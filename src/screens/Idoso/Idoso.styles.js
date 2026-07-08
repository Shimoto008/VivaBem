import { StyleSheet } from 'react-native';

/**
 * Cópia EXATA dos valores visuais do Style.js original — por instrução
 * explícita, a área do Idoso não deve sofrer nenhuma mudança visual.
 * Só o nome do arquivo/export muda (padronização com o resto do projeto).
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    color: '#3f3f3f',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 80,
  },
  img: {
    width: 150,
    height: 100,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#ffffff',
    width: '90%',
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 10,
  },
  txt: {
    backgroundColor: '#ffffff',
    fontWeight: 'bold',
    width: '88%',
    fontSize: 15,
    marginTop: 20,
  },
  cadastro: {
    backgroundColor: '#4169e1',
    marginTop: 60,
    padding: 20,
    borderRadius: 10,
    width: '50%',
    alignItems: 'center',
  },
  txt_cad: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  erro: {
    color: '#FF3B30',
    fontSize: 12,
    width: '88%',
    marginTop: 4,
  },
});
