const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventos.controller');

router.get('/', eventosController.getEventos);
router.post('/', eventosController.createEvento);
router.delete('/:id', eventosController.deleteEvento);

module.exports = router;
