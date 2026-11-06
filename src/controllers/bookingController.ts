import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { BookingModel } from '../models/bookingModel';
//


export class BookingController {
  static async createBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { space_id, check_in, check_out } = req.body;
      const guest_id = req.user?.id; // Capturado automaticamente pelo JWT

      if (!space_id || !check_in || !check_out || !guest_id) {
        res.status(400).json({ error: 'Dados obrigatórios ausentes.' });
        return;
      }

      // Validação básica de consistência cronológica
      if (new Date(check_in) >= new Date(check_out)) {
        res.status(400).json({ error: 'A data de check-out deve ser maior que a data de check-in.' });
        return;
      }

      // Executa o motor de disponibilidade do edital
      const isAvailable = await BookingModel.checkAvailability(space_id, check_in, check_out);
      
      if (!isAvailable) {
        res.status(409).json({ error: 'Este espaço já está reservado no período selecionado.' });
        return;
      }

      const newBooking = await BookingModel.create({
        space_id,
        guest_id,
        check_in,
        check_out
      });

      res.status(201).json({ message: 'Reserva confirmada com sucesso!', booking: newBooking });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno ao processar a reserva.' });
    }
  }

  static async listMyBookings(req: AuthRequest, res: Response): Promise<void> {
    try {
      const guest_id = req.user?.id;
      if (!guest_id) {
        res.status(401).json({ error: 'Usuário não identificado.' });
        return;
      }

      const bookings = await BookingModel.getByGuest(guest_id);
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar histórico de reservas.' });
    }
  }
}
