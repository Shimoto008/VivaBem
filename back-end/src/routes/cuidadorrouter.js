const express = require('express');
const router = express.Router();
const cuidadorController = require('../controllers/cuidadorController');

router.post('/cadastrar', cuidadorController.cadastrarCuidador);

module.exports = router;