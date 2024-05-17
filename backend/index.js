import express from "express";
import cors from 'cors';
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

mongoose.connect('mongodb+srv://admin:wwwwww@cluster0.weppimj.mongodb.net/messager?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('DB okey'))
    .catch((err) => console.log('db error', err));

const app = express();

app.use(express.json());
app.use(cors());

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    username: { type: String, required: true, unique: true }
});

const User = mongoose.model('User', UserSchema);

const CommentSchema = new mongoose.Schema({
    userName: String,
    content: String,
});


const Comment = mongoose.model('Comment', CommentSchema);

app.post('/register', async(req, res) => {
    const { email, password, username } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, username });
        await newUser.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        console.log('Error in registration:', error.message);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});



app.post('/login', async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });
        res.send({ token, user });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.post('/comment', async(req, res) => {
    const { userName, content } = req.body;
    try {
        const comment = new Comment({ userName, content });
        await comment.save();
        res.status(201).send({ message: 'Comment added successfully', comment });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});


app.get('/comments', async(req, res) => {
    try {
        const comments = await Comment.find()
        res.status(200).send({ comments });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});
app.get('/comment/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' });
        }
        res.status(200).send(comment);
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.delete('/comment/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findByIdAndDelete(id);
        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' });
        }
        res.status(200).send(comment);
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.patch('/comment/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const { userName, content } = req.body;

        const updatedComment = await Comment.findByIdAndUpdate(
            id, { userName, content }, { new: true }
        );

        if (!updatedComment) {
            return res.status(404).send({ message: 'Comment not found' });
        }

        res.status(200).send({ message: 'Comment updated successfully', updatedComment });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});
app.listen(4444, () => {
    console.log('Сервер запущен');
});