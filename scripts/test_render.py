import asyncio
import http.server
import socketserver
import threading
from pyppeteer import launch

PORT = 8002

def start_server():
    Handler = http.server.SimpleHTTPRequestHandler
    # serve from workspace root
    httpd = socketserver.TCPServer(("", PORT), Handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd

async def main():
    server = start_server()
    browser = await launch(args=['--no-sandbox'], headless=True)
    page = await browser.newPage()
    page.on('console', lambda msg: print('PAGE LOG:', msg.text))
    try:
        url = f'http://localhost:{PORT}'
        await page.goto(url, waitUntil='networkidle2', timeout=60000)
        print('title', await page.title())
        await page.screenshot({'path':'preview.png','fullPage':True})
        print('screenshot saved')
    except Exception as e:
        print('error visiting page', e)
    await browser.close()
    server.shutdown()

if __name__ == '__main__':
    asyncio.get_event_loop().run_until_complete(main())
