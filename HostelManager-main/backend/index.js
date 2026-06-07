const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const db = require('./db')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const PostSchema = require('./Schemas/Post.model')
const { User } = require('./Schemas/UserSchema')
const { default: auth } = require('./Middleware/Auth')

const cookieParser = require('cookie-parser')
const { Request } = require('./Schemas/request.model')
const { default: RoleAuth } = require('./Middleware/RoleAuth')

const path = require('path')
const app = express()

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

app.use(cookieParser())
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        const isLocal = origin.startsWith('http://localhost') || 
                        origin.startsWith('http://127.0.0.1') || 
                        origin.startsWith('http://192.168.') || 
                        origin.startsWith('http://10.') || 
                        origin.startsWith('http://172.');
                        
        const allowedOrigins = [
            "https://hostelmanager.onrender.com",
            "https://wardenfrontend.onrender.com"
        ];
        
        if (isLocal || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials : true
}))

db()


app.get('/api' ,(req , res)=>{
    res.send("server ready !!")
})

app.get('/home' , auth, async (req,res)=>{ 
     // all posts data from database

    // const now = new Date();
    // const data = await Post.find({ tillTime: { $gt: now } })
    //     .populate("createdBy", "name")
    //     .lean();
    // res.json(data);

    
    const data = await PostSchema.Post.find()
    .populate("createdBy" , "name role photo rollNumber") 
    .lean() 
    // console.log(data)
    res.json(data)
    
     
})
app.post('/login' ,  async (req, res)=>{


    const {gmail,name , expectedRole} = req.body   // de structuring gmail from (body)
    console.log(expectedRole)

    const user = await User.findOne({ gmail , name });
    if(!user){ return res.status(300).json("no user found")}

    
    if(expectedRole && user.role !== expectedRole){
        return res.status(400).json({ msg : `invalid auth ${expectedRole} cannot login here`})
    }
        const token = await jwt.sign( { "userid" : user._id , "role": user.role } , process.env.SECRET_KEY || 'default_secret_key' , {expiresIn : '1h'})
        res.cookie("token" , token , {maxAge: 60 * 60 * 1000, httpOnly:true , sameSite : 'none' , secure : true}).status(200).json({
            msg : "login successfull" ,
            "userId" : user._id,
            "username" : user.name,
            "role" : user.role
        })
    
    
 
        // console.log(user._id);
        
    
    
    // console.log(gmail)


    
})


app.post('/register' , async (req,res)=>{
           const data = req.body 
           console.log(data);
           
    try{
         if(data){
             if (!data.photo) {
                 const documentName = data.role === 'warden' ? "Warden ID Proof" : "Hostel ID Card";
                 return res.status(400).json({ error: `${documentName} is required` });
             }
             if (data.role === 'student' && !data.rollNumber) {
                 return res.status(400).json({ error: "College Roll Number is required for student registration" });
             }
             if (data.role === 'warden') {
                 const secretCode = process.env.WARDEN_CODE || 'Warden2026';
                 if (data.wardenCode !== secretCode) {
                     return res.status(400).json({ error: "Invalid Warden Code" });
                 }
             }
             const response = await User.create(data)
             res.json(response)
         }
    }catch(err){
        console.log(err);
        res.status(500).json({ error: err.message });
    }
   
})

app.post('/post', auth , async (req,res)=>{

    // post data to database
        const user = req.user
        console.log(user)
    try{
        const {content ,tillTime ,conditions, image, roomNumber  }  = req.body
        // if(!req.user.userid) {return res.json({msg:"Please Login First ."})}
        if (req.user && req.user.role === 'student' && !roomNumber) {
            return res.status(400).json({ error: "Room number is required for student complaints" });
        }
        if(content){
           await PostSchema.Post.create(
            {
                content : content  ,
                conditions :conditions ,
                createdBy : req.user.userid,
                tillTime: tillTime ? new Date(tillTime) : undefined,
                image : image,
                roomNumber : roomNumber
            }
           )
            
            res.send("done post")
        }
    }catch(err){
        console.log({"error" : err});
        
    }
     

    
})

app.post('/request' , async (req,res)=>{
    const data = req.body 
 
    try{
        const response = await Request.create(data)
        console.log(response)
        res.status(200).json("request created successfully")
    }catch(err){
        res.json({"err" : err})
    }
})

app.get('/post/:id' , async (req, res)=>{
    const id = req.params.id 
    try{
        const response = await PostSchema.Post.findById(id)
        .populate("createdBy" , "name role photo rollNumber")
        .lean()
        res.json(response)
    }catch(err){
        res.json(err)
    }
})

app.delete('/post/:id', auth, async (req, res) => {
    const id = req.params.id
    const userId = req.user.userid
    const role = req.user.role

    try {
        const post = await PostSchema.Post.findById(id)
        if (!post) {
            return res.status(404).json("Post not found")
        }

        // Allow deletion if user is warden OR if they created the post
        if (role === "warden" || post.createdBy.toString() === userId.toString()) {
            await PostSchema.Post.findByIdAndDelete(id)
            return res.status(200).json("Post deleted successfully")
        } else {
            return res.status(403).json("Unauthorised: You can only delete your own posts")
        }
    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
})


app.get('/logout' , (req , res)=>{
    const token = req.cookies.token     
    console.log(token)
    
    res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "None"
})

res.status(200).json("logged out")

    // res.cookie("token" , "none" ,{maxAge : 50000 , httpOnly:true}).json("cookie deleted success !!").status(200)
})


// app.get('/wardenHome' , auth , RoleAuth , (req,res)=>{
//     res.send("hello this is warden access!!")
// })

app.patch("/warden/updateStatus/post/:id" , auth , RoleAuth,  async (req,res)=>{
    const id = req.params.id 
    const {status, tillTime} = req.body

    try{
    const allowed = ["Seen" , "Done" ,"Pending"]
    if(!allowed.includes(status)){
       return res.status(400).json("invalid status")
    }

    const updateFields = { status }
    if (tillTime) {
        updateFields.tillTime = new Date(tillTime)
    }

    const post = await PostSchema.Post.findByIdAndUpdate(id , updateFields , {new : true} )

    if(!post){
         return res.status(400).json("post not found")
    }

        return res.json({ msg : "status updated successfully" , post})

    }catch(err){
        res.status(500).json({"err": err.message})
}
})



// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend/build")));

// React Router fallback




app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/build", "index.html")
  );
});

// wildcard route
// app.get("/*" , (req, res) => {
//   res.status(400).send("<h3>This page is not found </h3>")
// });

const PORT = process.env.PORT || 8000;
app.listen(PORT ,()=>{
    console.log(`listening at ${PORT}`);
    
})