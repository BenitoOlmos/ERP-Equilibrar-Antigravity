import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import DDD Core Domains
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/users.routes';
import serviceRoutes from './routes/services.routes';
import appointmentRoutes from './routes/appointments.routes';
import financeRoutes from './routes/finance.routes';
import programRoutes from './routes/programs.routes';
import treatmentRoutes from './routes/treatments.routes';
import courseRoutes from './routes/courses.routes';
import dbRoutes from './routes/db.routes';
import adminRoutes from './routes/admin.routes';
import productRoutes from './routes/products.routes';
import crmRoutes from './routes/crm.routes';
import mailingRoutes from './routes/mailing.routes';
import studentRoutes from './routes/student.routes';
import statsRoutes from './routes/stats.routes';
import branchesRoutes from './routes/branches.routes';
import clinicalRoutes from './routes/clinical.routes';
import messagesRoutes from './routes/messages.routes';
import notificationsRoutes from './routes/notifications.routes';
import hrRoutes from './routes/hr.routes';
import virtualAgentRoutes from './routes/virtualAgent.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const apiRouter = express.Router();

// 1. Auth & CRM
apiRouter.use('/auth', authRoutes);
apiRouter.use('/crm', crmRoutes);
apiRouter.use('/mailing', mailingRoutes);

// 2. Student Platform Endpoints (Courses UI)
apiRouter.use('/', studentRoutes);
apiRouter.use('/notifications', notificationsRoutes);

// 3. Admin / Unified Dashboard (Master endpoints)
const masterRouter = express.Router();
masterRouter.use('/rfai-programs', programRoutes);
masterRouter.use('/treatments', treatmentRoutes);
masterRouter.use('/courses', courseRoutes);
masterRouter.use('/branches', branchesRoutes);
masterRouter.use('/virtual-agents', virtualAgentRoutes);
masterRouter.use('/', adminRoutes); // Captures /resumen
apiRouter.use('/master', masterRouter);

// 4. Agenda Foundation (Legacy endpoint preservation)
const dataRouter = express.Router();
dataRouter.use('/users', userRoutes);
dataRouter.use('/services', serviceRoutes);
dataRouter.use('/appointments', appointmentRoutes);
dataRouter.use('/payments', financeRoutes);
dataRouter.use('/products', productRoutes);
dataRouter.use('/programs', treatmentRoutes); // Same logical controller as treatments!
dataRouter.use('/backup', dbRoutes);
dataRouter.use('/stats', statsRoutes);
dataRouter.use('/clinical', clinicalRoutes);
dataRouter.use('/messages', messagesRoutes);
apiRouter.use('/data', dataRouter);
apiRouter.use('/hr', hrRoutes);

// Mount master API router
app.use('/api', apiRouter);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Unified DDD API is running flawlessly' });
});

app.listen(PORT, () => {
    console.log(`Unified DDD backend server running on http://localhost:${PORT}`);
});
