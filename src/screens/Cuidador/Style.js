import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center"
  },
  titulo: {
    color: "#",
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

  }
});

export default styles;