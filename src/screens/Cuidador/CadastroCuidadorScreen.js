import React from 'react';
import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { styles } from './CadastroCuidador.styles';
import { useCuidadorCadastro } from '../../hooks/useCuidadorCadastro';
import { Input, Button, ScreenHeader, SelectModal } from '../../components/ui';
import { LISTA_ESPECIALIDADES } from '../../constants/especialidades';
import { colors } from '../../theme';

/**
 * Tela "burra" por design: só lê o que o hook devolve e desenha a UI.
 * Toda validação, máscara e chamada de API está em useCuidadorCadastro.
 */
export default function CadastroCuidadorScreen() {
  const navigation = useNavigation();
  const {
    nome, telefone, cpf, especialidade, outraEspecialidade, erros, enviando,
    modalEspecialidadeVisivel, setModalEspecialidadeVisivel,
    alterarNome, alterarCpf, alterarTelefone, alterarOutraEspecialidade, selecionarEspecialidade,
    salvar,
  } = useCuidadorCadastro();

  return (
    <KeyboardAwareScrollView
      style={styles.containerScroll}
      contentContainerStyle={styles.contentScroll}
      enableOnAndroid
      extraScrollHeight={100}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.viewPrincipal}>
          <ScreenHeader title="Área de Cadastro" subtitle="Cuidador" onBack={() => navigation.goBack()} />
          <Image style={styles.img} source={require('../../../assets/VivaBem.png')} />

          <Input
            label="Nome Completo"
            placeholder="Digite seu nome completo"
            value={nome}
            onChangeText={alterarNome}
            error={erros.nome}
          />

          <Input
            label="CPF"
            placeholder="000.000.000-00"
            value={cpf}
            onChangeText={alterarCpf}
            keyboardType="numeric"
            maxLength={14}
            error={erros.cpf}
          />

          <Input
            label="Telefone"
            placeholder="(11) 00000-0000"
            value={telefone}
            onChangeText={alterarTelefone}
            keyboardType="numeric"
            maxLength={15}
            error={erros.telefone}
          />

          <Text style={{ alignSelf: 'flex-start', fontWeight: '600', marginBottom: 8 }}>Especialidade</Text>
          {especialidade !== 'Outros' ? (
            <TouchableOpacity style={styles.seletor} onPress={() => setModalEspecialidadeVisivel(true)}>
              <Text style={especialidade ? styles.seletorTextoPreenchido : styles.seletorTextoVazio}>
                {especialidade || 'Selecione uma opção...'}
              </Text>
            </TouchableOpacity>
          ) : (
            <Input
              placeholder="Escreva sua especialidade aqui..."
              value={outraEspecialidade}
              onChangeText={alterarOutraEspecialidade}
              autoFocus
            />
          )}
          {erros.especialidade ? <Text style={{ color: colors.danger, marginBottom: 8 }}>{erros.especialidade}</Text> : null}

          <Button title="Cadastrar" onPress={salvar} loading={enviando} style={{ width: '100%', marginTop: 12 }} />
        </View>
      </TouchableWithoutFeedback>

      <SelectModal
        visible={modalEspecialidadeVisivel}
        title="Selecione a Especialidade"
        options={LISTA_ESPECIALIDADES}
        onSelect={selecionarEspecialidade}
        onClose={() => setModalEspecialidadeVisivel(false)}
      />
    </KeyboardAwareScrollView>
  );
}
