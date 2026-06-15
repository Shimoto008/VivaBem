import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Seus estilos originais totalmente preservados:
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center"
  },
  titulo: {
    color: "#333333", // Corrigido erro de sintaxe original ("#")
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10
  },
  img: {
    width: 150,
    height: 200,
    alignSelf: 'center',
    marginTop: 10
  },
  input: {
    backgroundColor: "#ffffff",
    width: "90%",
    fontSize: 20,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 10,
    padding: 10, // Adicionado pequeno padding interno para o texto não colar nas bordas
  },
  txt: {
    backgroundColor: "#ffffff",
    fontWeight: "bold",
    width: "88%",
    fontSize: 15,
    marginTop: 20,
  },
  cadastro: {
    backgroundColor: "#4169e1",
    marginTop: 20,
    padding: 10,
    borderRadius: 30,
    width: "90%",
    alignItems: "center"
  },
  txt_cad:{
    color: "white",
    fontSize: 15,
    fontWeight: "bold"
  },

  // === ACRÉSCIMOS PARA VALIDAÇÃO, TECLADO E COMPONENTE SELETOR ===
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  inputErro: {
    borderColor: '#ff3737',
    borderWidth: 1.5,
  },
  txtErro: {
    color: '#ff3737',
    fontSize: 13,
    alignSelf: 'flex-start',
    marginLeft: '6%',
    marginTop: 4,
    fontWeight: '500',
  },
  inputSeletor: {
    backgroundColor: "#ffffff",
    width: "90%",
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 10,
    padding: 12,
    justifyContent: 'center',
    marginTop: 5,
  },
  txtSeletorPlaceholder: {
    fontSize: 20,
    color: '#a1a1a1',
  },
  txtSeletorAtivo: {
    fontSize: 20,
    color: '#000000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalConteudo: {
    width: width * 0.85,
    maxHeight: '60%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  modalOpcao: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOpcaoTxt: {
    fontSize: 16,
    color: '#444',
  }
});

export default styles;