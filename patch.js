const fs = require('fs');
const filepath = 'frontend/cms-equilibrar/src/pages/ClientProgress.tsx';
let data = fs.readFileSync(filepath, 'utf8');

const replacement = `<header className="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-20">
             <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="w-1/3 flex justify-start">
                   <button onClick={() => navigate('/mi-cuenta')} className="flex items-center text-slate-500 hover:text-[#00A89C] font-semibold transition-colors">
                      <ChevronLeft className="w-5 h-5 mr-1" /> <span className="hidden sm:inline">Volver a Mi Cuenta</span><span className="sm:hidden">Volver</span>
                   </button>
                </div>
                <div className="w-1/3 flex items-center justify-center gap-2">
                   <div className="w-8 h-8 rounded-full overflow-hidden bg-[#F4F9F9] flex items-center justify-center p-1">
                      <img alt="Logo" className="w-full h-full object-contain" src="/assets/logo-CYF-QZPl.png" onError={(e: any) => e.target.style.display='none'}/>
                   </div>
                   <span className="text-sm font-bold text-[#0097B2] tracking-wide hidden sm:block">EQUILIBRAR</span>
                </div>
                <div className="w-1/3 flex justify-end">
                   <div className="relative">
                      <div className="flex items-center space-x-3 focus:outline-none transition-opacity">
                         <div className="hidden sm:flex flex-col text-right">
                            <span className="text-sm font-bold text-slate-700">{user?.name || 'Invitado'}</span>
                            <span className="text-[10px] font-black uppercase text-[#00A89C]">{(user?.role === 'patient' || user?.role === 'CLIENT') ? 'Paciente' : 'Usuario'}</span>
                         </div>
                         <img alt="Avatar" className="w-10 h-10 rounded-full border-2 border-slate-100 shadow-sm bg-white object-cover" src={\`https://api.dicebear.com/7.x/adventurer/svg?seed=\${user?.name || 'Usuario'}&backgroundColor=bbf7d0\`} />
                      </div>
                   </div>
                </div>
             </div>
          </header>`;

let regex = /<header className="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-20">[\s\S]*?<\/header>/;
let newData = data.replace(regex, replacement);

if (newData !== data) {
    fs.writeFileSync(filepath, newData, 'utf8');
    console.log('Successfully replaced header block using wildcard regex!');
} else {
    console.log('Failed: regex pattern not found.');
}
