import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { AuthRequest, authenticate } from '../middlewares/auth.middleware';
const router = Router();

interface SignupBody {
    name: string;
    email: string;
    password: string;
}

interface LoginBody {
    email: string;
    password: string;
}


// POST /api/auth/signup
router.post('/signup', async (req: Request<{}, {}, SignupBody>, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        if (password.length < 6) {
            res.status(400).json({ message: 'Password must be at least 6 characters' });
            return;
        }

        const existing = await User.findOne({ email });
        if (existing) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const hashed = await bcrypt.hash(password, 12);
        const user = await User.create({ name, email, password: hashed });

        res.status(201).json({
            message: 'User registered successfully',
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (err: unknown) {
        console.error('Signup error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Signup failed';
        res.status(500).json({ message: errorMessage });
    }
});

// POST /api/auth/login
router.post('/login', async (req: Request<{}, {}, LoginBody>, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined');
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret, {
            expiresIn: '7d',
        });

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (err: unknown) {
        console.error('Login error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Login failed';
        res.status(500).json({ message: errorMessage });
    }
});
// GET /api/auth/me



export default router;