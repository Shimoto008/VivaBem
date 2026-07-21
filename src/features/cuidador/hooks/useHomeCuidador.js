import { useState } from 'react';
import { usePacientes } from './usePacientes';


export function useHomeCuidador(cuidadorId) {

  const [abaAtiva, setAbaAtiva] = useState('home');

  const [pacienteSelecionadoId, setPacienteSelecionadoId] = useState(null);


  const {
    pacientes,
    carregando,
    erro,
    recarregar
  } = usePacientes(cuidadorId);



  const pacienteSelecionado =
    pacientes.find(
      (p) => p.id === pacienteSelecionadoId
    ) ?? null;



  const selecionarPaciente = (paciente) => {

    setPacienteSelecionadoId((atualId) =>
      atualId === paciente.id
        ? null
        : paciente.id
    );

  };



  return {

    cuidadorId,

    abaAtiva,
    setAbaAtiva,


    pacientes,

    carregandoPacientes: carregando,

    erroPacientes: erro,

    recarregarPacientes: recarregar,


    pacienteSelecionado,

    selecionarPaciente,


    limparPacienteSelecionado:
      () => setPacienteSelecionadoId(null),

  };
}