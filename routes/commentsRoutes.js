import express from 'express'
import {
  addComment,
  editComment,
  deleteComment,
} from '../controllers/commentsControllers.js'
import checkAuth from '../middleware/checkOut.js'

const Route = express.Router()

Route.route('/:id')
  .post(checkAuth, addComment)
  .put(checkAuth, editComment)
  .delete(checkAuth, deleteComment)

export default Route
