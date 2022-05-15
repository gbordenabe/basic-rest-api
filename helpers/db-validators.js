const {Categoria, Producto} = require('../models')
const Role = require('../models/role')
const Usuario = require('../models/usuario')

const esRoleValido = async (rol = '') => {
  const existeRol = await Role.findOne({rol})
  if (!existeRol) {
    throw new Error(`El rol ${rol} no esta registrado en la base de datos`)
  }
}

const emailExiste = async (correo = '') => {
  const existeEmail = await Usuario.findOne({correo})
  if (existeEmail) {
    throw new Error(`El correo ${correo} ya esta registrado`)
  }
}

const existeUsuarioPorId = async id => {
  const existeUsuario = await Usuario.findById(id)
  if (!existeUsuario) {
    throw new Error(`El id ${id} no existe`)
  }
}

const existeCategoria = async id => {
  const existeCategoria = await Categoria.findById(id)
  if (!existeCategoria) {
    throw new Error(`No existe categoria con id ${id}`)
  }
}

const existeProducto = async id => {
  const existeProducto = await Producto.findById(id)
  if (!existeProducto) {
    throw new Error(`No existe producto con id ${id}`)
  }
}

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
  if (!colecciones.includes(coleccion)) {
    throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`)
  }

  return true
}

module.exports = {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
  existeCategoria,
  existeProducto,
  coleccionesPermitidas,
}
