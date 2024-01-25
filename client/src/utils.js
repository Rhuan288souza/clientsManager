const applyTelephoneMask = (telefone) => {
  if (telefone.length === 11) {
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } 
  return telefone
}

module.exports = {
  applyTelephoneMask
}