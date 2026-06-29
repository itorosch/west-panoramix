const eventosService = require('../services/eventos.service');

exports.createEvento = (req, res) => {
  try {
    const {
      nombreEvento,
      direccion,
      pais,
      ciudad,
      nombreProductora,
      fechaInicio,
      fechaTermino,
      estado,
    } = req.body;

    const errors = {};

    if (!nombreEvento || nombreEvento.trim().length === 0)
      errors.nombreEvento = 'El nombre del evento es obligatorio';

    if (!direccion || direccion.trim().length === 0)
      errors.direccion = 'La dirección es obligatoria';

    if (!pais || pais.trim().length === 0)
      errors.pais = 'El país es obligatorio';

    if (!ciudad || ciudad.trim().length === 0)
      errors.ciudad = 'La ciudad es obligatoria';

    if (!nombreProductora || nombreProductora.trim().length === 0)
      errors.nombreProductora = 'El nombre de la productora es obligatorio';

    if (!fechaInicio)
      errors.fechaInicio = 'La fecha de inicio es obligatoria';

    if (!fechaTermino)
      errors.fechaTermino = 'La fecha de término es obligatoria';

    if (fechaInicio && fechaTermino && new Date(fechaTermino) <= new Date(fechaInicio))
      errors.fechaTermino = 'La fecha de término debe ser posterior a la de inicio';

    if (!estado || !['Pendiente', 'Iniciado', 'Finalizado'].includes(estado))
      errors.estado = 'El estado debe ser Pendiente, Iniciado o Finalizado';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const evento = eventosService.createEvento({
      nombreEvento: nombreEvento.trim(),
      direccion: direccion.trim(),
      pais: pais.trim(),
      ciudad: ciudad.trim(),
      nombreProductora: nombreProductora.trim(),
      fechaInicio,
      fechaTermino,
      estado,
    });

    res.status(201).json(evento);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getEventos = (req, res) => {
  try {
    const eventos = eventosService.getEventos();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.deleteEvento = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const eliminado = eventosService.deleteEvento(id);
    if (eliminado === null) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    res.json(eliminado);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
