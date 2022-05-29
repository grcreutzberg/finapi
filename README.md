## FinAPI - Financeira

Aplicação para acesso aos serviços da [FinAPI](https://www.finapi.com.br/).
API de gerenciamento de contas bancárias.

### Requisitos: 

- [ x ] Deve ser possível criar uma conta
- [ x ] Deve ser possível buscar o extrato bancário do cliete
- [ x ] Deve ser possível realizar um depósito
- [ x ] Deve ser possível realizar um saque
- [ x ] Deve ser possível buscar o extrato bancário do cliente por data
- [ ] Deve ser possível atualizar dados da conta bancária do cliente
- [ ] Deve ser possível obter dados da conta do cliente
- [ ] Deve ser possível deletar uma conta
- [ ] Deve ser possível retornar o saldo da conta

## Regras de negócio: 

- [ x ] Não deve ser possível cadastrar uma conta com cpf já existente
- [ x ] Não deve ser possível buscar extrato em uma conta não existente
- [ x ] Não deve ser possível fazer depósito em uma conta não existente
- [ x ] Não deve ser possível fazer saque em uma conta não existente
- [ ] Não deve ser possível excluir uma conta não existente
- [ ] Não deve ser possível fazer saque quando o saldo for insuficiente 