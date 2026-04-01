import { Router } from 'express';
import { sendTestEmail, sendBulkEmails } from '../controllers/mailing.controller';

const router = Router();

router.post('/test', sendTestEmail);
router.post('/bulk', sendBulkEmails);

// CRM CRUD
import { getGroups, createGroup, importContacts, getContacts, deleteGroup, updateContactGroups } from '../controllers/mailing.controller';
router.get('/groups', getGroups);
router.post('/groups', createGroup);
router.delete('/groups/:id', deleteGroup);
router.get('/contacts', getContacts);
router.post('/contacts/import', importContacts);
router.put('/contacts/:id/groups', updateContactGroups);

export default router;
