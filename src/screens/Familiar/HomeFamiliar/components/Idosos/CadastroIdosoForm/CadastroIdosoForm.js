import React from 'react';
import { View } from 'react-native';

import { Input, Button } from '../../../../../../components/ui';

export function CadastroIdosoForm({
  nome,
  setNome,
  idade,
  setIdade,
  cpf,
  alterarCpf,
  erros,
  enviando,
  onSalvar,
}) {
  return (
    <View
      style={{
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 15,
        marginTop: 20,
        elevation: 3,
      }}
    >

      <Input
        placeholder="Nome Completo"
        value={nome}
        onChangeText={setNome}
        error={erros.nome}
      />


      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >

        <View style={{ width: '30%' }}>
          <Input
            placeholder="Idade"
            keyboardType="numeric"
            value={idade}
            onChangeText={setIdade}
            error={erros.idade}
          />
        </View>


        <View style={{ width: '65%' }}>
          <Input
            placeholder="CPF"
            keyboardType="numeric"
            maxLength={14}
            value={cpf}
            onChangeText={alterarCpf}
            error={erros.cpf}
          />
        </View>

      </View>


      <Button
        title="Cadastrar Idoso"
        onPress={onSalvar}
        loading={enviando}
        style={{
          width: '100%',
          marginTop: 10,
        }}
      />

    </View>
  );
}