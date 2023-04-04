import express from 'express'
import {
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
} from '../controllers/userControllers.js'
import checkAuth from '../middleware/checkOut.js'

const router = express.Router()

router.post('/', registerUser) // Crear nuevo usuario
router.post('/login', autenticarUsuario) // Autenticar usuario
router.get('/confirmar/:token', confirmAccount) // Confirma cuenta
router.post('/recuperar-password', olvidePassword) // Olvide password
router
  .route('/olvide-password/:token')
  .get(comprobarToken) // Comporar token para recuperar password
  .post(newPassword) // Establece nuevo password
router.get('/perfil', checkAuth, perfil)
router.post('/follow-user', checkAuth, followUser) // Seguir Usuario
router.post('/unfollow-user', checkAuth, unfollowUser) // Seguir Usuario
router.get('/list-users', checkAuth, listUsers) // Listar Usuarios
router.get('/get-user/:id', checkAuth, getUser) // Obtener Usuario

export default router
