import re

file_path = r"c:\Users\JereM\OneDrive\Desktop\Paoloni\backend\src\infrastructure\http\controllers\AiController.ts"

# Read as bytes to inspect/fix encoding issues if needed
try:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
except UnicodeDecodeError:
    with open(file_path, "r", encoding="utf-16") as f:
        content = f.read()

# Fix literal newlines in strings
content = re.sub(r"\+\s*'[\r\n]+';", r"+ '\\n';", content)

# Fix messed up characters
content = content.replace("sltimas", "Últimas")
content = content.replace("sltimos", "Últimos")
content = content.replace("Elaboracin", "Elaboración")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
