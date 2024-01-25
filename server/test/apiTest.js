import request from 'supertest'
import sinon from 'sinon'
import { expect } from 'chai'
import app from '../app.js'
import pool from '../db_connection.js'

describe('API Routes', () => {
  let stub
  let server

  // Configura um stub para o banco de dados antes de cada teste
  beforeEach(() => {
    stub = sinon.stub(pool, 'query')
  })

  // Restaura o comportamento original após cada teste
  afterEach(() => {
    stub.restore()
  })

  // Inicia o servidor para testes
  before((done) => {
    server = app.listen(3007, done)
  })
  
  // Fecha o servidor após os testes
  after(() => {
    server.close()
  })

  describe('GET /clientes', () => {
    it('deve retornar todos os clientes', (done) => {
      const clientesMock = [
        { id: 1, nome: 'Cliente 1', email: 'cliente1@example.com', telefone: '123456789', coordenada_x: '10', coordenada_y: '20' },
      ]

      stub.resolves({ rows: clientesMock })

      request(app)
        .get('/clientes')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.be.an('array').that.deep.equals(clientesMock)
          done()
        })
    })
  })

  describe('POST /clientes', () => {
    it('deve criar um novo cliente', (done) => {
      const clienteMock = { id: 1 }

      stub.resolves({ rows: [clienteMock] })

      request(app)
        .post('/clientes')
        .send({
          nome: 'TesteChai',
          email: 'teste@teste.com',
          telefone: '123456789',
          coordenada_x: '10',
          coordenada_y: '20'
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(201)
          expect(res.body).to.have.property('id')
          done()
        })
    })
  })

  describe('GET /calcular_rota', () => {
    it('deve retornar uma rota calculada', (done) => {
      const rotaMock = [
        { coordenada_x: 0, coordenada_y: 0 },
        { coordenada_x: 10, coordenada_y: 20 },
      ]

      stub.resolves({ rows: rotaMock })

      request(app)
        .get('/calcular_rota')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.be.an('array')
          done()
        })
    })
  })
})
