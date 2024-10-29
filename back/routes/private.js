import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/listar-usuarios", async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json({ message: "Usuário listado com sucesso", users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "falha no servidor" });
  }
});

// Rota para editar usuário
router.put("/editarusuarios/:email", async (req, res) => {
  try {
    await prisma.user.update({
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

//////////////////////////////////////////////////////////////////deletar
router.delete("/usuarios/:email", async (req, res) => {
  try {
    await prisma.user.delete({
      where: {
        email: req.params.email,
      },
    });
    res.status(201).json({ message: "Usuário deletado com Sucesso!!!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "falha ao Deletar" });
  }
});



//pesquisar com o body
router.post("/pesquisar/:email", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (user) {
      res.status(201).json({ user, message: "Usuário encontrado com Sucesso!!!" });
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Falha ao pesquisar" });
  }
});


export default router;

/*
if (!userEmail || !/\S+@\S+\.\S+/.test(userEmail)) { // Validação de email
  alert("E-mail inválido");
  return; // Sai se o email for inválido
}*/