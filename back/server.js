import express from 'express'
import publicRoutes from './routes/public.js'
import privado from './routes/private.js'
import usuarioCompra from './routes/usuarioCompra.js'
import cors from 'cors'

import auth from './middlewares/auth.js'

const app = express()
app.use(express.json())
app.use(cors())

app.use('/', publicRoutes)
app.use('/' ,auth,  privado)
app.use('/' ,  usuarioCompra)


app.listen(3000, () => console.log(`
☆ ┌─┐  　─┐☆
　│▒│  /▒/
　│▒│ /▒/
　│▒/▒/─┬─┐
　│▒│▒|▒│▒│
┌┴─┴─┐-┘─┘
│▒┌──┘▒▒▒│
└┐▒▒▒▒▒▒┌┘
　└┐▒▒▒▒┌⠀⠀⠀
    `));