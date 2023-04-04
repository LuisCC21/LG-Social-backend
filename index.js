import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import conectarBD from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import postsRoutes from './routes/postsRoutes.js'
import commentsRoutes from './routes/commentsRoutes.js'
import { Server } from 'socket.io'

const app = express()

app.use(express.json())

dotenv.config()

conectarBD()

// Configurar CORS
const whitelist = [process.env.FRONTEND_URL]

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin) || !origin) {
      // Puede consultar la API
      callback(null, true)
    } else {
      // No esta permitido
      callback(new Error('Error de Cors'))
    }
  },
}

app.use(cors(corsOptions))

// Routing
app.use('/api/users', userRoutes)
app.use('/api/posts', postsRoutes)
app.use('/api/comments', commentsRoutes)

app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Origin',
    'https://warm-macaron-817d9b.netlify.app'
  )
  next()
})

const PORT = process.env.PORT || 5000

const servidor = app.listen(PORT, () => {})

const io = new Server(servidor, {
  pingTimeout: 60000,
  cors: {
    origin: '*',
  },
})

io.on('connection', (socket) => {
  // Definir los eventos de socket io

  // socket io Publicaciones
  socket.on('nueva publicacion', (publicacion) => {
    socket.broadcast.emit('publicacion agregada', publicacion)
  })
  socket.on('eliminar publicacion', (publicacion) => {
    socket.broadcast.emit('publicacion eliminada', publicacion)
  })
  socket.on('editar publicacion', (publicacion) => {
    socket.broadcast.emit('publicacion actualizada', publicacion)
  })
  // socket io Comentarios
  socket.on('abrir publicacion', (publicacion) => {
    socket.join(publicacion)
  })
  socket.on('nuevo comentario', (comentario) => {
    socket.to(comentario.publicacion).emit('comentario agregado', comentario)
  })
  socket.on('eliminar comentario', ({ id, idPublicacion }) => {
    socket.to(idPublicacion).emit('comentario eliminado', { id, idPublicacion })
  })

  // socket io Likes
  socket.on('dar Like', ({ data, id }) => {
    socket.broadcast.emit('likes aumentados', { data, id })
  })
  socket.on('quitar Like', ({ data, id }) => {
    socket.broadcast.emit('likes disminuidos', { data, id })
  })
  socket.on('dar disLike', ({ data, id }) => {
    socket.broadcast.emit('disLikes aumentados', { data, id })
  })
  socket.on('quitar disLike', ({ data, id }) => {
    socket.broadcast.emit('disLikes disminuidos', { data, id })
  })
})
