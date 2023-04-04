import mongoose from 'mongoose'
import Comentario from '../models/Comentarios.js'
import Publicacion from '../models/Publicaciones.js'

const addComment = async (req, res) => {
  const { id } = req.params

  const valid = mongoose.Types.ObjectId.isValid(id)

  if (!valid) {
    const error = new Error('Publicacion no Encontrada')
    return res.status(400).json({ msg: error.message })
  }

  const publicacion = await Publicacion.findById(id)

  if (!publicacion) {
    const error = new Error('Publicacion no Encontrada')
    return res.status(400).json({ msg: error.message })
  }

  const comentario = await new Comentario(req.body)
  comentario.creador = req.usuario._id
  comentario.publicacion = id

  try {
    const comentarioAlmacenado = await comentario.save()
    publicacion.comentarios = [
      ...publicacion.comentarios,
      comentarioAlmacenado._id,
    ]
    await publicacion.save()

    const comentarioRespuesta = await Comentario.findById(
      comentarioAlmacenado._id
    ).populate('creador', 'nombre genero')
    res.json(comentarioRespuesta)
  } catch (error) {
    console.log(error)
  }
}

const editComment = async (req, res) => {
  const { descripcion } = req.body
  const { id } = req.params

  const valid = mongoose.Types.ObjectId.isValid(id)

  if (!valid) {
    const error = new Error('Comentario no Encontrado')
    return res.status(400).json({ msg: error.message })
  }
  const comentario = await Comentario.findById(id)

  if (!comentario) {
    const error = new Error('Comentario no Encontrado')
    return res.status(400).json({ msg: error.message })
  }

  if (comentario.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Acción No Válida')
    return res.status(401).json({ msg: error.message })
  }

  try {
    comentario.descripcion = descripcion || comentario.descripcion
    const comentarioAlmacenado = await comentario.save()

    res.json(comentarioAlmacenado)
  } catch (error) {
    console.log(error)
  }
}

const deleteComment = async (req, res) => {
  const { id } = req.params

  const valid = mongoose.Types.ObjectId.isValid(id)

  if (!valid) {
    const error = new Error('Comentario no Encontrado')
    return res.status(404).json({ msg: error.message })
  }

  const comentario = await Comentario.findById(id)

  if (!comentario) {
    const error = new Error('Comentario no Encontrado')
    return res.status(400).json({ msg: error.message })
  }

  const publicacion = await Publicacion.findById(comentario.publicacion)
  console.log(publicacion)
  publicacion.comentarios.pull(id)

  try {
    await Promise.all([await comentario.deleteOne(), await publicacion.save()])

    res.json({ msg: 'Comentario eliminado correctamente' })
  } catch (error) {
    console.log(error)
  }
}

export { addComment, editComment, deleteComment }
