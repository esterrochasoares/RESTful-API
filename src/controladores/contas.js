let { banco, contas, saques, depositos, transferencias, identificadorConta } = require('../bancodedados');

const criarConta = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha }= req.body;

  const usuario = tratamentoDeDadosUsuario(nome, cpf, data_nascimento, telefone, email, senha, req, res)
  if(!usuario.nome){
    return
  }

  const conta = {
    numero: identificadorConta++,
    saldo: 0,
    usuario
  }
  contas.push(conta)
  return res.status(201).json();

}

const atualizarUsuario = (req, res) => {
  const { numeroConta } = req.params;
  const { nome, cpf, data_nascimento, telefone, email, senha }= req.body;

  const contaValida = contas.find((conta) => {
    return conta.numero == numeroConta;
  })
  
  if(!contaValida){
    return res.status(400).json({ mensagem: 'A conta informada não existe' });
  }

  const usuario = tratamentoDeDadosUsuario(nome, cpf, data_nascimento, telefone, email, senha, req, res)

  contas[numeroConta-1].usuario = usuario

  return res.status(201).json();

} 

const listarContas = (req, res) => {
  const { senha_banco } = req.query;

  if (senha_banco != banco.senha){
    return  res.status(400).json({ mensagem: 'A senha do banco informada é inválida!' });
  }

  return  res.status(200).json(contas)
}

const deletarConta = (req, res) => {
  const { numeroConta } = req.params;

  const contaValida = contas.find((conta) => {
    return conta.numero == numeroConta;
  })
  
  if(!contaValida){
    return res.status(400).json({ mensagem: 'A conta informada não existe' });
  }

  const saldoValido = contas[numeroConta-1].saldo == 0;

  if(!saldoValido){
    return res.status(400).json({ mensagem: 'A conta só pode ser removida se o saldo for zero!' });
  }

  contas.splice(numeroConta-1,1)
  
  return res.status(201).json();
}

const exibirSaldo = (req, res) => {
  const { numero_conta, senha } = req.params

  if(!numero_conta || !senha ){
    return res.status(400).json({ mensagem: 'O numero da conta e a senha são obrigatorios' });
  }

  const contaValida = contas.find((conta)=>{
    return conta.numero == numero_conta
  })

  if(!contaValida){
    return res.status(400).json({ mensagem: 'Conta não cadastrada'})
  }

  const senhaValida = senha == contas[numero_conta-1].usuario.senha
  
  if(!senhaValida){
    return res.status(400).json({ mensagem: 'A senha informada está incorreta'})
  }

  const saldoConta = contas[numero_conta-1].saldo
  
  return res.status(200).json({saldo: saldoConta})
}

const gerarExtrato = (req, res) => {
  const { numero_conta, senha } = req.params

  if(!numero_conta || !senha ){
    return res.status(400).json({ mensagem: 'O numero da conta e a senha são obrigatorios' });
  }

  const contaValida = contas.find((conta)=>{
    return conta.numero == numero_conta
  })

  if(!contaValida){
    return res.status(400).json({ mensagem: 'Conta não cadastrada'})
  }

  const senhaValida = senha == contas[numero_conta-1].usuario.senha
  
  if(!senhaValida){
    return res.status(400).json({ mensagem: 'A senha informada está incorreta'})
  }

  const depositosConta = []
  const saquesConta = []
  const transferenciasEnviadas = []
  const transferenciasRecebidas = []

  for(let deposito of depositos){
    if(deposito.numero_conta == numero_conta){
      depositosConta.push(deposito)
    }
  }

  for(let saque of saques){
    if(saque.numero_conta == numero_conta){
      saquesConta.push(saque)
    }
  }

  for(let transferencia of transferencias){
    if(transferencia.numero_conta_origem == numero_conta){
      transferenciasEnviadas.push(transferencia)
    }
    if(transferencia.numero_conta_destino == numero_conta){
      transferenciasRecebidas.push(transferencia)
    }
  }

  const extrato = {
    depositosConta,
    saquesConta,
    transferenciasEnviadas,
    transferenciasRecebidas
  }

  return res.status(200).json({extrato})

}


function tratamentoDeDadosUsuario (nome, cpf, data_nascimento, telefone, email, senha, req, res) {

  if (!nome) {
    return res.status(400).json({ mensagem: 'O nome é obrigatório' });
  }
  if (!cpf) {
    return res.status(400).json({ mensagem: 'O cpf é obrigatório' });
  }

  const cpfExiste = contas.find((conta) => {
    return conta.usuario.cpf === cpf;
  })

  if(cpfExiste){
    return res.status(400).json({ mensagem: 'O cpf já esta cadastrado' });
  }

  if (!data_nascimento) {
    return res.status(400).json({ mensagem: 'A data_nascimento é obrigatória' });
  }

  if (!telefone) {
    return res.status(400).json({ mensagem: 'O telefone é obrigatório' });
  }

  if (!email) {
      return res.status(400).json({ mensagem: 'O email é obrigatório' });
  }
  const emailExiste = contas.find((conta) => {
    return conta.usuario.email === String(email);
  })

  if(emailExiste){
    return res.status(400).json({ mensagem: 'O email já esta cadastrado' });
  }
  if (!senha) {
      return res.status(400).json({ mensagem: 'A senha é obrigatória' });
  }

  const usuario = {
      nome, 
      cpf,
      data_nascimento, 
      telefone, 
      email, 
      senha,
  }
  return usuario
}

module.exports = {
  criarConta,
  atualizarUsuario,
  listarContas,
  deletarConta,
  exibirSaldo,
  gerarExtrato
}