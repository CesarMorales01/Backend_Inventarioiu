const mongoose = require("mongoose");

const marcaSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  estado: {
    type: Boolean,
    required: true,
    default: true
  },
  fechaCreacion: {
    type: Date,
    default: new Date()
  },
  fechaActualizacion: {
    type: Date,
    default: new Date()
  }
});

module.exports = mongoose.model('Marca', marcaSchema);