import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { styles } from '../HomeFamiliar.styles';
import { Card, EmptyState } from '../../../../components/ui';
import { colors } from '../../../../theme';
import { useConexaoFamiliarContext } from '../../../../contexts/ConexaoFamiliarContext';
import { useAtividadesDoFamiliar } from '../../../../hooks/useAtividadesDoFamiliar';
import { ATIVIDADE_CONFIG } from '../../../../constants/atividadeTipos';
import { formatarDataPtBR } from '../../../../utils/dateUtils';

/**
 * Regra de negócio: "um Familiar desconectado não tem acesso a nenhuma
 * atividade". Por isso só chamamos useAtividadesDoFamiliar com um
 * cuidadorId quando existe conexão ativa — sem conexão, nem tentamos buscar.
 */
export function AtividadesFamiliarList() {
  const { conexao } = useConexaoFamiliarContext();
  const cuidadorId = conexao?.cuidadores?.id ?? null;
  const { atividades, carregando, erro } = useAtividadesDoFamiliar(cuidadorId);

  if (!conexao) {
    return (
      <EmptyState
        icon="event-busy"
        title="Conecte-se a um cuidador"
        description="As atividades publicadas pelo cuidador aparecerão aqui depois que você se conectar."
      />
    );
  }

  if (carregando) return <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />;

  if (erro) {
    return <EmptyState icon="error-outline" title="Não foi possível carregar as atividades" description="Tente novamente em alguns instantes." />;
  }

  if (atividades.length === 0) {
    return <EmptyState icon="inbox" title="Nenhuma atividade publicada ainda" description={`${conexao.cuidadores.nome} ainda não registrou nada.`} />;
  }

  return (
    <View>
      {atividades.map((atividade) => {
        const config = ATIVIDADE_CONFIG[atividade.tipo];
        return (
          <Card key={atividade.id} style={[styles.atividadeCard, { borderLeftWidth: 4, borderLeftColor: config.cor }]}>
            <View style={styles.atividadeHeader}>
              <Text style={styles.atividadePaciente}>{atividade.pacientes?.nome ?? 'Paciente'}</Text>
              <Text style={styles.atividadeData}>{formatarDataPtBR(new Date(atividade.created_at))}</Text>
            </View>
            <Text style={styles.atividadeConteudo}>{atividade.conteudo}</Text>
          </Card>
        );
      })}
    </View>
  );
}
