import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_secret

const auth = (req, res, next) => {
    
    const token = req.headers.authorization

    if(!token){
        return res.status(401).json({message: 'Acesso Negado'})
    }

    try {

        const decoded = jwt.verify(token.replace('Bearer ',''), JWT_SECRET)
        req.userId = decoded.id
        
        console.log(decoded)

        req.userId = decoded.id

    } catch(err){
        
        return res.status(401).json({message: 'token inválido'})
    }
    next()
    
}

export default auth