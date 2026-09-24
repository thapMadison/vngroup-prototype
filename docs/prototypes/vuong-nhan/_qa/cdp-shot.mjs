// Chụp màn hình + bắt lỗi console qua Chrome DevTools Protocol (Edge headless).
// Dùng: node --experimental-websocket cdp-shot.mjs <url> <out.png> <width> <height> [fullPage=1] [mobile=0] [script]
// script (tuỳ chọn): đoạn JS chạy trước khi chụp, ví dụ để bấm chuyển màn.
import { spawn } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [url, out, w = '1440', h = '900', full = '1', mobile = '0', script = ''] = process.argv.slice(2);
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const port = 9300 + Math.floor(Math.random() * 500);
const prof = mkdtempSync(join(tmpdir(), 'cdp-'));
const proc = spawn(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--no-first-run', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));

let target;
for (let i = 0; i < 50; i++) {
  try { const r = await fetch(`http://127.0.0.1:${port}/json`); const l = await r.json(); target = l.find(t => t.type === 'page'); if (target) break; } catch {}
  await sleep(150);
}
if (!target) { console.error('Không kết nối được trình duyệt'); proc.kill(); process.exit(2); }

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let id = 0; const pend = new Map(); const errors = [];
ws.addEventListener('message', ev => {
  const m = JSON.parse(ev.data);
  if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); }
  if (m.method === 'Runtime.exceptionThrown') errors.push('EXCEPTION ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push('console.error ' + m.params.args.map(a => a.value ?? a.description).join(' '));
  if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') errors.push('log ' + m.params.entry.text + ' ' + (m.params.entry.url || ''));
});
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: +w, height: +h, deviceScaleFactor: 1, mobile: mobile === '1' });
await send('Page.navigate', { url });
await sleep(2500);
if (script) { await send('Runtime.evaluate', { expression: script, awaitPromise: true }); await sleep(700); }
const m = await send('Runtime.evaluate', { expression: 'JSON.stringify({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,sh:document.documentElement.scrollHeight})', returnByValue: true });
const dims = JSON.parse(m.result.result.value);
let clipH = full === '1' ? Math.min(dims.sh, 12000) : +h;
if (full === '1') await send('Emulation.setDeviceMetricsOverride', { width: +w, height: clipH, deviceScaleFactor: 1, mobile: mobile === '1' });
await sleep(400);
const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
writeFileSync(out, Buffer.from(shot.result.data, 'base64'));
console.log(JSON.stringify({ out, overflowX: dims.sw > dims.cw, scrollWidth: dims.sw, clientWidth: dims.cw, height: dims.sh, errors }));
ws.close(); proc.kill();
process.exit(0);
