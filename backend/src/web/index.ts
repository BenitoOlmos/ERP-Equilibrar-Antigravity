import express from 'express';
import cors from 'cors';
import path from 'path';
import programRoutes from './routes/programRoutes';
import serviceRoutes from './routes/serviceRoutes';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/programs', programRoutes);
app.use('/api/services', serviceRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'C.O.R.E. Nervous System Online' });
});

// 2. Servir Archivos Estáticos (Frontend)
// El build de Vite se genera en la carpeta 'dist' en la raíz del proyecto.
// Desde 'server/dist' (producción) o 'server/src' (dev), subimos 2 niveles para llegar a la raíz.
const frontendPath = path.join(__dirname, '../../dist');
app.use(express.static(frontendPath));

// 3. SPA Fallback (Cualquier ruta no-API devuelve index.html)
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`⚡️[server]: C.O.R.E. Backend running at http://localhost:${PORT}`);
});
