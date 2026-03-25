import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users.ts';
import appointmentsRouter from './routes/appointments.ts';
import evaluationsRouter from './routes/evaluations.ts';
import servicesRouter from './routes/services.ts';
import assetsRouter from './routes/assets.ts';
import authRouter from './routes/auth.ts';
import audioLogsRouter from './routes/audioLogs.ts';
import activityRouter from './routes/activity.ts';
import messagesRouter from './routes/messages.ts';
import bitacoraRouter from './routes/bitacora.ts';
import adminRouter from './routes/admin.ts';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Main API routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/evaluations', evaluationsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/assets', assetsRouter);
app.use('/api/audiologs', audioLogsRouter);
app.use('/api/activity', activityRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/bitacora', bitacoraRouter);
app.use('/api/admin', adminRouter);

// Healthcheck
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
