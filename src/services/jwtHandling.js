const jwt = require("jsonwebtoken");
const {StatusCodes} = require("http-status-codes");




class JwtHandling {

    async jwtSign ( email, id , userType , expiresIn= "3d"){
        try {
            const result = await jwt.sign({email,userType , id  } ,process.env.JWT_SECRET , {expiresIn})
            return {success:true , data:result}
        }catch (e){
            console.log(e)
            return {success:false ,data:null}
        }

    }

        jwtVerify = (user) => async  (req,res,next) => {
        const authHeader = req.headers.authorization;
        if(!authHeader) {
            return res.status(StatusCodes.BAD_REQUEST).json("undefined Bearer Authorization Header")
        }
        const token = authHeader.split(' ')[1];

        if(token) {
            try {
                const {email,id,userType} = await jwt.verify(token , process.env.JWT_SECRET) ;

                if(!(user.find((e)=>userType===e))) {
                    return res.status(StatusCodes.UNAUTHORIZED).json('unauthorized action')
                }
                req.infos= {"authEmail":email,"authId":id , "authRole":userType} ;
                return next();
            }catch (err) {
                 return res.status(StatusCodes.UNAUTHORIZED).send('invalid token')
            }
        }
             return res.status(StatusCodes.BAD_REQUEST).send("undefined Bearer Authorization Header");

    }
}


module.exports = new JwtHandling() ;