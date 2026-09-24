// Bộ chạy thử: mở 1 trang, thực hiện chuỗi bước (JS), chụp ảnh từng bước, gom lỗi console.
// node --experimental-websocket run.mjs <file.html> <steps.json> <outdir> [w] [h] [mobile]
import { spawn } from 'node:child_process';
import { writeFileSync, readFileSync, mkdtempSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [file, stepsFile, outdir, w = '1440', h = '900', mobile = '0'] = process.argv.slice(2);
const steps = JSON.parse(readFileSync(stepsFile, 'utf8'));
mkdirSync(outdir, { recursive: true });
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const port = 9300 + Math.floor(Math.random() * 600);
const prof = mkdtempSync(join(tmpdir(), 'cdp-'));
const proc = spawn(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--no-first-run', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let target;
for (let i = 0; i < 60 && !target; i++) { try { const l = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); target = l.find(t => t.type === 'page'); } catch {} await sleep(150); }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let id = 0; const pend = new Map(); let errors = [];
ws.addEventListener('message', ev => {
  const m = JSON.parse(ev.data);
  if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); }
  if (m.method === 'Runtime.exceptionThrown') errors.push('EXC ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text).split('\n').slice(0, 3).join(' | '));
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push('ERR ' + m.params.args.map(a => a.value ?? a.description).join(' ').slice(0, 300));
  if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error' && !/favicon/.test(m.params.entry.url || '')) errors.push('LOG ' + m.params.entry.text + ' ' + (m.params.entry.url || ''));
});
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: +w, height: +h, deviceScaleFactor: 1, mobile: mobile === '1' });
await send('Page.navigate', { url: pathToFileURL(resolve(file)).href + (steps.query || '') });
await sleep(2200);
const report = [{ step: 'load', errors: errors.slice(), check: null, dims: null }];
for (const s of steps.steps) {
  errors = [];
  if (s.js) { const r = await send('Runtime.evaluate', { expression: s.js, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errors.push('STEP ' + (r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text).split('\n')[0]); }
  await sleep(s.wait || 450);
  let val = null;
  if (s.check) { const r = await send('Runtime.evaluate', { expression: s.check, returnByValue: true }); val = r.result?.result?.value; }
  const dims = (await send('Runtime.evaluate', { expression: 'JSON.stringify({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth})', returnByValue: true })).result.result.value;
  if (s.shot) {
    const opt = { format: s.jpeg ? 'jpeg' : 'png' };
    if (s.jpeg) opt.quality = 82;
    if (s.clip) { const r = await send('Runtime.evaluate', { expression: `JSON.stringify((function(){var b=document.querySelector(${JSON.stringify(s.clip)}).getBoundingClientRect();return {x:b.left,y:b.top,width:b.width,height:b.height}})())`, returnByValue: true }); opt.clip = Object.assign(JSON.parse(r.result.result.value), { scale: s.scale || 1 }); }
    const sh = await send('Page.captureScreenshot', opt);
    writeFileSync(join(outdir, s.shot + (s.jpeg ? '.jpg' : '.png')), Buffer.from(sh.result.data, 'base64'));
  }
  report.push({ step: s.name, errors, check: val, dims: JSON.parse(dims) });
}
console.log(JSON.stringify(report, null, 1));
ws.close(); proc.kill(); process.exit(0);
