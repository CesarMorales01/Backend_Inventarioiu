const mongoose = require("mongoose");

const estadoSchema = mongoose.Schema({
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

module.exports = mongoose.model('Estado', estadoSchema);