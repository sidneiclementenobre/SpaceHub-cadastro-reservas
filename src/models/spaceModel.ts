import { pool } from '../config/database';

export interface Space {
  id?: number;
  title: string;
  description: string;
  price_per_night: number;
  image_url: string;
  host_id: number;
}

export class SpaceModel {
  static async create(space: Space): Promise<Space> {
    const query = `
      INSERT INTO spaces (title, description, price_per_night, image_url, host_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const values = [space.title, space.description, space.price_per_night, space.image_url, space.host_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getAll(): Promise<Space[]> {
    const { rows } = await pool.query('SELECT id, title, description, price_per_night, image_url, host_id FROM spaces;');
    return rows;
  }
}
