import os
import glob
pages_dir = r"c:\Users\benit\OneDrive\Escritorio\PROYECTOS\ERP-Equilibrar-Antigravity\frontend\cms-equilibrar\src\pages"
files = glob.glob(os.path.join(pages_dir, "*.tsx"))
for fp in files:
    with open(fp, "r", encoding="utf-8") as f: content = f.read()
    new_content = content.replace("min-min-h-", "min-h-")
    if new_content != content:
        with open(fp, "w", encoding="utf-8") as f: f.write(new_content)
        print(f"Fixed {os.path.basename(fp)}")
