const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const {Server} = require('socket.io');


const app = express();
app.set('trust proxy', 1);
const server = http.createServer(app);


// test
app.get('/test', (req, res) => {
    res.json('ok');
});

const allowedOrigins = [
    "https://my-mern-blog-sigma.vercel.app",
    "https://www.gzw-blog.me",
    "https://gzw-blog.me",
    "https://www.gzw-blog.me",
];

app.use(cors({credentials:true, origin:allowedOrigins}));
app.use(express.json());
app.use(cookieParser());

const io = new Server(server,{
    cors:{
        origin: allowedOrigins,
        credentials: true,
    }
});



// 访问照片
app.use('/uploads', express.static(__dirname + '/uploads'));

// 数据库
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('MongoDB云端连接成功!');
    })
    .catch((err) => {
        console.error('连接失败，失败原因：', err);
    });
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

// 加密
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

// jwt
const jwt = require('jsonwebtoken');
const secret =  'asdasdasdasdsa';


// 文件系统处理命名
// const fs = require('fs');

// AWS S3
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    }
})

// 中间件 解析包含文字和图片的混合数据
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' })
const uploadMiddleware = multer({
    storage:multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function(req, file, cb){
            cb(null, Date.now().toString() + '-' + file.originalname);
        }
    })
})

app.post('/register', async  (req , res) => {
    const {username, password} = req.body;
    try{
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        })
        res.json(userDoc);
    } catch (err){
        res.status(400).json({error: err.message});
    }

})

app.post('/login',async (req,res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if(passOk){
        // 登录成功
        jwt.sign({username, id:userDoc._id}, secret, {}, (err, token)=>{
            if(err) throw err;
            res.cookie('token', token, {
                sameSite: 'none',
                secure: true,
            }).json({
                id: userDoc._id,
                username,
            });
        })
    }
    else{
        // 登录失败
        res.status(400).json('用户名或密码错误');
    }

})

app.get('/profile', (req,res) => {
    const {token} = req.cookies;

    if(!token){
        return res.json(null);
    }
    jwt.verify(token, secret, {}, (err, info) => {
        if(err) throw err;
        res.json(info);
    })
})

app.post('/logout', (req,res) => {
    res.cookie('token','', {
        sameSite: 'none',
        secure: true,
    }).json('ok');
})

app.post('/post', uploadMiddleware.single('img'), async (req,res) => {
    // const {originalname, path} = req.file;
    // // 图片名+后缀
    // const parts = originalname.split('.');
    // const ext = parts[parts.length - 1];
    // const newPath = path+'.'+ext
    // fs.renameSync(path, newPath);
    const { location } = req.file;
    // 获取当前用户名
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;
        const {title, summary, content} = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            img: location,
            author:info.id,
        })
        res.json(postDoc);
    })

})

app.get('/post', async (req,res) => {
    res.json(
        await Post.find()
        .populate('author', ['username'])
        .sort({ createdAt: -1 })
        .limit(20)
    );
})

app.get('/post/:id', async (req,res) => {
    const {id} = req.params;
    const postDoc =  await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
})

app.put('/post', uploadMiddleware.single('img'), async (req,res) => {
    let newPath = null;
    if(req.file){
        // const {originalname, path} = req.file;
        // // 图片名+后缀
        // const parts = originalname.split('.');
        // const ext = parts[parts.length - 1];
        // newPath = path+'.'+ext
        // fs.renameSync(path, newPath);
        newPath = req.file.location;
    }
    // 获取当前用户名
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;
        const {id, title, summary, content} = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if(!isAuthor){
            res.status(403).json('你不是作者！');
        }
        await postDoc.updateOne({
            title,
            summary,
            content,
            img:newPath ? newPath:postDoc.img,
        })

        res.json('ok');
    })
})

// 历史评论
app.get('/post/:id/comments', async (req,res) => {
    const {id} = req.params;
    try{
        const comments = await Comment.find({post:id})
            .populate('author', ['username'])
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch(err){
        res.status(500).json({err:err.message});
    }
})

// websocket 实时评论
function parseCookieString(cookieString){
    if(!cookieString) return {};
    return cookieString.split(';').reduce((acc, item) => {
        const [key, value] = item.trim().split('=');
        if(key && value){
            acc[key] = val;
        }
        return acc;
    },{});
}

io.on('connection', (socket) => {
    console.log('用户已连接：', socket.id);
    const cookieString = socket.handshake.headers.cookie;
    console.log(`[Socket连接] ID: ${socket.id}|Cookie长度：${cookieString?cookieString.length:0}`);
    const cookies = parseCookieString(cookieString);
    const token = cookies.token;
    if(!token){
        console.log(`❌ 警告: 用户 ${socket.id} 连接了但没有 Token (可能是未登录或Cookie被拦截)`);
    }
    // 1. 用户进入文章详情页时，加入该文章对应的“房间”
    socket.on('join_post', (postId)=>{
        socket.join(postId);
        console.log(`用户加入房间：${postId}`);
    })

    // 2. 监听发送评论
    socket.on('send_comment', async (data)=>{
        const {postId, content} = data;
        if(!token){
            console.log('无Token，未登录');
            return;
        }
        jwt.verify(token, secret, {}, async (err, info) => {
            if(err) {
                console.log('JWT验证失败');
                return;
            };

            // 存入数据库
            const commentDoc = await Comment.create({
                content,
                post:postId,
                author: info.id,
            })

            const fullComment = await commentDoc.populate('author', ['username']);
            // 使用 io 推送到指定 postId 房间
            io.to(postId).emit('receive_comment', fullComment);
        })
    })

    socket.on('disconnect', () => {
        console.log('用户断开连接接');
    });
});

app.put('/post/:id/likes', async (req,res) => {
    const {token} = req.cookies;
    const {id} = req.params;

    if(!token) {
        res.status(401).json('未登录');
        return;
    };
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;

        const postDoc= await Post.findById(id);
        const isLiked = (postDoc.likes||[]).some(id => id.toString() === info.id);
        if(isLiked){
            await Post.findByIdAndUpdate(id, {
                $pull: {likes: info.id},
            })
            res.json('unliked');
        }
        else{
            await Post.findByIdAndUpdate(id, {
                $addToSet: {likes: info.id},
            })
            res.json('liked');
        }
    })

})

// server.listen(4000, () => {
//     console.log('服务器运行在端口：4000');
// })
const port = process.env.PORT || 4000;
server.listen(port, () => {
    console.log(`服务器运行在端口：${port}`);
})
