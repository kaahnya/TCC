const express = require('express');

const multer = require('multer');

const cors = require('cors');

const path = require('path');


const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cors())

var {User} = require('./models')

const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        if(file.fieldname == "pfp"){
            cb(null, 'upload/pfp')
        }
        else if (file.fieldname == "banner"){
            cb(null, 'upload/banner')
        }
        else if (file.fieldname == "doubt"){
            cb(null, 'upload/doubt')
        }
    },
    filename:function(req, file, cb){
        cb(null, Date.now() + "_" + file.originalname)
    },
})


const upload = multer({storage:storage})


app.get('/users', async function(req, res){
    const users = await User.findAll()
    res.json(users)
})

app.get('/user/pfp/:id', async function(req, res){
    const user = await User.findByPk(req.params.id)
    if(!user||!user.pfp){
        return res.status(404).json({message:"imagem não encontrada"})
    }
    const pfp = path.resolve(user.pfp)
    res.sendFile(pfp)
})

app.get('/user/banner/:id', async function(req, res){
    const user = await User.findByPk(req.params.id)
    if(!user||!user.banner){
        return res.status(404).json({message:"imagem não encontrada"})
    }
    const banner = path.resolve(user.banner)
    res.sendFile(banner)
})

app.post('/user', upload.fields([{
    name:'pfp', maxCount:1
},
{
    name:'banner', maxCount:1
}
]), async function (req, res){
    const {name, cpf, email, password, desc} = req.body
    const newUser = await User.create({name, cpf, email, password, desc, pfp:req.files['pfp'][0].path, banner:req.files['banner'][0].path})
    res.json (newUser)
})


app.listen(3000);
