import { Router } from 'express';
import { BookingController } from '../controllers/bookingController';
import { authMiddleware } from '../middlewares/AuthMiddleware';



const router = Router();

// Ambas as rotas exigem obrigatoriamente que o usuário esteja logado
router.post('/reservas', authMiddleware as any, BookingController.createBooking);
router.get('/reservas/historico', authMiddleware as any, BookingController.listMyBookings);

export default router;
