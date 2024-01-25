import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, TextField, Button, Modal, Grid, useMediaQuery, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import { useTheme } from '@mui/material/styles'
import styled from 'styled-components'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import MaskedInput from 'react-text-mask'
import ClientCard from './UserCards'
import { applyTelephoneMask } from '../../utils'
import { fetchClientes, addCliente, calcRota } from './api'
import './style.css'

const validationSchema = Yup.object({
  nome: Yup.string().required('Nome é obrigatório'),
  email: Yup.string()
  .matches(
    /^[^\s@]+@[^\s@]+\.[^\s@]+(\.[^\s@]+)?$/,
    'Email inválido'
  )
  .required('Email é obrigatório'),
  telefone: Yup.string().matches(/^\(\d{2}\)\s\d\s\d{4,5}-\d{4}$/, 'Telefone inválido').required('Telefone é obrigatório'),
  coordenada_x: Yup.number().integer('Coordenada X deve ser um número inteiro').required('Coordenada X é obrigatória'),
  coordenada_y: Yup.number().integer('Coordenada Y deve ser um número inteiro').required('Coordenada Y é obrigatória')
})

const TextMaskCustom = (props) => {
  const { inputRef, ...other } = props
  return (
    <MaskedInput
      {...other}
      ref={inputRef}
      mask={['(', /[0-9]/, /\d/, ')', ' ', /\d/, ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      placeholderChar={'\u2000'}
      showMask
    />
  )
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '500px',
  maxHeight: '90%',
  overflow: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
}

const ClientContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'nome', headerName: 'Nome', width: 130 },
  { field: 'email', headerName: 'Email', width: 130 },
  { field: 'telefone', headerName: 'Telefone', width: 130, renderCell: (params) => applyTelephoneMask(params.value)},
  { field: 'coordenada_x', headerName: 'Coordenada X', width: 130 },
  { field: 'coordenada_y', headerName: 'Coordenada Y', width: 130 }
]

const UserManagement = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [visibleCards, setVisibleCards] = useState(5)
  const [searchTerm, setSearchTerm] = useState('');
  const [rota, setRota] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [clients, setClients] = useState([])
  const formik = useFormik({
    initialValues: {
      nome: '',
      email: '',
      telefone: '',
      coordenada_x: '',
      coordenada_y: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await addCliente({
          ...values,
          telefone: cleanTelephoneNumber(values.telefone)
        })
        const updatedClients = await fetchClientes()
        setClients(filterClients(updatedClients))
        resetForm()
        toast.success("Usuário cadastrado com sucesso!")
      } catch (error) {
        toast.error("Erro ao cadastrar o usuário")
        console.error('Houve um erro ao enviar os dados', error)
      }
    }
  })

  const cleanTelephoneNumber = (telefone) => {
    return telefone.replace(/\D/g, '')
  }

  const filterClients = (clients) => {
    const filteredClients = searchTerm.trim()
      ? clients.filter(cliente =>
          cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.telefone.includes(searchTerm) ||
          cliente.coordenada_x.toString().includes(searchTerm) ||
          cliente.coordenada_y.toString().includes(searchTerm)
        )
      : clients
  
    return filteredClients
  }

  const handleShowMore = () => {
    setVisibleCards(prevVisibleCards => prevVisibleCards + 5)
  }
  
  const handleCalculateRoute = async () => {
    try {
      const response = await calcRota()
      setRota(response)
      setModalOpen(true)
    } catch (error) {
      toast.error("Erro ao calcular rota")
      console.error('Erro ao calcular rota', error)
    }
  }

  const handleCloseModal = () => setModalOpen(false)

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchClientes()
      setClients(filterClients(data))
    }
    try {
      fetchData()
    } catch (error) {
      toast.error("Erro ao buscar os dados dos clientes")
      console.error('Houve um erro ao buscar os dados dos clientes', error)
    }
  }, [])

  useEffect(() => {
    setVisibleCards(5)
  }, [searchTerm, isMobile])

  return (
    <div>
      <h1>Cadastrar Novo Cliente</h1>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={4}>
            <TextField
              sx={{ width: '95%'}}
              id="nome"
              name="nome"
              label="Nome"
              value={formik.values.nome}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nome && Boolean(formik.errors.nome)}
              helperText={formik.touched.nome && formik.errors.nome}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              sx={{ width: '95%'}}
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              sx={{ width: '95%'}}
              id="telefone"
              name="telefone"
              label="Telefone"
              value={formik.values.telefone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.telefone && Boolean(formik.errors.telefone)}
              helperText={formik.touched.telefone && formik.errors.telefone}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                inputComponent: TextMaskCustom
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              sx={{ width: '95%'}}
              id="coordenada_x"
              name="coordenada_x"
              label="Coordenada X"
              type="number"
              value={formik.values.coordenada_x}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.coordenada_x && Boolean(formik.errors.coordenada_x)}
              helperText={formik.touched.coordenada_x && formik.errors.coordenada_x}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              sx={{ width: '95%'}}
              id="coordenada_y"
              name="coordenada_y"
              label="Coordenada Y"
              type="number"
              value={formik.values.coordenada_y}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.coordenada_y && Boolean(formik.errors.coordenada_y)}
              helperText={formik.touched.coordenada_y && formik.errors.coordenada_y}
            />
          </Grid>
        </Grid>
        <br/>
        <Button 
          id="submit-button"
          color="primary" 
          variant="contained" 
          fullWidth 
          type="submit" 
          sx={{
            width: 200,
            height: 40, 
            fontSize: '1rem',
          }}
          disabled={!formik.isValid || formik.isSubmitting}
        >
          Cadastrar
        </Button>
      </form>
      <h1>Listagem de Clientes</h1>
      {isMobile ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px', marginTop: '27px', paddingRight: '5%' }}>
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '10px' }}
            />
          </div>
          {filterClients(clients).slice(0, visibleCards).map(client => <ClientCard key={client.id} client={client} />)}
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
            {visibleCards < filterClients(clients).length && (
              <Button onClick={handleShowMore}>Mostrar Mais</Button>
            )}
          </Box>
        </div>
      ) : (
        <DataGrid
          rows={clients}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      )}
      <h1>Rota de Atendimento</h1>
      <Button
        id="botao-calcular-rota"
        variant="contained" 
        onClick={handleCalculateRoute}
      >
        Calcular Rota
      </Button>
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-title" variant="h6" component="h2" align="center">
            Rota Calculada
          </Typography>
          <Box sx={{ mt: 2 }}>
            {rota.map((cliente, index) => (
              <ClientContainer>
                {cliente.nome ? (
                  <>
                    <span className='client-name'> Cliente {index + 1}: </span><Typography key={index}>{cliente.nome}</Typography>
                  </>
                ): (
                  <>
                    <span style={{marginTop: '10px', fontWeight: 'bold'}}>Retorno à empresa</span>
                  </>
                )}
              </ClientContainer>
            ))}
          </Box>
        </Box>
      </Modal>
    </div>
  )
}

export default UserManagement
