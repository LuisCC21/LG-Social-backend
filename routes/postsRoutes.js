import express from 'express'
import {
  createPost,
  getPosts,
  editPost,
  deletePost,
  aumentarLikes,
  aumentarDisLikes,
  disminuirLikes,
  disminuirDisLikes,
  listComments,
  getPost,
} from '../controllers/postsControllers.js'
import checkAuth from '../middleware/checkOut.js'

const router = express.Router()

router.route('/').get(checkAuth, getPosts).post(checkAuth, createPost)
router
  .route('/:id')
  .get(checkAuth, getPost)
  .put(checkAuth, editPost)
  .delete(checkAuth, deletePost)

router.get('/list-comments/:id', checkAuth, listComments)
router.get('/like/:id', checkAuth, aumentarLikes)
router.get('/restar-like/:id', checkAuth, disminuirLikes)
router.get('/dislike/:id', checkAuth, aumentarDisLikes)
router.get('/restar-dislike/:id', checkAuth, disminuirDisLikes)

export default router
