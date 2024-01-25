import axios from 'axios'

const BASE_URL = 'http://localhost:3004'

export const fetchClientes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/clientes`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar clientes:', error)
    throw error
  }
}

export const addCliente = async (cliente) => {
  try {
    const response = await axios.post(`${BASE_URL}/clientes`, cliente)
    return response.data
  } catch (error) {
    console.error('Erro ao cadastrar cliente:', error)
    throw error
  }
}

export const calcRota = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/calcular_rota`)
    return response.data
  } catch (error) {
    console.error('Erro ao calcular rota:', error)
    throw error
  }
}
