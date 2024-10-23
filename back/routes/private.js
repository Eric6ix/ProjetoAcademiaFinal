import express from "express";
import { PrismaClient } from "@prisma/client";


const router = express.Router()
const prisma = new PrismaClient()

router.get('/listar-usuarios', async (req, res) => {
    try{
        const users = await prisma.user.findMany()

        res.status(200).json({message: 'Usuário listado com sucesso', users})
    }catch(err){
        console.log(err)
        res.status(500).json({message: 'falha no servidor'})
    }
})


// Rota para editar usuário
router.put("/usuarios/:id", async (req, res) => {
  try {
    await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.hashPassword,
      },
    });
    res.status(201).json(req.body);
    console.log("🚀 ~ router.put ~ ok:")

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "falha na Edição" });
  }
});

//deletar
router.delete("/usuarios/:email", async (req, res) => {
  try {
    await prisma.user.delete({
      where: {
        email: req.params.email
      },
    });
    res.status(201).json({ message: "Usuário deletado com Sucesso!!!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "falha ao Deletar" });
  }
});
export default router;
