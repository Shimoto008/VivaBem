import { supabase } from './supabaseClient';
import { somenteDigitos } from '../utils/masks';
import { DomainError } from './errors';
import { gerarCodigoCuidador } from './cuidadorService';

const DOMINIO_INTERNO = 'cuidadorapp.com';
const TABELA_CUIDADORES = 'cuidadores';
const TABELA_FAMILIARES = 'familiares';
const TAMANHO_CPF = 11;
const CODIGO_VIOLACAO_UNICIDADE = '23505';
const STATUS_USUARIO_DUPLICADO = 422;

/**
 * O app autentica por CPF, mas o Supabase Auth exige e-mail. Cada CPF vira um
 * e-mail interno determinístico — nunca é exibido nem enviado ao usuário.
 */
function gerarEmailPorCpf(cpfLimpo) {
  return `user_${cpfLimpo}@${DOMINIO_INTERNO}`;
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
export async function buscarPerfilPorCpf(cpf) {
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

  return null;
}

async function garantirCpfDisponivel(cpfLimpo) {
  const existente = await buscarPerfilPorCpf(cpfLimpo);
  if (!existente) return;

  const comoQue = existente.tipo === 'cuidador' ? 'cuidador' : 'familiar';
  throw new DomainError(
    `Este CPF já está cadastrado como ${comoQue}. Entre na sua conta usando o CPF e a senha.`
  );
}

/**
 * Cria a conta no Auth. Se o usuário já existir lá (perfil apagado do banco,
 * cadastro interrompido no meio), reaproveita a conta fazendo login com a senha
 * informada em vez de barrar o cadastro.
 */
async function criarOuReaproveitarUsuarioAuth(email, senha) {
  const { data, error } = await supabase.auth.signUp({ email, password: senha });

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
        'A confirmação por e-mail está ativada no Supabase e impede o login por CPF. ' +
        'Desative "Confirm email" em Authentication → Providers.'
      );
    }
    throw new DomainError(
      'Este CPF já possui uma conta de acesso com outra senha. Faça login with a senha original.'
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
  if (erro?.code === CODIGO_VIOLACAO_UNICIDADE) {
    return new DomainError('Este CPF já está cadastrado no sistema.');
  }
  return erro;
}

/**
 * Cadastra e conecta o Cuidador no Supabase repassando latitude e longitude para atuar com a Trigger PostGIS.
 */
export async function cadastrarEConectarCuidador({
  nome,
  cpf,
  telefone,
  especialidade,
  senha,
  latitude = null,  // 👈 Adicionado parâmetro opcional de latitude
  longitude = null, // 👈 Adicionado parâmetro opcional de longitude
}) {
  const cpfLimpo = normalizarCpf(cpf);
  await garantirCpfDisponivel(cpfLimpo);

  const userId = await criarOuReaproveitarUsuarioAuth(gerarEmailPorCpf(cpfLimpo), senha);

  const { data: perfilCuidador, error: erroBanco } = await supabase
    .from(TABELA_CUIDADORES)
    .insert([
      {
        id: userId,
        nome: nome.trim(),
        cpf: cpfLimpo,
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

export async function cadastrarEConectarFamiliar({ nome, cpf, telefone, senha }) {
  const cpfLimpo = normalizarCpf(cpf);
  await garantirCpfDisponivel(cpfLimpo);

  const userId = await criarOuReaproveitarUsuarioAuth(gerarEmailPorCpf(cpfLimpo), senha);

  const { data: perfilFamiliar, error: erroBanco } = await supabase
    .from(TABELA_FAMILIARES)
    .insert([
      {
        id: userId,
        nome: nome.trim(),
        cpf: cpfLimpo,
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

/**
 * Login por CPF + senha (o e-mail interno é reconstruído a partir do CPF).
 */
export async function entrarComCpf({ cpf, senha }) {
  const cpfLimpo = normalizarCpf(cpf);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: gerarEmailPorCpf(cpfLimpo),
    password: senha,
  });

  if (error) {
    throw new DomainError('CPF ou senha incorretos.');
  }

  return data.user;
}

export async function sair() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}