#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add cache control headers for better performance
        self.send_header('Cache-Control', 'public, max-age=3600')
        super().end_headers()

    def log_message(self, format, *args):
        # Custom logging with timestamp
        import datetime
        timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{timestamp}] {format % args}")
        sys.stdout.flush()

if __name__ == "__main__":
    # Change to dist directory
    os.chdir('/home/user/webapp/fraction-game/dist')
    
    PORT = 8080
    Handler = MyHTTPRequestHandler
    
    with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
        print(f"🎮 Fraction Game Server running at http://0.0.0.0:{PORT}/")
        print("📚 Ready for classroom deployment!")
        sys.stdout.flush()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped")
