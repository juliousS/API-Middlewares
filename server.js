const express = require('express');

const app = express();

app.use(express.json());

// 1º Middleware: autenticação
function autenticacao(req, res, next) {
    console.log('Autenticação realizada');
    next();
}

// 2º Middleware: validação do corpo
function validarCorpo(req, res, next) {
    if (!req.body.titulo) {
        return res.status(400).json({
            erro: 'O título da tarefa é obrigatório'
        });
    }

    console.log('Corpo validado');
    next();
}

// 3º Middleware: registro de log
function registrarLog(req, res, next) {
    console.log('Log: criação de tarefa');
    next();
}

// Rota POST /tarefas
app.post(
    '/tarefas',
    [autenticacao, validarCorpo, registrarLog],
    (req, res) => {
        res.status(201).json({
            mensagem: 'Tarefa criada com sucesso',
            tarefa: req.body
        });
    }
);

// Rota apenas para testar o servidor no navegador
app.get('/', (req, res) => {
    res.send('Servidor funcionando!');
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});