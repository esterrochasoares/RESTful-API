let { banco, contas, saques, depositos, transferencias, identificadorConta } = require('../bancodedados');
const { format } = require('date-fns')

const depositar = (req, res) => {
  const { numero_conta, valor } = req.body;

  if(!numero_conta || !valor){
    return res.status(400).json({ mensagem: 'O número da conta e o valor são obrigatórios!' });
  }

  let indexConta

  const contaValida = contas.find((conta)=>{
    indexConta = contas.indexOf(conta)
    return conta.numero == numero_conta
  })

  if(!contaValida){
    return res.status(400).json({ mensagem: 'Conta não cadastrada'})
  }

  const valorValido = valor > 0

  if(!valorValido){
    return res.status(400).json({ mensagem: 'Não é permitido depósitos com valores negativos ou zerados'});
  }


  contas[indexConta].saldo += valor

  const data = date()

  const deposito = {
    data,
    numero_conta,
    valor
  }

  depositos.push(deposito)

  return res.status(201).json();
}

const sacar = (req, res) =>{
  const { numero_conta, valor, senha } = req.body;

  if(!numero_conta || !valor || !senha){
    return res.status(400).json({ mensagem: 'O número da conta, valor e senha são obrigatórios!' });
  }

  let indexConta

  const contaValida = contas.find((conta)=>{
    indexConta = contas.indexOf(conta)
    return conta.numero == numero_conta
  })

  if(!contaValida){
    return res.status(400).json({ mensagem: 'Conta não cadastrada'})
  }

  const senhaValida = senha == contas[numero_conta-1].usuario.senha
  
  if(!senhaValida){
    return res.status(400).json({ mensagem: 'A senha informada está incorreta'})
  }

  if(contas[numero_conta-1].saldo < valor){
    return res.status(400).json({ mensagem: 'O saldo é insuficiente'})
  }

  contas[indexConta].saldo -= valor

  const data = date()

  const saque = {
    data,
    numero_conta,
    valor
  }

  saques.push(saque)
  return res.status(201).json();
}

const transferir = (req,res) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body

  if(!numero_conta_origem || !numero_conta_destino || !valor || !senha){
    return res.status(400).json({ mensagem: 'O número da conta origem, conta destino, valor e senha da conta origem são obrigatórios' })
  }

  let indexContaOrigem

  const contaOrigenValida = contas.find((conta)=>{
    indexContaOrigem = contas.indexOf(conta)
    return conta.numero == numero_conta_origem
  })

  if(!contaOrigenValida){
    return res.status(400).json({ mensagem: 'Conta de origem não cadastrada'})
  }

  let indexContaDestino

  const contaDestinoValida = contas.find((conta)=>{
    indexContaDestino = contas.indexOf(conta)
    return conta.numero == numero_conta_destino
  })

  if(!contaDestinoValida){
    return res.status(400).json({ mensagem: 'Conta de destino não cadastrada'})
  }

  const senhaValida = senha == contas[numero_conta_origem-1].usuario.senha
  
  if(!senhaValida){
    return res.status(400).json({ mensagem: 'A senha informada está incorreta'})
  }

  if(contas[numero_conta_origem-1].saldo < valor){
    return res.status(400).json({ mensagem: 'Saldo insuficiente!'})
  }

  contas[indexContaOrigem].saldo -= valor
  contas[indexContaDestino].saldo += valor

  const data = date()

  const transferencia = {
    data,
    numero_conta_origem,
    numero_conta_destino,
    valor
  }

  transferencias.push(transferencia)

  return res.status(201).json();
}

function date() {
  const date = new Date
  return format(date, "yyyy-MM-dd hh:mm:ss")
}



module.exports = {
  depositar,
  sacar,
  transferir
}