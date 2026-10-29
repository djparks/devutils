/* ---------------- sidebar ---------------- */
const TOOLS = [
  ['🕘','Unix Time Converter'],
  ['64','Base64 String Encode/Decode'],
  ['✳️','JWT Debugger'], ['%','URL Encode/Decode'],
  ['⇄','YAML to JSON'], ['⇄','JSON to YAML'], ['⇄','YAML to Property'], ['⇄','Property to YAML'], ['01','Number Base Converter'],
  ['📅','Date Calculator'], ['#','Hash Generator']
];

let currentTool = 'Unix Time Converter';
const nav = document.getElementById('nav');
const tabPill = document.getElementById('tabPill');

function renderNav(filter = '') {
  const q = filter.trim().toLowerCase();
  nav.innerHTML = '';
  for (const [ico, name] of TOOLS) {
    if (q && !name.toLowerCase().includes(q)) continue;
    const el = document.createElement('div');
    el.className = 'nav-item' + (name === currentTool ? ' active' : '');
    el.innerHTML = `<span class="ico"></span><span class="nm"></span>`;
    el.querySelector('.ico').textContent = ico;
    el.querySelector('.nm').textContent = name;
    el.onclick = () => selectTool(name);
    nav.appendChild(el);
  }
}

function selectTool(name) {
  currentTool = name;
  tabPill.textContent = name;
  document.title = 'DevUtils — ' + name;
  renderNav(document.getElementById('navSearch').value);

  const unixToolEl = document.getElementById('unixTool');
  const jwtToolEl = document.getElementById('jwtTool');
  const urlToolEl = document.getElementById('urlTool');
  const b64ToolEl = document.getElementById('b64Tool');
  const yamlToolEl = document.getElementById('yamlTool');
  const propToolEl = document.getElementById('propTool');
  const nbToolEl = document.getElementById('nbTool');
  const dcToolEl = document.getElementById('dcTool');
  const hgToolEl = document.getElementById('hgTool');
  const otherToolEl = document.getElementById('otherTool');

  unixToolEl.style.display = 'none';
  jwtToolEl.style.display = 'none';
  urlToolEl.style.display = 'none';
  b64ToolEl.style.display = 'none';
  yamlToolEl.style.display = 'none';
  propToolEl.style.display = 'none';
  nbToolEl.style.display = 'none';
  dcToolEl.style.display = 'none';
  hgToolEl.style.display = 'none';
  otherToolEl.style.display = 'none';

  if (name === 'Unix Time Converter') {
    unixToolEl.style.display = 'flex';
    updateUnixTime();
  } else if (name === 'JWT Debugger') {
    jwtToolEl.style.display = 'flex';
    runJwt();
  } else if (name === 'URL Encode/Decode') {
    urlToolEl.style.display = 'flex';
    runUrl();
  } else if (name === 'Base64 String Encode/Decode') {
    b64ToolEl.style.display = 'flex';
    runB64();
  } else if (name === 'YAML to JSON' || name === 'JSON to YAML') {
    yamlToolEl.style.display = 'flex';
    yamlDirectionSel.value = name === 'YAML to JSON' ? 'y2j' : 'j2y';
    runYaml();
  } else if (name === 'YAML to Property' || name === 'Property to YAML') {
    propToolEl.style.display = 'flex';
    propDirectionSel.value = name === 'YAML to Property' ? 'y2p' : 'p2y';
    runProp();
  } else if (name === 'Number Base Converter') {
    nbToolEl.style.display = 'flex';
  } else if (name === 'Date Calculator') {
    dcToolEl.style.display = 'flex';
    runDc();
  } else if (name === 'Hash Generator') {
    hgToolEl.style.display = 'flex';
    runHg();
  } else {
    otherToolEl.style.display = 'flex';
    document.getElementById('otherToolName').textContent = name;
  }
}

renderNav();
const navSearchInput = document.getElementById('navSearch');
navSearchInput.addEventListener('input', e => renderNav(e.target.value));
document.getElementById('sidebarToggle').addEventListener('click', () => {
  const s = document.getElementById('sidebar');
  s.style.display = s.style.display === 'none' ? '' : 'none';
});

window.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === '/') {
    e.preventDefault();
    navSearchInput.focus();
    navSearchInput.select();
  }
});

/* ---------------- helpers ---------------- */
const esc = s => s.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const pad = n => String(n).padStart(2, '0');

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

async function copyText(text, btn) {
  try { await navigator.clipboard.writeText(text); } catch { return; }
  const orig = btn.innerHTML;
  btn.innerHTML = '<span style="color:var(--green);font-size:12px;font-weight:600">✓</span>';
  setTimeout(() => btn.innerHTML = orig, 1000);
}

document.querySelectorAll('.btn-copy').forEach(btn => {
  btn.onclick = () => {
    const targetId = btn.dataset.copyTarget;
    const input = document.getElementById(targetId);
    if (input) copyText(input.value, btn);
  };
});

/* ---------------- Unix Time Converter ---------------- */
const unixInput = document.getElementById('unixInput');
const unixFormatSelect = document.getElementById('unixFormatSelect');
const btnNow = document.getElementById('btnNow');
const btnClearUnix = document.getElementById('btnClearUnix');

const outLocal = document.getElementById('outLocal');
const outUtc = document.getElementById('outUtc');
const outRelative = document.getElementById('outRelative');
const outUnix = document.getElementById('outUnix');
const outDayOfYear = document.getElementById('outDayOfYear');
const outWeekOfYear = document.getElementById('outWeekOfYear');
const outIsLeapYear = document.getElementById('outIsLeapYear');
const outOther1 = document.getElementById('outOther1');
const outOther2 = document.getElementById('outOther2');
const outOther3 = document.getElementById('outOther3');
const outOther4 = document.getElementById('outOther4');
const outOther5 = document.getElementById('outOther5');
const outOther6 = document.getElementById('outOther6');
const outOther7 = document.getElementById('outOther7');
const outOther8 = document.getElementById('outOther8');

function getISOWeek(date) {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target) / 604800000);
}

function formatRelativeTime(date) {
  const diffSec = Math.round((Date.now() - date.getTime()) / 1000);
  if (Math.abs(diffSec) < 5) return 'just now';
  if (diffSec > 0) {
    if (diffSec < 60) return `${diffSec}sec ago`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}min ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}hour ago`;
    if (diffSec < 30 * 86400) return `${Math.floor(diffSec / 86400)}days ago`;
    if (diffSec < 365 * 86400) return `${Math.floor(diffSec / (30 * 86400))}months ago`;
    const yrs = Math.floor(diffSec / (365 * 86400));
    return `${yrs}year${yrs > 1 ? 's' : ''} ago`;
  } else {
    const sec = Math.abs(diffSec);
    if (sec < 60) return `in ${sec}sec`;
    if (sec < 3600) return `in ${Math.floor(sec / 60)}min`;
    if (sec < 86400) return `in ${Math.floor(sec / 3600)}hour`;
    if (sec < 30 * 86400) return `in ${Math.floor(sec / 86400)}days`;
    if (sec < 365 * 86400) return `in ${Math.floor(sec / (30 * 86400))}months`;
    const yrs = Math.floor(sec / (365 * 86400));
    return `in ${yrs}year${yrs > 1 ? 's' : ''}`;
  }
}

function parseDateInput(raw, formatMode) {
  if (!raw || !raw.trim()) return null;
  const str = raw.trim();

  // 1. ISO format with T or Z / timezone
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?$/i.test(str)) {
    const t = Date.parse(str);
    if (!isNaN(t)) return new Date(t);
  }

  // 2. YYYY/MM/DD or YYYY-MM-DD or YYYY.MM.DD with optional time
  const ymdMatch = str.match(/^(\d{4})[\/\-. ](\d{1,2})[\/\-. ](\d{1,2})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (ymdMatch) {
    const [_, y, m, d, h, min, s] = ymdMatch;
    const date = new Date(+y, +m - 1, +d, h ? +h : 0, min ? +min : 0, s ? +s : 0);
    if (!isNaN(date.getTime())) return date;
  }

  // 3. MM/DD/YYYY with optional time
  const mdyMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (mdyMatch) {
    const [_, m, d, y, h, min, s] = mdyMatch;
    const date = new Date(+y, +m - 1, +d, h ? +h : 0, min ? +min : 0, s ? +s : 0);
    if (!isNaN(date.getTime())) return date;
  }

  // 4. DD-MM-YYYY or DD.MM.YYYY with optional time
  const dmyMatch = str.match(/^(\d{1,2})[\-.](\d{1,2})[\-.](\d{4})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (dmyMatch) {
    const [_, d, m, y, h, min, s] = dmyMatch;
    const date = new Date(+y, +m - 1, +d, h ? +h : 0, min ? +min : 0, s ? +s : 0);
    if (!isNaN(date.getTime())) return date;
  }

  // 5. Text date with month names
  if (/[a-zA-Z]/.test(str) && !/\bnow\b/i.test(str)) {
    const t = Date.parse(str);
    if (!isNaN(t)) return new Date(t);
  }

  // 6. Number or Math expression (+ - * /)
  let mathStr = str.replace(/\bnow\b/gi, Math.floor(Date.now() / 1000));
  if (/^[\d\s+\-*/.()]+$/.test(mathStr)) {
    try {
      const num = Function('"use strict"; return (' + mathStr + ')')();
      if (typeof num === 'number' && !isNaN(num) && isFinite(num)) {
        if (formatMode === 'ms') {
          return new Date(num);
        } else if (formatMode === 's' && num < 1e11) {
          return new Date(num * 1000);
        } else {
          // Auto detect
          if (num > 1e16) return new Date(Math.floor(num / 1e6));
          if (num > 1e13) return new Date(Math.floor(num / 1e3));
          if (num > 3e10) return new Date(num);
          return new Date(num * 1000);
        }
      }
    } catch (e) {}
  }

  const fallback = Date.parse(str);
  if (!isNaN(fallback)) return new Date(fallback);

  return null;
}

function clearUnixOutputs() {
  outLocal.value = '';
  outUtc.value = '';
  outRelative.value = '';
  outUnix.value = '';
  outDayOfYear.value = '';
  outWeekOfYear.value = '';
  outIsLeapYear.value = '';
  outOther1.value = '';
  outOther2.value = '';
  outOther3.value = '';
  outOther4.value = '';
  outOther5.value = '';
  outOther6.value = '';
  outOther7.value = '';
  outOther8.value = '';
}

function updateUnixTime() {
  const raw = unixInput.value;
  if (!raw || !raw.trim()) {
    clearUnixOutputs();
    return;
  }

  const d = parseDateInput(raw, unixFormatSelect.value);
  if (!d || isNaN(d.getTime())) {
    clearUnixOutputs();
    outLocal.value = 'Invalid Date';
    return;
  }

  // Local
  const off = -d.getTimezoneOffset();
  const sign = off >= 0 ? '+' : '-';
  const tz = sign + pad(Math.floor(Math.abs(off)/60)) + pad(Math.abs(off)%60);
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  outLocal.value = `${DAYS[d.getDay()]} ${MONTHS[d.getMonth()]} ${pad(d.getDate())} ${time} ${tz} ${d.getFullYear()}`;

  // UTC
  outUtc.value = `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}Z`;

  // Relative
  outRelative.value = formatRelativeTime(d);

  // Unix time
  outUnix.value = Math.floor(d.getTime() / 1000);

  // Day of year
  const start = new Date(d.getFullYear(), 0, 1);
  const diff = d - start + (start.getTimezoneOffset() - d.getTimezoneOffset()) * 60000;
  outDayOfYear.value = Math.floor(diff / 86400000) + 1;

  // Week of year
  outWeekOfYear.value = getISOWeek(d);

  // Is leap year?
  const y = d.getFullYear();
  const isLeap = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
  outIsLeapYear.value = isLeap ? 'true' : 'false';

  // Other formats (local)
  outOther1.value = `${DAYS_FULL[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  outOther2.value = `${pad(d.getMonth()+1)}/${pad(d.getDate())}/${d.getFullYear()}`;
  outOther3.value = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  outOther4.value = `${pad(d.getMonth()+1)}-${pad(d.getDate())}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;

  let h12 = d.getHours() % 12;
  if (!h12) h12 = 12;
  const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
  outOther5.value = `${MONTHS[d.getMonth()]} ${d.getDate()}, ${h12}:${pad(d.getMinutes())} ${ampm}`;

  outOther6.value = `${MONTHS_FULL[d.getMonth()]} ${d.getFullYear()}`;
  outOther7.value = `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  outOther8.value = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${String(d.getMilliseconds()).padStart(3,'0')}`;
}

unixInput.addEventListener('input', updateUnixTime);
unixFormatSelect.addEventListener('change', updateUnixTime);
btnNow.onclick = () => {
  unixInput.value = Math.floor(Date.now() / 1000);
  updateUnixTime();
  unixInput.focus();
};
btnClearUnix.onclick = () => {
  unixInput.value = '';
  updateUnixTime();
  unixInput.focus();
};

/* ---------------- JWT Debugger ---------------- */
function b64urlToBytes(str) {
  let s = str.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
const b64urlToText = s => new TextDecoder().decode(b64urlToBytes(s));
const bytesToB64url = bytes =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

function highlightJSON(text) {
  return esc(text).replace(
    /("(?:\\.|[^"\\])*")(\s*:)?|\b(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b|\b(true|false|null)\b|([{}\[\],:])/g,
    (m, str, colon, num, lit, punct) => {
      if (str) return colon
        ? `<span class="j-key">${str}</span><span class="j-punct">${colon}</span>`
        : `<span class="j-str">${str}</span>`;
      if (num) return `<span class="j-num">${num}</span>`;
      if (lit) return `<span class="j-bool">${lit}</span>`;
      return `<span class="j-punct">${punct}</span>`;
    });
}

const ta = document.getElementById('token');
const hl = document.getElementById('highlight');
const verdict = document.getElementById('verdict');
const headerBox = document.getElementById('headerBox');
const payloadBox = document.getElementById('payloadBox');
const claimsMeta = document.getElementById('claimsMeta');
const algSel = document.getElementById('alg');
const secretInput = document.getElementById('secret');

function paintToken(v) {
  const parts = v.split('.');
  const cls = ['t-h', 't-p', 't-s'];
  let html = '';
  parts.forEach((p, i) => {
    if (i) html += `<span class="t-d">.</span>`;
    html += `<span class="${cls[i] || 't-d'}">${esc(p)}</span>`;
  });
  hl.innerHTML = html + '\n';
  hl.scrollTop = ta.scrollTop;
}

function prettyOrRaw(text) {
  try { return JSON.stringify(JSON.parse(text), null, 2); } catch { return text; }
}

function fmtTime(sec) {
  const d = new Date(sec * 1000);
  const off = -d.getTimezoneOffset();
  const sign = off >= 0 ? '+' : '-';
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T` +
         `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}` +
         `${sign}${pad(Math.floor(Math.abs(off)/60))}:${pad(Math.abs(off)%60)}`;
}

function setVerdict(state, text) {
  verdict.className = 'verdict' + (state === 'ok' ? '' : state === 'bad' ? ' bad' : ' idle');
  verdict.textContent = text;
}

let decoded = { header: null, payload: null };

async function runJwt() {
  const raw = ta.value.trim();
  paintToken(ta.value);

  if (!raw) {
    headerBox.innerHTML = ''; payloadBox.innerHTML = ''; claimsMeta.textContent = '';
    decoded = { header: null, payload: null };
    setVerdict('idle', 'Enter a JWT above');
    return;
  }

  const parts = raw.split('.');
  let headerText = '', payloadText = '', headerObj = null, payloadObj = null;

  try { headerText = prettyOrRaw(b64urlToText(parts[0] || '')); headerObj = JSON.parse(headerText); }
  catch { headerText = ''; }
  try { payloadText = prettyOrRaw(b64urlToText(parts[1] || '')); payloadObj = JSON.parse(payloadText); }
  catch { payloadText = ''; }

  headerBox.innerHTML = headerText
    ? highlightJSON(headerText) : '<span class="j-err">Invalid header segment</span>';
  payloadBox.innerHTML = payloadText
    ? highlightJSON(payloadText) : '<span class="j-err">Invalid payload segment</span>';
  decoded = { header: headerText, payload: payloadText };

  // claim timestamps
  const bits = [];
  if (payloadObj) {
    if (typeof payloadObj.iat === 'number') bits.push('Issued At: ' + fmtTime(payloadObj.iat));
    if (typeof payloadObj.nbf === 'number') bits.push('Not Before: ' + fmtTime(payloadObj.nbf));
    if (typeof payloadObj.exp === 'number') bits.push('Expires At: ' + fmtTime(payloadObj.exp));
  }
  claimsMeta.innerHTML = bits.length
    ? bits.map(esc).join('<br>') + ' <span style="opacity:.55">👁</span>' : '';

  // keep the alg picker in sync with the token header
  if (headerObj && typeof headerObj.alg === 'string') {
    const want = headerObj.alg.toUpperCase();
    if ([...algSel.options].some(o => o.value === want || o.text === want)) algSel.value = want;
  }
  const alg = algSel.value;
  document.getElementById('sigFn').textContent =
    alg.startsWith('HS') ? 'HMACSHA' + alg.slice(2) : alg;

  if (parts.length !== 3 || !parts[2]) { setVerdict('bad', '✕ Invalid JWT — expected three segments'); return; }
  if (!alg.startsWith('HS')) { setVerdict('idle', `Signature check for ${alg} is not supported`); return; }

  try {
    const key = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(secretInput.value),
      { name: 'HMAC', hash: 'SHA-' + alg.slice(2) }, false, ['sign']);
    const mac = new Uint8Array(await crypto.subtle.sign(
      'HMAC', key, new TextEncoder().encode(parts[0] + '.' + parts[1])));
    const ok = bytesToB64url(mac) === parts[2];
    setVerdict(ok ? 'ok' : 'bad', ok ? '✓ Signature Verified' : '✕ Invalid Signature');
  } catch (e) {
    setVerdict('bad', '✕ Could not verify: ' + e.message);
  }
}

ta.addEventListener('input', runJwt);
ta.addEventListener('scroll', () => { hl.scrollTop = ta.scrollTop; hl.scrollLeft = ta.scrollLeft; });
secretInput.addEventListener('input', runJwt);
algSel.addEventListener('change', runJwt);

/* ---------------- JWT toolbar actions ---------------- */
const SAMPLE = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.vqb33-7FqzFWPNlr0ElW1v2RjJRZBel3CdDHBWD7y_o';

document.getElementById('btnSample').onclick = () => { ta.value = SAMPLE; secretInput.value = 'your-secret'; runJwt(); };
document.getElementById('btnClear').onclick = () => { ta.value = ''; runJwt(); ta.focus(); };
document.getElementById('btnCopyToken').onclick = e => copyText(ta.value, e.currentTarget);
for (const b of document.querySelectorAll('[data-copy]'))
  b.onclick = e => copyText(decoded[b.dataset.copy] || '', e.currentTarget);

/* ---------------- URL Encode/Decode ---------------- */
const urlInput = document.getElementById('urlInput');
const urlOutput = document.getElementById('urlOutput');
const urlModeSel = document.getElementById('urlMode');
const urlStatus = document.getElementById('urlStatus');
const urlDir = () => document.querySelector('input[name="urlDir"]:checked').value;

const URL_SAMPLE = 'abc 0123 !@#$%^&*()|+?"<>\',.;:` {"store":{"book":[{"category":"reference", "sold": false,"author":"Nigel Rees","title":"Sayings of the Century","price":8.95},{"category":"fiction","author":"Evelyn Waugh","title":"Sword of Honour","price":12.99}],"bicycle":{"color":"red","price":19.95}}}';

// RFC 3986: only unreserved characters (A-Z a-z 0-9 - . _ ~) stay literal
const rfc3986Encode = s => encodeURIComponent(s).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());

function urlTransform(text, dir, mode) {
  if (dir === 'encode') {
    if (mode === 'form') return rfc3986Encode(text).replace(/%20/g, '+');
    if (mode === 'uri') return encodeURI(text).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
    return rfc3986Encode(text);
  }
  if (mode === 'form') text = text.replace(/\+/g, ' ');
  return mode === 'uri' ? decodeURI(text) : decodeURIComponent(text);
}

function runUrl() {
  urlInput.classList.remove('err');
  urlStatus.className = 'url-status';
  urlStatus.textContent = '';
  try {
    urlOutput.value = urlTransform(urlInput.value, urlDir(), urlModeSel.value);
  } catch (e) {
    urlOutput.value = '';
    urlInput.classList.add('err');
    urlStatus.className = 'url-status bad';
    urlStatus.textContent = 'Invalid percent-encoded input (' + e.message + ')';
  }
}

urlInput.addEventListener('input', runUrl);
urlModeSel.addEventListener('change', runUrl);
for (const r of document.querySelectorAll('input[name="urlDir"]')) r.addEventListener('change', runUrl);
document.getElementById('urlSample').onclick = () => {
  urlInput.value = urlDir() === 'decode' ? urlTransform(URL_SAMPLE, 'encode', urlModeSel.value) : URL_SAMPLE;
  runUrl();
};
document.getElementById('urlClear').onclick = () => { urlInput.value = ''; runUrl(); urlInput.focus(); };
document.getElementById('urlCopy').onclick = e => copyText(urlOutput.value, e.currentTarget);
document.getElementById('urlUseAsInput').onclick = () => {
  urlInput.value = urlOutput.value;
  document.querySelector('input[name="urlDir"]:not(:checked)').checked = true;
  runUrl();
};

/* ---------------- Base64 Encode/Decode ---------------- */
const b64Input = document.getElementById('b64Input');
const b64Output = document.getElementById('b64Output');
const b64Status = document.getElementById('b64Status');
const b64Dir = () => document.querySelector('input[name="b64Dir"]:checked').value;

const B64_SAMPLE = '{"store":{"book":[{"category":"reference", "sold": false,"author":"Nigel Rees","title":"Sayings of the Century","price":8.95},{"category":"fiction","author":"Evelyn Waugh","title":"Sword of Honour","price":12.99},{"category":"fiction","author":"J. R. R. Tolkien","title":"The Lord of the Rings","act": null,"isbn":"0-395-19395-8","price":22.99}],"bicycle":{"color":"red","price":19.95}}}';

function runB64() {
  b64Input.classList.remove('err');
  b64Status.className = 'url-status';
  b64Status.textContent = '';
  try {
    if (b64Dir() === 'encode') {
      b64Output.value = btoa(unescape(encodeURIComponent(b64Input.value)));
    } else {
      b64Output.value = decodeURIComponent(escape(atob(b64Input.value.replace(/\s/g, ''))));
    }
  } catch (e) {
    b64Output.value = '';
    b64Input.classList.add('err');
    b64Status.className = 'url-status bad';
    b64Status.textContent = 'Invalid Base64 input (' + e.message + ')';
  }
}

b64Input.addEventListener('input', runB64);
for (const r of document.querySelectorAll('input[name="b64Dir"]')) r.addEventListener('change', runB64);
document.getElementById('b64Sample').onclick = () => {
  b64Input.value = b64Dir() === 'decode' ? btoa(unescape(encodeURIComponent(B64_SAMPLE))) : B64_SAMPLE;
  runB64();
};
document.getElementById('b64Clear').onclick = () => { b64Input.value = ''; runB64(); b64Input.focus(); };
document.getElementById('b64Copy').onclick = e => copyText(b64Output.value, e.currentTarget);
document.getElementById('b64UseAsInput').onclick = () => {
  b64Input.value = b64Output.value;
  document.querySelector('input[name="b64Dir"]:not(:checked)').checked = true;
  runB64();
};

/* ---------------- YAML <-> JSON ---------------- */
function yamlResolvePlain(s) {
  if (s === '' || s === '~' || /^(null|Null|NULL)$/.test(s)) return null;
  if (/^(true|True|TRUE)$/.test(s)) return true;
  if (/^(false|False|FALSE)$/.test(s)) return false;
  let n;
  if (/^[-+]?\d+$/.test(s)) { n = Number(s); return Number.isSafeInteger(n) ? n : s; }
  if (/^0x[0-9a-fA-F]+$/.test(s)) { n = parseInt(s.slice(2), 16); return Number.isSafeInteger(n) ? n : s; }
  if (/^0o[0-7]+$/.test(s)) { n = parseInt(s.slice(2), 8); return Number.isSafeInteger(n) ? n : s; }
  if (/^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(s)) return Number(s);
  return s;
}

// Parses a quoted scalar starting at text[pos]; returns {value, end} or null when the closing quote is missing.
function yamlParseQuoted(text, pos) {
  const q = text[pos];
  let cur = '', i = pos + 1;
  const ESC = {0:'\0',a:'\x07',b:'\b',t:'\t','\t':'\t',n:'\n',v:'\v',f:'\f',r:'\r',e:'\x1b',' ':' ','"':'"','/':'/','\\':'\\',N:'\u0085',_:'\u00a0',L:'\u2028',P:'\u2029'};
  let out = '';
  for (; i < text.length; i++) {
    const c = text[i];
    if (q === "'") {
      if (c === "'") {
        if (text[i + 1] === "'") { cur += "'"; i++; continue; }
        out += cur; return { value: yamlFoldQuoted(out), end: i + 1 };
      }
      cur += c;
    } else {
      if (c === '"') { out += cur; return { value: yamlFoldQuoted(out), end: i + 1 }; }
      if (c === '\\') {
        const d = text[++i];
        if (d === undefined) return null;
        if (d === '\n') { // escaped line break: join lines, drop leading whitespace of next line
          cur += '\u0001'; while (text[i + 1] === ' ' || text[i + 1] === '\t') i++;
        } else if (d === 'x' || d === 'u' || d === 'U') {
          const len = d === 'x' ? 2 : d === 'u' ? 4 : 8;
          const hex = text.slice(i + 1, i + 1 + len);
          if (!new RegExp('^[0-9a-fA-F]{' + len + '}$').test(hex)) throw new Error('Invalid escape sequence \\' + d + hex);
          const ch = String.fromCodePoint(parseInt(hex, 16));
          cur += '\u0002' + (ch === '\n' ? '\u0003' : ch) + '\u0002'; i += len;
        } else if (d in ESC) {
          cur += '\u0002' + (ESC[d] === '\n' ? '\u0003' : ESC[d]) + '\u0002';
        } else throw new Error('Unknown escape sequence \\' + d);
      } else cur += c;
    }
  }
  return null;
}

// Folds line breaks of a multi-line quoted scalar (\u0002 wraps escaped chars so they are never trimmed)
function yamlFoldQuoted(s) {
  const done = r => r.replace(/[\u0002]/g, '').replace(/\u0003/g, '\n');
  if (s.indexOf('\n') === -1 && s.indexOf('\u0001') === -1) return done(s);
  const lines = s.split('\n');
  let res = '';
  for (let k = 0; k < lines.length; k++) {
    let l = lines[k];
    if (k > 0) l = l.replace(/^[ \t]+/, '');
    if (k < lines.length - 1) l = l.replace(/[ \t]+$/, '');
    if (k === 0) { res = l; continue; }
    if (l === '') { res += '\n'; continue; }
    const prev = lines[k - 1].trim();
    res += (prev === '' ? '' : ' ') + l;
  }
  return done(res.replace(/ ?\u0001/g, ''));
}

function yamlStripComment(s) {
  let inS = false, inD = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i], p = i ? s[i - 1] : ' ';
    if (inD) { if (c === '\\') i++; else if (c === '"') inD = false; continue; }
    if (inS) { if (c === "'") inS = false; continue; }
    if (c === '"' && /[\s\[{,:]/.test(p)) inD = true;
    else if (c === "'" && /[\s\[{,:]/.test(p)) inS = true;
    else if (c === '#' && /\s/.test(p)) return s.slice(0, i).trimEnd();
  }
  return s.trimEnd();
}

// Index of the key/value separating colon of a block-mapping line, or -1
function yamlFindColon(s) {
  if (s[0] === '"' || s[0] === "'") {
    let r; try { r = yamlParseQuoted(s, 0); } catch { return -1; }
    if (!r) return -1;
    let j = r.end;
    while (s[j] === ' ' || s[j] === '\t') j++;
    return s[j] === ':' && (j + 1 === s.length || /\s/.test(s[j + 1])) ? j : -1;
  }
  if (s[0] === '[' || s[0] === '{' || s[0] === '|' || s[0] === '>' || s[0] === '*' && !/\s:/.test(s)) return -1;
  for (let i = 0; i < s.length; i++)
    if (s[i] === ':' && (i + 1 === s.length || /\s/.test(s[i + 1]))) return i;
  return -1;
}

function yamlParseFlow(text, anchors) {
  let p = 0;
  const err = m => { throw new Error(m + ' in flow collection'); };
  const ws = () => { while (p < text.length && /[\s]/.test(text[p])) p++; };
  function scalar(inKey) {
    ws();
    const c = text[p];
    if (c === '"' || c === "'") {
      const r = yamlParseQuoted(text, p);
      if (!r) err('Unterminated string');
      p = r.end; return { v: r.value, quoted: true };
    }
    const start = p;
    while (p < text.length) {
      const d = text[p];
      if (',[]{}'.indexOf(d) !== -1) break;
      if (d === ':' && (p + 1 >= text.length || /[\s,\[\]{}]/.test(text[p + 1]))) break;
      p++;
    }
    const raw = text.slice(start, p).trim();
    if (raw[0] === '*') {
      const name = raw.slice(1);
      if (!(name in anchors)) throw new Error('Unknown alias *' + name);
      return { v: anchors[name], quoted: true };
    }
    return { v: yamlResolvePlain(raw), quoted: false, raw };
  }
  function value() {
    ws();
    if (text[p] === '[') {
      p++; const arr = [];
      for (;;) {
        ws();
        if (text[p] === ']') { p++; return arr; }
        if (p >= text.length) err('Missing "]"');
        let item = value();
        ws();
        if (text[p] === ':') { // single pair inside a sequence
          p++; const o = Object.create(null); o[String(item)] = value(); item = o; ws();
        }
        arr.push(item);
        if (text[p] === ',') p++;
        else if (text[p] !== ']') err('Expected "," or "]"');
      }
    }
    if (text[p] === '{') {
      p++; const obj = Object.create(null);
      for (;;) {
        ws();
        if (text[p] === '}') { p++; return obj; }
        if (p >= text.length) err('Missing "}"');
        const k = scalar(true); ws();
        let v = null;
        if (text[p] === ':') { p++; ws(); v = (text[p] === ',' || text[p] === '}') ? null : value(); }
        obj[String(k.v)] = v; ws();
        if (text[p] === ',') p++;
        else if (text[p] !== '}') err('Expected "," or "}"');
      }
    }
    const s = scalar(false);
    return s.quoted ? s.v : s.v;
  }
  const v = value();
  ws();
  if (p < text.length) err('Unexpected "' + text[p] + '"');
  return v;
}

function yamlParseDocument(text) {
  const lines = text.split('\n');
  const anchors = Object.create(null);
  let i = 0;
  const lineNo = () => 'line ' + (i + 1);
  const fail = m => { throw new Error(m + ' (' + lineNo() + ')'); };
  const indentOf = l => l.length - l.trimStart().length;
  const skipBlank = () => { while (i < lines.length && /^\s*(#.*)?$/.test(lines[i])) i++; };
  const isSeqLine = c => c === '-' || c.startsWith('- ') || c.startsWith('-\t');

  function parseBlock(indent) {
    skipBlank();
    if (i >= lines.length) return null;
    const line = lines[i];
    if (line.includes('\t') && /^\s*\t/.test(line)) fail('Tabs are not allowed for indentation');
    const content = yamlStripComment(line.trim());
    if (isSeqLine(content)) return parseSeq(indentOf(line));
    if (yamlFindColon(content) !== -1) return parseMap(indentOf(line));
    return parseValue(content, indent - 1);
  }

  function parseNested(parentInd, allowSameIndentSeq) {
    skipBlank();
    if (i >= lines.length) return null;
    const ind = indentOf(lines[i]);
    if (ind > parentInd) return parseBlock(ind);
    if (allowSameIndentSeq && ind === parentInd && isSeqLine(yamlStripComment(lines[i].trim()))) return parseSeq(ind);
    return null;
  }

  function parseSeq(ind) {
    const arr = [];
    for (;;) {
      skipBlank();
      if (i >= lines.length) break;
      const line = lines[i];
      const li = indentOf(line);
      const content = yamlStripComment(line.trim());
      if (li < ind) break;
      if (li > ind) fail('Bad indentation of a sequence entry');
      if (!isSeqLine(content)) break;
      const rest = content.slice(1);
      const restTrim = rest.trim();
      if (restTrim === '') { i++; arr.push(parseNested(ind, false)); continue; }
      const restIndent = li + 1 + (rest.length - rest.trimStart().length);
      lines[i] = ' '.repeat(restIndent) + line.trim().slice(1).trimStart();
      arr.push(parseBlock(restIndent));
    }
    return arr;
  }

  function parseMap(ind) {
    const obj = Object.create(null);
    const merges = [];
    for (;;) {
      skipBlank();
      if (i >= lines.length) break;
      const line = lines[i];
      const li = indentOf(line);
      if (li < ind) break;
      if (li > ind) fail('Bad indentation of a mapping entry');
      if (/^\s*\t/.test(line)) fail('Tabs are not allowed for indentation');
      const content = yamlStripComment(line.trim());
      const ci = yamlFindColon(content);
      if (ci === -1) { if (isSeqLine(content)) break; fail('Expected a "key: value" pair'); }
      let key;
      const kt = content.slice(0, ci).trim();
      if (kt[0] === '"' || kt[0] === "'") key = yamlParseQuoted(kt, 0).value;
      else if (kt[0] === '*') { key = anchors[kt.slice(1)]; if (key === undefined) fail('Unknown alias ' + kt); }
      else key = yamlResolvePlain(kt);
      key = String(key === null && kt !== 'null' && kt !== '~' && kt !== '' ? kt : key);
      const rest = content.slice(ci + 1).trim();
      let val;
      const m = rest.match(/^&([^\s,\[\]{}]+)\s*(.*)$/);
      if (m) {
        const inner = m[2];
        val = inner === '' ? (i++, parseNested(ind, true)) : parseValue(inner, ind);
        anchors[m[1]] = val;
      } else if (rest === '') { i++; val = parseNested(ind, true); }
      else val = parseValue(rest, ind);
      if (key === '<<' && kt === '<<') merges.push(val);
      else obj[key] = val;
    }
    for (const mv of merges)
      for (const src of Array.isArray(mv) ? mv : [mv])
        if (src && typeof src === 'object')
          for (const k of Object.keys(src)) if (!(k in obj)) obj[k] = src[k];
    return obj;
  }

  // Parses the scalar / flow value that starts on the current line (line i is consumed)
  function parseValue(rest, parentInd) {
    let anchor = null;
    const am = rest.match(/^&([^\s,\[\]{}]+)\s*(.*)$/);
    if (am) { anchor = am[1]; rest = am[2]; }
    rest = rest.replace(/^!\S*\s*/, ''); // ignore tags
    let v;
    if (rest === '') { i++; v = parseNested(parentInd, false); }
    else if (rest[0] === '|' || rest[0] === '>') { i++; v = parseBlockScalar(rest, parentInd); }
    else if (rest[0] === '"' || rest[0] === "'") {
      let text = rest, r = yamlParseQuoted(text, 0);
      while (!r && i + 1 < lines.length) { i++; text += '\n' + lines[i]; r = yamlParseQuoted(text, 0); }
      if (!r) fail('Unterminated quoted string');
      const trail = yamlStripComment(text.slice(r.end).trim());
      if (trail) fail('Unexpected text after quoted string');
      i++; v = r.value;
    } else if (rest[0] === '[' || rest[0] === '{') {
      let text = rest;
      const balanced = t => {
        let depth = 0, inS = false, inD = false;
        for (let k = 0; k < t.length; k++) {
          const c = t[k];
          if (inD) { if (c === '\\') k++; else if (c === '"') inD = false; continue; }
          if (inS) { if (c === "'") inS = false; continue; }
          if (c === '"') inD = true; else if (c === "'" && /[\s\[{,:]/.test(k ? t[k - 1] : ' ')) inS = true;
          else if (c === '[' || c === '{') depth++; else if (c === ']' || c === '}') depth--;
        }
        return depth <= 0;
      };
      while (!balanced(text) && i + 1 < lines.length) { i++; text += '\n' + yamlStripComment(lines[i]); }
      i++; v = yamlParseFlow(text, anchors);
    } else if (rest[0] === '*') {
      const name = rest.slice(1).trim();
      if (!(name in anchors)) fail('Unknown alias *' + name);
      i++; v = anchors[name];
    } else {
      let text = rest;
      if (yamlFindColon(rest) !== -1) fail('Mapping values are not allowed here');
      i++;
      for (;;) { // multi-line plain scalar
        let j = i;
        while (j < lines.length && lines[j].trim() === '') j++;
        if (j >= lines.length) break;
        const l = lines[j];
        if (indentOf(l) <= parentInd || /^\s*#/.test(l)) break;
        const cont = yamlStripComment(l.trim());
        if (yamlFindColon(cont) !== -1) { i = j; fail('Bad indentation of a mapping entry'); }
        text += (j - i > 0 ? '\n'.repeat(j - i) : ' ') + cont;
        i = j + 1;
      }
      v = yamlResolvePlain(text.replace(/ ?\n/g, m => m.trim() ? m : '\n'));
    }
    if (anchor) anchors[anchor] = v;
    return v;
  }

  function parseBlockScalar(header, parentInd) {
    const hm = header.match(/^([|>])([-+]?)(\d?)([-+]?)\s*(#.*)?$/);
    if (!hm) fail('Invalid block scalar header "' + header + '"');
    const style = hm[1], chomp = hm[2] || hm[4], explicit = hm[3] ? Number(hm[3]) : 0;
    let blockInd = -1;
    if (explicit) blockInd = Math.max(parentInd, 0) + explicit;
    else {
      let j = i;
      while (j < lines.length && lines[j].trim() === '') j++;
      if (j < lines.length && indentOf(lines[j]) > parentInd) blockInd = indentOf(lines[j]);
    }
    const body = [];
    if (blockInd >= 0)
      while (i < lines.length) {
        const l = lines[i];
        if (l.trim() === '') body.push(l.length > blockInd ? l.slice(blockInd) : '');
        else if (indentOf(l) >= blockInd) body.push(l.slice(blockInd));
        else break;
        i++;
      }
    let trailing = 0;
    while (body.length && body[body.length - 1] === '') { body.pop(); trailing++; }
    let text = '';
    if (style === '|') text = body.join('\n');
    else body.forEach((l, k) => {
      if (k === 0) { text = l; return; }
      const prev = body[k - 1];
      if (l === '') text += '\n';
      else if (prev === '') text += l;
      else if (/^[ \t]/.test(l) || /^[ \t]/.test(prev)) text += '\n' + l;
      else text += ' ' + l;
    });
    if (chomp === '-') return text;
    if (chomp === '+') return text + '\n'.repeat(body.length ? trailing + 1 : trailing);
    return body.length ? text + '\n' : '';
  }

  const result = parseBlock(0);
  skipBlank();
  if (i < lines.length) fail('Unexpected content');
  return result;
}

function yamlParse(src) {
  const docs = [];
  let cur = null;
  const push = () => { if (cur && cur.some(l => l.trim() && !/^\s*#/.test(l))) docs.push(cur.join('\n')); cur = null; };
  for (const raw of src.replace(/^\uFEFF/, '').split(/\r\n|\r|\n/)) {
    if (/^---(\s|$)/.test(raw)) {
      push(); cur = [];
      const after = yamlStripComment(raw.slice(3).trim());
      if (after) cur.push(after);
    } else if (/^\.\.\.(\s|$)/.test(raw)) { push(); }
    else if (cur === null && /^%/.test(raw)) continue;
    else (cur = cur || []).push(raw);
  }
  push();
  const vals = docs.map(yamlParseDocument);
  if (!vals.length) return null;
  return vals.length === 1 ? vals[0] : vals;
}

/* ----- dump ----- */
function yamlNeedsQuotes(s) {
  if (s === '') return true;
  if (yamlResolvePlain(s) !== s) return true;
  if (/^(y|n|yes|no|on|off|true|false|null|~)$/i.test(s)) return true;
  if (/^[-+]?\.?\d[\d_.,:]*([eE][-+]?\d+)?$/.test(s) || /^0[xob]/i.test(s) || /^[-+]?\.(inf|nan)$/i.test(s)) return true;
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return true;
  if (/^\s|\s$/.test(s)) return true;
  if (/^[\[\]{},&*!|>'"%@`#]/.test(s)) return true;
  if (/^[-?:](\s|$)/.test(s)) return true;
  if (/:(\s|$)|\s#/.test(s)) return true;
  if (/[\u0000-\u001f\u007f-\u009f\u2028\u2029\ufeff]/.test(s)) return true;
  return false;
}
const yamlStr = s => yamlNeedsQuotes(s) ? JSON.stringify(s) : s;
const yamlBlockable = s => s.includes('\n') && s.trim() !== '' && !/[\u0000-\u0009\u000b-\u001f\u007f-\u009f\u2028\u2029\ufeff]/.test(s) && !/^[ \n]/.test(s);

function yamlDump(v, step) {
  const pad = n => ' '.repeat(n);
  const inlineOf = x => {
    if (x === null || x === undefined) return 'null';
    if (typeof x === 'number') return isFinite(x) ? String(x) : 'null';
    if (typeof x === 'boolean') return String(x);
    if (typeof x === 'string') return yamlStr(x);
    if (Array.isArray(x)) return x.length ? null : '[]';
    return Object.keys(x).length ? null : '{}';
  };
  function put(prefix, x, col, out) {
    if (typeof x === 'string' && yamlBlockable(x)) {
      const m = x.match(/\n*$/)[0].length;
      const head = m === 0 ? '|-' : m === 1 ? '|' : '|+';
      out.push(pad(col) + prefix + ' ' + head);
      const body = m === 0 ? x : x.slice(0, x.length - m);
      for (const l of body.split('\n')) out.push(l === '' ? '' : pad(col + step) + l);
      for (let k = 1; k < m; k++) out.push('');
      return;
    }
    const il = inlineOf(x);
    if (il !== null) { out.push(pad(col) + prefix + ' ' + il); return; }
    if (prefix === '-') {
      const sub = [];
      coll(x, col + 2, sub);
      sub[0] = pad(col) + '- ' + sub[0].slice(col + 2);
      out.push(...sub);
    } else {
      out.push(pad(col) + prefix);
      coll(x, col + step, out);
    }
  }
  function coll(x, col, out) {
    if (Array.isArray(x)) for (const e of x) put('-', e, col, out);
    else for (const k of Object.keys(x)) put(yamlStr(k) + ':', x[k], col, out);
  }
  const il = inlineOf(v);
  if (il !== null) return il;
  const out = [];
  coll(v, 0, out);
  return out.join('\n');
}

/* ----- public helpers ----- */
function yamlToJson(text, indent) {
  const v = yamlParse(text);
  if (v === null && !/\S/.test(text.replace(/^\s*#.*$/gm, ''))) return '';
  return indent === 'min' ? JSON.stringify(v) : JSON.stringify(v, null, indent === 'tab' ? '\t' : Number(indent));
}
function jsonToYaml(text, indent) {
  if (!text.trim()) return '';
  return yamlDump(JSON.parse(text), indent === '4' ? 4 : 2);
}
function yamlLooksLikeJson(text) {
  const t = text.trim();
  if (t[0] !== '{' && t[0] !== '[') return false;
  try { JSON.parse(t); return true; } catch { return false; }
}

/* ----- YAML <-> JSON screen ----- */
const yamlInput = document.getElementById('yamlInput');
const yamlOutput = document.getElementById('yamlOutput');
const yamlDirectionSel = document.getElementById('yamlDirection');
const yamlIndentSel = document.getElementById('yamlIndent');
const yamlStatus = document.getElementById('yamlStatus');

const YAML_SAMPLE = `---
# Products purchased
- item    : Super Hoop
  quantity: 1
- item    : Basketball
  quantity: 4
- item    : Big Shoes
  quantity: 1
`;
const JSON_SAMPLE = '[{"item":"Super Hoop","quantity":1},{"item":"Basketball","quantity":4},{"item":"Big Shoes","quantity":1}]';

// Resolves the effective direction: 'y2j' or 'j2y'
function yamlDirection(text) {
  const d = yamlDirectionSel.value;
  return d !== 'auto' ? d : (yamlLooksLikeJson(text) ? 'j2y' : 'y2j');
}

function runYaml() {
  const text = yamlInput.value;
  const dir = yamlDirection(text);
  for (const o of yamlIndentSel.options) o.disabled = dir === 'j2y' && (o.value === 'tab' || o.value === 'min');
  yamlInput.classList.remove('err');
  yamlStatus.className = 'url-status';
  yamlStatus.textContent = '';
  try {
    yamlOutput.value = dir === 'y2j' ? yamlToJson(text, yamlIndentSel.value) : jsonToYaml(text, yamlIndentSel.value);
    if (yamlDirectionSel.value === 'auto' && text.trim())
      yamlStatus.textContent = 'Detected ' + (dir === 'y2j' ? 'YAML → JSON' : 'JSON → YAML');
  } catch (e) {
    yamlOutput.value = '';
    yamlInput.classList.add('err');
    yamlStatus.className = 'url-status bad';
    yamlStatus.textContent = (dir === 'y2j' ? 'Invalid YAML: ' : 'Invalid JSON: ') + e.message;
  }
}

yamlInput.addEventListener('input', runYaml);
yamlDirectionSel.addEventListener('change', runYaml);
yamlIndentSel.addEventListener('change', runYaml);
document.getElementById('yamlSample').onclick = () => {
  yamlInput.value = yamlDirectionSel.value === 'j2y' ? JSON_SAMPLE : YAML_SAMPLE;
  runYaml();
};
document.getElementById('yamlClear').onclick = () => { yamlInput.value = ''; runYaml(); yamlInput.focus(); };
document.getElementById('yamlCopy').onclick = e => copyText(yamlOutput.value, e.currentTarget);
document.getElementById('yamlUseAsInput').onclick = () => {
  const dir = yamlDirection(yamlInput.value);
  yamlInput.value = yamlOutput.value;
  if (yamlDirectionSel.value !== 'auto') yamlDirectionSel.value = dir === 'y2j' ? 'j2y' : 'y2j';
  runYaml();
};

/* ---------------- YAML <-> Properties ---------------- */
// Escapes a key or value for the Java .properties format
function propEscape(s, isKey, unicode) {
  let r = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '\\') r += '\\\\';
    else if (c === '\n') r += '\\n';
    else if (c === '\r') r += '\\r';
    else if (c === '\t') r += '\\t';
    else if (c === '\f') r += '\\f';
    else if (isKey && (c === ' ' || c === '=' || c === ':')) r += '\\' + c;
    else if (i === 0 && (c === ' ' || (isKey && (c === '#' || c === '!')))) r += '\\' + c;
    else if (c < ' ' || (unicode && c > '~')) r += '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0');
    else r += c;
  }
  return r;
}

function yamlToProps(text, arrays, unicode) {
  const v = yamlParse(text);
  if (v === null) return '';
  if (typeof v !== 'object') throw new Error('Top-level value must be a mapping or a list');
  const out = [];
  const walk = (x, path) => {
    if (Array.isArray(x) && x.length) {
      x.forEach((e, i) => walk(e, arrays === 'dot' ? (path ? path + '.' + i : String(i)) : path + '[' + i + ']'));
    } else if (x && typeof x === 'object' && !Array.isArray(x) && Object.keys(x).length) {
      for (const k of Object.keys(x)) walk(x[k], (path ? path + '.' : '') + propEscape(k, true, unicode));
    } else {
      const val = x === null || x === undefined || Array.isArray(x) || typeof x === 'object' ? '' : String(x);
      out.push(path + '=' + propEscape(val, false, unicode));
    }
  };
  walk(v, '');
  return out.join('\n');
}

// Parses .properties text into [[key, value], ...]
function propsParse(text) {
  const lines = text.replace(/^\uFEFF/, '').split(/\r\n|\r|\n/);
  const entries = [];
  const readEsc = (s, i, ln) => { // s[i] is the char after a backslash -> [char, nextIndex]
    const c = s[i];
    if (c === undefined) return ['', i];
    if (c === 'u') {
      const hex = s.slice(i + 1, i + 5);
      if (!/^[0-9a-fA-F]{4}$/.test(hex)) throw new Error('Malformed \\u escape (line ' + ln + ')');
      return [String.fromCharCode(parseInt(hex, 16)), i + 5];
    }
    const map = { n: '\n', r: '\r', t: '\t', f: '\f' };
    return [c in map ? map[c] : c, i + 1];
  };
  for (let n = 0; n < lines.length; n++) {
    let line = lines[n].replace(/^[ \t\f]+/, '');
    if (line === '' || line[0] === '#' || line[0] === '!') continue;
    const startLn = n + 1;
    while (/(^|[^\\])(\\\\)*\\$/.test(line) && n + 1 < lines.length) {
      line = line.slice(0, -1) + lines[++n].replace(/^[ \t\f]+/, '');
    }
    if (/(^|[^\\])(\\\\)*\\$/.test(line)) line = line.slice(0, -1);
    let i = 0, key = '';
    while (i < line.length) {
      const c = line[i];
      if (c === '\\') { const r = readEsc(line, i + 1, startLn); key += r[0]; i = r[1]; }
      else if (c === '=' || c === ':' || c === ' ' || c === '\t' || c === '\f') break;
      else { key += c; i++; }
    }
    while (/[ \t\f]/.test(line[i] || '')) i++;
    if (line[i] === '=' || line[i] === ':') i++;
    while (/[ \t\f]/.test(line[i] || '')) i++;
    let val = '';
    while (i < line.length) {
      if (line[i] === '\\') { const r = readEsc(line, i + 1, startLn); val += r[0]; i = r[1]; }
      else val += line[i++];
    }
    entries.push([key, val, startLn]);
  }
  return entries;
}

function propKeyPath(key, ln) {
  const segs = [];
  let buf = '';
  const flush = () => { if (buf !== '') segs.push({ k: buf, idx: false }); buf = ''; };
  for (let i = 0; i < key.length; i++) {
    const c = key[i];
    if (c === '.') flush();
    else if (c === '[') {
      const m = /^\[(\d+)\]/.exec(key.slice(i));
      if (m) { flush(); segs.push({ k: String(Number(m[1])), idx: true }); i += m[0].length - 1; }
      else buf += c;
    } else buf += c;
  }
  flush();
  if (!segs.length) throw new Error('Empty key (line ' + ln + ')');
  return segs;
}

function propsToYaml(text, infer, indent) {
  const entries = propsParse(text);
  if (!entries.length) return '';
  const mk = () => ({ kids: new Map(), hasIdx: false, hasKey: false, leaf: false, value: '' });
  const root = mk();
  for (const [key, value, ln] of entries) {
    let node = root, path = '';
    for (const s of propKeyPath(key, ln)) {
      path += (path ? '.' : '') + s.k;
      if (node.leaf) throw new Error("'" + path.slice(0, path.lastIndexOf('.')) + "' is both a value and a parent (line " + ln + ')');
      if (s.idx) node.hasIdx = true; else node.hasKey = true;
      let child = node.kids.get(s.k);
      if (!child) { child = mk(); node.kids.set(s.k, child); }
      node = child;
    }
    if (node.kids.size) throw new Error("'" + key + "' is both a value and a parent (line " + ln + ')');
    node.leaf = true; node.value = value;
  }
  const conv = node => {
    if (node.leaf) return infer && node.value !== '' ? yamlResolvePlain(node.value) : node.value;
    if (node.hasIdx && node.hasKey) throw new Error('A key mixes list indexes and names');
    const keys = [...node.kids.keys()];
    const contiguous = keys.length > 0 && keys.every(k => /^\d+$/.test(k)) && keys.map(Number).sort((a, b) => a - b).every((n, i) => n === i);
    if (node.hasIdx || contiguous) {
      const size = Math.max(...keys.map(Number)) + 1;
      if (size > 10000) throw new Error('List index too large');
      const arr = new Array(size).fill(null);
      for (const [k, c] of node.kids) arr[Number(k)] = conv(c);
      return arr;
    }
    return Object.fromEntries([...node.kids].map(([k, c]) => [k, conv(c)]));
  };
  return yamlDump(conv(root), indent === '4' ? 4 : 2);
}

function propLooksLikeProps(text) {
  for (const raw of text.split(/\r?\n|\r/)) {
    const l = raw.trim();
    if (!l || l[0] === '#' || l[0] === '!') continue;
    if (/^(---|-\s|-$|\[|\{)/.test(l)) return false;
    const eq = l.indexOf('=');
    const m = /:(\s|$)/.exec(l);
    return eq !== -1 && (!m || eq < m.index);
  }
  return false;
}

/* ----- YAML <-> Properties screen ----- */
const propInput = document.getElementById('propInput');
const propOutput = document.getElementById('propOutput');
const propDirectionSel = document.getElementById('propDirection');
const propArraysSel = document.getElementById('propArrays');
const propUnicodeSel = document.getElementById('propUnicode');
const propValuesSel = document.getElementById('propValues');
const propIndentSel = document.getElementById('propIndent');
const propStatus = document.getElementById('propStatus');

const PROP_YAML_SAMPLE = `server:
  port: 8080
  hosts:
    - alpha.example.com
    - beta.example.com
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/app
    username: admin
logging:
  level:
    root: INFO
`;
const PROP_SAMPLE = yamlToProps(PROP_YAML_SAMPLE, 'bracket', false);

function propDirection(text) {
  const d = propDirectionSel.value;
  return d !== 'auto' ? d : (propLooksLikeProps(text) ? 'p2y' : 'y2p');
}

function runProp() {
  const text = propInput.value;
  const dir = propDirection(text);
  const show = (id, on) => { document.getElementById(id).style.display = on ? '' : 'none'; };
  show('propArraysWrap', dir === 'y2p'); show('propUnicodeWrap', dir === 'y2p');
  show('propValuesWrap', dir === 'p2y'); show('propIndentWrap', dir === 'p2y');
  propInput.classList.remove('err');
  propStatus.className = 'url-status';
  propStatus.textContent = '';
  try {
    propOutput.value = dir === 'y2p'
      ? yamlToProps(text, propArraysSel.value, propUnicodeSel.value === 'esc')
      : propsToYaml(text, propValuesSel.value === 'infer', propIndentSel.value);
    if (propDirectionSel.value === 'auto' && text.trim())
      propStatus.textContent = 'Detected ' + (dir === 'y2p' ? 'YAML → Property' : 'Property → YAML');
  } catch (e) {
    propOutput.value = '';
    propInput.classList.add('err');
    propStatus.className = 'url-status bad';
    propStatus.textContent = (dir === 'y2p' ? 'Invalid YAML: ' : 'Invalid Property: ') + e.message;
  }
}

propInput.addEventListener('input', runProp);
for (const s of [propDirectionSel, propArraysSel, propUnicodeSel, propValuesSel, propIndentSel]) s.addEventListener('change', runProp);
document.getElementById('propSample').onclick = () => {
  propInput.value = propDirectionSel.value === 'p2y' ? PROP_SAMPLE : PROP_YAML_SAMPLE;
  runProp();
};
document.getElementById('propClear').onclick = () => { propInput.value = ''; runProp(); propInput.focus(); };
document.getElementById('propCopy').onclick = e => copyText(propOutput.value, e.currentTarget);
document.getElementById('propUseAsInput').onclick = () => {
  const dir = propDirection(propInput.value);
  propInput.value = propOutput.value;
  if (propDirectionSel.value !== 'auto') propDirectionSel.value = dir === 'y2p' ? 'p2y' : 'y2p';
  runProp();
};

/* ---------------- Number Base Converter ---------------- */
const NB_DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';
const nbFields = [...document.querySelectorAll('#nbTool .nb-input')];
const nbCustomInput = document.getElementById('nbCustom');
const nbCustomBaseSel = document.getElementById('nbCustomBase');
const nbStatus = document.getElementById('nbStatus');

for (let b = 2; b <= 36; b++) nbCustomBaseSel.add(new Option(String(b), String(b)));
nbCustomBaseSel.value = '36';

function nbBaseOf(el) {
  return el === nbCustomInput ? Number(nbCustomBaseSel.value) : Number(el.dataset.base);
}

// Parses text in the given base into a BigInt (optional leading sign, spaces/underscores ignored)
function nbParse(text, base) {
  let s = text.replace(/[\s_]/g, '').toLowerCase();
  let neg = false;
  if (s[0] === '-' || s[0] === '+') { neg = s[0] === '-'; s = s.slice(1); }
  if (base === 16) s = s.replace(/^0x/, '');
  else if (base === 8) s = s.replace(/^0o/, '');
  else if (base === 2) s = s.replace(/^0b/, '');
  if (s === '') throw new Error('Missing digits');
  const B = BigInt(base);
  let n = 0n;
  for (const c of s) {
    const d = NB_DIGITS.indexOf(c);
    if (d < 0 || d >= base) throw new Error("Invalid digit '" + c + "' for base " + base);
    n = n * B + BigInt(d);
  }
  return neg ? -n : n;
}

function nbFormat(n, base) {
  return n.toString(base);
}

let nbValue = null; // the number currently shown (BigInt), or null when empty/invalid

function nbUpdate(source) {
  nbStatus.className = 'url-status';
  nbStatus.textContent = '';
  nbValue = null;
  for (const f of nbFields) f.classList.remove('err');
  const text = source.value;
  if (text.trim() === '') {
    for (const f of nbFields) if (f !== source) f.value = '';
    return;
  }
  let n;
  try {
    n = nbParse(text, nbBaseOf(source));
  } catch (e) {
    source.classList.add('err');
    nbStatus.className = 'url-status bad';
    nbStatus.textContent = e.message;
    for (const f of nbFields) if (f !== source) f.value = '';
    return;
  }
  nbValue = n;
  for (const f of nbFields) if (f !== source) f.value = nbFormat(n, nbBaseOf(f));
}

for (const f of nbFields) f.addEventListener('input', () => nbUpdate(f));
nbCustomBaseSel.addEventListener('change', () => {
  // keep the number; only redraw the custom-base field in the newly selected base
  if (nbValue !== null) {
    nbCustomInput.classList.remove('err');
    nbCustomInput.value = nbFormat(nbValue, nbBaseOf(nbCustomInput));
  }
});
document.querySelectorAll('#nbTool [data-nb-clear]').forEach(btn => {
  btn.onclick = () => {
    const el = document.getElementById(btn.dataset.nbClear);
    el.value = '';
    nbUpdate(el);
    el.focus();
  };
});
document.querySelectorAll('#nbTool [data-nb-copy]').forEach(btn => {
  btn.onclick = e => copyText(document.getElementById(btn.dataset.nbCopy).value, e.currentTarget);
});

/* ---------------- Date Calculator ---------------- */
const DC_DAY_MS = 86400000;
const dcEl = id => document.getElementById(id);
const dcStartEl = dcEl('dcStart'), dcEndEl = dcEl('dcEnd'), dcBaseEl = dcEl('dcBase');
const dcIncludeEl = dcEl('dcInclude');

// All dates are UTC midnight so DST never changes day counts
function dcMake(y, m, d) {
  const t = new Date(0);
  t.setUTCFullYear(y, m, d);
  return t;
}
function dcParse(v) {
  const m = /^(\d{4,6})-(\d{2})-(\d{2})$/.exec(v || '');
  return m ? dcMake(+m[1], +m[2] - 1, +m[3]) : null;
}
function dcIso(t) {
  return String(t.getUTCFullYear()).padStart(4, '0') + '-' + pad(t.getUTCMonth() + 1) + '-' + pad(t.getUTCDate());
}
function dcToday() {
  const n = new Date();
  return dcMake(n.getFullYear(), n.getMonth(), n.getDate());
}
function dcDim(y, m) {
  if (m === 1) return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 29 : 28;
  return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m];
}
// Adds calendar months, clamping the day (Jan 31 + 1 month = Feb 28/29)
function dcAddMonths(t, n) {
  const total = t.getUTCFullYear() * 12 + t.getUTCMonth() + n;
  const y = Math.floor(total / 12), m = total - y * 12;
  return dcMake(y, m, Math.min(t.getUTCDate(), dcDim(y, m)));
}
const dcAddDays = (t, n) => new Date(t.getTime() + n * DC_DAY_MS);
const dcDiffDays = (a, b) => Math.round((b - a) / DC_DAY_MS);

// Calendar difference a <= b as years / months / days
function dcBreakdown(a, b) {
  let months = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + b.getUTCMonth() - a.getUTCMonth();
  if (dcAddMonths(a, months) > b) months--;
  return { years: Math.floor(months / 12), months: months % 12, days: dcDiffDays(dcAddMonths(a, months), b) };
}
// Number of Monday-Friday days among n consecutive days beginning at t
function dcWeekdays(t, n) {
  let count = Math.floor(n / 7) * 5;
  for (let i = 0; i < n % 7; i++) {
    const d = (t.getUTCDay() + i) % 7;
    if (d !== 0 && d !== 6) count++;
  }
  return count;
}

const dcPlural = (n, w) => n + ' ' + w + (n === 1 ? '' : 's');
const dcFmtLong = t => t.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
const dcFmtShort = t => t.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });

function dcShow(el, big, lines, bad) {
  el.className = 'dc-result' + (bad ? ' bad' : '');
  el.innerHTML = '<div class="dc-big">' + esc(big) + '</div>' +
    (lines || []).map(l => '<div class="dc-line">' + esc(l) + '</div>').join('');
}

function dcRunBetween() {
  const out = dcEl('dcBetweenResult');
  let a = dcParse(dcStartEl.value), b = dcParse(dcEndEl.value);
  if (!a || !b) return dcShow(out, 'Enter a valid start and end date', null, true);
  let reversed = false;
  if (b < a) { [a, b] = [b, a]; reversed = true; }
  const include = dcIncludeEl.checked;
  const days = dcDiffDays(a, b) + (include ? 1 : 0);
  const span = dcBreakdown(a, include ? dcAddDays(b, 1) : b);
  const parts = [];
  if (span.years) parts.push(dcPlural(span.years, 'year'));
  if (span.months) parts.push(dcPlural(span.months, 'month'));
  if (span.days || !parts.length) parts.push(dcPlural(span.days, 'day'));
  const wk = Math.floor(days / 7), rd = days % 7;
  const weekdays = dcWeekdays(a, days);
  const lines = [
    parts.join(', '),
    (wk ? dcPlural(wk, 'week') + ', ' : '') + dcPlural(rd, 'day'),
    dcPlural(weekdays, 'weekday') + ' (Mon\u2013Fri), ' + dcPlural(days - weekdays, 'weekend day'),
    dcPlural(days * 24, 'hour')
  ];
  const mid = dcAddDays(a, Math.floor(dcDiffDays(a, b) / 2));
  lines.push('Midpoint: ' + dcFmtLong(mid));
  if (reversed) lines.unshift('The end date is before the start date; showing the absolute difference.');
  dcShow(out, dcPlural(days, 'day'), lines, false);
}

function dcRunAdd() {
  const out = dcEl('dcAddResult');
  const base = dcParse(dcBaseEl.value);
  if (!base) return dcShow(out, 'Enter a valid start date', null, true);
  const num = id => {
    const v = dcEl(id).value.trim();
    return v === '' ? 0 : Number(v);
  };
  const y = num('dcYears'), mo = num('dcMonths'), w = num('dcWeeks'), d = num('dcDays');
  if (![y, mo, w, d].every(Number.isInteger)) return dcShow(out, 'Years, months, weeks and days must be whole numbers', null, true);
  const sign = document.querySelector('input[name=dcOp]:checked').value === 'sub' ? -1 : 1;
  const res = dcAddDays(dcAddMonths(base, sign * (y * 12 + mo)), sign * (w * 7 + d));
  if (isNaN(res) || Math.abs(res.getUTCFullYear()) > 275000) return dcShow(out, 'Result is out of the supported date range', null, true);
  const items = [];
  if (y) items.push(dcPlural(y, 'year'));
  if (mo) items.push(dcPlural(mo, 'month'));
  if (w) items.push(dcPlural(w, 'week'));
  if (d) items.push(dcPlural(d, 'day'));
  const desc = dcFmtShort(base) + (sign < 0 ? ' \u2212 ' : ' + ') + (items.join(', ') || '0 days');
  const diff = Math.abs(dcDiffDays(base, res));
  dcShow(out, dcFmtLong(res), [desc, dcPlural(diff, 'day') + (sign < 0 ? ' before' : ' after') + ' the start date'], false);
}

function runDc() {
  dcRunBetween();
  dcRunAdd();
}

{
  const today = dcIso(dcToday());
  dcStartEl.value = dcEndEl.value = dcBaseEl.value = today;
}
dcEl('dcTool').addEventListener('input', runDc);
dcEl('dcTool').addEventListener('change', runDc);
dcEl('dcSwap').onclick = () => {
  [dcStartEl.value, dcEndEl.value] = [dcEndEl.value, dcStartEl.value];
  runDc();
};
document.querySelectorAll('#dcTool [data-dc-today]').forEach(btn => {
  btn.onclick = () => {
    dcEl(btn.dataset.dcToday).value = dcIso(dcToday());
    runDc();
  };
});

/* ---------------- Hash Generator ---------------- */
/* HASH-ALGOS-BEGIN */
const HASH_MD2_S = [41,46,67,201,162,216,124,1,61,54,84,161,236,240,6,19,98,167,5,243,192,199,115,140,152,147,43,217,188,76,130,202,30,155,87,60,253,212,224,22,103,66,111,24,138,23,229,18,190,78,196,214,218,158,222,73,160,251,245,142,187,47,238,122,169,104,121,145,21,178,7,63,148,194,16,137,11,34,95,33,128,127,93,154,90,144,50,39,53,62,204,231,191,247,151,3,255,25,48,179,72,165,181,209,215,94,146,42,172,86,170,198,79,184,56,210,150,164,125,182,118,252,107,226,156,116,4,241,69,157,112,89,100,113,135,32,134,91,207,101,230,45,168,2,27,96,37,173,174,176,185,246,28,70,97,105,52,64,126,15,85,71,163,35,221,81,175,58,195,92,249,206,186,197,234,38,44,83,13,110,133,40,132,9,211,223,205,244,65,129,77,82,106,220,55,200,108,193,171,250,36,225,123,8,12,189,177,74,120,136,149,139,227,99,232,109,233,203,213,254,59,0,29,57,242,239,183,14,102,88,208,228,166,119,114,248,235,117,75,10,49,68,80,180,143,237,31,26,219,153,141,51,159,17,131,20];

const hashRol = (x, s) => (x << s) | (x >>> (32 - s));
const hashRor = (x, s) => (x >>> s) | (x << (32 - s));

// Appends 0x80, zero padding and the 64-bit bit-length (in a 'lenSize'-byte field) to a block multiple
function hashPad(bytes, block, lenSize, little) {
  const n = bytes.length;
  const total = Math.ceil((n + 1 + lenSize) / block) * block;
  const m = new Uint8Array(total);
  m.set(bytes);
  m[n] = 0x80;
  const dv = new DataView(m.buffer);
  const lo = (n * 8) >>> 0, hi = Math.floor(n / 0x20000000);
  if (little) { dv.setUint32(total - 8, lo, true); dv.setUint32(total - 4, hi, true); }
  else { dv.setUint32(total - 8, hi, false); dv.setUint32(total - 4, lo, false); }
  return m;
}

function hashWordsOut(words, little) {
  const out = new Uint8Array(words.length * 4);
  const dv = new DataView(out.buffer);
  words.forEach((w, i) => dv.setUint32(i * 4, w >>> 0, little));
  return out;
}

function hashMd2(bytes) {
  const S = HASH_MD2_S;
  const n = bytes.length, padLen = 16 - (n % 16);
  const m = new Uint8Array(n + padLen + 16);
  m.set(bytes);
  m.fill(padLen, n, n + padLen);
  const C = new Uint8Array(16);
  let L = 0;
  for (let i = 0; i < (n + padLen) / 16; i++) {
    for (let j = 0; j < 16; j++) { C[j] ^= S[m[i * 16 + j] ^ L]; L = C[j]; }
  }
  m.set(C, n + padLen);
  const X = new Uint8Array(48);
  for (let i = 0; i < m.length / 16; i++) {
    for (let j = 0; j < 16; j++) { X[16 + j] = m[i * 16 + j]; X[32 + j] = X[16 + j] ^ X[j]; }
    let t = 0;
    for (let j = 0; j < 18; j++) {
      for (let k = 0; k < 48; k++) { X[k] ^= S[t]; t = X[k]; }
      t = (t + j) & 255;
    }
  }
  return X.slice(0, 16);
}

function hashMd4(bytes) {
  const m = hashPad(bytes, 64, 8, true);
  const dv = new DataView(m.buffer);
  const X = new Array(16);
  let h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];
  const F = (x, y, z) => (x & y) | (~x & z);
  const G = (x, y, z) => (x & y) | (x & z) | (y & z);
  const H = (x, y, z) => x ^ y ^ z;
  const order2 = [0,4,8,12,1,5,9,13,2,6,10,14,3,7,11,15];
  const order3 = [0,8,4,12,2,10,6,14,1,9,5,13,3,11,7,15];
  for (let off = 0; off < m.length; off += 64) {
    for (let i = 0; i < 16; i++) X[i] = dv.getUint32(off + i * 4, true);
    let [a, b, c, d] = h;
    const step = (fn, k, s, K) => {
      a = hashRol((a + fn(b, c, d) + X[k] + K) | 0, s);
      [a, b, c, d] = [d, a, b, c];
    };
    for (let i = 0; i < 16; i++) step(F, i, [3, 7, 11, 19][i % 4], 0);
    for (let i = 0; i < 16; i++) step(G, order2[i], [3, 5, 9, 13][i % 4], 0x5a827999);
    for (let i = 0; i < 16; i++) step(H, order3[i], [3, 9, 11, 15][i % 4], 0x6ed9eba1);
    h = [(h[0] + a) | 0, (h[1] + b) | 0, (h[2] + c) | 0, (h[3] + d) | 0];
  }
  return hashWordsOut(h, true);
}

let HASH_MD5_K = null;
const HASH_MD5_S = [7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,
  4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21];
function hashMd5(bytes) {
  if (!HASH_MD5_K) HASH_MD5_K = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) | 0);
  const K = HASH_MD5_K;
  const m = hashPad(bytes, 64, 8, true);
  const dv = new DataView(m.buffer);
  const X = new Array(16);
  let h = [0x67452301, 0xefcdab89 | 0, 0x98badcfe | 0, 0x10325476];
  for (let off = 0; off < m.length; off += 64) {
    for (let i = 0; i < 16; i++) X[i] = dv.getUint32(off + i * 4, true);
    let [a, b, c, d] = h;
    for (let i = 0; i < 64; i++) {
      let f, g;
      if (i < 16) { f = (b & c) | (~b & d); g = i; }
      else if (i < 32) { f = (d & b) | (~d & c); g = (5 * i + 1) % 16; }
      else if (i < 48) { f = b ^ c ^ d; g = (3 * i + 5) % 16; }
      else { f = c ^ (b | ~d); g = (7 * i) % 16; }
      f = (f + a + K[i] + X[g]) | 0;
      a = d; d = c; c = b;
      b = (b + hashRol(f, HASH_MD5_S[i])) | 0;
    }
    h = [(h[0] + a) | 0, (h[1] + b) | 0, (h[2] + c) | 0, (h[3] + d) | 0];
  }
  return hashWordsOut(h, true);
}

function hashSha1(bytes) {
  const m = hashPad(bytes, 64, 8, false);
  const dv = new DataView(m.buffer);
  const w = new Array(80);
  let h = [0x67452301, 0xefcdab89 | 0, 0x98badcfe | 0, 0x10325476, 0xc3d2e1f0 | 0];
  for (let off = 0; off < m.length; off += 64) {
    for (let i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4, false);
    for (let i = 16; i < 80; i++) w[i] = hashRol(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1);
    let [a, b, c, d, e] = h;
    for (let i = 0; i < 80; i++) {
      let f, k;
      if (i < 20) { f = (b & c) | (~b & d); k = 0x5a827999; }
      else if (i < 40) { f = b ^ c ^ d; k = 0x6ed9eba1; }
      else if (i < 60) { f = (b & c) | (b & d) | (c & d); k = 0x8f1bbcdc | 0; }
      else { f = b ^ c ^ d; k = 0xca62c1d6 | 0; }
      const t = (hashRol(a, 5) + f + e + k + w[i]) | 0;
      e = d; d = c; c = hashRol(b, 30); b = a; a = t;
    }
    h = [(h[0] + a) | 0, (h[1] + b) | 0, (h[2] + c) | 0, (h[3] + d) | 0, (h[4] + e) | 0];
  }
  return hashWordsOut(h, false);
}

// SHA-2 constants are derived from the fractional parts of prime roots, computed exactly with BigInt
let HASH_SHA2 = null;
function hashSha2Consts() {
  if (HASH_SHA2) return HASH_SHA2;
  const primes = [];
  for (let n = 2; primes.length < 80; n++) if (primes.every(p => n % p)) primes.push(n);
  const root = (n, k) => {
    let x = 1n << BigInt(Math.ceil(n.toString(2).length / Number(k)));
    for (;;) {
      const y = ((k - 1n) * x + n / x ** (k - 1n)) / k;
      if (y >= x) return x;
      x = y;
    }
  };
  const M64 = (1n << 64n) - 1n;
  const cbrtFrac = p => root(BigInt(p) << 192n, 3n) & M64;
  const sqrtFrac = p => root(BigInt(p) << 128n, 2n) & M64;
  const K512 = primes.map(cbrtFrac);
  HASH_SHA2 = {
    K512,
    K256: K512.slice(0, 64).map(v => Number(v >> 32n) | 0),
    H256: primes.slice(0, 8).map(p => Number(sqrtFrac(p) >> 32n) | 0),
    H512: primes.slice(0, 8).map(sqrtFrac),
    H384: primes.slice(8, 16).map(sqrtFrac)
  };
  return HASH_SHA2;
}

function hashSha256Core(bytes, init, outWords) {
  const { K256 } = hashSha2Consts();
  const m = hashPad(bytes, 64, 8, false);
  const dv = new DataView(m.buffer);
  const w = new Array(64);
  let h = init.slice();
  for (let off = 0; off < m.length; off += 64) {
    for (let i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4, false) | 0;
    for (let i = 16; i < 64; i++) {
      const s0 = hashRor(w[i - 15], 7) ^ hashRor(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = hashRor(w[i - 2], 17) ^ hashRor(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }
    let [a, b, c, d, e, f, g, hh] = h;
    for (let i = 0; i < 64; i++) {
      const S1 = hashRor(e, 6) ^ hashRor(e, 11) ^ hashRor(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (hh + S1 + ch + K256[i] + w[i]) | 0;
      const S0 = hashRor(a, 2) ^ hashRor(a, 13) ^ hashRor(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) | 0;
      hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
    }
    h = [a, b, c, d, e, f, g, hh].map((v, i) => (h[i] + v) | 0);
  }
  return hashWordsOut(h.slice(0, outWords), false);
}
const hashSha256 = bytes => hashSha256Core(bytes, hashSha2Consts().H256, 8);
const hashSha224 = bytes => hashSha256Core(bytes,
  [0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939, 0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4].map(v => v | 0), 7);

function hashSha512Core(bytes, init, outBytes) {
  const { K512 } = hashSha2Consts();
  const M = (1n << 64n) - 1n;
  const ror = (x, n) => ((x >> n) | (x << (64n - n))) & M;
  const m = hashPad(bytes, 128, 16, false);
  const dv = new DataView(m.buffer);
  const w = new Array(80);
  let h = init.slice();
  for (let off = 0; off < m.length; off += 128) {
    for (let i = 0; i < 16; i++) w[i] = dv.getBigUint64(off + i * 8, false);
    for (let i = 16; i < 80; i++) {
      const s0 = ror(w[i - 15], 1n) ^ ror(w[i - 15], 8n) ^ (w[i - 15] >> 7n);
      const s1 = ror(w[i - 2], 19n) ^ ror(w[i - 2], 61n) ^ (w[i - 2] >> 6n);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) & M;
    }
    let [a, b, c, d, e, f, g, hh] = h;
    for (let i = 0; i < 80; i++) {
      const S1 = ror(e, 14n) ^ ror(e, 18n) ^ ror(e, 41n);
      const ch = (e & f) ^ (~e & M & g);
      const t1 = (hh + S1 + ch + K512[i] + w[i]) & M;
      const S0 = ror(a, 28n) ^ ror(a, 34n) ^ ror(a, 39n);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) & M;
      hh = g; g = f; f = e; e = (d + t1) & M; d = c; c = b; b = a; a = (t1 + t2) & M;
    }
    h = [a, b, c, d, e, f, g, hh].map((v, i) => (h[i] + v) & M);
  }
  const out = new Uint8Array(64);
  const odv = new DataView(out.buffer);
  h.forEach((v, i) => odv.setBigUint64(i * 8, v, false));
  return out.slice(0, outBytes);
}
const hashSha384 = bytes => hashSha512Core(bytes, hashSha2Consts().H384, 48);
const hashSha512 = bytes => hashSha512Core(bytes, hashSha2Consts().H512, 64);

const hashHex = u8 => Array.from(u8, b => b.toString(16).padStart(2, '0')).join('');
/* HASH-ALGOS-END */

const HG_ALGOS = [
  ['MD2', hashMd2], ['MD4', hashMd4], ['MD5', hashMd5], ['SHA1', hashSha1],
  ['SHA224', hashSha224], ['SHA256', hashSha256], ['SHA384', hashSha384], ['SHA512', hashSha512]
];
const HG_SAMPLE = 'Ut quidem aut expedita porro ut ipsa ea et earum dolorem sapiente molestias delectus dolores. Ducimus sunt eos enim dolor ullam sint doloremque et quas dolor molestias explicabo. Architecto eius vero quibusdam cupiditate facilis officiis aliquid adipisci. Excepturi quam voluptatem dolorem accusantium aliquid dolorem omnis voluptas porro ea eos maxime sint quia.';

const hgInput = document.getElementById('hgInput');
const hgInfo = document.getElementById('hgInfo');
const hgLower = document.getElementById('hgLower');
const hgFileInput = document.getElementById('hgFile');
const hgRows = document.getElementById('hgRows');
let hgFileData = null; // { name, bytes } when a file is loaded instead of text

const hgOutputs = HG_ALGOS.map(([name]) => {
  const row = document.createElement('div');
  row.className = 'hg-row';
  row.innerHTML = '<span class="nb-label">' + name + ':</span>' +
    '<div class="nb-field"><input type="text" class="nb-input hg-input" readonly spellcheck="false"><button class="btn">📋 Copy</button></div>';
  hgRows.appendChild(row);
  const input = row.querySelector('input');
  row.querySelector('button').onclick = e => copyText(input.value, e.currentTarget);
  return input;
});

function runHg() {
  const bytes = hgFileData ? hgFileData.bytes : new TextEncoder().encode(hgInput.value);
  hgInfo.textContent = bytes.length + ' byte' + (bytes.length === 1 ? '' : 's') +
    (hgFileData ? ' (file: ' + hgFileData.name + ')' : ' (string)');
  HG_ALGOS.forEach(([, fn], i) => {
    const hex = hashHex(fn(bytes));
    hgOutputs[i].value = hgLower.checked ? hex : hex.toUpperCase();
  });
}

function hgSetText(text) {
  hgFileData = null;
  hgInput.disabled = false;
  hgInput.placeholder = '';
  hgInput.value = text;
  runHg();
}

hgInput.addEventListener('input', () => { hgFileData = null; runHg(); });
hgLower.addEventListener('change', runHg);
document.getElementById('hgSample').onclick = () => hgSetText(HG_SAMPLE);
document.getElementById('hgClear').onclick = () => { hgSetText(''); hgInput.focus(); };
document.getElementById('hgLoad').onclick = () => hgFileInput.click();
hgFileInput.addEventListener('change', async () => {
  const file = hgFileInput.files[0];
  hgFileInput.value = '';
  if (!file) return;
  hgFileData = { name: file.name, bytes: new Uint8Array(await file.arrayBuffer()) };
  hgInput.value = '';
  hgInput.placeholder = 'File loaded: ' + file.name + ' (type here to hash text instead)';
  runHg();
});

/* boot with Unix Time Converter */
selectTool('Unix Time Converter');
ta.value = SAMPLE;
