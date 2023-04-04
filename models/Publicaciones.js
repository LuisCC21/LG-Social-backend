import mongoose from 'mongoose'

const PublicacionesSchema = mongoose.Schema(
  {
    descripcion: {
      type: String,
      required: true,
    },

    like: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
      },
    ],
    disLike: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
      },
    ],
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
    },
    comentarios: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comentario',
      },
    ],
  },
  {
    timestamps: true,
  }
)

const Publicacion = mongoose.model('Publicacion', PublicacionesSchema)

export default Publicacion
