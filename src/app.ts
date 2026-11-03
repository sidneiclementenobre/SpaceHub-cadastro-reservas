import express from 'express';
import path from 'path';
import spaceRoutes from './routes/spaceroutes';
import authRoutes from './routes/authRoutes';
import bookingRoutes from './routes/bookingRoutes';

const app = express();

app.use(express.json());

// Marco 4: Serve a interface HTML (Frontend) automaticamente para o navegador
app.use(express.static(path.join(__dirname, '../public')));

// Registro de todas as rotas da API RESTful exigidas pelo projeto
app.use('/api', spaceRoutes);
app.use('/api', authRoutes);
app.use('/api', bookingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 SpaceHub Server rodando perfeitamente na porta ${PORT}`);
});
