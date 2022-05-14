const {Router} = require('express')
const {check} = require('express-validator')
const {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
} = require('../controllers/producto')
const {existeProducto, existeCategoria} = require('../helpers/db-validators')
const {esAdminRole} = require('../middlewares')
const {validarCampos} = require('../middlewares/validar-campos')
const {validarJWT} = require('../middlewares/validar-jwt')

const router = Router()

router.get('/', obtenerProductos)

router.get(
  '/:id',
  [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos,
  ],
  obtenerProducto
)

router.post(
  '/',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    //check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos,
  ],
  crearProducto
)

router.put(
  '/:id',
  [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos,
  ],
  actualizarProducto
)

router.delete(
  '/:id',
  [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos,
  ],
  borrarProducto
)

module.exports = router
