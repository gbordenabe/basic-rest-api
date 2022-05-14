const {Router} = require('express')
const {check} = require('express-validator')
const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
} = require('../controllers/categorias')
const {existeCategoria} = require('../helpers/db-validators')
const {validarJWT, esAdminRole} = require('../middlewares')

const {validarCampos} = require('../middlewares/validar-campos')

const router = Router()

router.get('/', obtenerCategorias)

router.get(
  '/:id',
  [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos,
  ],
  obtenerCategoria
)

router.post(
  '/',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
)

router.put(
  '/:id',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos,
  ],
  actualizarCategoria
)

router.delete(
  '/:id',
  [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos,
  ],
  borrarCategoria
)

module.exports = router
