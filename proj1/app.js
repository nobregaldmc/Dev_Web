const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.json()); // 👈 Permite interpretar JSON no corpo da requisição

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Lista de alunos com ID fixo inicial
let alunos = [
    { id: 1, nome: "Lucas", curso: "Engenharia de Computação", ira: 8.5 },
    { id: 2, nome: "Maria", curso: "Engenharia Elétrica", ira: 7.2 },
    { id: 3, nome: "João", curso: "Engenharia Civil", ira: 9.1 }
];

// Controlador do próximo ID
let proximoId = 4;

// GET - listar todos os alunos
app.get('/alunos', (req, res) => {
    res.json(alunos);
});

// GET - buscar aluno por ID
app.get('/alunos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const aluno = alunos.find(a => a.id === id);
    if (!aluno) {
        return res.status(404).json({ erro: "Aluno não encontrado" });
    }
    res.json(aluno);
});

// POST - adicionar novo aluno
app.post('/alunos', (req, res) => {
    const { nome, curso, ira } = req.body;

    if (!nome || !curso || typeof ira !== 'number') {
        return res.status(400).json({ erro: 'Dados inválidos. Envie nome, curso e ira numérico.' });
    }

    const novoAluno = {
        id: proximoId++,
        nome,
        curso,
        ira
    };

    alunos.push(novoAluno);
    res.status(201).json({ mensagem: 'Aluno adicionado com sucesso!', aluno: novoAluno });
});

// PUT - atualizar aluno
app.put('/alunos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = alunos.findIndex(a => a.id === id);
    if (index === -1) {
        return res.status(404).json({ erro: "Aluno não encontrado" });
    }

    const { nome, curso, ira } = req.body;
    alunos[index] = { id, nome, curso, ira };
    res.json({ mensagem: "Aluno atualizado", aluno: alunos[index] });
});

// DELETE - remover aluno
app.delete('/alunos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    alunos = alunos.filter(a => a.id !== id);
    res.json({ mensagem: "Aluno removido" });
});

// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
