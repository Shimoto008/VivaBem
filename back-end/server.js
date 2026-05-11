const express = require('express');
const cors = require('cors');
const cuidadorRoutes = require('./src/routes/cuidadorrouter');

const app = express();
app.use(cors());
app.use(express.json()); // Essencial para o Express entender o JSON do Axios

// Agora o servidor sabe que tudo que começar com /cuidadores 
// deve ir para o arquivo de rotas do cuidador
app.use('/cuidadores', cuidadorRoutes);

app.listen(3000, () => console.log("Servidor ON na porta 3000 c====B"));




//COLAR O MYSQL
//USE vivabem;

//CREATE TABLE cuidadores (
//    id INT AUTO_INCREMENT PRIMARY KEY,
//    nome VARCHAR(255) NOT NULL,
//    telefone VARCHAR(20),
//    CPF VARCHAR(14),
//    especialidade VARCHAR(100)
//);

//select * from cuidadores;