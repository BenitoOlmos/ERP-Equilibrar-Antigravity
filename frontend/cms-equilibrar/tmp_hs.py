import os
import glob

pages_dir = r"c:\Users\benit\OneDrive\Escritorio\PROYECTOS\ERP-Equilibrar-Antigravity\frontend\cms-equilibrar\src\pages"

files = glob.glob(os.path.join(pages_dir, "*.tsx"))
modified = 0

for fp in files:
    with open(fp, "r", encoding="utf-8") as f:
        content = f.read()
        
    new_content = content.replace("h-[calc(100vh-8rem)]", "min-h-[calc(100vh-6rem)]")
    new_content = new_content.replace("h-[calc(100vh-6rem)]", "min-h-[calc(100vh-6rem)]")
    
    if new_content != content:
        with open(fp, "w", encoding="utf-8") as f:
            f.write(new_content)
        modified += 1
        print(f"Updated {os.path.basename(fp)}")

print(f"\nTotal files modified: {modified}")
