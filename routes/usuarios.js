const {Router} = require('express')
const {
  usuariosGet,
  usuarioPut,
  usuariosPost,
  usuariosDelete,
} = require('../controllers/usuarios')

const router = Router()

router.get('/', usuariosGet)

router.post('/', usuariosPost)

router.put('/:id', usuarioPut)

router.delete('/:id', usuariosDelete)

module.exports = router
