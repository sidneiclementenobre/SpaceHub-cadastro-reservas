import { Router } from 'express';
import { SpaceController } from '../controllers/spaceController';

const router = Router();

router.post('/imoveis', SpaceController.createSpace);
router.get('/imoveis', SpaceController.listSpaces);

export default router;
