import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar,
  Briefcase, 
  Dumbbell, 
  Activity, 
  GraduationCap, 
  Users, 
  Wallet, 
  Server,
  Settings,
  LogOut,
  ChevronDown,
  PieChart,
  ClipboardList,
  Tags,
  Target,
  ShoppingCart,
  CreditCard,
  Package,
  Archive,
  Heart,
  MessageCircle,
  BookOpen,
  MapPin,
  FileText,
  Contact,
  FolderOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navGroups = [
  {
    title: 'Panel de Control',
    icon: PieChart,
    isStandalone: true,
    items: [
      { path: '/', label: 'Resumen', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Gestión',
    icon: ClipboardList,
    items: [
      { path: '/agenda', label: 'Agenda', icon: Calendar },
      { path: '/directorio', label: 'Directorio de Pacientes', icon: Contact },
      { path: '/fichas-clinicas', label: 'Fichas Clínicas', icon: FolderOpen },
      { path: '/crm', label: 'CRM', icon: Target },
    ]
  },
  {
    title: 'Seguimiento',
    icon: Heart,
    items: [
      { path: '/pacientes', label: 'Pacientes Activos', icon: Users },
      { path: '/bitacoras', label: 'Revisión de Bitácoras', icon: BookOpen },
      { path: '/chat', label: 'Chat', icon: MessageCircle },
    ]
  },
  {
    title: 'Servicios',
    icon: Tags,
    items: [
      { path: '/servicios', label: 'Consultas', icon: Briefcase },
      { path: '/programas', label: 'Programas', icon: Dumbbell },
      { path: '/tratamientos', label: 'Tratamientos', icon: Activity },
      { path: '/cursos', label: 'Cursos', icon: GraduationCap },
    ]
  },
  {
    title: 'Productos',
    icon: Package,
    items: [
      { path: '/productos', label: 'Inventario', icon: Package },
      { path: '/bodega', label: 'Bodega', icon: Archive },
    ]
  },
  {
    title: 'Ventas y Finanzas',
    icon: Wallet,
    items: [
      { path: '/ventas', label: 'Ventas', icon: ShoppingCart },
      { path: '/cotizaciones', label: 'Cotizaciones', icon: ClipboardList },
      { path: '/pagos', label: 'Pagos', icon: CreditCard },
      { path: '/cuentas-cobrar', label: 'Cuentas por Cobrar', icon: Wallet },
      { path: '/facturacion', label: 'Facturación / Boletas', icon: FileText },
    ]
  },
  {
    title: 'Web Equilibrar',
    icon: Activity,
    items: [
      { path: '/test-rfai', label: 'Test RFAI', icon: Activity },
      { path: '/web-editor', label: 'Editor de Sitio Web', icon: LayoutDashboard },
      { path: '/web-noticias', label: 'Noticias Web', icon: Activity },
      { path: '/web-servicios', label: 'Servicios Web', icon: Tags },
    ]
  },
  {
    title: 'Administración',
    icon: Users,
    items: [
      { path: '/usuarios', label: 'Usuarios', icon: Users },
      { path: '/sucursales', label: 'Sucursales', icon: MapPin },
    ]
  },
  {
    title: 'Ajustes',
    icon: Settings,
    items: [
      { path: '/ajustes', label: 'Ajustes Generales', icon: Settings },
      { path: '/db', label: 'Respaldos DB', icon: Server },
    ]
  }
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'Panel de Control': true,
    'Gestión': true,
    'Seguimiento': true,
    'Servicios': true,
    'Ventas y Finanzas': true,
    'Web Equilibrar': true,
    'Administración': true,
    'Productos': true,
    'Ajustes': true,
  });

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Filter groups and items by role
  const renderedGroups = navGroups.map(group => {
    const filteredItems = group.items.filter(item => {
      if (!user || user.role === 'Super Admin') return true;
      if (user.role === 'Administrador') return !['/ajustes', '/db'].includes(item.path || '');
      if (user.role === 'Coordinador') return [
        '/',
        '/agenda', '/directorio', '/fichas-clinicas', '/crm', 
        '/servicios', '/programas', '/tratamientos', '/cursos', 
        '/productos', '/bodega',
        '/ventas', '/cotizaciones', '/pagos', '/cuentas-cobrar', '/facturacion', 
        '/usuarios', '/sucursales', 
        '/test-rfai', '/editor-web', '/noticias-web', '/servicios-web'
      ].includes(item.path || '');
      if (user.role === 'Especialista') return ['/agenda', '/directorio', '/fichas-clinicas', '/pacientes', '/bitacoras', '/chat', '/test-rfai'].includes(item.path || '');
      if (user.role === 'Cliente') return ['/mi-cuenta'].includes(item.path || '');
      return false;
    });
    return { ...group, items: filteredItems };
  }).filter(group => group.items.length > 0);

  const handleLogout = () => {
     logout();
     navigate('/login');
  };

  return (
    <aside className="w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-slate-800/50 flex flex-col h-full shrink-0 shadow-2xl relative overflow-hidden">
      <div className="h-20 flex items-center px-7 border-b border-slate-800/50 shrink-0 relative z-10 w-full mb-2">
        <h1 className="text-white font-black text-xl tracking-tight">
          ERP <span className="text-[#00A89C]">Equilibrar</span>
        </h1>
      </div>
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-2 pb-6 relative z-10">
        {renderedGroups.map((group) => {
          const isStandalone = (group as any).isStandalone;
          const isExpanded = isStandalone || expandedGroups[group.title];
          const GroupIcon = group.icon;
          return (
            <div key={group.title} className={isStandalone ? "mb-2" : "mb-4"}>
              {/* Omitir botón y título si es Standalone */}
              {!isStandalone && (
                <button 
                  onClick={() => toggleGroup(group.title)}
                  className="w-full flex items-center justify-between px-4 py-3 mb-1 text-slate-400 hover:text-white transition-colors group rounded-xl hover:bg-slate-800/40 outline-none"
                  title={`Alternar ${group.title}`}
                >
                  <h3 className="text-xs font-bold uppercase tracking-wider group-hover:text-white transition-colors flex items-center gap-3">
                    <GroupIcon className="w-[22px] h-[22px] text-[#00A89C] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
                    {group.title}
                  </h3>
                  <div className={`transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isExpanded ? 'rotate-180 text-white' : 'rotate-0 text-slate-500'}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>
              )}
              
              {/* CSS Grid Animation for perfect height transition */}
              <div 
                className={isStandalone ? "grid grid-rows-[1fr] opacity-100 w-full" : `grid transition-[grid-template-rows,opacity,transform] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top ${
                  isExpanded ? 'grid-rows-[1fr] opacity-100 scale-100 mt-1' : 'grid-rows-[0fr] opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <div className="overflow-hidden space-y-1 px-2">
                  <div className="py-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path!}
                          className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                              isActive
                                ? 'bg-gradient-to-r from-[#00A89C]/20 to-[#00A89C]/5 text-[#00A89C] border border-[#00A89C]/20 translate-x-2 shadow-md hover:translate-x-3'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/60 hover:translate-x-2 outline-none'
                            }`
                          }
                        >
                          <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                          <span>{item.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </nav>
      
      <div className="p-5 border-t border-slate-800/50 bg-slate-900/80 backdrop-blur-md relative z-10 m-4 rounded-2xl border shadow-xl shadow-black/40">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00A89C] to-emerald-600 text-white flex items-center justify-center font-black shadow-inner shadow-white/20 text-lg uppercase ring-2 ring-slate-800">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-sm font-bold text-white leading-tight truncate">{user?.name || 'Cargando...'}</span>
            <span className="text-[10px] text-[#00A89C] uppercase tracking-widest font-black truncate mt-0.5">{user?.role || 'Autenticando'}</span>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-9 h-9 rounded-full bg-slate-800/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition-all duration-300 hover:scale-110"
            title="Cerrar Sessión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
