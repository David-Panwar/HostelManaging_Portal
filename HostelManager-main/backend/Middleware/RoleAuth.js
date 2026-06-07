
const RoleAuth = (req,res ,next)=>{
    const role = req.user.role
    if(role != "warden"){
        return res.status(403).json("Unauthorised aceess")
    }

    next()
}


export default RoleAuth