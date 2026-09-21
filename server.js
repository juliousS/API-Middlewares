import express from "express"

const app = express()
const PORTA = 3000

app.use(express.json())

let tarefas = [
    { id: 1, titulo: 'Lavar louça', concluida: true },
    { id: 2, titulo: 'Lavar a casa', concluida: false },
    { id: 3, titulo: 'Lavar roupa', concluida: true }
]

let proximoId = tarefas.length + 1

app.get('/', (req, res) => {
    res.json({ Mensagem: 'API de Tarefas no ar!' })
})

function filtrarPorStatus(req, res, next) {
    const { concluida } = req.query

    if (concluida !== undefined) {
        const statusBooleano = concluida === 'true'

        const tarefasConcluidas = tarefas.filter(
            tarefa => tarefa.concluida === statusBooleano
        )

        return res.json(tarefasConcluidas)
    }

    next()
}

app.get('/tarefas', filtrarPorStatus, (req, res) => {
    res.json(tarefas)
})

function buscarTarefa(req, res, next) {
    const { id } = req.params
    const idTarefa = parseInt(id)

    const tarefa = tarefas.find(t => t.id === idTarefa)

    if (!tarefa) {
        return res.status(404).json({
            Error: 'Tarefa não encontrada!'
        })
    }

    req.tarefa = tarefa

    next()
}

app.get('/tarefas/:id', buscarTarefa, (req, res) => {
    res.json(req.tarefa)
})

function autenticar(req, res, next) {
    console.log('Autenticando...')
    next()
}

function validarTarefa(req, res, next) {
    const { titulo } = req.body

    if (!titulo || typeof titulo !== 'string' || !titulo.trim()) {
        return res.status(400).json({
            Error: 'Título inválido ou campo vazio'
        })
    }

    req.titulo = titulo

    next()
}

function logger(req, res, next) {
    console.log(
        `${new Date().toISOString()} - ${req.method} ${req.url}`
    )

    next()
}

app.post(
    '/tarefas',
    [autenticar, validarTarefa, logger],
    (req, res) => {

        const novaTarefa = {
            id: proximoId++,
            titulo: req.titulo,
            concluida: false
        }

        tarefas.push(novaTarefa)

        res.status(201).json({
            Mensagem: 'Tarefa criada com sucesso!',
            tarefa: novaTarefa
        })
    }
)

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`)
})