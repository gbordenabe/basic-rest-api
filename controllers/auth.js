const bcryptjs = require('bcryptjs')
const {response} = require('express')
const {json} = require('express/lib/response')
const {generarJWT} = require('../helpers/generar-jwt')
const {googleVerify} = require('../helpers/google-verify')
const Usuario = require('../models/usuario')

const login = async (req, res = response) => {
  const {correo, password} = req.body

  try {
    const usuario = await Usuario.findOne({correo})
    if (!usuario) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - correo',
      })
    }

    if (!usuario.estado) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - estado : false',
      })
    }

    const validPassword = bcryptjs.compareSync(password, usuario.password)
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - password',
      })
    }

    const token = await generarJWT(usuario.id)

    res.json({
      usuario,
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Hable con el administrador',
    })
  }
}

const googleSingIn = async (req, res = response) => {
  const {id_token} = req.body

  try {
    const {correo, nombre, img} = await googleVerify(id_token)

    let usuario = await Usuario.findOne({correo})

    if (!usuario) {
      const data = {
        nombre,
        correo,
        password: 'nolonecesita',
        img,
        google: true,
        rol: 'USER_ROLE',
      }

      usuario = new Usuario(data)
      await usuario.save()
    }

    if (!usuario.estado) {
      res.status(401).json({
        msg: 'Hable con el administrador - Usuario bloqueado',
      })
    }

    const token = await generarJWT(usuario.id)

    res.json({
      usuario,
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      ok: false,
      msg: 'El token no se pudo verificar',
    })
  }
}

module.exports = {login, googleSingIn}
