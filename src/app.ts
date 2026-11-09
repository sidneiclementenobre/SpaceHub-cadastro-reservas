import express from 'express';
import cors from 'cors';
import path from 'path';
import spaceRoutes from './routes/spaceRoutes';
import authRoutes from './routes/authRoutes';
import bookingRoutes from './routes/bookingRoutes';

const app = express();

// Configurações de Segurança e Interpretação de dados
app.use(cors());
app.use(express.json());

// Resolução infalível do caminho absoluto da pasta pública contendo seus HTMLs (Válido para Local e Nuvem)
const publicPath = path.resolve(__dirname, '..', 'public');
app.use(express.static(publicPath));

// Registro de todas as rotas da API RESTful com o prefixo correto exigido pelo projeto
app.use('/api', spaceRoutes);
app.use('/api', authRoutes);
app.use('/api', bookingRoutes);

// Rota de Fallback: Se o usuário digitar caminhos aleatórios, o Express entrega o index.html por padrão
app.get('/', (req, res, next) => {
  // Ignora se for uma rota interna da API para não quebrar as requisições
  if (req.url.startsWith('/api')) return next();
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Configuração dinâmica da porta exigida para ambientes de nuvem (Railway / Render)
const PORT = process.env.PORT || 3000;
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 SpaceHub Server rodando perfeitamente na porta ${PORT}`);
});
