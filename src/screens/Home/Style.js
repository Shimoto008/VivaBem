import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },
  titulo: {
    color: "#3f3f3f",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },

  app: {
    color: "#3f3f3f",
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },

  selecionar: {
    color: "#3f3f3f",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 15,
  },

  fixToButton: {
    flexDirection: "column",
    marginBottom: 20,
  },

  botaoC: {
    flexDirection: "column",
    alignItems: "left",
    backgroundColor: "#fffcfc",
    padding: 20,
    borderRadius: 10,
    marginBottom: 25,
    marginLeft: 10,
    width: "90%",
    boxShadow: "5px px px 0px #ecdd0afb",
  },

  botaoF: {
    flexDirection: "column",
    alignItems: "left",
    backgroundColor: "#fffcfc",
    padding: 20,
    borderRadius: 10,
    marginBottom: 25,
    marginLeft: 10,
    width: "90%",
    boxShadow: "5px px px 0px #12d60bfb",
  },

  botaoI: {
    flexDirection: "column",
    alignItems: "left",
    backgroundColor: "#fffcfc",
    padding: 20,
    borderRadius: 10,
    marginBottom: 25,
    marginLeft: 10,
    width: "90%",
    boxShadow: "5px px px 0px #0b63d6fb",
  },

  escolha: {
    color: "#000000",
    fontSize: 17,
    fontWeight: "bold",
  },

  desc: {
    color: "#585858",
    fontSize: 14,
  },

  login: {
    textAlign: "center",
    color: "#3f3f3f",
    fontSize: 14,
    marginBottom: 10,
    marginTop: 14,
  },

  link: {
    color: "#0000FF",
    textAlign: "center",
    fontSize: 14,
  },

  icon:{
    fontSize: 40,
    alignSelf: 'center',
  },

  img: {
    width: 150,
    height: 100,
    alignSelf: 'center'
  },

  gridSelecao: {
    width: '100%',
    gap: 16,
    marginTop: 10,
  },
  cardPerfil: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoContainer: {
    flex: 1,
    marginLeft: 12,
  },
});

export default styles;