const express = require('express');
//para criação de rotas dinamicas
const multer = require('multer');
//para lidar com as imagens
const cors = require('cors');
//para permitir a conexão entre o back e o front
const path = require('path');
//para lidar com o caminho das imagens

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
//configurando multer, destino das imagens e o nome delas

const upload = multer({storage:storage})
//aplicando a minha configuração ao multer e guardando em uma variavel para não precisar repetir

app.get('/users', async function(req, res){
    const users = await User.findAll()
    res.json(users)
})
//rota para obter os usuarios

app.get('/user/pfp/:id', async function(req, res){
    const user = await User.findByPk(req.params.id)
    if(!user||!user.pfp){
        return res.status(404).json({message:"imagem não encontrada"})
    }
    const pfp = path.resolve(user.pfp)
    res.sendFile(pfp)
})
//rota para obter a foto de perfil do usuario(pfp)

app.get('/user/banner/:id', async function(req, res){
    const user = await User.findByPk(req.params.id)
    if(!user||!user.banner){
        return res.status(404).json({message:"imagem não encontrada"})
    }
    const banner = path.resolve(user.banner)
    res.sendFile(banner)
})
// rota para obter a foto de banner do usuario(banner)

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
//rota para adicionar um usuario


app.listen(3000);