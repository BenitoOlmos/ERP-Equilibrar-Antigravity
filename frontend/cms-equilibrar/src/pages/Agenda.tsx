import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, Calendar as CalendarIcon, List, Clock, MoreVertical, Plus, CalendarDays, CalendarRange, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CalendarWidget = ({ month, year, selectedDay, selectedDate, onDaySelect, onMonthChange }: any) => {
   const monthIndex = selectedDate.getMonth();
   const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
   const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();
   const emptyOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

   return (
     <div className="bg-white rounded-xl p-2 sm:p-4">
       <div className="flex items-center justify-between mb-4">
         <button onClick={() => onMonthChange(-1)} className="text-slate-300 hover:text-[#00A89C] px-2 font-black transition-colors">‹</button>
         <span className="text-sm font-black text-slate-700 capitalize tracking-tight">{month} - {year}</span>
         <button onClick={() => onMonthChange(1)} className="text-slate-300 hover:text-[#00A89C] px-2 font-black transition-colors">›</button>
       </div>
       <div className="grid grid-cols-7 text-center mb-4">
         {['Lu','Ma','Mi','Ju','Vi','Sa','Do'].map(d => <span key={d} className="text-[11px] font-bold text-slate-400 capitalize">{d}</span>)}
       </div>
       <div className="grid grid-cols-7 text-center gap-y-2">
         {Array.from({length: emptyOffset}).map((_, i) => <div key={`empty-${i}`} />)}
         {Array.from({length: daysInMonth}, (_, i) => i + 1).map(d => (
           <button 
             key={d} 
             onClick={() => onDaySelect(d)}
             className={`w-7 h-7 sm:w-8 sm:h-8 mx-auto flex items-center justify-center text-xs sm:text-sm transition-all ${selectedDay === d ? 'bg-[#00A89C] text-white font-black rounded-full shadow-lg shadow-[#00A89C]/30' : 'text-slate-600 font-semibold hover:bg-slate-100 rounded-full'}`}
           >
             {d}
           </button>
         ))}
       </div>
     </div>
   );
};

export function Agenda() {
  const { user } = useAuth();
  const isSpecialist = user?.role === 'SPECIALIST';
  
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month' | 'list'>('week');
  const [agendaFilterSpec, setAgendaFilterSpec] = useState('ALL');
  const effectiveFilter = isSpecialist ? user.id : agendaFilterSpec;
  
  const [now] = useState(new Date());

  // Block Modal
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockData, setBlockData] = useState({ date: new Date().toISOString().split('T')[0], time: '08:00', specialistId: '' });

  // Appointment Modal
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
     date: new Date().toISOString().split('T')[0],
     time: '08:00',
     specialistId: '',
     clientId: '',
     serviceId: '',
     sessionType: 'IN_PERSON'
  });
  
  // Combobox Search State
  const [clientSearch, setClientSearch] = useState('');
  const [showClientDrop, setShowClientDrop] = useState(false);

  // Context Menu & Edit State
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editApptId, setEditApptId] = useState<string | null>(null);

  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8:00 to 21:00

  const fetchData = () => {
    Promise.all([
      axios.get('/api/data/appointments'),
      axios.get('/api/data/users')
    ]).then(([resAppts, resUsers]) => {
      setAppointments(resAppts.data);
      const allUsers = resUsers.data || [];
      setProfessionals(
         allUsers.filter((u:any) => ['SPECIALIST', 'Especialista', 'ESPECIALISTA'].includes(u.role)).map((s:any) => ({
            id: s.id,
            name: `${s.profile?.firstName || ''} ${s.profile?.lastName || ''}`.trim() || s.name || s.email,
            color: s.profile?.color || 'bg-slate-100 border-slate-300 text-slate-700',
            avatar: `https://ui-avatars.com/api/?name=${s.profile?.firstName}+${s.profile?.lastName}&background=random&color=fff&rounded=true&bold=true`
         }))
      );
      setClients(
         allUsers.filter((u:any) => ['CLIENT', 'Cliente', 'USER', 'CLIENTE'].includes(u.role)).map((c:any) => ({
            id: c.id,
            name: `${c.profile?.firstName || ''} ${c.profile?.lastName || ''}`.trim() || c.name || c.email
         }))
      );
      
      axios.get('/api/data/services').then(resSrv => setServices(resSrv.data)).catch(console.error);
      setLoading(false);
    }).catch(err => {
      console.error('Error fetching Agenda data', err);
      setLoading(false);
    });
  };

  useEffect(() => { fetchData() }, []);

  const handleBlockSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     if(!blockData.specialistId) { alert('Seleccione un profesional para bloquear su hora.'); return; }
     
     // Construir la fecha completa
     const dt = new Date(`${blockData.date}T${blockData.time}:00`);
     
     try {
        await axios.post('/api/data/appointments', {
           specialistId: blockData.specialistId,
           date: dt.toISOString(),
           sessionType: 'BLOCKED',
           status: 'BLOCKED',
           clientId: null,
           serviceId: null
        });
        setShowBlockModal(false);
        fetchData();
     } catch (err) {
        console.error(err);
        alert('Error al bloquear la cita');
     }
  };

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
     e.preventDefault();

     const selectedService = services.find(s => s.id === appointmentData.serviceId);
     const derivedSpecialistId = selectedService ? selectedService.specialistId : null;

     if(!derivedSpecialistId || !appointmentData.clientId || !appointmentData.serviceId) { 
        alert('Complete todos los campos requeridos y/o asegúrese de elegir una consulta con especialista.'); return; 
     }
     
     const dt = new Date(`${appointmentData.date}T${appointmentData.time}:00`);

     // Validar disponibilidad
     const isConflict = appointments.some(app => {
         if (editApptId && app.id === editApptId) return false;
         const apptDate = new Date(app.date);
         return app.specialistId === derivedSpecialistId && apptDate.getTime() === dt.getTime();
     });

     if (isConflict) {
        alert('Este especialista ya tiene una consulta agendada o un bloqueo en este horario. Seleccione otro por favor.');
        return;
     }
     
     try {
        if (editApptId) {
           await axios.put(`/api/data/appointments/${editApptId}`, {
              specialistId: derivedSpecialistId,
              clientId: appointmentData.clientId,
              serviceId: appointmentData.serviceId,
              date: dt.toISOString(),
              sessionType: appointmentData.sessionType
           });
        } else {
           await axios.post('/api/data/appointments', {
              specialistId: derivedSpecialistId,
              clientId: appointmentData.clientId,
              serviceId: appointmentData.serviceId,
              date: dt.toISOString(),
              sessionType: appointmentData.sessionType,
              status: 'SCHEDULED'
           });
        }
        setShowAppointmentModal(false);
        setEditApptId(null);
        fetchData();
     } catch (err) {
        console.error(err);
        alert('Error al registrar o actualizar la cita médica');
     }
  };

  const handleDeleteAppt = async (id: string) => {
     if(!window.confirm('¿Está seguro de que desea eliminar permanentemente esta cita?')) return;
     try {
        await axios.delete(`/api/data/appointments/${id}`);
        setMenuOpenId(null);
        fetchData();
     } catch (err) {
        console.error(err);
        alert('Error al cancelar la cita');
     }
  };

  const gridAppointments = appointments.map(app => {
    const start = new Date(app.date);
    const durationMin = app.service?.duration || 60;
    const end = new Date(start.getTime() + durationMin * 60000);
    const isOnline = app.sessionType === 'ONLINE';
    const isBlocked = app.status === 'BLOCKED' || app.sessionType === 'BLOCKED';
    
    return {
      id: app.id,
      profId: app.specialistId,
      clientId: app.clientId,
      serviceId: app.serviceId,
      sessionType: app.sessionType,
      name: isBlocked ? 'Bloqueo Horario' : `${app.client?.profile?.firstName || 'RFAI'} ${app.client?.profile?.lastName || 'Reserva'}`,
      type: isBlocked ? 'Restringido' : (app.service?.name || app.rfaiType || 'Reserva Base'),
      time: `${start.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})} - ${end.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}`,
      color: isBlocked ? 'bg-slate-800 border-slate-900 text-white' : (app.specialist?.profile?.color || 'bg-slate-100 border-slate-300 text-slate-700'),
      startHour: start.getHours() + (start.getMinutes() / 60),
      duration: durationMin / 60,
      isBlocked,
      hasGlobe: isOnline && !isBlocked,
      rawDate: start
    };
  });

  const timePos = Math.max(0, (now.getHours() - 8) * 60 + (now.getMinutes() / 60) * 60);

  // Month View Helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
     const day = new Date(year, month, 1).getDay();
     return day === 0 ? 6 : day - 1; // 0 is Monday
  };

  if (loading) return <div className="flex h-full items-center justify-center"><div className="w-12 h-12 border-4 border-[#00A89C]/20 border-t-[#00A89C] rounded-full animate-spin" /></div>;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-6rem)] bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm animate-fade-in relative z-10 w-full">
      {/* Sidebar de Control */}
      <aside className="w-full lg:w-[300px] bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col p-4 lg:p-6 overflow-y-auto shrink-0 z-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100 w-full overflow-hidden">
            <button onClick={() => setViewMode('day')} className={`flex-1 flex items-center justify-center py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === 'day' ? 'bg-[#00A89C] text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}><Clock className="w-3.5 h-3.5 mr-1.5" /> Día</button>
            <button onClick={() => setViewMode('week')} className={`flex-1 flex items-center justify-center py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === 'week' ? 'bg-[#00A89C] text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}><CalendarRange className="w-3.5 h-3.5 mr-1.5" /> Sem</button>
            <button onClick={() => setViewMode('month')} className={`flex-1 flex items-center justify-center py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === 'month' ? 'bg-[#00A89C] text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}><CalendarDays className="w-3.5 h-3.5 mr-1.5" /> Mes</button>
            <button onClick={() => setViewMode('list')} className={`flex-1 flex items-center justify-center py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}><List className="w-3.5 h-3.5 mr-1.5" /> Lista</button>
          </div>
        </div>

        <div className="space-y-6">
          {!isSpecialist && (
             <div className="space-y-2">
               <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Filtro Profesional</label>
               <div className="relative">
                 <select 
                   value={agendaFilterSpec}
                   onChange={(e) => setAgendaFilterSpec(e.target.value)}
                   className="w-full bg-white border border-slate-200 shadow-sm rounded-xl px-4 py-2.5 text-xs font-bold appearance-none outline-none focus:ring-2 focus:ring-[#00A89C]/20 cursor-pointer text-slate-700"
                 >
                   <option value="ALL">Vista Global (Todos)</option>
                   {professionals.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                   ))}
                 </select>
                 <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               </div>
             </div>
          )}

          <div className="flex flex-col gap-2 mt-4">
             <button onClick={() => {
                setEditApptId(null);
                setAppointmentData({
                   date: selectedDate.toISOString().split('T')[0],
                   time: '08:00',
                   specialistId: effectiveFilter === 'ALL' ? '' : effectiveFilter,
                   clientId: '',
                   serviceId: '',
                   sessionType: 'IN_PERSON'
                });
                setClientSearch('');
                setShowAppointmentModal(true);
             }} className="w-full py-3 px-4 bg-[#00A89C] hover:bg-emerald-500 text-white rounded-xl text-sm font-black flex items-center justify-center transition-all shadow-lg shadow-[#00A89C]/20">
               <Plus className="w-5 h-5 mr-2" />
               Nueva Consulta
             </button>
             <button onClick={() => {
                setBlockData(prev => ({...prev, specialistId: isSpecialist ? user.id : ''}));
                setShowBlockModal(true);
             }} className="w-full py-3 px-4 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl text-xs font-bold flex items-center justify-center transition-all border border-slate-200 hover:border-red-200">
               <ShieldAlert className="w-4 h-4 mr-2" />
               Bloquear Horario
             </button>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-8">
          <CalendarWidget 
            month={selectedDate.toLocaleDateString('es-ES', {month:'long'})} 
            year={selectedDate.getFullYear()} 
            selectedDay={selectedDate.getDate()}
            selectedDate={selectedDate}
            onDaySelect={(d: number) => {
              const newD = new Date(selectedDate);
              newD.setDate(d);
              setSelectedDate(newD);
              if (viewMode === 'month') setViewMode('day'); // Jump into the day
            }}
            onMonthChange={(offset: number) => {
               const newD = new Date(selectedDate);
               newD.setMonth(newD.getMonth() + offset);
               setSelectedDate(newD);
            }}
          />
        </div>
      </aside>

      {/* Main Grid Render Space */}
      <main className="flex-1 overflow-hidden flex flex-col relative bg-slate-50/50">
        
        {viewMode === 'month' && (
           <div className="flex-1 flex flex-col bg-white overflow-hidden">
              <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 shrink-0">
                 {['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'].map(d => (
                    <div key={d} className="py-3 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 border-r border-slate-100">{d}</div>
                 ))}
              </div>
              <div className="flex-1 grid grid-cols-7 grid-rows-5 bg-slate-100 gap-[1px]">
                 {Array.from({ length: 35 }, (_, i) => {
                    const year = selectedDate.getFullYear();
                    const month = selectedDate.getMonth();
                    const firstDay = getFirstDayOfMonth(year, month);
                    const daysInMonth = getDaysInMonth(year, month);
                    const dayNum = i - firstDay + 1;
                    const isCurrentMonth = dayNum > 0 && dayNum <= daysInMonth;
                    const dateForCell = new Date(year, month, dayNum);
                    
                    const cellApps = isCurrentMonth ? gridAppointments.filter(app => 
                       app.rawDate.toDateString() === dateForCell.toDateString() && 
                       (effectiveFilter === 'ALL' || app.profId === effectiveFilter)
                    ) : [];

                    return (
                       <div key={i} onClick={() => { if(isCurrentMonth) { setSelectedDate(dateForCell); setViewMode('day') } }} className={`bg-white p-2 overflow-hidden flex flex-col transition-colors ${isCurrentMonth ? 'cursor-pointer hover:bg-slate-50' : 'opacity-40 pointer-events-none'}`}>
                          <div className={`text-right text-xs font-bold mb-1 ${dateForCell.toDateString() === new Date().toDateString() ? 'text-[#00A89C] bg-[#00A89C]/10 w-6 h-6 rounded-full flex items-center justify-center ml-auto' : 'text-slate-400'}`}>
                             {isCurrentMonth ? dayNum : new Date(year, month, dayNum).getDate()}
                          </div>
                          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                             {cellApps.map((app, idx) => (
                                <div key={idx} className={`text-[9px] font-bold px-1.5 py-0.5 rounded truncate ${app.isBlocked ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                   {app.time.split(' - ')[0]} {app.name}
                                </div>
                             ))}
                          </div>
                          {cellApps.length > 3 && <div className="text-[9px] text-center text-slate-400 font-bold mt-1">+{cellApps.length - 3} más</div>}
                       </div>
                    );
                 })}
              </div>
           </div>
        )}

        {(viewMode === 'week' || viewMode === 'day') && (
           <div className="flex-1 overflow-auto bg-slate-50/50 scroll-smooth flex flex-col relative custom-scrollbar">
              <div className={`flex flex-col ${viewMode === 'week' ? 'min-w-[600px] lg:min-w-full' : 'w-full'}`}>
                 <div className="flex border-b border-slate-200 shrink-0 bg-white shadow-sm font-sans sticky top-0 z-40">
                    <div className="w-12 sm:w-16 border-r border-slate-100 flex items-center justify-center bg-slate-50 shrink-0 sticky left-0 z-50 shadow-[1px_0_2px_rgba(0,0,0,0.02)]">
                       <Clock className="w-5 h-5 text-slate-400" />
                    </div>
                    {Array.from({ length: viewMode === 'week' ? 6 : 1 }, (_, i) => {
                       const d = new Date(selectedDate);
                       if (viewMode === 'week') {
                          const currentDay = d.getDay();
                          d.setDate(d.getDate() - currentDay + (currentDay === 0 ? -6 : 1) + i);
                       }
                       const isToday = d.toDateString() === new Date().toDateString();
                       return (
                          <div key={i} className={`flex-1 min-w-[80px] lg:min-w-0 py-3 flex flex-col items-center justify-center border-r border-slate-100 transition-colors ${isToday ? 'bg-[#00A89C]/5' : 'bg-white'}`}>
                             <span className={`text-[9px] sm:text-[10px] uppercase font-black tracking-widest ${isToday ? 'text-[#00A89C]' : 'text-slate-400'}`}>{d.toLocaleDateString('es-ES', { weekday: 'long' })}</span>
                             <span className={`text-xl sm:text-2xl font-black mt-1 ${isToday ? 'text-[#00A89C]' : 'text-slate-800'}`}>{d.getDate()}</span>
                          </div>
                       );
                    })}
                 </div>

                 <div className="flex min-h-[840px]">
                    {/* Horas */}
                    <div className="w-12 sm:w-16 shrink-0 bg-white border-r border-slate-100 sticky left-0 z-30 shadow-[1px_0_2px_rgba(0,0,0,0.02)]">
                       {hours.map(hour => (
                          <div key={hour} className="h-[60px] border-b border-slate-50 flex items-start justify-center pt-2 shrink-0">
                             <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 bg-slate-50 px-1.5 sm:px-2 py-0.5 rounded-lg border border-slate-100 shadow-sm">{hour.toString().padStart(2, '0')}:00</span>
                          </div>
                       ))}
                    </div>

                    <div className="flex-1 flex relative bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:100%_60px]">
                       {Array.from({ length: viewMode === 'week' ? 6 : 1 }, (_, i) => {
                          const d = new Date(selectedDate);
                          if(viewMode === 'week') {
                             const currentDay = d.getDay();
                             d.setDate(d.getDate() - currentDay + (currentDay === 0 ? -6 : 1) + i);
                          }
                          
                          return (
                             <div key={i} className="flex-1 min-w-[80px] lg:min-w-0 border-r border-slate-200/50 relative hover:bg-slate-100/30 transition-colors">
                                {gridAppointments
                                   .filter(app => app.rawDate.toDateString() === d.toDateString())
                                   .filter(app => effectiveFilter === 'ALL' || app.profId === effectiveFilter)
                                   .map(app => (
                                         <div
                                            key={app.id}
                                            className={`absolute inset-x-1 sm:inset-x-2 rounded-xl sm:rounded-2xl border-l-[3px] p-1.5 sm:p-2 shadow z-20 cursor-pointer transition-all flex flex-col group overflow-hidden ${app.color.includes('bg-') ? app.color : 'bg-slate-100 border-slate-400 text-slate-800'} ${app.isBlocked ? 'border-none' : 'hover:shadow-md hover:-translate-y-0.5'}`}
                                            style={{ top: `${(app.startHour - 8) * 60 + 2}px`, height: `${app.duration * 60 - 4}px` }}
                                         >
                                            <div className="flex justify-between items-start mb-0.5">
                                               <span className="font-extrabold text-[10px] sm:text-xs leading-tight truncate drop-shadow-sm">{app.name}</span>
                                               {!app.isBlocked && (
                                                  <div className="relative">
                                                     <MoreVertical onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === app.id ? null : app.id); }} className="w-3.5 h-3.5 opacity-50 hover:opacity-100 shrink-0 group-hover:block hidden" />
                                                     {menuOpenId === app.id && (
                                                        <div className="absolute top-4 right-0 w-32 bg-white rounded-lg shadow-xl border border-slate-200 z-[100] py-1 overflow-visible" onClick={e => e.stopPropagation()}>
                                                           <button onClick={() => {
                                                              setMenuOpenId(null);
                                                              setEditApptId(app.id);
                                                              setAppointmentData({
                                                                 date: app.rawDate.toISOString().split('T')[0],
                                                                 time: app.rawDate.toTimeString().slice(0,5),
                                                                 specialistId: app.profId,
                                                                 clientId: app.clientId || '',
                                                                 serviceId: app.serviceId || '',
                                                                 sessionType: app.sessionType || 'IN_PERSON'
                                                              });
                                                              setClientSearch('');
                                                              setShowAppointmentModal(true);
                                                           }} className="w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-wider text-slate-600 hover:bg-[#00A89C]/10 hover:text-[#00A89C]">Editar Consulta</button>
                                                           <button onClick={() => handleDeleteAppt(app.id)} className="w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-wider text-red-600 hover:bg-red-50 border-t border-slate-100">Eliminar</button>
                                                        </div>
                                                     )}
                                                  </div>
                                               )}
                                            </div>
                                            <div className="mt-auto flex items-center justify-between font-bold text-[9px] sm:text-[10px] leading-none overflow-hidden">
                                               <span className="opacity-80 truncate mr-1.5">{app.type}</span>
                                               <span className="opacity-90 bg-white/50 px-1 py-0.5 rounded text-slate-800 whitespace-nowrap">{app.time.split(' - ')[0]}</span>
                                            </div>
                                         </div>
                                   ))}
                             </div>
                          );
                       })}

                       {timePos >= 0 && timePos <= (hours.length * 60) && (
                          <div className="absolute w-full flex items-center pointer-events-none z-40" style={{ top: `${timePos}px` }}>
                             <div className="absolute -left-1 w-12 h-5 bg-red-500 rounded-full flex items-center justify-center text-[9px] text-white font-black shadow-lg ring-2 ring-red-100/50 z-50">
                                {now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                             </div>
                             <div className="w-full h-[1px] bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] z-40 relative"></div>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {viewMode === 'list' && (
           <div className="flex-1 overflow-auto p-12 relative bg-white">
              <div className="max-w-4xl mx-auto space-y-4 pb-24">
                 <h3 className="text-2xl font-black text-slate-800 mb-8 capitalize flex items-center border-b border-slate-100 pb-4">
                   <CalendarIcon className="w-6 h-6 mr-3 text-[#00A89C]" />
                   <span>Lista Cronológica <span className="text-slate-400 mx-2">/</span> <span className="text-[#00A89C] tracking-tight">{selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span></span>
                 </h3>
                 
                 {gridAppointments
                    .filter(app => app.rawDate.toDateString() === selectedDate.toDateString())
                    .filter(app => effectiveFilter === 'ALL' || app.profId === effectiveFilter)
                    .sort((a,b) => a.rawDate.getTime() - b.rawDate.getTime())
                    .map((app, i) => (
                       <div key={i} className={`flex items-center p-5 rounded-2xl border bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all ${app.isBlocked ? 'border-slate-800 border-l-[6px] bg-slate-50' : (app.color.replace('bg-', 'border-l-[6px] border-').replace('text-', ''))}`}>
                          <div className="w-32 shrink-0 flex flex-col justify-center border-r border-slate-100 pr-5 mr-5">
                             <div className="font-extrabold text-slate-400 text-[10px] uppercase tracking-widest bg-slate-50 w-max px-2 py-0.5 rounded-md mb-2">{app.rawDate.toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: '2-digit' })}</div>
                             <div className="font-black text-slate-800 text-2xl leading-none">{app.time.split(' - ')[0]}<span className="text-sm text-slate-400 font-bold ml-0.5">hs</span></div>
                          </div>
                          <div className="flex-1">
                             <p className="font-black text-slate-800 text-lg leading-tight tracking-tight">{app.name}</p>
                             <p className={`text-xs font-bold mt-1 w-max px-2.5 py-1 rounded-md ${app.isBlocked ? 'bg-slate-800 text-white' : 'text-[#00A89C] bg-[#00A89C]/10'}`}>{app.type}</p>
                          </div>
                          {!app.isBlocked && (
                             <div className="flex shrink-0 items-center justify-end space-x-6">
                                <div className="w-56 shrink-0 flex items-center space-x-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                   <img src={professionals.find(p => p.id === app.profId)?.avatar} className="w-10 h-10 rounded-xl shadow-sm" alt="" />
                                   <div className="flex flex-col">
                                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Atiende</span>
                                     <span className="font-bold text-slate-700 text-sm">{professionals.find(p => p.id === app.profId)?.name}</span>
                                   </div>
                                </div>
                                
                                <div className="relative">
                                   <button onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === app.id ? null : app.id); }} className="w-10 h-10 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors">
                                      <MoreVertical className="w-5 h-5" />
                                   </button>
                                   {menuOpenId === app.id && (
                                       <div className="absolute top-12 right-0 w-36 bg-white rounded-lg shadow-xl border border-slate-200 z-[100] py-1 overflow-hidden" onClick={e => e.stopPropagation()}>
                                          <button onClick={() => {
                                             setMenuOpenId(null);
                                             setEditApptId(app.id);
                                             setAppointmentData({
                                                date: app.rawDate.toISOString().split('T')[0],
                                                time: app.rawDate.toTimeString().slice(0,5),
                                                specialistId: isSpecialist ? user.id : '',
                                                clientId: app.clientId || '',
                                                serviceId: app.serviceId || '',
                                                sessionType: app.sessionType || 'IN_PERSON'
                                             });
                                             setClientSearch('');
                                             setShowAppointmentModal(true);
                                          }} className="w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-wider text-slate-600 hover:bg-[#00A89C]/10 hover:text-[#00A89C]">Editar Consulta</button>
                                          <button onClick={() => handleDeleteAppt(app.id)} className="w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-wider text-red-600 hover:bg-red-50 border-t border-slate-100">Eliminar</button>
                                       </div>
                                    )}
                                </div>
                             </div>
                          )}
                       </div>
                    ))}
                    
                    {gridAppointments
                       .filter(app => app.rawDate.toDateString() === selectedDate.toDateString())
                       .filter(app => effectiveFilter === 'ALL' || app.profId === effectiveFilter)
                       .length === 0 && (
                       <div className="flex flex-col items-center justify-center text-slate-400 py-32 font-medium bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                          <CalendarIcon className="w-12 h-12 text-slate-300 mb-4" />
                          <span className="font-bold text-lg">Día Despejado</span>
                          <span className="text-sm mt-1">No hay citas registradas en los filtros actuales.</span>
                       </div>
                    )}
              </div>
           </div>
        )}
      </main>

      {/* Block Modal */}
      {showBlockModal && (
         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
               <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                  <ShieldAlert className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-black text-slate-800 mb-1">Restringir Horario</h3>
               <p className="text-sm text-slate-500 mb-6">El profesional no podrá recibir citas en el lapso fijado.</p>
               
               <form onSubmit={handleBlockSubmit} className="space-y-4">
                  <div>
                     <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Especialista a Bloquear</label>
                     {isSpecialist ? (
                        <div className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-700 opacity-70">
                           {user?.name}
                        </div>
                     ) : (
                        <select required value={blockData.specialistId} onChange={e => setBlockData({...blockData, specialistId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:border-red-500">
                           <option value="" disabled>Seleccione en la lista...</option>
                           {professionals.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                     )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Día Fijo</label>
                        <input type="date" required value={blockData.date} onChange={e => setBlockData({...blockData, date: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:border-red-500" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Inicio (1hr)</label>
                        <input type="time" required value={blockData.time} onChange={e => setBlockData({...blockData, time: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:border-red-500" />
                     </div>
                  </div>
                  <div className="flex gap-4 pt-4 mt-4">
                     <button type="button" onClick={() => setShowBlockModal(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
                     <button type="submit" className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl shadow-lg shadow-red-500/30 transition-all">Consolidar</button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* Appointment Modal */}
      {showAppointmentModal && (
         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl overflow-y-auto max-h-[90vh]">
               <div className="w-12 h-12 bg-[#00A89C]/10 text-[#00A89C] rounded-full flex items-center justify-center mb-4 border border-[#00A89C]/20 flex-shrink-0">
                  <CalendarRange className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-black text-slate-800 mb-1">{editApptId ? 'Editar Consulta' : 'Agendar Nueva Consulta'}</h3>
               <p className="text-sm text-slate-500 mb-6">{editApptId ? 'Modifique los parámetros de la sesión seleccionada.' : 'Inscribir manualmente un paciente en la agenda clínica.'}</p>
               
               <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                     <div className="relative">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Paciente (Cliente Inscrito)</label>
                        <div className="relative">
                           <button type="button" onClick={() => setShowClientDrop(!showClientDrop)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold flex items-center justify-between text-slate-700 outline-none focus:border-[#00A89C]">
                              <span className="truncate">{appointmentData.clientId ? clients.find(c => c.id === appointmentData.clientId)?.name : 'Buscar paciente...'}</span>
                              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                           </button>
                           
                           {showClientDrop && (
                              <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 shadow-xl rounded-xl z-[70] overflow-hidden flex flex-col max-h-48">
                                 <div className="p-2 border-b border-slate-100 bg-slate-50 sticky top-0">
                                   <input type="text" autoFocus placeholder="Escribe para filtrar..." value={clientSearch} onChange={e => setClientSearch(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#00A89C] font-semibold" />
                                 </div>
                                 <div className="overflow-y-auto w-full custom-scrollbar">
                                    {clients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase())).map(c => (
                                       <button type="button" key={c.id} onClick={() => { setAppointmentData({...appointmentData, clientId: c.id}); setShowClientDrop(false); }} className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-[#00A89C]/10 hover:text-[#00A89C] transition-colors last:border-0 border-b border-slate-50">
                                          {c.name}
                                       </button>
                                    ))}
                                    {clients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase())).length === 0 && <div className="p-3 text-center text-xs text-slate-400 font-bold">No hay coincidencias</div>}
                                 </div>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>

                  <div>
                     <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Servicio Clínico y Especialista Asignado</label>
                     <select required value={appointmentData.serviceId} onChange={e => setAppointmentData({...appointmentData, serviceId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#00A89C]">
                        <option value="" disabled>Catálogo de Servicios...</option>
                        {services.map(s => {
                           const profName = s.specialist ? `${s.specialist.profile?.firstName || ''} ${s.specialist.profile?.lastName || ''}`.trim() : 'Sin Especialista';
                           return <option key={s.id} value={s.id}>{s.name} ({s.duration} min) — Atiende: {profName}</option>
                        })}
                     </select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                     <div className="col-span-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Fecha</label>
                        <input type="date" required value={appointmentData.date} onChange={e => setAppointmentData({...appointmentData, date: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#00A89C]" />
                     </div>
                     <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Hora</label>
                        <input type="time" required value={appointmentData.time} onChange={e => setAppointmentData({...appointmentData, time: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#00A89C]" />
                     </div>
                  </div>



                  <div className="flex gap-4 pt-4 mt-6">
                     <button type="button" onClick={() => { setShowAppointmentModal(false); setEditApptId(null); }} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
                     <button type="submit" className="flex-1 py-3 bg-[#00A89C] hover:bg-emerald-500 text-white font-black rounded-xl shadow-lg shadow-[#00A89C]/30 transition-all">{editApptId ? 'Guardar Cambios' : 'Consolidar Consulta'}</button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
}
