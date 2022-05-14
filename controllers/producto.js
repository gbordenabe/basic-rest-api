const {response} = require('express')
const moongose = require('mongoose')
const {Categoria} = require('../models')
const Producto = require('../models/producto')

const obtenerProductos = async (req, res = response) => {
  const {desde = 0, limit = 5} = req.query
  const query = {estado: true}

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .skip(Number(desde))
      .limit(Number(limit))
      .populate('usuario', 'nombre')
      .populate('categoria', 'nombre'),
  ])

  res.json({
    total,
    productos,
  })
}

const obtenerProducto = async (req, res = response) => {
  const {id} = req.params

  const producto = await Producto.findById(id)
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre')

  res.json({producto})
}

const crearProducto = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase()
  const categoria = req.body.categoria

  const productoDB = await Producto.findOne({nombre})
  if (productoDB) {
    return res.status(400).json({
      msg: `El producto ${productoDB.nombre}, ya existe`,
    })
  }

  const categoriaDB = await Categoria.findOne({categoria})
  if (!categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre}, no existe`,
    })
  }

  const data = {
    ...req.body,
    nombre,
    categoria: categoriaDB._id,
    usuario: req.usuario._id,
  }

  const producto = new Producto(data)
  await producto.save()

  res.json(producto)
}

const actualizarProducto = async (req, res = response) => {
  const {id} = req.params
  const {estado, usuario, ...data} = req.body

  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase()
  }

  data.usuario = req.usuario._id

  const producto = await Producto.findByIdAndUpdate(id, data, {new: true})
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre')
  await producto.save()

  res.json(producto)
}

const borrarProducto = async (req, res = response) => {
  const {id} = req.params

  const producto = await Producto.findByIdAndUpdate(
    id,
    {estado: false},
    {new: true}
  )
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre')
  await producto.save()

  res.json(producto)
}

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
}
