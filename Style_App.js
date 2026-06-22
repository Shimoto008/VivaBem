import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  containerSplash: {
    flex: 1,
    backgroundColor: '#4169E1', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoLogo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 15,
    letterSpacing: 1,
  },
  containerOnboarding: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  conteudoOnboarding: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  cardPasso: {
    alignItems: 'center',
  },
  tituloOnboarding: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  txtOnboarding: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  rodapeOnboarding: {
    alignItems: 'center',
    gap: 24,
  },
  containerBolinhas: {
    flexDirection: 'row',
    gap: 8,
  },
  bolinha: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#DDD',
  },
  bolinhaAtiva: {
    backgroundColor: '#4169E1',
    width: 24, 
  },
  btnAvancar: {
    backgroundColor: '#4169E1',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  btnTexto: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});