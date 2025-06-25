const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public')));

let alunos = [
  { id: 1, nome: "Sabrina", curso: "Engenharia de Computação", ira: 8.5 },
  { id: 2, nome: "Beatriz", curso: "Engenharia Elétrica", ira: 7.2 },
  { id: 3, nome: "André", curso: "Engenharia Civil", ira: 9.1 }
];

let proximoId = 4; 

app.get('/alunos', (req, res) => {
  res.json(alunos);
});

app.post('/alunos', (req, res) => {
  const { nome, curso, ira } = req.body;
  if (!nome || !curso || typeof ira !== 'number') {
    return res.status(400).json({ erro: 'Dados inválidos.' });
  }

  const novoAluno = { id: proximoId++, nome, curso, ira };
  alunos.push(novoAluno);
  res.status(201).json(novoAluno);
});

app.put('/alunos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, curso, ira } = req.body;

  const alunoIndex = alunos.findIndex(a => a.id === id);
  if (alunoIndex === -1) {
    return res.status(404).json({ erro: 'Aluno não encontrado.' });
  }

  if (nome) alunos[alunoIndex].nome = nome;
  if (curso) alunos[alunoIndex].curso = curso;
  if (typeof ira === 'number') alunos[alunoIndex].ira = ira;

  res.json(alunos[alunoIndex]);
});

app.delete('/alunos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const alunoIndex = alunos.findIndex(a => a.id === id);
  if (alunoIndex === -1) {
    return res.status(404).json({ erro: 'Aluno não encontrado.' });
  }

  const removido = alunos.splice(alunoIndex, 1);
  res.json({ mensagem: 'Aluno removido com sucesso.', aluno: removido[0] });
});

app.listen(PORT, () => {
  console.log(`API de alunos escutando em http://localhost:${PORT}`);
});
