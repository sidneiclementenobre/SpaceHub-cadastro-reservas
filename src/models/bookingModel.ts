import { pool } from '../config/database';

export interface Booking {
  id?: number;
  space_id: number;
  guest_id: number;
  check_in: string;
  check_out: string;
}

export class BookingModel {
  static async checkAvailability(spaceId: number, checkIn: string, checkOut: string): Promise<boolean> {
    // Algoritmo matemático de conflito de datas: (Entrada1 < Saída2) E (Saída1 > Entrada2)
    const query = `
      SELECT COUNT(*) FROM bookings
      WHERE space_id = $1
        AND check_in < $3
        AND check_out > $2;
    `;
    const { rows } = await pool.query(query, [spaceId, checkIn, checkOut]);
    const count = parseInt(rows[0].count, 10);
    
    // Retorna TRUE se estiver livre (contagem igual a zero)
    return count === 0;
  }

  static async create(booking: Booking): Promise<Booking> {
    const query = `
      INSERT INTO bookings (space_id, guest_id, check_in, check_out)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [booking.space_id, booking.guest_id, booking.check_in, booking.check_out];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getByGuest(guestId: number): Promise<any[]> {
    const query = `
      SELECT b.id, b.check_in, b.check_out, s.title, s.price_per_night 
      FROM bookings b
      JOIN spaces s ON b.space_id = s.id
      WHERE b.guest_id = $1;
    `;
    const { rows } = await pool.query(query, [guestId]);
    return rows;
  }
}
