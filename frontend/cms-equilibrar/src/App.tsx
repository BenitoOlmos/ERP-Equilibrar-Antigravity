import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { 
  Resumen, Agenda, Servicios, Programas, Tratamientos, 
  Cursos, Usuarios, Pagos, TestRFAI, DB, Ajustes, Login, ClientDashboard, ClientProgress,
  CRM, Ventas, Productos, Sucursales, Pacientes
} from './pages';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          <Route path="/">
            {/* Protected Area (Employees) */}
            <Route element={<ProtectedRoute allowedRoles={['Super Admin', 'Administrador', 'Coordinador', 'Especialista']}><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/resumen" replace />} />
              <Route path="resumen" element={<Resumen />} />
              <Route path="agenda" element={<Agenda />} />
              <Route path="servicios" element={<Servicios />} />
              <Route path="programas" element={<Programas />} />
              <Route path="tratamientos" element={<Tratamientos />} />
              <Route path="cursos" element={<Cursos />} />
              <Route path="productos" element={<Productos />} />
              <Route path="usuarios" element={<Usuarios />} />
              <Route path="sucursales" element={<Sucursales />} />
              <Route path="pagos" element={<Pagos />} />
              <Route path="test-rfai" element={<TestRFAI />} />
              <Route path="db" element={<DB />} />
              <Route path="ajustes" element={<Ajustes />} />
              <Route path="crm" element={<CRM />} />
              <Route path="ventas" element={<Ventas />} />
              <Route path="pacientes" element={<Pacientes />} />
              <Route path="directorio" element={<Pacientes />} />
            </Route>

            {/* Protected Area (Clients) */}
            <Route element={<ProtectedRoute allowedRoles={['Cliente']}><Layout /></ProtectedRoute>}>
              <Route path="mi-cuenta" element={<ClientDashboard />} />
              <Route path="mi-cuenta/programa/:id" element={<ClientProgress />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
