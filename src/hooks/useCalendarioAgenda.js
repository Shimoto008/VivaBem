import { useState } from 'react';
import { diasNoMes, NOMES_DOS_MESES } from '../utils/dateUtils';

/** Estado puro de navegação do calendário (mês/ano/dia) — sem I/O. */
export function useCalendarioAgenda() {
  const hoje = new Date();
  const [mesAtual, setMesAtual] = useState(hoje.getMonth());
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());
  const [diaSelecionado, setDiaSelecionado] = useState(hoje.getDate());

  const irParaMesAnterior = () => {
    if (mesAtual === 0) { setMesAtual(11); setAnoAtual((ano) => ano - 1); }
    else setMesAtual((mes) => mes - 1);
  };

  const irParaMesSeguinte = () => {
    if (mesAtual === 11) { setMesAtual(0); setAnoAtual((ano) => ano + 1); }
    else setMesAtual((mes) => mes + 1);
  };

  return {
    mesAtual, anoAtual, diaSelecionado, setDiaSelecionado,
    nomesDosMeses: NOMES_DOS_MESES,
    quantidadeDiasNoMes: diasNoMes(anoAtual, mesAtual),
    irParaMesAnterior, irParaMesSeguinte,
  };
}
