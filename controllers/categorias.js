const {response} = require('express')
const {Categoria} = require('../models')

const obtenerCategorias = async (req, res = response) => {
  const {desde = 0, limit = 5} = req.query
  const query = {estado: true}

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .skip(Number(desde))
      .limit(Number(limit))
      .populate('usuario', 'nombre'),
  ])

  res.json({
    total,
    categorias,
  })
}

const obtenerCategoria = async (req, res = response) => {
  const {id} = req.params

  const categoria = await Categoria.findById(id).populate('usuario', 'nombre')

  res.json({categoria})
}

const crearCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase()

  const categoriaDB = await Categoria.findOne({nombre})

  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre}, ya existe`,
    })
  }

  const data = {
    nombre,
    usuario: req.usuario._id,
  }

  const categoria = new Categoria(data)
  await categoria.save()
  res.status(201).json(categoria)
}

const actualizarCategoria = async (req, res = response) => {
  const {id} = req.params
  const {estado, usuario, ...data} = req.body

  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase()
  }

  data.usuario = req.usuario._id

  const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true})
  await categoria.save()

  res.json(categoria)
}

const borrarCategoria = async (req, res = response) => {
  const {id} = req.params

  const categoria = await Categoria.findByIdAndUpdate(
    id,
    {estado: false},
    {new: true}
  )
  await categoria.save()

  res.json(categoria)
}

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
}
