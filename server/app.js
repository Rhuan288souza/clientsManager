import express, { json } from 'express'
import cors from 'cors'
import pool from './db_connection.js'
const app = express()

app.use(cors({
  origin: 'http://localhost:3000'
}))

app.use(json())

app.get('/clientes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send('Erro no servidor')
  }
})

app.post('/clientes', async (req, res) => {
  try {
    const { nome, email, telefone, coordenada_x, coordenada_y } = req.body
    const result = await pool.query(
      'INSERT INTO clientes (nome, email, telefone, coordenada_x, coordenada_y) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [nome, email, telefone, coordenada_x, coordenada_y]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Erro no servidor')
  }
})

app.get('/calcular_rota', async (req, res) => {
  try {
    const clientes = await pool.query('SELECT * FROM clientes')
    const rota = calcularRota(clientes.rows)
    res.json(rota)
  } catch (error) {
    console.error(error)
    res.status(500).send('Erro no servidor')
  }
})

const calcularDistancia = (ponto1, ponto2) => {
  const x1 = parseFloat(ponto1.coordenada_x)
  const y1 = parseFloat(ponto1.coordenada_y)
  const x2 = parseFloat(ponto2.coordenada_x)
  const y2 = parseFloat(ponto2.coordenada_y)
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

const encontrarMaisProximo = (pontoAtual, pontosNaoVisitados) =>{
  let maisProximo = null
  let menorDistancia = Infinity
  pontosNaoVisitados.forEach(ponto => {
    const distancia = calcularDistancia(pontoAtual, ponto)
    if (distancia < menorDistancia) {
      maisProximo = ponto
      menorDistancia = distancia
    }
  })
  return maisProximo
}

const calcularRota = (clientes) => {
  let rota = []
  let pontosNaoVisitados = [...clientes]
  let pontoAtual = { coordenada_x: 0, coordenada_y: 0 } // Ponto de partida
  while (pontosNaoVisitados.length > 0) {
    let maisProximo = encontrarMaisProximo(pontoAtual, pontosNaoVisitados)
    rota.push(maisProximo)
    pontosNaoVisitados = pontosNaoVisitados.filter(ponto => ponto !== maisProximo)
    pontoAtual = maisProximo
  }
  rota.push({ coordenada_x: 0, coordenada_y: 0 }) // Retornar ao ponto de partida (empresa)
  return rota
}

export default app