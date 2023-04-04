import mongoose from 'mongoose'

const ComentariosSchema = mongoose.Schema(
  {
    descripcion: {
      type: String,
    },
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
    },
    publicacion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Publicacion',
    },
  },
  {
    timestamps: true,
  }
)

const Comentario = mongoose.model('Comentario', ComentariosSchema)

export default Comentario
