import { supabase } from './supabaseClient';
import { somenteDigitos } from '../utils/masks';
import { DomainError } from './errors';
import { gerarCodigoCuidador } from './cuidadorService';

const TABELA_CUIDADORES = 'cuidadores';
const TABELA_FAMILIARES = 'familiares';
const TABELA_IDOSOS = 'idosos';
const TAMANHO_CPF = 11;
const CODIGO_VIOLACAO_UNICIDADE = '23505';
const STATUS_USUARIO_DUPLICADO = 422;
const TAMANHO_MINIMO_CODIGO_RECUPERACAO = 6;

function normalizarEmail(email) {
  const limpo = (email ?? '').trim().toLowerCase();
  if (!limpo) {
    throw new DomainError('Informe o seu e-mail.');
  }
  return limpo;
}

function normalizarCpf(cpf) {
  const cpfLimpo = somenteDigitos(cpf);
  if (cpfLimpo.length !== TAMANHO_CPF) {
    throw new DomainError('CPF inválido. Informe os 11 dígitos.');
  }
  return cpfLimpo;
}

/**
 * O Supabase responde de formas diferentes para "e-mail já cadastrado"
 * dependendo da versão da API e da configuração de confirmação por e-mail.
 */
function ehUsuarioJaRegistrado(erro) {
  if (!erro) return false;
  const mensagem = (erro.message ?? '').toLowerCase();
  return (
    erro.status === STATUS_USUARIO_DUPLICADO ||
    erro.code === 'user_already_exists' ||
    mensagem.includes('already registered') ||
    mensagem.includes('already been registered')
  );
}

/**
 * Com "Confirm email" ligado, o signUp de um e-mail existente NÃO retorna erro:
 * devolve um usuário sem identidades para não vazar quais contas existem.
 */
function ehUsuarioFantasma(usuario) {
  return !!usuario && Array.isArray(usuario.identities) && usuario.identities.length === 0;
}

/**
 * Fonte da verdade sobre "este CPF já existe": as tabelas de perfil, e não o
 * Auth. Um usuário removido no painel do Supabase (ou um perfil apagado à mão)
 * deixava o cadastro travado em "CPF já cadastrado" mesmo com o banco vazio.
 */
async function buscarPerfilPorCpf(cpf) {
  const cpfLimpo = normalizarCpf(cpf);

  const { data: cuidador, error: erroCuidador } = await supabase
    .from(TABELA_CUIDADORES)
    .select('*')
    .eq('cpf', cpfLimpo)
    .maybeSingle();
  if (erroCuidador) throw erroCuidador;
  if (cuidador) return { tipo: 'cuidador', perfil: cuidador };

  const { data: familiar, error: erroFamiliar } = await supabase
    .from(TABELA_FAMILIARES)
    .select('*')
    .eq('cpf', cpfLimpo)
    .maybeSingle();
  if (erroFamiliar) throw erroFamiliar;
  if (familiar) return { tipo: 'familiar', perfil: familiar };

  const { data: idoso, error: erroIdoso } = await supabase
    .from(TABELA_IDOSOS)
    .select('*')
    .eq('cpf', cpfLimpo)
    .maybeSingle();
  if (erroIdoso) throw erroIdoso;
  if (idoso) return { tipo: 'idoso', perfil: idoso };

  return null;
}

async function garantirCpfDisponivel(cpfLimpo) {
  const existente = await buscarPerfilPorCpf(cpfLimpo);
  if (!existente) return;

  const rotulos = {
    cuidador: 'cuidador',
    familiar: 'familiar',
    idoso: 'idoso',
  };
  const comoQue = rotulos[existente.tipo] ?? existente.tipo;
  throw new DomainError(
    `Este CPF já está cadastrado como ${comoQue}. Entre na sua conta usando o e-mail e a senha.`
  );
}

/**
 * Cria a conta no Auth. Se o usuário já existir lá (perfil apagado do banco,
 * cadastro interrompido no meio), reaproveita a conta fazendo login com a senha
 * informada em vez de barrar o cadastro.
 *
 * Os `metadados` vão para `auth.users.raw_user_meta_data`, o que deixa os dados
 * básicos disponíveis no próprio Auth (útil para triggers e para o painel).
 */
async function criarOuReaproveitarUsuarioAuth(email, senha, metadados) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: { data: metadados },
  });

  if (error && !ehUsuarioJaRegistrado(error)) throw error;

  if (!error && data.user?.id && !ehUsuarioFantasma(data.user)) {
    if (data.session) return data.user.id;
  }

  const { data: dadosLogin, error: erroLogin } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (erroLogin || !dadosLogin.user?.id) {
    const mensagem = (erroLogin?.message ?? '').toLowerCase();
    if (mensagem.includes('email not confirmed')) {
      throw new DomainError(
        'A confirmação por e-mail está ativada no Supabase e impede o cadastro. ' +
        'Desative "Confirm email" em Authentication → Providers.'
      );
    }
    throw new DomainError(
      'Este e-mail já está cadastrado. Entre com a sua senha ou use "Esqueci minha senha".'
    );
  }

  return dadosLogin.user.id;
}

async function desfazerSessao() {
  try {
    await supabase.auth.signOut();
  } catch {
    // Falhar no rollback não deve mascarar o erro original do cadastro.
  }
}

function traduzirErroDeInsercao(erro) {
  if (erro?.code !== CODIGO_VIOLACAO_UNICIDADE) return erro;

  // A chave primária do perfil é o id do usuário do Auth: se ela colide, o
  // e-mail informado já tem um perfil — não é o CPF que está duplicado.
  const detalhe = `${erro.message ?? ''} ${erro.details ?? ''}`.toLowerCase();
  if (detalhe.includes('pkey') || detalhe.includes('(id)')) {
    return new DomainError(
      'Este e-mail já está cadastrado no sistema. Entre na sua conta pela tela de login.'
    );
  }

  return new DomainError('Este CPF já está cadastrado no sistema.');
}

/**
 * Cadastra e conecta o Cuidador no Supabase repassando latitude e longitude para atuar com a Trigger PostGIS.
 */
export async function cadastrarEConectarCuidador({
  nome,
  cpf,
  email,
  telefone,
  especialidade,
  senha,
  latitude = null,  // 👈 Adicionado parâmetro opcional de latitude
  longitude = null, // 👈 Adicionado parâmetro opcional de longitude
}) {
  const cpfLimpo = normalizarCpf(cpf);
  const emailLimpo = normalizarEmail(email);
  await garantirCpfDisponivel(cpfLimpo);

  const userId = await criarOuReaproveitarUsuarioAuth(emailLimpo, senha, {
    nome: nome.trim(),
    cpf: cpfLimpo,
    telefone: somenteDigitos(telefone),
    tipo_usuario: 'cuidador',
  });

  const { data: perfilCuidador, error: erroBanco } = await supabase
    .from(TABELA_CUIDADORES)
    .insert([
      {
        id: userId,
        nome: nome.trim(),
        cpf: cpfLimpo,
        email: emailLimpo,
        telefone: somenteDigitos(telefone),
        especialidade: especialidade ? especialidade.trim() : null,
        codigo: gerarCodigoCuidador(),
        latitude,  // 👈 Repassado para o banco (dispara a Trigger PostGIS)
        longitude, // 👈 Repassado para o banco (dispara a Trigger PostGIS)
      },
    ])
    .select()
    .single();

  if (erroBanco) {
    await desfazerSessao();
    throw traduzirErroDeInsercao(erroBanco);
  }

  return perfilCuidador;
}

export async function cadastrarEConectarFamiliar({ nome, cpf, email, telefone, senha }) {
  const cpfLimpo = normalizarCpf(cpf);
  const emailLimpo = normalizarEmail(email);
  await garantirCpfDisponivel(cpfLimpo);

  const userId = await criarOuReaproveitarUsuarioAuth(emailLimpo, senha, {
    nome: nome.trim(),
    cpf: cpfLimpo,
    telefone: somenteDigitos(telefone),
    tipo_usuario: 'familiar',
  });

  const { data: perfilFamiliar, error: erroBanco } = await supabase
    .from(TABELA_FAMILIARES)
    .insert([
      {
        id: userId,
        nome: nome.trim(),
        cpf: cpfLimpo,
        email: emailLimpo,
        telefone: somenteDigitos(telefone),
      },
    ])
    .select()
    .single();

  if (erroBanco) {
    await desfazerSessao();
    throw traduzirErroDeInsercao(erroBanco);
  }

  return perfilFamiliar;
}

export async function cadastrarEConectarIdoso({ nome, cpf, email, telefone, senha }) {
  const cpfLimpo = normalizarCpf(cpf);
  const emailLimpo = normalizarEmail(email);
  await garantirCpfDisponivel(cpfLimpo);

  const userId = await criarOuReaproveitarUsuarioAuth(emailLimpo, senha, {
    nome: nome.trim(),
    cpf: cpfLimpo,
    telefone: somenteDigitos(telefone),
    tipo_usuario: 'idoso',
  });

  const { data: perfilIdoso, error: erroBanco } = await supabase
    .from(TABELA_IDOSOS)
    .insert([
      {
        id: userId,
        nome: nome.trim(),
        cpf: cpfLimpo,
        email: emailLimpo,
        telefone: somenteDigitos(telefone),
      },
    ])
    .select()
    .single();

  if (erroBanco) {
    await desfazerSessao();
    throw traduzirErroDeInsercao(erroBanco);
  }

  return perfilIdoso;
}

/** Login por e-mail + senha. */
export async function entrarComEmail({ email, senha }) {
  const emailLimpo = normalizarEmail(email);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailLimpo,
    password: senha,
  });

  if (error) {
    const mensagem = (error.message ?? '').toLowerCase();
    if (mensagem.includes('email not confirmed')) {
      throw new DomainError(
        'Este e-mail ainda não foi confirmado. Desative "Confirm email" em ' +
        'Authentication → Providers no Supabase.'
      );
    }
    throw new DomainError('E-mail ou senha incorretos.');
  }

  return data.user;
}

/**
 * Etapa 1 da recuperação: dispara o e-mail com o código de 6 dígitos.
 *
 * O Supabase não devolve erro quando o e-mail não existe (proteção contra
 * enumeração de contas), então a UI precisa manter a mensagem neutra.
 */
export async function solicitarRecuperacaoSenha(email) {
  const emailLimpo = normalizarEmail(email);

  const { error } = await supabase.auth.resetPasswordForEmail(emailLimpo);

  if (error) {
    const mensagem = (error.message ?? '').toLowerCase();
    if (error.status === 429 || mensagem.includes('rate limit') || mensagem.includes('security purposes')) {
      throw new DomainError(
        'Muitas tentativas em pouco tempo. Aguarde alguns minutos antes de pedir um novo código.'
      );
    }
    throw new DomainError('Não foi possível enviar o código agora. Tente novamente em instantes.');
  }

  return emailLimpo;
}

/**
 * Etapa 2 da recuperação: valida o código e grava a nova senha.
 *
 * O `verifyOtp` abre uma sessão autenticada (é ela que autoriza o
 * `updateUser`), por isso a sessão é encerrada no fim — quem redefine a senha
 * volta para a tela de Login em vez de entrar direto no app.
 */
export async function redefinirSenhaComCodigo({ email, codigo, novaSenha }) {
  const emailLimpo = normalizarEmail(email);
  // Só remove espaços das pontas: o token do Supabase costuma ser numérico, mas
  // pode vir alfanumérico dependendo da configuração do projeto, então nada de
  // filtrar caracteres — só o próprio Auth sabe validá-lo.
  const codigoLimpo = (codigo ?? '').trim();

  if (codigoLimpo.length < TAMANHO_MINIMO_CODIGO_RECUPERACAO) {
    throw new DomainError(
      `O código deve ter no mínimo ${TAMANHO_MINIMO_CODIGO_RECUPERACAO} caracteres.`
    );
  }

  const { error: erroCodigo } = await supabase.auth.verifyOtp({
    email: emailLimpo,
    token: codigoLimpo,
    type: 'recovery',
  });

  if (erroCodigo) {
    throw new DomainError('Código inválido ou expirado. Peça um novo código e tente de novo.');
  }

  try {
    const { error: erroSenha } = await supabase.auth.updateUser({ password: novaSenha });

    if (erroSenha) {
      const mensagem = (erroSenha.message ?? '').toLowerCase();
      if (mensagem.includes('should be different') || mensagem.includes('same as the old')) {
        throw new DomainError('A nova senha precisa ser diferente da senha atual.');
      }
      throw new DomainError('Não foi possível alterar a senha. Tente novamente.');
    }
  } finally {
    await desfazerSessao();
  }
}

/**
 * Apaga a conta autenticada (Auth + perfil em cascade) via função no banco.
 * Remove também o avatar no Storage, se existir.
 */
export async function excluirMinhaConta() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    throw new DomainError('Sessão expirada. Faça login novamente.');
  }

  try {
    await supabase.storage.from('avatars').remove([
      `${user.id}/avatar.jpg`,
      `${user.id}/avatar.jpeg`,
      `${user.id}/avatar.png`,
      `${user.id}/avatar.webp`,
      `${user.id}/avatar.heic`,
    ]);
  } catch {
    // Bucket pode não existir ainda; a exclusão da conta segue mesmo assim.
  }

  const { error } = await supabase.rpc('excluir_minha_conta');
  if (error) {
    const mensagem = (error.message ?? '').toLowerCase();
    if (mensagem.includes('function') || mensagem.includes('does not exist') || error.code === '42883') {
      throw new DomainError(
        'A exclusão de conta ainda não está configurada no banco. Rode o SQL da seção 8.1 em docs/DATABASE.md.'
      );
    }
    throw new DomainError('Não foi possível excluir a conta. Tente novamente.');
  }

  await supabase.auth.signOut();
}