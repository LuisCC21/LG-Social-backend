import mongoose from 'mongoose'
import Comentario from '../models/Comentarios.js'
import Publicacion from '../models/Publicaciones.js'

const getPosts = async (req, res) => {
  try {
    const publicaciones = await Publicacion.find({}).populate(
      'creador',
      'nombre genero'
    )

    res.json(publicaciones)
  } catch (error) {
    console.log(error)
  }
}

const getPost = async (req, res) => {
  const { id } = req.params

  const valid = mongoose.Types.ObjectId.isValid(id)

  if (!valid) {
    const error = new Error('Publicacion no Encontrada')
    return res.status(400).json({ msg: error.message })
  }

  const publicacion = await Publicacion.findById(id)
    .populate('creador', 'nombre genero')
    .populate({
      path: 'comentarios',
      populate: { path: 'creador', select: 'nombre genero' },
    })

  if (!publicacion) {
    const error = new Error('Publicacion no Encontrada')
    return res.status(400).json({ msg: error.message })
  }

  try {
    res.json(publicacion)
  } catch (error) {
    console.log(error)
  }
}

const createPost = async (req, res) => {
  if (req.body.descripcion?.trim().length === 0) return

  const publicacion = new Publicacion(req.body)
  publicacion.creador = req.usuario._id

  try {
    const publicacionAlmacenada = await publicacion.save()
    const publicacionState = await Publicacion.findById(
      publicacionAlmacenada._id
    ).populate('creador', 'nombre genero')
    res.json(publicacionState)
  } catch (error) {
    console.log(error)
  }
}

const editPost = async (req, res) => {
  const { descripcion } = req.body
  if (descripcion?.trim().length === 0) return

  const { id } = req.params

  const valid = mongoose.Types.ObjectId.isValid(id)

  if (!valid) {
    const error = new Error('Publicacion no Encontrada')
    return res.status(400).json({ msg: error.message })
  }

  const publicacion = await Publicacion.findById(id).populate(
    'creador',
    'nombre genero'
  )

  if (!publicacion) {
    const error = new Error('Publicacion no Encontrada')
    return res.status(400).json({ msg: error.message })
  }

  if (publicacion.creador._id.toString() !== req.usuario._id.toString()) {
    const error = new Error('Acción No Válida')
    return res.status(401).json({ msg: error.message })
  }

  try {
    publicacion.descripcion = descripcion || publicacion.descripcion
    const publicacionAlmacenada = await publicacion.save()
    res.json(publicacionAlmacenada)
  } catch (error) {
    console.log(error)
  }
}

const deletePost = async (req, res) => {
  const { id } = req.params

  const valid = mongoose.Types.ObjectId.isValid(id)

  if (!valid) {
    const error = new Error('Publicacion no Encontrada')
    return res.status(404).json({ msg: error.message })
  }

  const publicacion = await Publicacion.findById(id)

  if (!publicacion) {
    const error = new Error('Publicacion no Encontrada')
    return res.status(400).json({ msg: error.message })
  }

  if (publicacion.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Acción No Válida')
    return res.status(401).json({ msg: error.message })
  }

  try {
    await publicacion.deleteOne()
    res.json({ msg: 'Publicacion Eliminado Correctamente' })
  } catch (error) {
    console.log(error)
  }
}

const aumentarLikes = async (req, res) => {
  const { id } = req.params

  const valid = mongoose.Types.ObjectId.isValid(id)

  if (!valid) {
    const error = new Error('Publicacion no Encontrada')
    return res.status(404).json({ msg: error.message })
  }

  const publicacion = await Publicacion.findById(id).populate(
    'creador',
    'nombre genero'
  )

  if (!publicacion) {
    const error = new Error('Publicacion no Encontrada')
    return res.status(404).json({ msg: error.message })
  }

  try {
    if (publicacion.disLike.includes(req.usuario._id)) {
      publicacion.disLike = publicacion.disLike.pull(req.usuario._id)
    }

    publicacion.like = [...publicacion.like, req.usuario._id]

    const publicacionAlmacenada = await publicacion.save()
    res.json(publicacionAlmacenada)
  } catch (error) {
    console.log(error)
  }
}
const disminuirLikes = async (req, res) => {
  const { id } = req.params

  const valid = mongoose.Types.ObjectId.isValid(id)

  if (!valid) {
    const error = new Error('Publicacion no Encontrada')
    return res.status(404).json({ msg: error.message })
  }

  const publicacion = await Publicacion.findById(id).populate(
    'creador',
    'nombre genero'
  )

  if (!publicacion) {
    const error = new Error('Publicacion no Encontrada')
    return res.status(404).json({ msg: error.message })
  }

  try {
    publicacion.like = publicacion.like.pull(req.usuario._id)

    const publicacionAlmacenada = await publicacion.save()

    res.json(publicacionAlmacenada)
  } catch (error) {
    console.log(error)
  }
}
const aumentarDisLikes = async (req, res) => {
  const { id } = req.params

  const valid = mongoose.Types.ObjectId.isValid(id)

  if (!valid) {
    const error = new Error('Publicacion no Encontrada')
    return res.status(404).json({ msg: error.message })
  }

  const publicacion = await Publicacion.findById(id).populate(
    'creador',
    'nombre genero'
  )

  if (!publicacion) {
    const error = new Error('Publicacion no Encontrada')
    return res.status(404).json({ msg: error.message })
  }

  try {
    if (publicacion.like.includes(req.usuario._id)) {
      publicacion.like = publicacion.like.pull(req.usuario._id)
    }

    publicacion.disLike = [...publicacion.disLike, req.usuario._id]

    const publicacionAlmacenada = await publicacion.save()

    res.json(publicacionAlmacenada)
  } catch (error) {
    console.log(error)
  }
}
const disminuirDisLikes = async (req, res) => {
  const { id } = req.params

  const valid = mongoose.Types.ObjectId.isValid(id)

  if (!valid) {
    const error = new Error('Publicacion no Encontrada')
    return res.status(404).json({ msg: error.message })
  }

  const publicacion = await Publicacion.findById(id).populate(
    'creador',
    'nombre genero'
  )

  if (!publicacion) {
    const error = new Error('Publicacion no Encontrada')
    return res.status(404).json({ msg: error.message })
  }

  try {
    publicacion.disLike = publicacion.disLike.pull(req.usuario._id)

    const publicacionAlmacenada = await publicacion.save()

    res.json(publicacionAlmacenada)
  } catch (error) {
    console.log(error)
  }
}

const listComments = async (req, res) => {
  const { id } = req.params

  const valid = mongoose.Types.ObjectId.isValid(id)

  if (!valid) {
    const error = new Error('Publicacion no Encontrada')
    return res.status(400).json({ msg: error.message })
  }

  const Validarpublicacion = await Publicacion.findById(id)

  if (!Validarpublicacion) {
    const error = new Error('Publicacion no Encontrada')
    return res.status(400).json({ msg: error.message })
  }
  try {
    const comentarios = await Comentario.find({ publicacion: id })
      .populate('publicacion')
      .populate('creador', 'nombre genero')
    res.json(comentarios)
  } catch (error) {
    console.log(error)
  }
}

export {
  createPost,
  getPosts,
  editPost,
  deletePost,
  aumentarLikes,
  disminuirLikes,
  aumentarDisLikes,
  disminuirDisLikes,
  listComments,
  getPost,
}
