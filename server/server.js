import app from './app.js'

const port = process.env.PORT || 3004
const server = app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})

export default server