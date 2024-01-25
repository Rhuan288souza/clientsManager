describe('Teste de Gerenciamento de clientes', () => {
  it('Adiciona um novo cliente', () => {
    cy.intercept('GET', 'http://localhost:3004/clientes', {
      statusCode: 200,
      body: [
      ],
    }).as('getClientes')

    cy.intercept('POST', 'http://localhost:3004/clientes', {
      statusCode: 200,
      body: { id: 1234, nome: 'Novo Cliente Mockado', email: 'mockEmail@example.com', telefone: '987654321', coordenada_x: 80, coordenada_y: 10},
    }).as('addCliente')

    cy.visit('http://localhost:3000')

    // Valida campos como obrigatórios
    cy.get('#nome').clear().blur()
    cy.contains('Nome é obrigatório')
    cy.get('#email').clear().blur()
    cy.contains('Email é obrigatório')
    cy.get('#telefone').click().blur()
    cy.contains('Telefone é obrigatório')
    cy.get('#coordenada_x').clear().blur()
    cy.contains('Coordenada X é obrigatória')
    cy.get('#coordenada_y').clear().blur()
    cy.contains('Coordenada Y é obrigatória')
    cy.get('button[type="submit"]').should('be.disabled')

    // Valida campos com dados inválidos
    cy.get('#email').clear().type('email.invalido').blur()
    cy.contains('Email inválido')
    cy.get('#telefone').clear().type('123').blur()
    cy.contains('Telefone inválido')
    cy.get('#coordenada_x').clear().type('18.9').blur()
    cy.contains('Coordenada X deve ser um número inteiro')
    cy.get('#coordenada_y').clear().type('20.1').blur()
    cy.contains('Coordenada Y deve ser um número inteiro')
    cy.get('button[type="submit"]').should('be.disabled')

    // Preenche o formulário
    cy.get('#nome').clear().type('Novo Cliente')
    cy.get('#email').clear().type('cliente@example.com')
    cy.get('#telefone').clear().type('88978789999')
    cy.get('#coordenada_x').clear().type('10')
    cy.get('#coordenada_y').clear().type('20')

    cy.intercept('GET', 'http://localhost:3004/clientes', {
      statusCode: 200,
      body: [
        { id: 1, nome: 'Cliente Mockado 1', email: 'mock1@example.com', telefone: '123456789', coordenada_x: 10, coordenada_y: 20 },
        { id: 2, nome: 'Cliente Mockado 2', email: 'mock2@example.com', telefone: '987654321', coordenada_x: 30, coordenada_y: 40 }
      ],
    }).as('getClientesUpdated')

    cy.get('form').submit()

    // Verifica se a chamada à API foi feita
    cy.wait('@addCliente').its('response.statusCode').should('eq', 200)
    cy.wait('@getClientesUpdated')
  })
})

describe('Teste Modal', () => {
  it('Deve abrir e fechar o modal corretamente', () => {
    cy.intercept('GET', 'http://localhost:3004/clientes', {
      statusCode: 200,
      body: [
      ],
    }).as('getClientes')

    cy.intercept('GET', 'http://localhost:3004//calcular_rota', {
      statusCode: 200,
      body: [
        {
            "id": 11,
            "nome": "gilberto",
            "email": "gilberto19@teste.com",
            "telefone": "(00) 0 0000-0000",
            "coordenada_x": 8,
            "coordenada_y": 1
        },
        {
            "id": 15,
            "nome": "a",
            "email": "huv@saa.com",
            "telefone": "(88) 8 8888-7777",
            "coordenada_x": 8,
            "coordenada_y": 9
        },
        {
            "id": 8,
            "nome": "nomeTeste",
            "email": "tyas@ass.com",
            "telefone": "88918189",
            "coordenada_x": 8,
            "coordenada_y": 10
        },
        {
            "id": 4,
            "nome": "Cliente 4",
            "email": "cliente4@email.com",
            "telefone": "456789012",
            "coordenada_x": 5,
            "coordenada_y": 11
        },
        {
            "coordenada_x": 0,
            "coordenada_y": 0
        }
      ],
    }).as('calcularRota')

    cy.visit('http://localhost:3000')

    cy.get('#botao-calcular-rota').click();
    cy.contains('Rota Calculada').should('be.visible')

    cy.wait(1000)
    cy.get('body').type('{esc}')
    cy.contains('Rota Calculada').should('not.exist')
  })
})
