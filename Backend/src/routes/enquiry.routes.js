import { Router } from 'express';
import { sendEnquiry } from '../controllers/enquiry.controller.js';

const router = Router();

router.route('/').post(sendEnquiry);

export default router;
