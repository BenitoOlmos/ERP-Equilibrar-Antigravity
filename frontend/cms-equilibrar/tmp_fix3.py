import os
import glob
files = [
    r"c:\Users\benit\OneDrive\Escritorio\PROYECTOS\ERP-Equilibrar-Antigravity\frontend\cms-equilibrar\src\pages\Programas.tsx",
    r"c:\Users\benit\OneDrive\Escritorio\PROYECTOS\ERP-Equilibrar-Antigravity\frontend\cms-equilibrar\src\pages\Tratamientos.tsx",
    r"c:\Users\benit\OneDrive\Escritorio\PROYECTOS\ERP-Equilibrar-Antigravity\frontend\cms-equilibrar\src\pages\Cursos.tsx"
]

bad_str = "agendaWeeks: Array.from({length: 4}, (_, i) => ({ weekNumber: i + 1, agendaWeeks: Array.from({length: 4}, (_, i) => ({ weekNumber: i + 1, serviceIds: [] as string[] })) as string[] }))"
good_str = "agendaWeeks: Array.from({length: 4}, (_, i) => ({ weekNumber: i + 1, serviceIds: [] as string[] }))"

bad_str_2 = "agendaWeeks: Array.from({length: 4}, (_, i) => ({ weekNumber: i + 1, agendaWeeks: Array.from({length: 4}, (_, i) => ({ weekNumber: i + 1, serviceIds: [] as string[] })) }))"

for fp in files:
    with open(fp, "r", encoding="utf-8") as f:
        content = f.read()

    content = content.replace(bad_str, good_str)
    content = content.replace(bad_str_2, good_str)

    with open(fp, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Fixed nested {os.path.basename(fp)}")
