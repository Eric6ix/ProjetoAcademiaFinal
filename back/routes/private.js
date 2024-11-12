import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.get("/listar-usuarios", async (req, res) => {
  try {
    const usuarios = await prisma.user.findMany();

    res.status(200).json({ message: usuarios });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "falha no servidor" });
  }
});

router.post("/cadastrofuncionario", async (req, res) => {
  try {
    const User = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(User.password, salt);
    await prisma.user.create({
      data: {
        role: (User.role = "FUNCIONARIO"),
        name: User.name,
        email: User.email,
        phone: User.phone,
        peso: User.peso,
        dataContra: User.dataContra,
        dataNasc: User.dataNasc,
        password: hashPassword,
      },
    });
    res.status(201).json({ messege: `Sucesso! ${User.email} Cadastrado` });
  } catch (err) {
    res
      .status(500)
      .json({ messege: `Erro no servidaor, Tente novamente ${err}` });
  }
});

router.post("/cadastroFuncionario", async (req, res) => {
  try {
    const { name, email, phone, peso, dataNasc, password } = req.body;

    // Verificar se todos os campos obrigatórios estão presentes
    if (!name || !email || !phone || !peso || !dataNasc || !password) {
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios." });
    }

    // Validar o formato do email
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Email inválido." });
    }

    // Verificar se o email já está em uso
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Este email já está em uso." });
    }

    // Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Criar o novo usuário no banco de dados
    const user = await prisma.user.create({
      data: {
        role: "FUNCIONARIO", // Definir o role como "ALUNO"
        name,
        email,
        phone,
        peso: parseFloat(peso), // Certificar-se de que o peso é um número
        dataNasc: new Date(dataNasc), // Converter a data de nascimento para o formato Date
        password: hashPassword,
      },
    });

    res.status(201).json({ message: "Usuário cadastrado com sucesso!", user });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: `Erro no servidor. Tente novamente mais tarde.` });
  }
});

// Rota para editar usuário
router.put("/editarusfuncionario/:email", async (req, res) => {
  try {
    // Aqui você obteria o email do usuário autenticado
    const userEmail = req.params.email; // Supondo que req.User tenha o email do usuário logado (exemplo com JWT)

    // Verifica o usuário logado na base de dados para garantir que ele tenha a role 'funcionario'
    const loggedUser = await prisma.User.findUnique({
      where: { email: userEmail },
    });

    // Se o usuário logado não for um 'funcionario', retorna um erro
    if (loggedUser.role !== "FUNCIONARIO") {
      return res
        .status(403)
        .json({ message: "Você não tem permissão para editar este usuário" });
    }

    // Atualiza o usuário com o email fornecido
    const updatedUser = await prisma.User.update({
      where: {
        email: req.params.email, // Email do usuário a ser atualizado
      },
      data: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        peso: req.body.peso,
        dataContra: req.body.dataContra,
        dataNasc: req.body.dataNasc,
        password: req.body.hashPassword, // Atualiza a senha (hash)
      },
    });

    // Retorna o usuário atualizado
    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Falha na Edição" });
  }
});

// Rota para editar usuário
router.put("/editarusuario/:email", async (req, res) => {
  try {
    // Aqui você obteria o email do usuário autenticado
    const userEmail = req.params.email; // Supondo que req.user tenha o email do usuário logado (exemplo com JWT)

    // Verifica o usuário logado na base de dados para garantir que ele tenha uma das roles 'ALUNO', 'FUNCIONARIO' ou 'ADMIN'
    const loggedUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (loggedUser.role == "ADMIN, FUNCIONARIO") {
      return res
        .status(403)
        .json({ message: "Você não tem permissão para editar este usuário" });
    }

    // Atualiza o usuário com o email fornecido
    const updatedUser = await prisma.user.update({
      where: {
        email: req.params.email, // Email do usuário a ser atualizado
      },
      data: {
        role: req.body.role,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        peso: req.body.peso,
        dataContra: req.body.dataContra,
        dataNasc: req.body.dataNasc,
        password: req.body.hashPassword, // Atualiza a senha (hash)
      },
    });

    // Retorna o usuário atualizado
    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Falha na Edição" });
  }
});



router.delete("/usuariosdell/:email", async (req, res) => {
  try {
    await prisma.User.delete({
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

//pesquisar no params

router.post("/pesquisar/:email", async (req, res) => {
  try {
    const User = await prisma.User.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (User) {
      res
        .status(201)
        .json({ User, message: "Usuário encontrado com Sucesso!!!" });
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Falha ao pesquisar" });
  }
});

export default router;
