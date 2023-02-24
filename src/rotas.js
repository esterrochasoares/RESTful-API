const express = require('express');
const contas = require('./controladores/contas');
const transacoes = require('./controladores/transacoes');

const rotas = express();

rotas.post('/contas', contas.criarConta);;
rotas.put('/contas/:numeroConta', contas.atualizarUsuario);;
rotas.delete('/contas/:numeroConta', contas.deletarConta);;
rotas.get('/contas', contas.listarContas);;
rotas.get('/contas/saldo/:numero_conta/:senha', contas.exibirSaldo)
rotas.get('/contas/extrato/:numero_conta/:senha', contas.gerarExtrato);;

rotas.post('/transacoes/depositar', transacoes.depositar);
rotas.post('/transacoes/sacar', transacoes.sacar);;
rotas.post('/transacoes/transferir', transacoes.transferir)

module.exports = rotas;