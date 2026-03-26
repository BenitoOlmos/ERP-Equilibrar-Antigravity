import { Plus, Trash2, Video, Headphones, AlignLeft, FileText, Image as ImageIcon, CheckSquare, ChevronDown, ChevronUp, GripVertical, BookOpen } from 'lucide-react';

export interface ContentModule {
  title: string;
  type: string;
  contentUrl?: string;
  description?: string;
  duration?: string | number;
  questions?: { text: string; type: string; min: number; max: number }[];
  order: number;
}

interface Props {
  modules: ContentModule[];
  onChange: (modules: ContentModule[]) => void;
  accentColor?: string;
}

export function UniversalContentBuilder({ modules, onChange }: Props) {
  
  const addModule = (type: string) => {
    onChange([...modules, { 
      title: '', 
      type, 
      contentUrl: '',
      description: '',
      order: modules.length,
      questions: type === 'QUESTIONNAIRE' ? [] : undefined
    }]);
  };

  const removeModule = (idx: number) => {
    onChange(modules.filter((_, i) => i !== idx).map((m, i) => ({ ...m, order: i })));
  };

  const updateModule = (idx: number, key: keyof ContentModule, value: any) => {
    const newModules = [...modules];
    newModules[idx] = { ...newModules[idx], [key]: value };
    onChange(newModules);
  };

  const addQuestion = (moduleIdx: number) => {
    const newModules = [...modules];
    if (!newModules[moduleIdx].questions) newModules[moduleIdx].questions = [];
    newModules[moduleIdx].questions!.push({ text: '', type: 'SCALE', min: 1, max: 10 });
    onChange(newModules);
  };

  const updateQuestion = (moduleIdx: number, qIdx: number, key: string, value: any) => {
    const newModules = [...modules];
    newModules[moduleIdx].questions![qIdx] = { ...newModules[moduleIdx].questions![qIdx], [key]: value };
    onChange(newModules);
  };

  const removeQuestion = (moduleIdx: number, qIdx: number) => {
    const newModules = [...modules];
    newModules[moduleIdx].questions = newModules[moduleIdx].questions!.filter((_, i) => i !== qIdx);
    onChange(newModules);
  };

  const moveModule = (idx: number, dir: -1 | 1) => {
    if (idx + dir < 0 || idx + dir >= modules.length) return;
    const newModules = [...modules];
    const temp = newModules[idx];
    newModules[idx] = newModules[idx + dir];
    newModules[idx + dir] = temp;
    newModules.forEach((m, i) => m.order = i);
    onChange(newModules);
  };

  const options = [
    { type: 'VIDEO', label: 'Video Youtube', icon: Video, color: 'text-rose-500', bg: 'bg-rose-50' },
    { type: 'JOURNAL', label: 'Bitácora', icon: BookOpen, color: 'text-fuchsia-500', bg: 'bg-fuchsia-50' },
    { type: 'AUDIO', label: 'Audio BD', icon: Headphones, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { type: 'QUESTIONNAIRE', label: 'Cuestionario', icon: CheckSquare, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { type: 'REFLECTION', label: 'Reflexión', icon: AlignLeft, color: 'text-amber-500', bg: 'bg-amber-50' },
    { type: 'PDF', label: 'Guía PDF', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
    { type: 'IMAGE', label: 'Imagen', icon: ImageIcon, color: 'text-purple-500', bg: 'bg-purple-50' }
  ];

  return (
    <div className="w-full flex flex-col pt-4">
      
      {/* Action Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-3 mb-8 shadow-sm">
        <span className="w-full text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Agregar Bloque:</span>
        {options.map(opt => (
          <button
            key={opt.type}
            type="button"
            onClick={() => addModule(opt.type)}
            className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:border-slate-300 hover:shadow-md transition-all active:scale-95"
          >
            <div className={`p-1.5 rounded-md mr-2 ${opt.bg} ${opt.color}`}>
               <opt.icon className="w-3.5 h-3.5" />
            </div>
            {opt.label}
          </button>
        ))}
      </div>

      {/* Modules List */}
      <div className="space-y-6">
        {modules.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl">
            <GripVertical className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-black text-slate-400">Syllabus Vacío</h3>
            <p className="text-slate-400 text-sm mt-2">Agregue videos, cuestionarios, reflexiones y más contenido interactivo.</p>
          </div>
        )}

        {modules.map((m, i) => {
          const opt = options.find(o => o.type === m.type) || options[0];
          const Icon = opt.icon;

          return (
            <div key={i} className="bg-white border text-left border-slate-200 shadow-sm rounded-2xl overflow-hidden relative group transition-all hover:shadow-md">
              {/* Toolbar */}
              <div className="bg-slate-50 border-b border-slate-100 p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <button type="button" onClick={() => moveModule(i, -1)} disabled={i === 0} className="text-slate-300 hover:text-slate-600 disabled:opacity-30 p-1"><ChevronUp className="w-4 h-4"/></button>
                    <button type="button" onClick={() => moveModule(i, 1)} disabled={i === modules.length - 1} className="text-slate-300 hover:text-slate-600 disabled:opacity-30 p-1"><ChevronDown className="w-4 h-4"/></button>
                  </div>
                  <div className={`p-2 rounded-xl ${opt.bg} ${opt.color}`}>
                     <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">{opt.label} • Bloque {i + 1}</span>
                    <input 
                      type="text" 
                      placeholder="Título de la cápsula/bloque..." 
                      value={m.title} 
                      onChange={e => updateModule(i, 'title', e.target.value)}
                      className="bg-transparent font-bold text-slate-800 border-none outline-none focus:ring-0 p-0 text-base placeholder:text-slate-300 w-full min-w-[300px]"
                    />
                  </div>
                </div>
                <button type="button" onClick={() => removeModule(i)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors mr-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Dynamic Content Body */}
              <div className="p-5 space-y-4">
                
                {['VIDEO', 'AUDIO', 'PDF', 'IMAGE'].includes(m.type) && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                       {m.type === 'AUDIO' ? 'Archivo Base de Datos / Enlace M3U' : 'Enlace del Recurso (URL)'}
                    </label>
                    <input 
                      type="text" 
                      value={m.contentUrl || ''} 
                      onChange={e => updateModule(i, 'contentUrl', e.target.value)}
                      placeholder={m.type === 'VIDEO' ? 'Ej. https://youtube.com/watch?v=...' : m.type === 'IMAGE' ? 'https://...' : ''} 
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2 text-sm font-mono focus:outline-none focus:border-slate-400 focus:bg-white transition-all" 
                    />
                  </div>
                )}

                {['VIDEO', 'PDF', 'REFLECTION', 'TEXT', 'JOURNAL'].includes(m.type) && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                       {m.type === 'REFLECTION' ? 'Texto de Reflexión / Contenido' : m.type === 'JOURNAL' ? 'Instrucciones para la Bitácora del Estudiante' : 'Instrucciones al Estudiante / Información'}
                    </label>
                    <textarea 
                      rows={['REFLECTION', 'JOURNAL'].includes(m.type) ? 5 : 2} 
                      value={m.description || ''} 
                      onChange={e => updateModule(i, 'description', e.target.value)}
                      placeholder={m.type === 'REFLECTION' ? 'Escribe o pega el texto para que el paciente lo lea...' : m.type === 'JOURNAL' ? 'Escribe la consigna sobre la cual el paciente debe escribir en su bitácora...' : 'Lee esto antes de ver el video...'} 
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-all resize-none" 
                    />
                  </div>
                )}

                {['VIDEO', 'AUDIO'].includes(m.type) && (
                  <div className="w-48">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Duración Total</label>
                    <input 
                      type="text" 
                      value={m.duration || ''} 
                      onChange={e => updateModule(i, 'duration', e.target.value)}
                      placeholder="Ej. 15 min" 
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-all" 
                    />
                  </div>
                )}

                {/* Question builder */}
                {m.type === 'QUESTIONNAIRE' && (
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                       <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Formulario</h4>
                       <button type="button" onClick={() => addQuestion(i)} className="text-[10px] font-black uppercase bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center"><Plus className="w-3 h-3 mr-1"/> Añadir Pregunta</button>
                    </div>

                    <div className="space-y-3">
                      {(!m.questions || m.questions.length === 0) && (
                         <div className="text-[11px] font-bold text-slate-400 py-3 text-center bg-white border border-dashed border-slate-200 rounded-xl">Pulse "Añadir Pregunta" para iniciar el cuestionario</div>
                      )}
                      {(m.questions || []).map((q, qIdx) => (
                        <div key={qIdx} className="bg-white border border-slate-200 shadow-sm rounded-xl p-3 flex gap-4 relative group">
                           <button type="button" onClick={() => removeQuestion(i, qIdx)} className="absolute top-2 right-2 p-1.5 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                           
                           <div className="flex flex-col items-center pt-1.5">
                              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 font-black text-[10px] flex items-center justify-center">{qIdx + 1}</span>
                           </div>

                           <div className="flex-1 flex flex-col gap-2 relative pr-8">
                             <input 
                                type="text"
                                value={q.text}
                                onChange={e => updateQuestion(i, qIdx, 'text', e.target.value)}
                                placeholder="Escribe tu pregunta aquí..."
                                className="w-full text-sm font-bold border-b border-transparent hover:border-slate-100 pb-1 outline-none text-slate-700 focus:border-slate-400 transition-colors"
                             />
                             <div className="flex flex-wrap items-center gap-4 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Tipo de Respuesta</span>
                                  <select value={q.type} onChange={e => updateQuestion(i, qIdx, 'type', e.target.value)} className="bg-white border border-slate-200 font-bold text-slate-600 text-[10px] rounded px-2 py-1 outline-none focus:border-slate-400">
                                    <option value="SCALE">Escala / Slider</option>
                                    <option value="TEXT">Desarrollo (Texto Libre)</option>
                                  </select>
                                </div>
                                {q.type === 'SCALE' && (
                                  <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Desde</span>
                                    <input type="number" value={q.min} onChange={e => updateQuestion(i, qIdx, 'min', parseInt(e.target.value))} className="w-12 bg-white border border-slate-200 font-mono text-[11px] font-bold rounded px-1.5 py-1 text-center outline-none focus:border-emerald-400" />
                                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest mx-1">Hasta</span>
                                    <input type="number" value={q.max} onChange={e => updateQuestion(i, qIdx, 'max', parseInt(e.target.value))} className="w-12 bg-white border border-slate-200 font-mono text-[11px] font-bold rounded px-1.5 py-1 text-center outline-none focus:border-emerald-400" />
                                  </div>
                                )}
                             </div>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
