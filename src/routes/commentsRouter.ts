import { Router } from 'express';
import { getComments, postComment} from '../controllers/commentsController.js';
import { authenticate } from '../middleware/auth.js';

const commentsRouter = Router({mergeParams: true});

commentsRouter.get('/', getComments);
commentsRouter.post('/', authenticate, postComment);

export default commentsRouter;