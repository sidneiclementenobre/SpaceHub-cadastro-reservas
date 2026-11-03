import { Request, Response } from 'express';
import { SpaceModel } from '../models/spaceModel';

export class SpaceController {
  static async createSpace(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, price_per_night, image_url, host_id } = req.body;

      // Validação simples exigida pelo enunciado para evitar dados corrompidos
      if (!title || !description || !price_per_night || !host_id) {
        res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
        return;
      }

      const newSpace = await SpaceModel.create({
        title,
        description,
        price_per_night,
        image_url: image_url || '',
        host_id
      });

      res.status(201).json(newSpace);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno no servidor ao criar o espaço.' });
    }
  }

  static async listSpaces(req: Request, res: Response): Promise<void> {
    try {
      const spaces = await SpaceModel.getAll();
      res.status(200).json(spaces);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno no servidor ao listar os espaços.' });
    }
  }
}
