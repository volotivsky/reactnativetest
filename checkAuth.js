import jwt from 'jsonwebtoken'
export default (req, res, next)=>{
    try{
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
        const decoded = jwt.verify(token, 'secret')
        
        req.userId=decoded.userId
        next()
    }  catch(err){
        res.json(err)
    }
}