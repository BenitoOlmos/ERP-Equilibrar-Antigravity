import re
import os

files = [
    r"c:\Users\benit\OneDrive\Escritorio\PROYECTOS\ERP-Equilibrar-Antigravity\frontend\cms-equilibrar\src\pages\Programas.tsx",
    r"c:\Users\benit\OneDrive\Escritorio\PROYECTOS\ERP-Equilibrar-Antigravity\frontend\cms-equilibrar\src\pages\Tratamientos.tsx",
    r"c:\Users\benit\OneDrive\Escritorio\PROYECTOS\ERP-Equilibrar-Antigravity\frontend\cms-equilibrar\src\pages\Cursos.tsx"
]

ui_block = """
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 mt-8">
                     <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Asignación de Agenda (Clínica)</h3>
                     <button type="button" onClick={addAgendaWeek} className="bg-slate-800 text-white text-[10px] uppercase tracking-widest font-black px-3 py-1.5 rounded-md hover:bg-slate-700 transition-colors">+ Añadir Semana</button>
                  </div>
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2 mt-4">
                     {formData.agendaWeeks.map((week, wIdx) => (
                        <div key={wIdx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative group">
                           <button type="button" onClick={() => removeAgendaWeek(wIdx)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 bg-red-50 w-6 h-6 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3 h-3" /></button>
                           <div className="text-[10px] font-black uppercase tracking-widest text-[#00A89C] mb-3 flex items-center">
                              <span className="w-4 h-4 rounded bg-[#00A89C]/10 flex items-center justify-center mr-2">W</span> Semana {week.weekNumber}
                           </div>
                           <div className="grid grid-cols-1 gap-2">
                             {availableServices.map(srv => {
                                const isSel = week.serviceIds.includes(srv.id);
                                return (
                                   <label key={srv.id} className={`flex items-center px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${isSel ? 'bg-[#00A89C]/5 border-[#00A89C]/30' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}>
                                      <input type="checkbox" className="mr-3 w-3 h-3 accent-[#00A89C]" checked={isSel} onChange={() => toggleServiceInWeek(wIdx, srv.id)} />
                                      <span className={`text-[11px] flex-1 font-bold ${isSel ? 'text-slate-800' : 'text-slate-600'}`}>{srv.name}</span>
                                   </label>
                                );
                             })}
                           </div>
                        </div>
                     ))}
                     {formData.agendaWeeks.length === 0 && <div className="text-[10px] text-slate-400 uppercase text-center py-4">Sin semanas clínicas</div>}
                  </div>
"""

helpers = """
  const toggleServiceInWeek = (wIdx: number, srvId: string) => {
    setFormData(prev => {
       const nw = [...prev.agendaWeeks];
       const week = {...nw[wIdx]};
       if(week.serviceIds.includes(srvId)) week.serviceIds = week.serviceIds.filter(id => id !== srvId);
       else week.serviceIds = [...week.serviceIds, srvId];
       nw[wIdx] = week;
       return { ...prev, agendaWeeks: nw };
    });
  };

  const addAgendaWeek = () => {
     setFormData(prev => ({
        ...prev,
        agendaWeeks: [...prev.agendaWeeks, { weekNumber: prev.agendaWeeks.length > 0 ? prev.agendaWeeks[prev.agendaWeeks.length-1].weekNumber + 1 : 1, serviceIds: [] }]
     }));
  }

  const removeAgendaWeek = (idx: number) => {
     setFormData(prev => ({
        ...prev,
        agendaWeeks: prev.agendaWeeks.filter((_, i) => i !== idx).map((w, i) => ({ ...w, weekNumber: i + 1 }))
     }));
  }
"""

def parse_backend_services(prog_str):
    return f"""
                           const weeksMap = new Map<number, string[]>();
                           ({prog_str}.services || []).forEach((s:any) => {{
                               const wNum = s.weekNumber || 1;
                               const sId = s.serviceId || s.agendaServiceId;
                               if(!weeksMap.has(wNum)) weeksMap.set(wNum, []);
                               weeksMap.get(wNum)!.push(sId);
                           }});
                           const maxW = Math.max(4, ...Array.from(weeksMap.keys()));
                           const aw = Array.from({{length: maxW}}, (_, i) => ({{ weekNumber: i + 1, serviceIds: weeksMap.get(i+1) || [] }}));
"""

for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Add clock to lucide imports if missing (to ensure W icon fits, but I used W). I will use Trash2 if present. Since Trash2 is used, it's fine.
    
    # 2. State init replacement
    content = content.replace("serviceIds: [] as string[]", "agendaWeeks: Array.from({length: 4}, (_, i) => ({ weekNumber: i + 1, serviceIds: [] as string[] }))")
    
    # Reset New Button
    content = content.replace("serviceIds: []", "agendaWeeks: Array.from({length: 4}, (_, i) => ({ weekNumber: i + 1, serviceIds: [] as string[] }))")
    
    # 3. Add helpers right before `const filtered` or similar
    if "const [isEditing, setIsEditing]" in content:
        # insert helpers below handleSave/Delete
        # Find where to place it
        if "toggleServiceInWeek" not in content:
            if "const filtered" in content:
                content = content.replace("const filtered", helpers + "\n  const filtered")
            elif "const addContentLayer =" in content:
                content = content.replace("const addContentLayer =", helpers + "\n  const addContentLayer =")
    
    # In Cursos, toggleServiceSelection might be there
    content = re.sub(r'const toggleServiceSelection = \(.*?};', '', content, flags=re.DOTALL)
    
    # 4. Replace Edit logic mapping
    # Searching for edit button mapping: `serviceIds: prog.services?.map((ps:any) => ps.agendaServiceId) || []`
    # or `serviceIds: prog.services?.map((ps:any) => ps.serviceId) || []`
    # We replace the whole `serviceIds: ...` part with the map parsing logic. Wait, it's inside an object.
    
    edit_block = re.search(r'setFormData\({\s*id: prog.id.*?\n.*?set', content, flags=re.DOTALL)
    if edit_block:
        full_edit = edit_block.group(0)
        if "weeksMap" not in full_edit:
            setup = parse_backend_services("prog")
            new_edit = setup + "                           " + full_edit.replace(re.search(r'serviceIds: prog.services\?.*?(?:,|})', full_edit).group(0), "agendaWeeks: aw,")
            if new_edit.endswith(" }"): # Sometimes the trailing comma makes it bad. Let's do it safer. 
                pass
            content = content.replace(full_edit, new_edit)
    
    # Programas uses wks.
    edit_block2 = re.search(r'const wks = prog.*?setFormData\({ id: prog.id.*?}', content, flags=re.DOTALL)
    if edit_block2:
        if "weeksMap" not in edit_block2.group(0):
            setup = parse_backend_services("prog")
            full_edit = edit_block2.group(0)
            new_form = full_edit.replace(re.search(r'serviceIds: prog.services\?.*?(?:,|})', full_edit).group(0), "agendaWeeks: aw,")
            content = content.replace(full_edit, setup + "                           " + new_form)

    # 5. UI HTML Replacement
    # Find the UI block starting with `<h3 className="...">Asignación de Agenda` up to `</div>` ending it.
    ui_search = re.search(r'<h3[^>]*>Asignación de Agenda \(Clínica\)</h3>\s*<div.*?availableServices\.map.*?</label>\s*\);\s*}\)\}.*?</div>\s*</div>', content, flags=re.DOTALL)
    if ui_search:
        content = content.replace(ui_search.group(0), ui_block)
    
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Refactored {os.path.basename(fp)}")
