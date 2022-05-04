const {response} = require('express')
const Usuario = require('../models/usuario')
const jwt = require('jsonwebtoken')

const validarJWT = async (req, res = response, next) => {
  const token = req.header('x-token')

  if (!token) {
    return res.status(400).json({
      msg: 'No hay token en la peticion',
    })
  }

  try {
    const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
    req.uid = uid
    const usuario = await Usuario.findById(uid)

    if (!usuario) {
      return res.status(401).json({
        msg: 'Token no valido - usuario no existe en base de datos',
      })
    }

    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Token no valido - usuario con estado : false',
      })
    }

    req.usuario = usuario
    next()
  } catch (error) {
    res.status(401).json({
      msg: 'Token no valido',
    })
  }
}

module.exports = {validarJWT}
