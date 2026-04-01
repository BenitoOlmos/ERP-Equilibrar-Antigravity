import { Router } from 'express';
import { sendTestEmail, sendBulkEmails } from '../controllers/mailing.controller';

const router = Router();

router.post('/test', sendTestEmail);
router.post('/bulk', sendBulkEmails);

export default router;
