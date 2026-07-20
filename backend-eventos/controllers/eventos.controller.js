const eventosService = require('../services/eventos.service');

// Validaciones comunes
function validarEvento(body, esUpdate = false) {
  const { nombreEvento, direccion, pais, ciudad, nombreProductora, fechaInicio, fechaTermino, estado } = body;
  const errors = {};

  if (!esUpdate || nombreEvento !== undefined) {
    if (!nombreEvento || nombreEvento.trim().length === 0)
      errors.nombreEvento = 'El nombre del evento es obligatorio';
  }
  if (!esUpdate || direccion !== undefined) {
    if (!direccion || direccion.trim().length === 0)
      errors.direccion = 'La dirección es obligatoria';
  }
  if (!esUpdate || pais !== undefined) {
    if (!pais || pais.trim().length === 0)
      errors.pais = 'El país es obligatorio';
  }
  if (!esUpdate || ciudad !== undefined) {
    if (!ciudad || ciudad.trim().length === 0)
      errors.ciudad = 'La ciudad es obligatoria';
  }
  if (!esUpdate || nombreProductora !== undefined) {
    if (!nombreProductora || nombreProductora.trim().length === 0)
      errors.nombreProductora = 'El nombre de la productora es obligatorio';
  }
  if (!esUpdate || fechaInicio !== undefined) {
    if (!fechaInicio) errors.fechaInicio = 'La fecha de inicio es obligatoria';
  }
  if (!esUpdate || fechaTermino !== undefined) {
    if (!fechaTermino) errors.fechaTermino = 'La fecha de término es obligatoria';
  }
  if (fechaInicio && fechaTermino && new Date(fechaTermino) <= new Date(fechaInicio)) {
    errors.fechaTermino = 'La fecha de término debe ser posterior a la de inicio';
  }
  if (!esUpdate || estado !== undefined) {
    if (!estado || !['Pendiente', 'Iniciado', 'Finalizado'].includes(estado))
      errors.estado = 'El estado debe ser Pendiente, Iniciado o Finalizado';
  }

  return errors;
}

// GET /api/eventos
exports.getEventos = (req, res) => {
  try {
    const eventos = eventosService.getEventos();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// POST /api/eventos
exports.createEvento = (req, res) => {
  try {
    const errors = validarEvento(req.body, false);
    if (Object.keys(errors).length > 0) return res.status(400).json({ errors });

    const evento = eventosService.createEvento({
      nombreEvento: req.body.nombreEvento.trim(),
      direccion: req.body.direccion.trim(),
      pais: req.body.pais.trim(),
      ciudad: req.body.ciudad.trim(),
      nombreProductora: req.body.nombreProductora.trim(),
      fechaInicio: req.body.fechaInicio,
      fechaTermino: req.body.fechaTermino,
      estado: req.body.estado,
      productora: req.body.productora || null, // para filtrado por rol
    });
    res.status(201).json(evento);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// PUT /api/eventos/:id
exports.updateEvento = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const errors = validarEvento(req.body, true);
    if (Object.keys(errors).length > 0) return res.status(400).json({ errors });

    const evento = eventosService.updateEvento(id, req.body);
    if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json(evento);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// DELETE /api/eventos/:id
exports.deleteEvento = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const eliminado = eventosService.deleteEvento(id);
    if (eliminado === null) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json(eliminado);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
