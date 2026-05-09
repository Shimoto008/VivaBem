import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center"
  },
  titulo: {
    color: "#3f3f3f",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 80
  },

  img: {
    width: 150,
    height: 100,
    alignSelf: 'center'
  },

  
  
  input: {
    backgroundColor: "#ffffff",
    width: "90%",
    fontSize: 18,
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
});

export default styles;