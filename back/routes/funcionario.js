import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator"; // Corrigido aqui
import express from "express";

const prisma = new PrismaClient();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Login Funcionários
router.post(
  "/loginfuncionario",
  [
    body("email").isEmail().withMessage("Email inválido"),
    body("password").notEmpty().withMessage("Senha é obrigatória"),
  ],
  async (req, res) => {
    // Verifica erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      // Busca no banco de dados pelo email
      const funcionario = await prisma.funcionario.findUnique({
        where: { email },
      });

      // Verifica se o e-mail do funcionário  existe
      if (!funcionario) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      // Comparação da senha
      const isMatch = await bcrypt.compare(password, funcionario.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Senha inválida" });
      }

      // Geração do token JWT
      const token = jwt.sign({ id: funcionario.id }, JWT_SECRET, {
        expiresIn: "20d",
      });

      res.status(200).json({ token });
    } catch (err) {
      console.error(err); // Log do erro
      res.status(500).json({ message: "Erro no servidor, tente novamente" });
    }
  }
);

//Cadastro
router.post("/cadastrofuncionario", async (req, res) => {
  try {
    const funcionario = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(funcionario.password, salt);

    const funcionarioDB = await prisma.funcionario.create({
      data: {
        email: funcionario.email,
        name: funcionario.name,
        phone: funcionario.phone,
        dataNasc: funcionario.dataNasc,
        dataContra: funcionario.dataContra,
        password: hashPassword,
      },
    });
    res.status(201).json(funcionarioDB);
  } catch (err) {
    res
      .status(500)
      .json({ messege: `Erro no servidaor, Tente novamente ${err}` });
    console.log(err);
  }
});


router.get("/listafuncionario", async (req, res) => {
  try {
    const funcionarios = await prisma.funcionario.findMany();

    res.status(200).json({ message: "Usuário listado com sucesso", funcionarios });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "falha no servidor" });
  }
});


router.get("/listaaluno", async (req, res) => {
  try {
    const aluno = await prisma.aluno.findMany();

    res.status(200).json({ message: "Usuário listado com sucesso", aluno });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "falha no servidor" });
  }
});


router.post("/cadastrofuncionario", async (req, res) => {
  try {
    const funcionario = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(funcionario.password, salt);

    const funcionarioDB = await prisma.funcionario.create({
      data: {
        email: funcionario.email,
        name: funcionario.name,
        phone: funcionario.phone,
        peso: funcionario.peso,
        dataNasc: funcionario.dataNasc,
        password: hashPassword,
      },
    });
    res.status(201).json(funcionarioDB);
  } catch (err) {
    res
      .status(500)
      .json({ messege: `Erro no servidaor, Tente novamente ${err}` });
  }
});



// Rota para editar usuário
router.put("/editarusuarios/:email", async (req, res) => {
  try {
    await prisma.funcionario.update({
      where: {
        email: req.params.email,
      },
      data: {
        name: req.body.name, // Atualiza o nome
        email: req.body.email, // Atualiza o nome
        password: req.body.hashPassword, // Atualiza a senha (hash)
      },
    });
    res.status(201).json(req.body);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Falha na Edição" });
  }
});

//deletar
router.delete("/funcionariodell/:email", async (req, res) => {
  try {
    await prisma.funcionario.delete({
      where: {
        email: req.params.email,
      },
    });
    res.status(201).json({ message: "Usuário deletado com Sucesso!!!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "falha ao Deletar" });
    err;
  }
});


router.delete("/alunodell/:email", async (req, res) => {
  try {
    await prisma.aluno.delete({
      where: {
        email: req.params.email,
      },
    });
    res.status(201).json({ message: "Usuário deletado com Sucesso!!!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "falha ao Deletar" });
    err;
  }
});

//pesquisar com o body
router.post("/pesquisaraluno/:email", async (req, res) => {
  try {
    const aluno = await prisma.aluno.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (aluno) {
      res
        .status(201)
        .json({ aluno, message: "Usuário encontrado com Sucesso!!!" });
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Falha ao pesquisar" });
  }
});



router.post("/pesquisar/:email", async (req, res) => {
  try {
    const funcionario = await prisma.funcionario.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (funcionario) {
      res
        .status(201)
        .json({ funcionario, message: "Usuário encontrado com Sucesso!!!" });
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Falha ao pesquisar" });
  }
});

export default router;
