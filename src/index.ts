import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import User, { IUser } from './model/userModel';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/user-data-api');

// Routes

// Create User
app.post('/users', async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const user: IUser = new User({ username, email, password });
        await user.save();
        res.status(201).json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Get All Users
app.get('/users', async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Get User by ID
app.get('/users/:id', async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/users/:id', async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { username, email, password }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/users/:id', async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/register', async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        const newUser: IUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const validPassword = true;
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        res.json({ message: 'Login successful', user });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
