import { Card, CardContent, Typography } from '@mui/material'
import { applyTelephoneMask } from '../../utils'

const ClientCard = ({ client }) => {
  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">{client.nome}</Typography>
        <Typography color="textSecondary">Email: {client.email}</Typography>
        <Typography color="textSecondary">Telefone: {applyTelephoneMask(client.telefone)}</Typography>
        <Typography color="textSecondary">Coordenada X: {client.coordenada_x}</Typography>
        <Typography color="textSecondary">Coordenada Y: {client.coordenada_y}</Typography>
      </CardContent>
    </Card>
  )
}

export default ClientCard