import http.server
import socketserver

PORT = 8080

class Handler(http.server.SimpleHTTPRequestHandler):
    pass

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"🔒 Secure Local Server running at http://localhost:{PORT}")
    print("This server is completely isolated from the internet.")
    print("Press Ctrl+C to stop.")
    httpd.serve_forever()
