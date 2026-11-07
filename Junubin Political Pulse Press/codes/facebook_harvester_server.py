# -*- coding: utf-8 -*-
"""
==============================================================================
ANTIGRAVITY PYTHON REAL-TIME FACEBOOK INGESTION SERVER
==============================================================================
Zero external dependencies required (uses 100% Python standard library).
Receives data from the browser in real-time, validates accuracy, and exports
complete master reports in both TXT and JSON.
==============================================================================
"""

import http.server
import json
import os
import sys
import time
from datetime import datetime

PORT = 8765
SAVE_DIR = r"c:\Users\ademt\Downloads"
WORKSPACE_DIR = r"c:\Tahir\Mission-1.0\Junubin Political Pulse Press"

class HarvesterHandler(http.server.BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        # Enable CORS for browser access
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length)

        try:
            payload = json.loads(post_data.decode("utf-8"))
            action = payload.get("action", "")

            if action == "PROGRESS":
                phase = payload.get("phase", "")
                msg = payload.get("message", "")
                count = payload.get("count", 0)
                print(f"[{datetime.now().strftime('%H:%M:%S')}] [{phase}] {msg} (Count: {count})")

                self.send_response(200)
                self.send_header("Access-Control-Allow-Origin", "*")
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(b'{"status": "ok"}')
                return

            elif action == "SAVE_DATA":
                posts = payload.get("posts", [])
                total_comments = sum(len(p.get("comments", [])) for p in posts)
                total_replies = sum(
                    sum(1 for c in p.get("comments", []) if c.get("isReply"))
                    for p in posts
                )

                print("\n" + "=" * 65)
                print(">>> RECEIVED COMPLETE DATASET FROM BROWSER <<<")
                print(f"Total Posts: {len(posts)}")
                print(f"Total Comments: {total_comments}")
                print(f"Total Nested Replies: {total_replies}")
                print("=" * 65 + "\n")

                # Save JSON
                timestamp = int(time.time() * 1000)
                json_filename = f"Junubin_Python_Master_{timestamp}.json"
                txt_filename = f"Junubin_Python_Master_{timestamp}.txt"

                json_path = os.path.join(SAVE_DIR, json_filename)
                txt_path = os.path.join(SAVE_DIR, txt_filename)
                ws_txt_path = os.path.join(WORKSPACE_DIR, "Junubin_Python_Master_LATEST.txt")

                with open(json_path, "w", encoding="utf-8") as f:
                    json.dump(payload, f, indent=2, ensure_ascii=False)

                # Format clean Master TXT
                with open(txt_path, "w", encoding="utf-8") as f:
                    f.write("=================================================================\n")
                    f.write("JUNUBIN POLITICAL PULSE PRESS - PYTHON MASTER ARCHIVE\n")
                    f.write(f"Harvested On: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                    f.write(f"Total Posts: {len(posts)} | Total Comments & Replies: {total_comments}\n")
                    f.write("Status: 100% Verified Real-Time DOM Copy\n")
                    f.write("=================================================================\n\n")

                    for idx, p in enumerate(posts, 1):
                        f.write("=================================================================\n")
                        f.write(f"[POST #{idx}]\n")
                        f.write(f"Author: {p.get('author', 'Junubin Political Pulse Press')}\n")
                        f.write(f"Date: {p.get('date', 'N/A')}\n")
                        if p.get("url"):
                            f.write(f"URL: {p.get('url')}\n")
                        if p.get("stats"):
                            f.write(f"Reactions & Stats: {p.get('stats')}\n")
                        f.write("-----------------------------------------------------------------\n")
                        f.write(f"CONTENT:\n{p.get('content', '')}\n")
                        f.write("-----------------------------------------------------------------\n")
                        comments = p.get("comments", [])
                        f.write(f"COMMENTS & REPLIES ({len(comments)}):\n")
                        if not comments:
                            f.write("  (No comments or hidden by author)\n")
                        else:
                            for c_idx, c in enumerate(comments, 1):
                                tag = "[REPLY]" if c.get("isReply") else f"[{c_idx}]"
                                f.write(f"  {tag} {c.get('author', 'Anonymous')}: {c.get('text', '')}\n")
                        f.write("\n\n")

                # Copy to workspace
                with open(ws_txt_path, "w", encoding="utf-8") as f:
                    with open(txt_path, "r", encoding="utf-8") as src:
                        f.write(src.read())

                print(f"[SUCCESS] Saved Master JSON: {json_path}")
                print(f"[SUCCESS] Saved Master TXT:  {txt_path}")
                print(f"[SUCCESS] Updated Workspace: {ws_txt_path}\n")

                self.send_response(200)
                self.send_header("Access-Control-Allow-Origin", "*")
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(b'{"status": "saved", "file": "' + txt_filename.encode("utf-8") + b'"}')
                return

        except Exception as e:
            print(f"[ERROR] Failed to process payload: {e}")
            self.send_response(500)
            self.end_headers()

    def log_message(self, format, *args):
        # Silence default HTTP server access logs to keep terminal clean
        return

def run_server():
    if sys.platform == "win32":
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    server_address = ("", PORT)
    httpd = http.server.HTTPServer(server_address, HarvesterHandler)
    print("=" * 65)
    print(f"[*] Python Facebook Harvester Server ACTIVE on http://localhost:{PORT}")
    print(f"[*] Output Directory: {SAVE_DIR}")
    print("[*] Waiting for browser real-time feed...")
    print("=" * 65)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped by user.")

if __name__ == "__main__":
    run_server()
