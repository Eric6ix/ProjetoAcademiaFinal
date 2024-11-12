import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/cadastroProduto", async (req, res) => {
  try {
    const { name, preco, descricao } = req.body;

    // Verificar se todos os campos obrigatórios estão presentes
    if (!name || !preco || !descricao) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }



    // Verificar se o nome já está em uso
    const existingProduct = await prisma.produto.findUnique({ where: { name } });
    if (existingProduct) {
      return res.status(400).json({ message: "Este nome já está em uso." });
    }

    // Criar um novo produto no banco de dados usando Prisma
    const produto = await prisma.produto.create({
      data: {
        name,
        preco,
        descricao,
      },
    });

    res.status(201).json({ message: "Produto cadastrado com sucesso! ", produto });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor. Tente novamente mais tarde." });
  }
});

router.get("/listar-produto", async (req, res) => {
  try {
    const produto = await prisma.produto.findMany();

    res.status(200).json({ message: produto });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "falha no servidor" });
  }
});


// Rota para editar usuário
router.put("/editarusproduto/:name", async (req, res) => {
  try {
    // Aqui você obteria o email do usuário autenticado
    const userName = req.params.name; // Supondo que req.User tenha o email do usuário logado (exemplo com JWT)

    // Atualiza o usuário com o email fornecido
    const updatedProduto = await prisma.produto.update({
      where: {
        name: req.params.name, // Email do usuário a ser atualizado
      },
      data: {
        name: req.body.name,
        preco: req.body.preco,
        descricao: req.body.descricao
      },
    });

    // Retorna o usuário atualizado
    res.status(200).json(updatedProduto);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Falha na Edição" });
  }
});


router.delete("/produtodell/:name", async (req, res) => {
  try {
    await prisma.produto.delete({
      where: {
        name: req.params.name,
      },
    });
    res.status(201).json({ message: "Usuário deletado com Sucesso!!!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "falha ao Deletar" });
    err;
  }
});
export default router;
