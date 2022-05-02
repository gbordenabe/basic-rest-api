const {request, response} = require('express')

const usuariosGet = (req = request, res = response) => {
  res.json({
    msg: 'get API - controlador',
  })
}

const usuariosPost = (req, res = response) => {
  res.json({
    msg: 'post API - controlador',
  })
}

const usuarioPut = (req, res = response) => {
  res.json({
    msg: 'put API - controlador',
  })
}

const usuariosDelete = (req, res = response) => {
  res.json({
    msg: 'delete API - controlador',
  })
}

module.exports = {usuariosGet, usuarioPut, usuariosPost, usuariosDelete}
