import { pool } from '../config/database';

export interface Space {
  id?: number;
  title: string;
  description: string;
  price_per_night: number;
  image_url: string;
}

export class SpaceModel {
  static async create(space: Space): Promise<Space> {
    // Corrigido: Agora são 4 colunas para 4 valores ($1, $2, $3, $4)
    const query = `
      INSERT INTO spaces (title, description, price_per_night, image_url)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [space.title, space.description, space.price_per_night, space.image_url];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getAll(): Promise<Space[]> {
    const { rows } = await pool.query('SELECT id, title, description, price_per_night, image_url FROM spaces;');
    return rows;
  }
}
