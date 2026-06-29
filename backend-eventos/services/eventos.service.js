const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/eventos.json');

function readEventos() {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]');
    return [];
  }
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error('Error leyendo archivo de eventos');
  }
}

function writeEventos(eventos) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(eventos, null, 2));
  } catch (error) {
    throw new Error('Error escribiendo archivo de eventos');
  }
}

exports.createEvento = (eventoData) => {
  const eventos = readEventos();
  const maxId = eventos.length > 0 ? Math.max(...eventos.map(e => e.id)) : 1000;
  const newEvento = {
    id: maxId + 1,
    ...eventoData,
    fechaRegistro: new Date().toISOString(),
    estado: eventoData.estado || 'Pendiente',
  };
  eventos.push(newEvento);
  writeEventos(eventos);
  return newEvento;
};

exports.getEventos = () => {
  const eventos = readEventos();
  return eventos.sort((a, b) => b.id - a.id);
};

exports.deleteEvento = (id) => {
  const eventos = readEventos();
  const index = eventos.findIndex(e => e.id === id);
  if (index === -1) return null;
  const eliminado = eventos[index];
  eventos.splice(index, 1);
  writeEventos(eventos);
  return eliminado;
};
