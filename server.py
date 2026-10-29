from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os

os.chdir(Path(__file__).resolve().parent)
print('3D Chemistry Lab: http://localhost:8000/chemistry_lab.html')
ThreadingHTTPServer(('127.0.0.1', 8000), SimpleHTTPRequestHandler).serve_forever()
