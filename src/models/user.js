const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  clave: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    required: true,
    enum: ['ADMIN', 'DOCENTE']
  },
  estado: {
    type: Boolean,
    required: true
  },
  fechaCreacion: {
    type: Date,
    default: new Date()
  },
  fechaActualizacion: {
    type: Date,
    default: new Date()
  },
});

module.exports = mongoose.model('User', userSchema);