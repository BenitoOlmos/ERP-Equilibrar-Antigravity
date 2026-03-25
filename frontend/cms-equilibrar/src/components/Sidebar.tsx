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
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navGroups = [
  {
    title: 'Panel de Control',
    icon: PieChart,
    items: [
      { path: '/', label: 'Resumen', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Gestión Operativa',
    icon: ClipboardList,
    items: [
      { path: '/agenda', label: 'Agenda', icon: Calendar },
      { path: '/crm', label: 'CRM / Seguimiento', icon: Target },
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
      { path: '/productos', label: 'Productos', icon: Package },
    ]
  },
  {
    title: 'Ventas y Finanzas',
    icon: Wallet,
    items: [
      { path: '/ventas', label: 'Ventas', icon: ShoppingCart },
      { path: '/pagos', label: 'Pagos', icon: CreditCard },
    ]
  },
  {
    title: 'Configuración',
    icon: Settings,
    items: [
      { path: '/usuarios', label: 'Usuarios', icon: Users },
      { path: '/sucursales', label: 'Sucursales', icon: MapPin },
      { path: '/ajustes', label: 'Ajustes', icon: Settings },
      { path: '/db', label: 'Respaldos', icon: Server },
      { path: '/test-rfai', label: 'Test RFAI', icon: Activity },
    ]
  }
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'Panel de Control': true,
    'Gestión Operativa': true,
    'Servicios': true,
    'Ventas y Finanzas': true,
    'Configuración': true,
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
      if (!user || user.role === 'ADMIN') return true;
      if (user.role === 'COORDINATOR') return ['/agenda', '/usuarios', '/tratamientos', '/pagos'].includes(item.path || '');
      if (user.role === 'SPECIALIST') return ['/agenda', '/usuarios', '/test-rfai'].includes(item.path || '');
      return false; // Clients shouldn't be here
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
          const isExpanded = expandedGroups[group.title];
          const GroupIcon = group.icon;
          return (
            <div key={group.title} className="mb-4">
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
              
              {/* CSS Grid Animation for perfect height transition */}
              <div 
                className={`grid transition-[grid-template-rows,opacity,transform] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top ${
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
