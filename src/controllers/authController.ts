import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password || !role) {
        res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const query = `
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4) RETURNING id, name, email, role;
      `;
      const { rows } = await pool.query(query, [name, email, hashedPassword, role]);

      res.status(201).json(rows[0]);
    } catch (error: any) {
      if (error.code === '23505') {
        res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
        return;
      }
      res.status(500).json({ error: 'Erro interno ao registrar usuário.' });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const { rows } = await pool.query('SELECT * FROM users WHERE email = $1;', [email]);
      const user = rows[0];

      if (!user) {
        res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        return;
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        return;
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(200).json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno ao fazer login.' });
    }
  }
}
