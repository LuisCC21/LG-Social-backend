import mongoose from 'mongoose'
import {
  emailRegistroGmail,
  emailOlvidePasswordGmail,
} from '../helpers/email.js'
import generarId from '../helpers/generarId.js'
import generarJWT from '../helpers/generarJWT.js'
import Usuario from '../models/Usuario.js'

// Autenticacion, Registro, y Confirmar Usuarios

const VALIDAR_EMAIL =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/

const registerUser = async (req, res) => {
  const { email, password, nombre } = req.body

  // Validaciones
  const buscarNombreUsuario = await Usuario.findOne({ nombre })
  const buscarEmailUsuario = await Usuario.findOne({ email })

  if (buscarNombreUsuario) {
    const error = Error('Nombre de usuario no disponible')
    return res.status(400).json({ msg: error.message })
  }
  if (buscarEmailUsuario) {
    const error = Error('Email  ya registrado')
    return res.status(400).json({ msg: error.message })
  }

  if (!VALIDAR_EMAIL.test(email)) {
    const error = Error('Email Incorrecto')
    return res.status(400).json({ msg: error.message })
  }

  if (password.length < 8) {
    const error = Error('Contraseña debe tener min 8 caracteres')
    return res.status(400).json({ msg: error.message })
  }

  // Almacenar
  try {
    const usuario = new Usuario(req.body)
    usuario.token = generarId()
    await usuario.save()

    // Enviar email de confirmacion
    emailRegistroGmail({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token,
    })

    res.json({
      msg: 'Usuario Creado Correctamente, Revisa tu Email para confirmar tu cuenta, si no lo encuentras buscalo en Spam.',
    })
  } catch (error) {
    console.log(error)
  }
}

const autenticarUsuario = async (req, res) => {
  const { email, password } = req.body

  // Validaciones
  const usuario = await Usuario.findOne({ email })

  if (!usuario) {
    const error = Error('Usuario no existe')
    return res.status(400).json({ msg: error.message })
  }

  if (!usuario.confirmado) {
    const error = Error('Su cuenta no ha sido confirmada')
    return res.status(400).json({ msg: error.message })
  }

  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      seguidos: usuario.seguidos,
      token: generarJWT(usuario._id),
    })
  } else {
    const error = Error('Contraseña Incorrecta')
    return res.status(400).json({ msg: error.message })
  }
}

const confirmAccount = async (req, res) => {
  const { token } = req.params

  const usuario = await Usuario.findOne({ token })

  if (!usuario) {
    const error = Error('Token no valido')
    return res.status(400).json({ msg: error.message })
  }

  try {
    usuario.confirmado = true
    usuario.token = ''
    await usuario.save()
    res.json({ msg: 'Usuario confirmado correctamente' })
  } catch (error) {
    console.log(error)
  }
}

const olvidePassword = async (req, res) => {
  const { email } = req.body
  const usuario = await Usuario.findOne({ email })

  if (!usuario) {
    const error = Error('Usuario no existe')
    return res.status(400).json({ msg: error.message })
  }

  try {
    usuario.token = generarId()
    await usuario.save()

    emailOlvidePasswordGmail({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token,
    })

    res.json({ msg: 'Le hemos enviado un email con las intruscciones' })
  } catch (error) {
    console.log(error)
  }
}

const comprobarToken = async (req, res) => {
  const { token } = req.params

  const tokenValido = await Usuario.findOne({ token })

  if (!tokenValido) {
    const error = Error('Token invalido')
    return res.status(400).json({ msg: error.message })
  }

  res.json({ msg: 'Token valido y el usuario existe' })
}

const newPassword = async (req, res) => {
  const { token } = req.params
  const { password } = req.body

  const usuario = await Usuario.findOne({ token })

  if (!usuario) {
    const error = Error('Token invalido')
    return res.status(400).json({ msg: error.message })
  }

  try {
    usuario.password = password
    usuario.token = ''
    await usuario.save()

    res.json({ msg: 'Password modificaco corectamente' })
  } catch (error) {
    console.log(error)
  }
}

const perfil = async (req, res) => {
  const { usuario } = req

  res.json(usuario)
}

const followUser = async (req, res) => {
  const { id } = req.body

  const valid = mongoose.Types.ObjectId.isValid(id)

  if (!valid) {
    const error = new Error('Usuario no Encontrado')
    return res.status(404).json({ msg: error.message })
  }

  const usuarioSeguir = await Usuario.findById(id)

  if (!usuarioSeguir) {
    const error = new Error('Usuario no Encontrado')
    return res.json({ msg: error.message })
  }

  const usuarioAuth = await Usuario.findById(req.usuario._id)

  try {
    usuarioAuth.seguidos = [...usuarioAuth.seguidos, id]
    await usuarioAuth.save()
    res.json({ msg: 'Usuario seguido correctamente' })
  } catch (error) {
    console.log(error)
  }
}
const unfollowUser = async (req, res) => {
  const { id } = req.body

  const valid = mongoose.Types.ObjectId.isValid(id)

  if (!valid) {
    const error = new Error('Usuario no Encontrado')
    return res.status(404).json({ msg: error.message })
  }

  const usuarioSeguir = await Usuario.findById(id)

  if (!usuarioSeguir) {
    const error = new Error('Usuario no Encontrado')
    return res.json({ msg: error.message })
  }

  const usuarioAuth = await Usuario.findById(req.usuario._id)

  try {
    usuarioAuth.seguidos = usuarioAuth.seguidos.pull(id)
    await usuarioAuth.save()
    res.json({ msg: 'Usuario eliminado de tu lista de seguidos correctamente' })
  } catch (error) {
    console.log(error)
  }
}

const listUsers = async (req, res) => {
  const usuarios = await Usuario.find({}).select('nombre _id genero seguidos')

  res.json(usuarios)
}

const getUser = async (req, res) => {
  const { id } = req.params
  const valid = mongoose.Types.ObjectId.isValid(id)

  if (!valid) {
    const error = new Error('Usuario no Encontrado')
    return res.status(404).json({ msg: error.message })
  }
  const usuario = await Usuario.findById(id).select(
    'nombre genero seguidos createdAt'
  )

  if (!usuario) {
    const error = new Error('Usuario no Encontrado')
    return res.status(404).json({ msg: error.message })
  }

  res.json(usuario)
}

export {
  registerUser,
  autenticarUsuario,
  confirmAccount,
  olvidePassword,
  comprobarToken,
  newPassword,
  perfil,
  followUser,
  unfollowUser,
  listUsers,
  getUser,
}
