/* ---------------- sidebar ---------------- */
const TOOLS = [
  ['🕘','Unix Time Converter'],
  ['64','Base64 String Encode/Decode'],
  ['✳️','JWT Debugger'], ['%','URL Encode/Decode'],
  ['⇄','YAML / JSON / Properties'], ['01','Number Base Converter'],
  ['📅','Date Calculator'], ['#','Hash Generator'], ['🔐','Chmod Calculator'], ['ms','Milliseconds to Seconds'], ['⏰','Cron Expression']
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
  const cvToolEl = document.getElementById('cvTool');
  const nbToolEl = document.getElementById('nbTool');
  const dcToolEl = document.getElementById('dcTool');
  const hgToolEl = document.getElementById('hgTool');
  const cmToolEl = document.getElementById('cmTool');
  const msToolEl = document.getElementById('msTool');
  const crToolEl = document.getElementById('crTool');
  const otherToolEl = document.getElementById('otherTool');

  unixToolEl.style.display = 'none';
  jwtToolEl.style.display = 'none';
  urlToolEl.style.display = 'none';
  b64ToolEl.style.display = 'none';
  cvToolEl.style.display = 'none';
  nbToolEl.style.display = 'none';
  dcToolEl.style.display = 'none';
  hgToolEl.style.display = 'none';
  cmToolEl.style.display = 'none';
  msToolEl.style.display = 'none';
  crToolEl.style.display = 'none';
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
  } else if (name === 'YAML / JSON / Properties') {
    cvToolEl.style.display = 'flex';
    runCv();
  } else if (name === 'Number Base Converter') {
    nbToolEl.style.display = 'flex';
  } else if (name === 'Date Calculator') {
    dcToolEl.style.display = 'flex';
    runDc();
  } else if (name === 'Hash Generator') {
    hgToolEl.style.display = 'flex';
    runHg();
  } else if (name === 'Chmod Calculator') {
    cmToolEl.style.display = 'flex';
    runCm();
  } else if (name === 'Milliseconds to Seconds') {
    msToolEl.style.display = 'flex';
    runMs();
  } else if (name === 'Cron Expression') {
    crToolEl.style.display = 'flex';
    runCr();
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

function yamlLooksLikeJson(text) {
  const t = text.trim();
  if (t[0] !== '{' && t[0] !== '[') return false;
  try { JSON.parse(t); return true; } catch { return false; }
}

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

function valueToProps(v, arrays, unicode) {
  if (v === null || v === undefined) return '';
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

function propsToValue(text, infer) {
  const entries = propsParse(text);
  if (!entries.length) return undefined;
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
  return conv(root);
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

/* ----- YAML / JSON / Properties screen ----- */
const CV_NAMES = { yaml: 'YAML', json: 'JSON', props: 'Properties' };
const cvInput = document.getElementById('cvInput');
const cvOutput = document.getElementById('cvOutput');
const cvFromSel = document.getElementById('cvFrom');
const cvToSel = document.getElementById('cvTo');
const cvIndentSel = document.getElementById('cvIndent');
const cvArraysSel = document.getElementById('cvArrays');
const cvUnicodeSel = document.getElementById('cvUnicode');
const cvValuesSel = document.getElementById('cvValues');
const cvStatus = document.getElementById('cvStatus');

const CV_SAMPLE_YAML = `# Application settings
server:
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

const cvDetect = text => yamlLooksLikeJson(text) ? 'json' : propLooksLikeProps(text) ? 'props' : 'yaml';
const cvFrom = text => cvFromSel.value === 'auto' ? cvDetect(text) : cvFromSel.value;

// Any format -> plain JS value (undefined when the input is empty)
function cvParse(text, fmt) {
  if (!text.trim()) return undefined;
  if (fmt === 'json') return JSON.parse(text);
  if (fmt === 'props') return propsToValue(text, cvValuesSel.value === 'infer');
  const v = yamlParse(text);
  return v === null && !/\S/.test(text.replace(/^\s*#.*$/gm, '')) ? undefined : v;
}

// Plain JS value -> any format
function cvSerialize(v, fmt) {
  if (v === undefined) return '';
  const indent = cvIndentSel.value;
  if (fmt === 'json') return indent === 'min' ? JSON.stringify(v) : JSON.stringify(v, null, indent === 'tab' ? '\t' : Number(indent));
  if (fmt === 'yaml') return yamlDump(v, indent === '4' ? 4 : 2);
  return valueToProps(v, cvArraysSel.value, cvUnicodeSel.value === 'esc');
}

function runCv() {
  const text = cvInput.value, from = cvFrom(text), to = cvToSel.value;
  const show = (id, on) => { document.getElementById(id).style.display = on ? '' : 'none'; };
  show('cvValuesWrap', from === 'props');
  show('cvIndentWrap', to !== 'props');
  show('cvArraysWrap', to === 'props');
  show('cvUnicodeWrap', to === 'props');
  for (const o of cvIndentSel.options) o.disabled = to === 'yaml' && (o.value === 'tab' || o.value === 'min');
  if (cvIndentSel.selectedOptions[0].disabled) cvIndentSel.value = '2';

  cvInput.classList.remove('err');
  cvStatus.className = 'url-status';
  cvStatus.textContent = '';
  let v;
  try {
    v = cvParse(text, from);
  } catch (e) {
    cvOutput.value = '';
    cvInput.classList.add('err');
    cvStatus.className = 'url-status bad';
    cvStatus.textContent = 'Invalid ' + CV_NAMES[from] + ': ' + e.message;
    return;
  }
  try {
    cvOutput.value = cvSerialize(v, to);
  } catch (e) {
    cvOutput.value = '';
    cvStatus.className = 'url-status bad';
    cvStatus.textContent = 'Can\'t convert to ' + CV_NAMES[to] + ': ' + e.message;
    return;
  }
  if (text.trim()) {
    cvStatus.textContent = (cvFromSel.value === 'auto' ? 'Detected ' : '') + CV_NAMES[from] + ' → ' + CV_NAMES[to] +
      (from === to ? ' (reformatted)' : '');
  }
}

cvInput.addEventListener('input', runCv);
for (const s of [cvFromSel, cvToSel, cvIndentSel, cvArraysSel, cvUnicodeSel, cvValuesSel]) s.addEventListener('change', runCv);
document.getElementById('cvSample').onclick = () => {
  const from = cvFromSel.value === 'auto' ? 'yaml' : cvFromSel.value;
  const v = yamlParse(CV_SAMPLE_YAML);
  cvInput.value = from === 'yaml' ? CV_SAMPLE_YAML
    : from === 'json' ? JSON.stringify(v, null, 2) : valueToProps(v, 'bracket', false);
  if (from === cvToSel.value) cvToSel.value = from === 'json' ? 'yaml' : 'json';
  runCv();
};
document.getElementById('cvClear').onclick = () => { cvInput.value = ''; runCv(); cvInput.focus(); };
document.getElementById('cvCopy').onclick = e => copyText(cvOutput.value, e.currentTarget);
document.getElementById('cvSwap').onclick = () => {
  const from = cvFrom(cvInput.value), to = cvToSel.value;
  if (!cvOutput.value) return;
  cvInput.value = cvOutput.value;
  if (cvFromSel.value !== 'auto') cvFromSel.value = to;
  cvToSel.value = from;
  runCv();
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

const HG_BASH = {MD5:'md5sum', SHA1:'shasum -a 1', SHA224:'shasum -a 224', SHA256:'shasum -a 256', SHA384:'shasum -a 384', SHA512:'shasum -a 512'};
const hgOutputs = HG_ALGOS.map(([name]) => {
  const row = document.createElement('div');
  row.className = 'hg-row';
  const bashBtn = HG_BASH[name] ? '<button class="btn hg-bash">📋 Copy Bash Command</button>' : '';
  row.innerHTML = '<div class="hg-header"><span class="nb-label">' + name + ':</span>' +
    (bashBtn ? ' ' + bashBtn : '') + '</div>' +
    '<div class="nb-field"><input type="text" class="nb-input hg-input" readonly spellcheck="false"><button class="btn">📋 Copy</button></div>';
  hgRows.appendChild(row);
  const input = row.querySelector('input');
  row.querySelector('.nb-field .btn').onclick = e => copyText(input.value, e.currentTarget);
  if (HG_BASH[name]) {
    row.querySelector('.hg-bash').onclick = () => {
      const text = hgInput.value;
      const cmd = HG_BASH[name] + " ";
      navigator.clipboard.writeText(cmd).then(() => {
        const btn = row.querySelector('.hg-bash');
        const orig = btn.textContent;
        btn.textContent = '✓ Copied';
        setTimeout(() => btn.textContent = orig, 1500);
      });
    };
  }
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

/* ---------------- Chmod Calculator ---------------- */
// mode is a 12-bit number: special(suid=4,sgid=2,sticky=1) << 9 | owner << 6 | group << 3 | other
const CM_CLASSES = [['Owner', 'u', 6], ['Group', 'g', 3], ['Public', 'o', 0]];
const CM_PERMS = [['r', 4], ['w', 2], ['x', 1]];
const CM_SPECIAL = [['cmSuid', 0o4000], ['cmSgid', 0o2000], ['cmSticky', 0o1000]];
const CM_PRESETS = [
  ['644', 'Regular file', 'Owner can read/write; everyone else can only read. The default for most files (configs, HTML, source code).'],
  ['755', 'Executable / directory', 'Owner has full access; others can read and execute. Standard for scripts, binaries and directories (x on a directory lets you cd into it).'],
  ['600', 'Private file', 'Only the owner can read/write; nobody else has any access. Use for secrets, .env files, ~/.ssh/config.'],
  ['700', 'Private dir / script', 'Only the owner can read, write and execute. Use for private directories like ~/.ssh or personal scripts.'],
  ['775', 'Group-writable', 'Owner and group have full access; others can read/execute. Handy for shared project dirs where a team shares a group.'],
  ['777', 'Everyone (avoid)', 'Anyone can read, write and execute. Almost never correct and a security risk; prefer 775 or 755.'],
  ['400', 'Read-only owner', 'Only the owner can read; no one can write. Required by ssh for private keys (e.g. AWS .pem files).'],
  ['1777', 'Shared dir like /tmp', 'Everyone can create files, but the sticky bit (t) means only a file\'s owner can delete or rename it. Used for /tmp.']
];

const cmNumeric = document.getElementById('cmNumeric');
const cmSymbolic = document.getElementById('cmSymbolic');
const cmFile = document.getElementById('cmFile');
const cmFrom = document.getElementById('cmFrom');
const cmFromSym = document.getElementById('cmFromSym');
const cmCmds = document.getElementById('cmCmds');
const cmGridBody = document.getElementById('cmGridBody');
let cmMode = 0o755;

const cmBoxes = []; // [{el, bit}]
const cmOctCells = [];
for (const [label, letter, shift] of CM_CLASSES) {
  const tr = document.createElement('tr');
  tr.innerHTML = '<th>' + label + '<small>(' + letter + ')</small></th>';
  for (const [, v] of CM_PERMS) {
    const td = document.createElement('td');
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cmBoxes.push({ el: cb, bit: v << shift });
    td.appendChild(cb);
    tr.appendChild(td);
  }
  const oct = document.createElement('td');
  oct.className = 'cm-oct';
  tr.appendChild(oct);
  cmOctCells.push([oct, shift]);
  cmGridBody.appendChild(tr);
}
cmGridBody.closest('table').querySelector('thead tr').insertAdjacentHTML('beforeend', '<th>Octal</th>');
for (const [id, bit] of CM_SPECIAL) cmBoxes.push({ el: document.getElementById(id), bit });

const cmPresets = document.getElementById('cmPresets');
for (const [mode, name, desc] of CM_PRESETS) {
  const b = document.createElement('button');
  b.className = 'btn nb-mini cm-preset';
  b.textContent = mode;
  const tip = document.createElement('span');
  tip.className = 'cm-tip';
  tip.innerHTML = '<b></b><code></code><span></span>';
  tip.querySelector('b').textContent = name;
  tip.querySelector('code').textContent = cmToSymbolic(parseInt(mode, 8));
  tip.querySelector('span').textContent = desc;
  b.appendChild(tip);
  b.onclick = () => { cmMode = parseInt(mode, 8); runCm(); };
  cmPresets.appendChild(b);
}

function cmToSymbolic(m) {
  let s = '';
  for (const [, letter, shift] of CM_CLASSES) {
    const bits = (m >> shift) & 7;
    s += bits & 4 ? 'r' : '-';
    s += bits & 2 ? 'w' : '-';
    const x = bits & 1;
    const special = letter === 'u' ? m & 0o4000 : letter === 'g' ? m & 0o2000 : m & 0o1000;
    const ch = letter === 'o' ? 't' : 's';
    s += special ? (x ? ch : ch.toUpperCase()) : (x ? 'x' : '-');
  }
  return s;
}

// Accepts octal (1-4 digits) or symbolic (9 chars, optional leading type char like ls -l). Returns null if invalid.
function cmParse(text) {
  const t = text.trim();
  if (/^[0-7]{1,4}$/.test(t)) return parseInt(t, 8);
  const m = /^[-dlbcps]?([r-][w-][xsS-][r-][w-][xsS-][r-][w-][xtT-])$/.exec(t);
  if (!m) return null;
  const s = m[1];
  let mode = 0;
  CM_CLASSES.forEach(([, , shift], i) => {
    const [r, w, x] = s.slice(i * 3, i * 3 + 3);
    if (r === 'r') mode |= 4 << shift;
    if (w === 'w') mode |= 2 << shift;
    if ('xst'.includes(x)) mode |= 1 << shift;
    if ('sStT'.includes(x)) mode |= [0o4000, 0o2000, 0o1000][i];
  });
  return mode;
}

const cmOctal = m => (m & 0o7000 ? (m >> 9).toString() : '') + ((m >> 6) & 7) + ((m >> 3) & 7) + (m & 7);

// chmod u=rwx,g=rx,o=rx  (absolute symbolic)
function cmAbsolute(m) {
  const parts = CM_CLASSES.map(([, letter, shift]) => {
    const bits = (m >> shift) & 7;
    let p = CM_PERMS.filter(([, v]) => bits & v).map(([c]) => c).join('');
    if (letter === 'u' && m & 0o4000) p += 's';
    if (letter === 'g' && m & 0o2000) p += 's';
    if (letter === 'o' && m & 0o1000) p += 't';
    return [letter, p];
  });
  // collapse classes with identical perms (e.g. u=rwx,go=rx or a=rwx)
  const groups = new Map();
  for (const [letter, p] of parts) groups.set(p, (groups.get(p) || '') + letter);
  return [...groups].map(([p, who]) => (who === 'ugo' ? 'a' : who) + '=' + p).join(',');
}

// chmod u+x,go-w  (relative change from `from` to `to`); returns '' if no change
function cmRelative(from, to) {
  const ops = { '+': [], '-': [] };
  for (const [, letter, shift] of CM_CLASSES) {
    const special = letter === 'u' ? 0o4000 : letter === 'g' ? 0o2000 : 0o1000;
    const sch = letter === 'o' ? 't' : 's';
    for (const [op, a, b] of [['+', to, from], ['-', from, to]]) {
      let p = CM_PERMS.filter(([, v]) => ((a >> shift) & v) && !((b >> shift) & v)).map(([c]) => c).join('');
      if ((a & special) && !(b & special)) p += sch;
      if (p) ops[op].push([letter, p]);
    }
  }
  const out = [];
  for (const op of ['+', '-']) {
    const groups = new Map();
    for (const [letter, p] of ops[op]) groups.set(p, (groups.get(p) || '') + letter);
    for (const [p, who] of groups) out.push((who === 'ugo' ? 'a' : who) + op + p);
  }
  return out.join(',');
}

const cmQuote = f => /^[\w./@%+=:,-]+$/.test(f) ? f : "'" + f.replace(/'/g, "'\\''") + "'";

function runCm(skip) {
  for (const { el, bit } of cmBoxes) el.checked = !!(cmMode & bit);
  for (const [cell, shift] of cmOctCells) cell.textContent = (cmMode >> shift) & 7;
  if (skip !== cmNumeric) { cmNumeric.value = cmOctal(cmMode); cmNumeric.classList.remove('err'); }
  if (skip !== cmSymbolic) { cmSymbolic.value = cmToSymbolic(cmMode); cmSymbolic.classList.remove('err'); }

  const file = cmQuote(cmFile.value.trim() || 'file');
  const from = cmParse(cmFrom.value);
  cmFrom.classList.toggle('err', from === null);
  cmFromSym.textContent = from === null ? 'invalid' : cmToSymbolic(from);

  const rel = from === null ? null : cmRelative(from, cmMode);
  const rows = [
    ['Numeric', 'chmod ' + cmOctal(cmMode) + ' ' + file],
    ['Symbolic (=)', 'chmod ' + cmAbsolute(cmMode) + ' ' + file],
    ['Relative (+/-)', rel === null ? null : rel ? 'chmod ' + rel + ' ' + file : null,
      rel === null ? 'Enter a valid current mode' : 'No change from current mode'],
    ['Recursive', 'chmod -R ' + cmOctal(cmMode) + ' ' + file],
    ['ls -l', '-' + cmToSymbolic(cmMode)]
  ];
  cmCmds.innerHTML = '';
  for (const [label, cmd, msg] of rows) {
    const row = document.createElement('div');
    row.className = 'cm-cmd';
    row.innerHTML = '<span class="nb-label"></span><code></code>';
    row.querySelector('.nb-label').textContent = label;
    row.querySelector('code').textContent = cmd || msg;
    if (cmd) {
      const b = document.createElement('button');
      b.className = 'btn';
      b.textContent = '📋 Copy';
      b.onclick = () => copyText(cmd, b);
      row.appendChild(b);
    } else {
      row.querySelector('code').style.color = 'var(--text-muted)';
    }
    cmCmds.appendChild(row);
  }
}

for (const { el, bit } of cmBoxes) el.addEventListener('change', () => {
  cmMode = el.checked ? cmMode | bit : cmMode & ~bit;
  runCm();
});
for (const input of [cmNumeric, cmSymbolic]) input.addEventListener('input', () => {
  const m = input === cmNumeric
    ? (/^[0-7]{1,4}$/.test(input.value.trim()) ? parseInt(input.value.trim(), 8) : null)
    : cmParse(input.value);
  input.classList.toggle('err', m === null);
  if (m === null) return;
  cmMode = m;
  runCm(input);
});
cmFile.addEventListener('input', () => runCm());
cmFrom.addEventListener('input', () => runCm());
document.querySelectorAll('[data-cm-copy]').forEach(b => {
  b.onclick = () => copyText(document.getElementById(b.dataset.cmCopy).value, b);
});

/* ---------------- Milliseconds to Seconds ---------------- */
const msMillis = document.getElementById('msMillis');
const msSeconds = document.getElementById('msSeconds');
const msHours = document.getElementById('msHours');
const msDays = document.getElementById('msDays');
const MS_FIELD_UNITS = new Map([[msHours, 3600000], [msDays, 86400000]]);
const msInfo = document.getElementById('msInfo');
const msJava = document.getElementById('msJava');
let msValue = 300000;

const MS_ONES = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN',
  'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
const MS_TENS = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];
const MS_SCALES = [[1e12, 'TRILLION'], [1e9, 'BILLION'], [1e6, 'MILLION'], [1e3, 'THOUSAND']];

// 1234 -> ONE_THOUSAND_TWO_HUNDRED_THIRTY_FOUR (Java identifiers can't start with a digit)
function msWords(n) {
  if (n < 20) return MS_ONES[n];
  if (n < 100) return MS_TENS[Math.floor(n / 10)] + (n % 10 ? '_' + MS_ONES[n % 10] : '');
  if (n < 1000) return MS_ONES[Math.floor(n / 100)] + '_HUNDRED' + (n % 100 ? '_' + msWords(n % 100) : '');
  for (const [v, w] of MS_SCALES) {
    if (n >= v) return msWords(Math.floor(n / v)) + '_' + w + (n % v ? '_' + msWords(n % v) : '');
  }
}

const msGroup = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '_'); // 300000 -> 300_000
const msTrim = (whole, frac, digits) => {
  const f = String(frac).padStart(digits, '0').replace(/0+$/, '');
  return whole + (f ? '.' + f : '');
};
const msDec = (ms, unit) => {
  const v = ms / unit;
  return Number.isInteger(v) ? String(v) : v.toFixed(6).replace(/0+$/, '');
};

// Matches java.time.Duration#toString (hours are not rolled into days)
function msIso(ms) {
  if (ms === 0) return 'PT0S';
  const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60, f = ms % 1000;
  return 'PT' + (h ? h + 'H' : '') + (m ? m + 'M' : '') + (s || f ? msTrim(s, f, 3) + 'S' : '');
}

function msHuman(ms) {
  if (ms === 0) return '0ms';
  const parts = [[86400000, 'd'], [3600000, 'h'], [60000, 'm'], [1000, 's'], [1, 'ms']];
  const out = [];
  for (const [v, u] of parts) { const q = Math.floor(ms / v); ms %= v; if (q) out.push(q + u); }
  return out.join(' ');
}

// Picks the largest exact unit (days, hours, minutes, seconds, else millis) for the Duration factory + constant name
function msUnit(ms) {
  if (ms === 0) return { n: 0, name: 'ZERO', factory: 'Duration.ZERO', tu: 'SECONDS' };
  const pick = (n, word, method, tu) => ({
    n, name: msWords(n) + '_' + (n === 1 ? word.slice(0, -1) : word),
    factory: 'Duration.' + method + '(' + msGroup(n) + ')', tu
  });
  if (ms % 86400000 === 0) return pick(ms / 86400000, 'DAYS', 'ofDays', 'DAYS');
  if (ms % 3600000 === 0) return pick(ms / 3600000, 'HOURS', 'ofHours', 'HOURS');
  if (ms % 60000 === 0) return pick(ms / 60000, 'MINUTES', 'ofMinutes', 'MINUTES');
  if (ms % 1000 === 0) return pick(ms / 1000, 'SECONDS', 'ofSeconds', 'SECONDS');
  return pick(ms, 'MILLISECONDS', 'ofMillis', 'MILLISECONDS');
}

function msHighlight(code) {
  return code.split('\n').map(line => {
    const i = line.indexOf('//');
    const src = i < 0 ? line : line.slice(0, i);
    const body = esc(src).replace(/\b(import|private|static|final|long|new)\b|\b(\d[\d_]*L?)\b/g,
      (_, kw, num) => kw ? '<span class="k">' + kw + '</span>' : '<span class="n">' + num + '</span>');
    return body + (i < 0 ? '' : '<span class="c">' + esc(line.slice(i)) + '</span>');
  }).join('\n');
}

function msRow(parent, label, text) {
  const row = document.createElement('div');
  row.className = 'cm-cmd';
  row.innerHTML = '<span class="nb-label"></span><code></code><button class="btn">📋 Copy</button>';
  row.querySelector('.nb-label').textContent = label;
  row.querySelector('code').textContent = text;
  row.querySelector('button').onclick = e => copyText(text, e.currentTarget);
  parent.appendChild(row);
}

function msSnippet(label, code) {
  const box = document.createElement('div');
  box.className = 'ms-snip';
  box.innerHTML = '<div class="ms-snip-head"><span class="nb-label"></span><button class="btn nb-mini">📋 Copy</button></div><pre></pre>';
  box.querySelector('.nb-label').textContent = label;
  box.querySelector('pre').innerHTML = msHighlight(code);
  box.querySelector('button').onclick = e => copyText(code, e.currentTarget);
  msJava.appendChild(box);
}

function runMs(skip) {
  const ms = msValue;
  if (skip !== msMillis) { msMillis.value = String(ms); msMillis.classList.remove('err'); }
  if (skip !== msSeconds) { msSeconds.value = msTrim(Math.floor(ms / 1000), ms % 1000, 3); msSeconds.classList.remove('err'); }
  for (const [el, unit] of MS_FIELD_UNITS) {
    if (skip !== el) { el.value = msDec(ms, unit); el.classList.remove('err'); }
  }

  msInfo.innerHTML = '';
  msRow(msInfo, 'Minutes', msDec(ms, 60000));
  msRow(msInfo, 'Readable', msHuman(ms));
  msRow(msInfo, 'ISO-8601', msIso(ms));

  const u = msUnit(ms);
  const tuExpr = ms === 0 ? '0L' : 'TimeUnit.' + u.tu + '.toMillis(' + msGroup(u.n) + ')';
  msJava.innerHTML = '';
  msSnippet('Constant — java.time.Duration (recommended, Java 8+)',
    'import java.time.Duration;\n\n' +
    'private static final Duration ' + u.name + ' = ' + u.factory + ';');
  msSnippet('Using it',
    'Thread.sleep(' + u.name + ');  // Java 19+ accepts a Duration\n' +
    'HttpClient.newBuilder().connectTimeout(' + u.name + ');\n' +
    'long millis = ' + u.name + '.toMillis();  // ' + msGroup(ms) + ' — for APIs that still take a long');
  msSnippet('When you need a long (legacy APIs)',
    'private static final long ' + u.name + '_MS = ' + (ms === 0 ? '0L' : u.factory + '.toMillis()') + ';  // ' + msGroup(ms) + '\n' +
    '// or: ' + tuExpr);
  const note = document.createElement('p');
  note.className = 'ms-note';
  note.textContent = 'Prefer passing a Duration over a raw long: the unit travels with the value, so there\'s no ' +
    '"was that seconds or millis?" bug. Avoid magic numbers like 300000; if you must write a literal, use underscores (' +
    msGroup(ms) + 'L).';
  msJava.appendChild(note);
}

function msParse(input) {
  const t = input.value.trim().replace(/[_,\s]/g, '');
  if (input === msMillis) return /^\d+$/.test(t) && Number.isSafeInteger(+t) ? +t : null;
  if (MS_FIELD_UNITS.has(input)) {
    // hours/days: any decimal, rounded to the nearest millisecond
    if (!/^\d+(\.\d+)?$/.test(t)) return null;
    const ms = Math.round(parseFloat(t) * MS_FIELD_UNITS.get(input));
    return Number.isSafeInteger(ms) ? ms : null;
  }
  const m = /^(\d+)(?:\.(\d{1,3}))?$/.exec(t);
  if (!m) return null;
  const ms = +m[1] * 1000 + +(m[2] || '0').padEnd(3, '0');
  return Number.isSafeInteger(ms) ? ms : null;
}

for (const input of [msMillis, msSeconds, msHours, msDays]) input.addEventListener('input', () => {
  const v = msParse(input);
  input.classList.toggle('err', v === null);
  if (v === null) return;
  msValue = v;
  runMs(input);
});
document.querySelectorAll('[data-ms-copy]').forEach(b => {
  b.onclick = () => copyText(document.getElementById(b.dataset.msCopy).value, b);
});
const msPresets = document.getElementById('msPresets');
for (const [label, v] of [['500ms', 500], ['1s', 1000], ['30s', 30000], ['90s', 90000], ['5m', 300000], ['1h', 3600000], ['1d', 86400000]]) {
  const b = document.createElement('button');
  b.className = 'btn nb-mini';
  b.textContent = label;
  b.onclick = () => { msValue = v; runMs(); };
  msPresets.appendChild(b);
}

/* ---------------- Cron Expression ---------------- */
// Internally day-of-week is always 0-6 (Sunday = 0) and months 1-12, whatever the source format.
const CR_DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const CR_MON = MONTHS.map(m => m.toUpperCase());
const CR_FIELDS = {
  sec: { label: 'Second', min: 0, max: 59, unit: 'second' },
  min: { label: 'Minute', min: 0, max: 59, unit: 'minute' },
  hour: { label: 'Hour', min: 0, max: 23, unit: 'hour' },
  dom: { label: 'Day of month', min: 1, max: 31, unit: 'day' },
  month: { label: 'Month', min: 1, max: 12, unit: 'month' },
  dow: { label: 'Day of week', min: 0, max: 6, unit: 'day' },
  year: { label: 'Year', min: 1970, max: 2099, unit: 'year' }
};
const CR_FORMATS = {
  linux: {
    name: 'Linux crontab', fields: ['min', 'hour', 'dom', 'month', 'dow'], dowRaw: [0, 7], q: false, specials: false, orDays: true,
    hint: '5 fields: minute hour day-of-month month day-of-week',
    macros: { '@yearly': '0 0 1 1 *', '@annually': '0 0 1 1 *', '@monthly': '0 0 1 * *', '@weekly': '0 0 * * 0', '@daily': '0 0 * * *', '@midnight': '0 0 * * *', '@hourly': '0 * * * *' }
  },
  quartz: {
    name: 'Quartz', fields: ['sec', 'min', 'hour', 'dom', 'month', 'dow', 'year'], dowRaw: [1, 7], q: true, specials: true, orDays: false,
    hint: '6–7 fields: second minute hour day-of-month month day-of-week [year]', macros: null
  },
  spring: {
    name: 'Spring', fields: ['sec', 'min', 'hour', 'dom', 'month', 'dow'], dowRaw: [0, 7], q: true, specials: true, orDays: false,
    hint: '6 fields: second minute hour day-of-month month day-of-week',
    macros: { '@yearly': '0 0 0 1 1 *', '@annually': '0 0 0 1 1 *', '@monthly': '0 0 0 1 * *', '@weekly': '0 0 0 * * 0', '@daily': '0 0 0 * * *', '@midnight': '0 0 0 * * *', '@hourly': '0 0 * * * *' }
  }
};
const CR_DEFAULTS = { linux: '*/15 9-17 * * 1-5', quartz: '0 */15 9-17 ? * MON-FRI', spring: '0 */15 9-17 * * MON-FRI' };
// Presets are written in Spring syntax (a superset) and converted to the active format; ones that can't convert are hidden.
const CR_PRESETS = [
  ['Every minute', '0 * * * * *'], ['Every 30 seconds', '*/30 * * * * *'], ['Every 5 minutes', '0 */5 * * * *'],
  ['Every 15 minutes', '0 */15 * * * *'], ['Every hour, on the hour', '0 0 * * * *'], ['Every 2 hours', '0 0 */2 * * *'],
  ['Every day at midnight', '0 0 0 * * *'], ['Every day at 09:00', '0 0 9 * * *'], ['Weekdays at 09:00', '0 0 9 * * MON-FRI'],
  ['Every 15 min, business hours', '0 */15 9-17 * * MON-FRI'], ['Every Sunday at midnight', '0 0 0 * * SUN'],
  ['1st of every month', '0 0 0 1 * *'], ['Every quarter', '0 0 0 1 */3 *'], ['Once a year (Jan 1)', '0 0 0 1 1 *'],
  ['Last day of the month', '0 0 0 L * *'], ['Last weekday of the month', '0 0 18 LW * *'],
  ['Last Friday of the month', '0 0 17 * * FRIL'], ['2nd Monday of the month', '0 0 9 * * MON#2']
];

const crDowToInternal = (fmt, raw) => fmt === 'quartz' ? raw - 1 : raw % 7;
const crDowToRaw = (fmt, i) => fmt === 'quartz' ? i + 1 : i;
const crDowTok = (fmt, i) => fmt === 'linux' ? String(i) : CR_DOW[i];
const crIsSpecial = it => ['L', 'LW', 'W', 'lastDow', 'nth'].includes(it.k);
const crFree = tok => tok === '*' || tok === '?';

// Parses one field into { any, q, star, items, set }. Throws a readable message on error.
function crParseField(tok, key, fmt) {
  const F = CR_FIELDS[key], FM = CR_FORMATS[fmt];
  const [lo, hi] = key === 'dow' ? FM.dowRaw : [F.min, F.max];
  const toI = raw => key === 'dow' ? crDowToInternal(fmt, raw) : raw;
  const ast = { tok, key, any: false, q: false, star: tok.startsWith('*'), items: [], set: new Set() };
  if (tok === '?') {
    if (!FM.q) throw 'Linux cron doesn\'t support "?" (use *)';
    if (key !== 'dom' && key !== 'dow') throw '"?" is only allowed in day-of-month or day-of-week';
    ast.any = ast.q = true;
    return ast;
  }
  if (tok === '*') {
    ast.any = true;
    for (let v = lo; v <= hi; v++) ast.set.add(toI(v));
    return ast;
  }
  const val = s => {
    if (/^\d+$/.test(s)) {
      const n = +s;
      if (n < lo || n > hi) throw `${s} is out of range (${lo}–${hi})`;
      return n;
    }
    const u = s.toUpperCase();
    if (key === 'month' && CR_MON.includes(u)) return CR_MON.indexOf(u) + 1;
    if (key === 'dow' && CR_DOW.includes(u)) return crDowToRaw(fmt, CR_DOW.indexOf(u));
    throw `"${s}" isn't a valid ${F.label.toLowerCase()}`;
  };
  for (const part of tok.split(',')) {
    if (!part) throw 'empty value in list';
    let m;
    if (FM.specials && key === 'dom') {
      if ((m = /^L(?:-(\d+))?$/i.exec(part))) {
        const off = +(m[1] || 0);
        if (off > 30) throw 'L-n offset must be 0–30';
        ast.items.push({ k: 'L', off });
        continue;
      }
      if (/^LW$/i.test(part)) { ast.items.push({ k: 'LW' }); continue; }
      if ((m = /^(\d+)W$/i.exec(part))) { ast.items.push({ k: 'W', day: val(m[1]) }); continue; }
    }
    if (FM.specials && key === 'dow') {
      if (fmt === 'quartz' && /^L$/i.test(part)) { ast.items.push({ k: 'v', a: 6 }); ast.set.add(6); continue; }
      if ((m = /^(\w+?)L$/i.exec(part))) { ast.items.push({ k: 'lastDow', d: toI(val(m[1])) }); continue; }
      if ((m = /^(\w+)#(\d+)$/i.exec(part))) {
        if (+m[2] < 1 || +m[2] > 5) throw '# must be followed by 1–5 (e.g. MON#2)';
        ast.items.push({ k: 'nth', d: toI(val(m[1])), n: +m[2] });
        continue;
      }
    }
    m = /^(?:(\*)|(\w+)(?:-(\w+))?)(?:\/(\d+))?$/.exec(part);
    if (!m) throw `can't understand "${part}"`;
    const step = m[4] === undefined ? 1 : +m[4];
    if (step < 1) throw 'step must be at least 1';
    let a, b, k;
    if (m[1]) { a = lo; b = hi; k = 'all'; }
    else {
      a = val(m[2]);
      b = m[3] !== undefined ? val(m[3]) : m[4] !== undefined ? hi : a;
      k = m[3] !== undefined ? 'range' : m[4] !== undefined ? 'from' : 'v';
    }
    if (a > b) throw `range "${part}" goes backwards`;
    for (let v = a; v <= b; v += step) ast.set.add(toI(v));
    ast.items.push({ k, a: toI(a), b: toI(b), step });
  }
  if (ast.items.length > 1 && ast.items.some(crIsSpecial)) throw 'L, W and # can\'t be combined with other values';
  return ast;
}

function crParse(expr, fmt) {
  const FM = CR_FORMATS[fmt];
  let text = expr.trim(), macro = null;
  if (!text) return { fmt, err: 'Enter a cron expression' };
  if (text.startsWith('@')) {
    const low = text.toLowerCase();
    if (low === '@reboot') return { fmt, err: '@reboot runs once at startup; it has no repeating schedule' };
    if (!FM.macros || !FM.macros[low]) {
      return { fmt, err: `${FM.name} doesn't support ${text}` + (FM.macros ? ' (try @yearly, @monthly, @weekly, @daily or @hourly)' : '') };
    }
    macro = low;
    text = FM.macros[low];
  }
  const toks = text.split(/\s+/);
  const ok = fmt === 'quartz' ? toks.length === 6 || toks.length === 7 : toks.length === FM.fields.length;
  if (!ok) {
    const names = FM.fields.map(k => CR_FIELDS[k].label.toLowerCase());
    if (fmt === 'quartz') names[6] = '[year]';
    let tip = '';
    if (fmt === 'linux' && toks.length === 6) tip = ' Looks like it has a seconds field; switch to Quartz or Spring above.';
    if (fmt !== 'linux' && toks.length === 5) tip = ' Looks like a Linux expression (no seconds); switch to Linux crontab above.';
    return { fmt, toks, err: `${FM.name} expressions have ${fmt === 'quartz' ? '6 or 7' : FM.fields.length} fields (${names.join(', ')}); found ${toks.length}.${tip}` };
  }
  const f = {}, tokens = {}, fieldErr = {};
  FM.fields.forEach((k, i) => {
    const t = toks[i] ?? '*';
    tokens[k] = t;
    try { f[k] = crParseField(t, k, fmt); } catch (e) { fieldErr[k] = String(e); }
  });
  if (fmt === 'quartz' && f.dom && f.dow) {
    if (f.dom.q && f.dow.q) fieldErr.dow = 'Quartz allows "?" in only one of day-of-month / day-of-week';
    else if (!f.dom.q && !f.dow.q) {
      fieldErr[f.dow.any ? 'dow' : 'dom'] = 'Quartz needs "?" in exactly one of day-of-month or day-of-week, e.g. "0 0 12 * * ?" or "0 0 12 ? * MON"';
    }
  }
  const errs = Object.entries(fieldErr);
  return {
    fmt, f, tokens, toks, macro, fieldErr,
    err: errs.length ? errs.map(([k, e]) => CR_FIELDS[k].label + ': ' + e).join(' · ') : null
  };
}

/* --- matching & next run times --- */
const crDaysIn = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate();
const crWd = (y, m, d) => new Date(Date.UTC(y, m - 1, d)).getUTCDay();
function crNearestWeekday(y, m, n, last) {
  if (n > last) return -1;
  const w = crWd(y, m, n);
  if (w === 6) return n === 1 ? 3 : n - 1;
  if (w === 0) return n === last ? n - 2 : n + 1;
  return n;
}
function crDomMatch(ast, y, m, d, last) {
  if (ast.set.has(d)) return true;
  for (const it of ast.items) {
    if (it.k === 'L' && d === last - it.off) return true;
    if (it.k === 'LW') { const w = crWd(y, m, last); if (d === (w === 6 ? last - 1 : w === 0 ? last - 2 : last)) return true; }
    if (it.k === 'W' && d === crNearestWeekday(y, m, it.day, last)) return true;
  }
  return false;
}
function crDowMatch(ast, d, wd, last) {
  if (ast.set.has(wd)) return true;
  return ast.items.some(it =>
    (it.k === 'lastDow' && it.d === wd && d + 7 > last) || (it.k === 'nth' && it.d === wd && Math.ceil(d / 7) === it.n));
}
function crDayMatch(p, y, m, d, wd, last) {
  const { dom, dow } = p.f;
  const a = dom.any || crDomMatch(dom, y, m, d, last);
  const b = dow.any || crDowMatch(dow, d, wd, last);
  // Linux quirk: if neither day field starts with "*", the job runs when EITHER matches
  return CR_FORMATS[p.fmt].orDays && !dom.star && !dow.star ? a || b : a && b;
}
function crNext(p, from, count, utc) {
  const out = [];
  const sorted = ast => [...ast.set].sort((x, y) => x - y);
  const secs = p.f.sec ? sorted(p.f.sec) : [0], mins = sorted(p.f.min), hours = sorted(p.f.hour);
  const years = p.f.year && !p.f.year.any ? p.f.year.set : null;
  let y = utc ? from.getUTCFullYear() : from.getFullYear();
  let m = (utc ? from.getUTCMonth() : from.getMonth()) + 1;
  let d = utc ? from.getUTCDate() : from.getDate();
  let wd = crWd(y, m, d), last = crDaysIn(y, m);
  const endY = y + 30;
  while (y <= endY) {
    if (years && !years.has(y)) {
      y++; m = 1; d = 1; wd = crWd(y, 1, 1); last = 31;
      continue;
    }
    if (p.f.month.set.has(m) && crDayMatch(p, y, m, d, wd, last)) {
      for (const h of hours) for (const mi of mins) for (const s of secs) {
        const t = utc ? new Date(Date.UTC(y, m - 1, d, h, mi, s)) : new Date(y, m - 1, d, h, mi, s);
        if (t <= from) continue;
        if (!utc && (t.getHours() !== h || t.getMinutes() !== mi)) continue; // skipped by a DST change
        out.push(t);
        if (out.length >= count) return out;
      }
    }
    d++; wd = (wd + 1) % 7;
    if (d > last) { d = 1; m++; if (m > 12) { m = 1; y++; } last = crDaysIn(y, m); }
  }
  return out;
}

/* --- plain-English description --- */
const crOrd = n => ['first', 'second', 'third', 'fourth', 'fifth'][n - 1];
const crJoin = arr => arr.length <= 1 ? (arr[0] || '') : arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
const crHM = (h, m, s) => pad(h) + ':' + pad(m) + (s === undefined ? '' : ':' + pad(s));
const crValName = (key, v) => key === 'month' ? MONTHS_FULL[v - 1] : key === 'dow' ? DAYS_FULL[v] : String(v);
const crPlural = (n, u) => n === 1 ? u : n + ' ' + u + 's';

function crItemText(it, key) {
  const n = v => crValName(key, v);
  switch (it.k) {
    case 'v': return n(it.a);
    case 'range': return n(it.a) + ' through ' + n(it.b) + (it.step > 1 ? ` (every ${it.step})` : '');
    case 'from': return `every ${it.step} starting at ${n(it.a)}`;
    case 'all': return `every ${it.step}`;
    case 'L': return it.off ? `the ${it.off + 1}${crSuffix(it.off + 1)}-to-last day of the month` : 'the last day of the month';
    case 'LW': return 'the last weekday (Mon–Fri) of the month';
    case 'W': return `the weekday (Mon–Fri) nearest the ${it.day}${crSuffix(it.day)}`;
    case 'lastDow': return `the last ${DAYS_FULL[it.d]} of the month`;
    case 'nth': return `the ${crOrd(it.n)} ${DAYS_FULL[it.d]} of the month`;
  }
}
const crSuffix = n => (n % 100 >= 11 && n % 100 <= 13) ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th';

function crUnitPhrase(ast, key) {
  const u = CR_FIELDS[key].unit;
  if (ast.any) return 'every ' + u;
  const its = ast.items;
  if (its.length === 1) {
    const it = its[0];
    if (it.k === 'all') return 'every ' + crPlural(it.step, u);
    if (it.k === 'v') return `at ${u} ${it.a}`;
    if (it.k === 'from') return `every ${crPlural(it.step, u)} starting at ${u} ${it.a}`;
    if (it.k === 'range') return `every ${crPlural(it.step, u)} from ${it.a} through ${it.b}`;
  }
  return `at ${u}s ` + crJoin(its.map(it => crItemText(it, key)));
}

function crTimePhrase(f) {
  const simple = a => a && !a.any && a.items.every(i => i.k === 'v');
  const vals = a => [...a.set].sort((x, y) => x - y);
  const secZero = !f.sec || (simple(f.sec) && f.sec.set.size === 1 && f.sec.set.has(0));
  if (simple(f.min) && simple(f.hour) && (secZero || simple(f.sec))) {
    const ss = secZero ? [undefined] : vals(f.sec);
    if (f.min.set.size * f.hour.set.size * ss.length <= 6) {
      const times = [];
      for (const h of vals(f.hour)) for (const m of vals(f.min)) for (const s of ss) times.push(crHM(h, m, s));
      return 'at ' + crJoin(times);
    }
  }
  const parts = [];
  if (!secZero) parts.push(crUnitPhrase(f.sec, 'sec'));
  if (secZero || !f.min.any) parts.push(crUnitPhrase(f.min, 'min'));
  const h = f.hour;
  if (h.any) {
    if (simple(f.min) && f.min.set.size === 1 && secZero) parts[parts.length - 1] += ' past every hour';
  } else if (h.items.length === 1 && h.items[0].k === 'all') {
    parts.push('every ' + crPlural(h.items[0].step, 'hour'));
  } else if (h.items.length === 1 && h.items[0].k === 'range' && h.items[0].step === 1) {
    parts.push(`between ${crHM(h.items[0].a, 0)} and ${crHM(h.items[0].b, 59)}`);
  } else if (simple(h)) {
    parts.push(h.set.size === 1 ? `between ${crHM(vals(h)[0], 0)} and ${crHM(vals(h)[0], 59)}`
      : 'during the ' + crJoin(vals(h).map(x => crHM(x, 0))) + ' hours');
  } else {
    parts.push('past hours ' + crJoin(h.items.map(it => crItemText(it, 'hour'))));
  }
  return parts.join(', ');
}

function crDomPhrase(ast) {
  const its = ast.items;
  if (its.length === 1) {
    const it = its[0];
    if (it.k === 'all') return 'every ' + crPlural(it.step, 'day');
    if (it.k === 'from') return `every ${crPlural(it.step, 'day')} starting on the ${it.a}${crSuffix(it.a)}`;
    if (it.k === 'range') return it.step === 1 ? `on days ${it.a} through ${it.b} of the month` : `every ${crPlural(it.step, 'day')} from day ${it.a} through ${it.b}`;
    if (crIsSpecial(it)) return 'on ' + crItemText(it, 'dom');
  }
  if (its.every(i => i.k === 'v')) return 'on day ' + crJoin(its.map(i => String(i.a))) + ' of the month';
  return 'on days ' + crJoin(its.map(it => crItemText(it, 'dom'))) + ' of the month';
}

function crListPhrase(ast, key, prefix) {
  const its = ast.items;
  const U = key === 'month' ? 'month' : 'year';
  if (its.length === 1 && its[0].k === 'all') return 'every ' + crPlural(its[0].step, U);
  if (its.length === 1 && its[0].k === 'from') return `every ${crPlural(its[0].step, U)} starting in ${crValName(key, its[0].a)}`;
  return prefix + crJoin(its.map(it => crItemText(it, key)));
}

function crDescribe(p) {
  const f = p.f;
  const out = [crTimePhrase(f)];
  const domP = f.dom.any ? '' : crDomPhrase(f.dom);
  const dowP = f.dow.any ? '' : 'on ' + crJoin(f.dow.items.map(it => it.k === 'all' && it.step > 1
    ? `every ${it.step}${crSuffix(it.step)} day of the week` : crItemText(it, 'dow')));
  if (domP && dowP) {
    out.push(CR_FORMATS[p.fmt].orDays && !f.dom.star && !f.dow.star ? `${domP} OR ${dowP}` : `${domP}, but only ${dowP}`);
  } else if (domP || dowP) out.push(domP || dowP);
  if (!f.month.any) out.push(crListPhrase(f.month, 'month', 'only in '));
  if (f.year && !f.year.any) out.push(crListPhrase(f.year, 'year', 'in '));
  const s = out.filter(Boolean).join(', ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* --- conversion between formats --- */
function crCompress(vals, fmtVal) {
  const v = [...vals].sort((a, b) => a - b), out = [];
  for (let i = 0; i < v.length;) {
    let j = i;
    while (j + 1 < v.length && v[j + 1] === v[j] + 1) j++;
    if (j - i >= 2) out.push(fmtVal(v[i]) + '-' + fmtVal(v[j]));
    else for (let k = i; k <= j; k++) out.push(fmtVal(v[k]));
    i = j + 1;
  }
  return out.join(',');
}
// Vixie cron doesn't accept "5/15"; it needs "5-59/15"
const crLinuxSteps = (tok, max) => tok.split(',').map(s => s.replace(/^(\d+)\/(\d+)$/, `$1-${max}/$2`)).join(',');

function crConvert(p, to) {
  const T = CR_FORMATS[to], f = p.f, t = p.tokens, lin = to === 'linux';
  const out = {};
  if (T.fields.includes('sec')) out.sec = t.sec ?? '0';
  else if (t.sec !== undefined && t.sec !== '0') return { err: `Linux cron can't schedule seconds (seconds field is "${t.sec}")` };
  if (t.year !== undefined && t.year !== '*') {
    if (!T.fields.includes('year')) return { err: `${T.name} has no year field (year is "${t.year}")` };
    out.year = t.year;
  }
  out.min = lin ? crLinuxSteps(t.min, 59) : t.min;
  out.hour = lin ? crLinuxSteps(t.hour, 23) : t.hour;
  out.month = crFree(t.month) ? '*' : lin && /[a-z]/i.test(t.month) ? crCompress(f.month.set, String) : lin ? crLinuxSteps(t.month, 12) : t.month;
  if (lin && (f.dom.items.some(crIsSpecial) || f.dow.items.some(crIsSpecial))) {
    return { err: 'Linux cron has no L, W or # (last day, nearest weekday, nth weekday)' };
  }
  let dom = crFree(t.dom) ? '*' : lin ? crLinuxSteps(t.dom, 31) : t.dom;
  let dow = '*';
  if (!crFree(t.dow)) {
    const special = f.dow.items.filter(crIsSpecial).map(it => CR_DOW[it.d] + (it.k === 'lastDow' ? 'L' : '#' + it.n));
    dow = special.length ? special.join(',') : f.dow.set.size === 7 ? '*' : crCompress(f.dow.set, i => crDowTok(to, i));
  }
  const domR = !crFree(dom), dowR = !crFree(dow);
  if (domR && dowR) {
    const srcOr = CR_FORMATS[p.fmt].orDays && !f.dom.star && !f.dow.star;
    if (srcOr && !lin) return { err: `Linux runs when EITHER the day-of-month OR the day-of-week matches; ${T.name} needs both to match, so it can't be expressed exactly` };
    if (!srcOr && lin && !dom.startsWith('*') && !dow.startsWith('*')) return { err: 'This needs BOTH day-of-month and day-of-week to match; Linux would run when either one matches' };
    if (to === 'quartz') return { err: 'Quartz can\'t restrict both day-of-month and day-of-week (one of them must be "?")' };
  }
  if (to === 'quartz') {
    if (!domR && !dowR) { dom = '*'; dow = '?'; }
    else if (domR) dow = '?';
    else dom = '?';
  }
  out.dom = dom;
  out.dow = dow;
  return { expr: T.fields.filter(k => out[k] !== undefined).map(k => out[k]).join(' ') };
}

/* --- UI --- */
const crExpr = document.getElementById('crExpr');
const crChips = document.getElementById('crChips');
const crDesc = document.getElementById('crDesc');
const crNotice = document.getElementById('crNotice');
const crBuilder = document.getElementById('crBuilder');
const crNextEl = document.getElementById('crNext');
const crUtc = document.getElementById('crUtc');
const crEquiv = document.getElementById('crEquiv');
let crFmt = 'linux';
let crRows = {}; // key -> { el, st, token }

function crSelect(options, value, onChange) {
  const wrap = document.createElement('div');
  wrap.className = 'select';
  const sel = document.createElement('select');
  for (const [v, label] of options) {
    const o = document.createElement('option');
    o.value = v;
    o.textContent = label;
    sel.appendChild(o);
  }
  sel.value = String(value);
  sel.onchange = () => onChange(sel.value);
  wrap.appendChild(sel);
  wrap.insertAdjacentHTML('beforeend', '<span class="chev">▲<br>▼</span>');
  return wrap;
}
function crValueOptions(key) {
  const F = CR_FIELDS[key], opts = [];
  if (key === 'year') {
    const y0 = new Date().getFullYear();
    for (let y = y0; y <= Math.min(y0 + 30, F.max); y++) opts.push([y, String(y)]);
    return opts;
  }
  for (let v = F.min; v <= F.max; v++) {
    opts.push([v, key === 'month' ? MONTHS[v - 1] : key === 'dow' ? DAYS[v] : key === 'hour' ? pad(v) + ':00' : String(v)]);
  }
  return opts;
}
function crModes(key) {
  const FM = CR_FORMATS[crFmt];
  const every = { sec: 'Every second', min: 'Every minute', hour: 'Every hour', dom: 'Every day', month: 'Every month', dow: 'Any day of the week', year: 'Every year' };
  const u = CR_FIELDS[key].unit;
  if (key === 'year') return [['every', every.year], ['range', 'Range of years'], ['custom', 'Custom…']];
  const modes = [['every', every[key]]];
  if (key !== 'dow') modes.push(['step', `Every N ${u}s…`]);
  modes.push(['specific', key === 'dow' ? 'Specific days…' : `Specific ${u}s…`], ['range', 'Range…']);
  if (FM.specials && key === 'dom') modes.push(['last', 'Last day of the month'], ['lastWeekday', 'Last weekday of the month'], ['nearest', 'Weekday nearest day…']);
  if (FM.specials && key === 'dow') modes.push(['lastDow', 'Last … of the month'], ['nth', 'Nth … of the month']);
  modes.push(['custom', 'Custom…']);
  return modes;
}

function crTokenToState(tok, key) {
  const F = CR_FIELDS[key], y0 = new Date().getFullYear();
  const st = {
    mode: 'custom', custom: tok, n: key === 'sec' || key === 'min' ? 15 : 2, a: key === 'year' ? y0 : F.min,
    b: key === 'year' ? y0 + 1 : key === 'dow' ? 5 : F.max, sel: new Set(), d: 5, nth: 1, day: 15
  };
  if (key === 'dow') st.a = 1;
  if (crFree(tok)) { st.mode = 'every'; return st; }
  let ast;
  try { ast = crParseField(tok, key, crFmt); } catch { return st; }
  const its = ast.items, it = its[0];
  if (key !== 'year') st.sel = new Set(ast.set); // so switching to "Specific" keeps the current values
  if (its.length === 1) {
    if (key !== 'dow' && key !== 'year' && (it.k === 'all' || it.k === 'from' || (it.k === 'range' && it.step > 1 && it.b === F.max))) {
      return Object.assign(st, { mode: 'step', n: it.step, a: it.k === 'all' ? F.min : it.a });
    }
    if (it.k === 'range' && it.step === 1 && it.a <= it.b) return Object.assign(st, { mode: 'range', a: it.a, b: it.b });
    if (it.k === 'L' && !it.off) return Object.assign(st, { mode: 'last' });
    if (it.k === 'LW') return Object.assign(st, { mode: 'lastWeekday' });
    if (it.k === 'W') return Object.assign(st, { mode: 'nearest', day: it.day });
    if (it.k === 'lastDow') return Object.assign(st, { mode: 'lastDow', d: it.d });
    if (it.k === 'nth') return Object.assign(st, { mode: 'nth', d: it.d, nth: it.n });
  }
  if (key !== 'year' && its.every(i => i.k === 'v' || (i.k === 'range' && i.step === 1))) {
    return Object.assign(st, { mode: 'specific', sel: new Set(ast.set) });
  }
  return st;
}

function crStateToken(st, key) {
  const F = CR_FIELDS[key], lin = crFmt === 'linux';
  const v = x => key === 'dow' ? crDowTok(crFmt, x) : String(x);
  switch (st.mode) {
    case 'every': return '*';
    case 'step': return (+st.a === F.min ? '*' : lin ? `${st.a}-${F.max}` : String(st.a)) + '/' + st.n;
    case 'specific': return st.sel.size ? crCompress(st.sel, v) : '*';
    case 'range': {
      const [a, b] = +st.a <= +st.b ? [+st.a, +st.b] : [+st.b, +st.a];
      return a === b ? v(a) : v(a) + '-' + v(b);
    }
    case 'last': return 'L';
    case 'lastWeekday': return 'LW';
    case 'nearest': return st.day + 'W';
    case 'lastDow': return CR_DOW[st.d] + 'L';
    case 'nth': return CR_DOW[st.d] + '#' + st.nth;
    default: return st.custom.trim() || '*';
  }
}

function crRenderControls(r) {
  const { key, st } = r, ctl = r.el.querySelector('.cr-ctl');
  ctl.innerHTML = '';
  const F = CR_FIELDS[key];
  const set = (prop, val) => { st[prop] = val; crFromBuilder(key); };
  const text = s => ctl.appendChild(document.createTextNode(s));
  const valSel = prop => crSelect(crValueOptions(key), st[prop], v => set(prop, +v));
  const dowSel = () => crSelect(DAYS_FULL.map((n, i) => [i, n]), st.d, v => set('d', +v));
  switch (st.mode) {
    case 'every':
      ctl.appendChild(Object.assign(document.createElement('span'), { textContent: '*' }));
      break;
    case 'step': {
      const nOpts = [];
      for (let i = 1; i <= Math.min(F.max - F.min, 59); i++) nOpts.push([i, String(i)]);
      text('every');
      ctl.appendChild(crSelect(nOpts, st.n, v => set('n', +v)));
      text(F.unit + '(s), starting at');
      ctl.appendChild(valSel('a'));
      break;
    }
    case 'specific': {
      const pick = document.createElement('div');
      pick.className = 'cr-pick';
      for (const [v, label] of crValueOptions(key)) {
        const b = document.createElement('button');
        b.textContent = key === 'hour' ? pad(v) : label;
        b.classList.toggle('on', st.sel.has(v));
        b.onclick = () => {
          st.sel.has(v) ? st.sel.delete(v) : st.sel.add(v);
          b.classList.toggle('on', st.sel.has(v));
          crFromBuilder(key);
        };
        pick.appendChild(b);
      }
      ctl.appendChild(pick);
      break;
    }
    case 'range':
      text('from');
      ctl.appendChild(valSel('a'));
      text('through');
      ctl.appendChild(valSel('b'));
      break;
    case 'nearest': {
      const days = [];
      for (let i = 1; i <= 31; i++) days.push([i, i + crSuffix(i)]);
      text('nearest weekday to the');
      ctl.appendChild(crSelect(days, st.day, v => set('day', +v)));
      break;
    }
    case 'lastDow':
      text('the last');
      ctl.appendChild(dowSel());
      text('of the month');
      break;
    case 'nth':
      text('the');
      ctl.appendChild(crSelect([1, 2, 3, 4, 5].map(n => [n, crOrd(n)]), st.nth, v => set('nth', +v)));
      ctl.appendChild(dowSel());
      text('of the month');
      break;
    case 'custom': {
      const inp = document.createElement('input');
      inp.className = 'nb-input';
      inp.value = st.custom;
      inp.spellcheck = false;
      inp.placeholder = 'e.g. 1,15 or 5-20/5';
      inp.oninput = () => { st.custom = inp.value; crFromBuilder(key); };
      ctl.appendChild(inp);
      break;
    }
  }
}

function crRenderRow(key, tok) {
  const r = crRows[key];
  r.token = tok;
  r.st = crTokenToState(tok, key);
  const modeWrap = r.el.querySelector('.cr-mode');
  modeWrap.innerHTML = '';
  modeWrap.appendChild(crSelect(crModes(key), r.st.mode, mode => {
    r.st.mode = mode;
    if (mode === 'specific' && !r.st.sel.size) r.st.sel.add(key === 'dow' ? 1 : CR_FIELDS[key].min);
    if (mode === 'custom') r.st.custom = r.token;
    crRenderControls(r);
    crFromBuilder(key);
  }));
  crRenderControls(r);
}

function crBuildRows(tokens) {
  crBuilder.innerHTML = '';
  crRows = {};
  for (const key of CR_FORMATS[crFmt].fields) {
    const el = document.createElement('div');
    el.className = 'cr-brow';
    el.innerHTML = '<span class="nb-label"></span><div class="cr-mode"></div><div class="cr-ctl"></div>';
    el.querySelector('.nb-label').textContent = CR_FIELDS[key].label + (key === 'year' ? ' (optional)' : '');
    crBuilder.appendChild(el);
    crRows[key] = { key, el };
    crRenderRow(key, tokens[key] ?? '*');
  }
}

// A builder control changed: rebuild that field's token, apply Quartz's "?" rule, and rewrite the expression.
function crFromBuilder(key) {
  const r = crRows[key];
  r.token = crStateToken(r.st, key);
  if (crFmt === 'quartz' && (key === 'dom' || key === 'dow')) {
    const other = crRows[key === 'dom' ? 'dow' : 'dom'];
    const setOther = tok => { if (other.token !== tok) crRenderRow(other.key, tok); };
    if (r.st.mode === 'every') {
      if (!crFree(other.token)) r.token = '?';
      else if (key === 'dom') { r.token = '*'; setOther('?'); }
      else { r.token = '?'; setOther('*'); }
    } else setOther('?');
  }
  const toks = CR_FORMATS[crFmt].fields.map(k => crRows[k].token);
  if (crFmt === 'quartz' && toks[6] === '*') toks.pop();
  crExpr.value = toks.join(' ');
  crNotice.textContent = '';
  runCr();
}

function crFmtDate(t, utc) {
  const g = utc
    ? [t.getUTCDay(), t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate(), t.getUTCHours(), t.getUTCMinutes(), t.getUTCSeconds()]
    : [t.getDay(), t.getFullYear(), t.getMonth(), t.getDate(), t.getHours(), t.getMinutes(), t.getSeconds()];
  const secs = crFmt === 'linux' ? '' : ':' + pad(g[6]);
  return `${DAYS[g[0]]} ${g[1]}-${pad(g[2] + 1)}-${pad(g[3])} ${pad(g[4])}:${pad(g[5])}${secs}`;
}
function crRel(ms) {
  const s = Math.round(ms / 1000);
  if (s < 60) return `in ${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `in ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 48) return `in ${h} h` + (m % 60 ? ` ${m % 60} min` : '');
  const d = Math.floor(h / 24);
  if (d < 60) return `in ${d} days`;
  if (d < 730) return `in ~${Math.round(d / 30.44)} months`;
  return `in ~${Math.round(d / 365.25)} years`;
}

function runCr() {
  const p = crParse(crExpr.value, crFmt);
  crExpr.classList.toggle('err', !!p.err);

  crChips.innerHTML = '';
  if (p.tokens) {
    for (const key of CR_FORMATS[crFmt].fields) {
      if (key === 'year' && p.toks.length < 7) continue;
      const chip = document.createElement('div');
      chip.className = 'cr-chip' + (p.fieldErr[key] ? ' err' : '');
      chip.title = p.fieldErr[key] || 'Click to edit in the builder';
      chip.innerHTML = '<b></b><span></span>';
      chip.querySelector('b').textContent = p.tokens[key];
      chip.querySelector('span').textContent = CR_FIELDS[key].label;
      chip.onclick = () => {
        const row = crRows[key].el;
        row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        row.classList.add('flash');
        setTimeout(() => row.classList.remove('flash'), 700);
      };
      crChips.appendChild(chip);
    }
    for (const key of CR_FORMATS[crFmt].fields) {
      if (crRows[key] && crRows[key].token !== p.tokens[key]) crRenderRow(key, p.tokens[key]);
    }
  }

  crEquiv.innerHTML = '';
  crNextEl.innerHTML = '';
  if (p.err) {
    crDesc.className = 'cr-desc bad';
    crDesc.textContent = p.err;
    crNextEl.innerHTML = '<li class="none">Fix the expression to see run times.</li>';
    return;
  }
  crDesc.className = 'cr-desc';
  crDesc.textContent = crDescribe(p) + '.';
  const sub = [];
  if (p.macro) sub.push(`${p.macro} is shorthand for "${CR_FORMATS[crFmt].macros[p.macro]}".`);
  if (CR_FORMATS[crFmt].orDays && !p.f.dom.star && !p.f.dow.star) {
    sub.push('Note: in Linux cron, when both day-of-month and day-of-week are set, the job runs when EITHER one matches.');
  }
  if (sub.length) crDesc.insertAdjacentHTML('beforeend', '<small>' + esc(sub.join(' ')) + '</small>');

  const utc = crUtc.checked, now = new Date();
  document.getElementById('crTz').textContent = 'Times in ' + (utc ? 'UTC' : Intl.DateTimeFormat().resolvedOptions().timeZone + ' (your local time zone)');
  const runs = crNext(p, now, 10, utc);
  if (!runs.length) crNextEl.innerHTML = '<li class="none">Never runs in the next 30 years (e.g. 30 February or a past year).</li>';
  for (const t of runs) {
    const li = document.createElement('li');
    li.innerHTML = '<span></span><em></em>';
    li.querySelector('span').textContent = crFmtDate(t, utc);
    li.querySelector('em').textContent = crRel(t - now);
    crNextEl.appendChild(li);
  }

  for (const to of Object.keys(CR_FORMATS)) {
    if (to === crFmt) continue;
    const c = crConvert(p, to);
    const row = document.createElement('div');
    row.className = 'cm-cmd';
    row.innerHTML = '<span class="nb-label"></span><code></code>';
    row.querySelector('.nb-label').textContent = CR_FORMATS[to].name;
    const code = row.querySelector('code');
    if (c.expr) {
      code.textContent = c.expr;
      const b = document.createElement('button');
      b.className = 'btn';
      b.textContent = '📋 Copy';
      b.onclick = () => copyText(c.expr, b);
      row.appendChild(b);
    } else {
      code.textContent = 'Not expressible: ' + c.err;
      code.style.color = 'var(--text-muted)';
      code.style.whiteSpace = 'normal';
    }
    crEquiv.appendChild(row);
  }
}

function crRenderStatic() {
  const FM = CR_FORMATS[crFmt];
  document.querySelectorAll('#crFormat button').forEach(b => b.classList.toggle('on', b.dataset.fmt === crFmt));
  document.getElementById('crFmtHint').textContent = FM.hint;
  crExpr.placeholder = CR_DEFAULTS[crFmt];

  const presets = document.getElementById('crPresets');
  presets.innerHTML = '';
  for (const [label, spring] of CR_PRESETS) {
    const expr = crFmt === 'spring' ? spring : crConvert(crParse(spring, 'spring'), crFmt).expr;
    if (!expr) continue;
    const b = document.createElement('button');
    b.innerHTML = '<span></span><code></code>';
    b.querySelector('span').textContent = label;
    b.querySelector('code').textContent = expr;
    b.onclick = () => { crExpr.value = expr; crNotice.textContent = ''; runCr(); };
    presets.appendChild(b);
  }

  const dowAllowed = {
    linux: '<code>0-7</code> or <code>SUN-SAT</code> (0 and 7 = Sunday)',
    quartz: '<code>1-7</code> or <code>SUN-SAT</code> (<b>1 = Sunday</b>, 2 = Monday)',
    spring: '<code>0-7</code> or <code>SUN-SAT</code> (0 and 7 = Sunday)'
  }[crFmt];
  const base = '<code>* , - /</code>';
  const ref = {
    sec: ['<code>0-59</code>', base], min: ['<code>0-59</code>', base], hour: ['<code>0-23</code>', base],
    dom: ['<code>1-31</code>', FM.specials ? '<code>* , - / ? L W</code>' : base],
    month: ['<code>1-12</code> or <code>JAN-DEC</code>', base],
    dow: [dowAllowed, FM.specials ? '<code>* , - / ? L #</code>' : base],
    year: ['empty or <code>1970-2099</code>', base]
  };
  document.getElementById('crRef').innerHTML = '<tr><th>Field</th><th>Allowed values</th><th>Special characters</th></tr>' +
    FM.fields.map(k => `<tr><td>${CR_FIELDS[k].label}</td><td>${ref[k][0]}</td><td>${ref[k][1]}</td></tr>`).join('');

  const legend = [['*', 'any value'], [',', 'list (1,15)'], ['-', 'range (9-17)'], ['/', 'step (*/15)']];
  if (FM.specials) legend.push(['?', 'no specific value'], ['L', 'last (day / weekday of month)'], ['W', 'nearest weekday'], ['#', 'nth weekday (MON#2)']);
  if (FM.macros) legend.push(['@daily', '@hourly, @weekly, @monthly, @yearly shortcuts']);
  document.getElementById('crLegend').innerHTML = legend.map(([c, d]) => `<span><code>${esc(c)}</code> ${esc(d)}</span>`).join('');

  const diffs = {
    linux: '<b>Linux crontab:</b> 5 fields, no seconds. Day-of-week 0-7 (0 and 7 = Sunday). If both day-of-month and day-of-week are set, it runs when <b>either</b> matches. Names can\'t be used in lists or ranges on many systems, so numbers are safest.',
    quartz: '<b>Quartz:</b> 6 or 7 fields, seconds first, optional year at the end. Day-of-week is <b>1-7 with 1 = Sunday</b>. Exactly one of day-of-month / day-of-week must be <code>?</code>. Supports L, W and #.',
    spring: '<b>Spring</b> (<code>@Scheduled(cron = …)</code>, Spring 5.3+): 6 fields, seconds first, no year. Day-of-week is 0-7 like Linux (0 and 7 = Sunday), not like Quartz. <code>?</code> is optional. Supports L, W, # and @daily-style macros. Both day fields must match.'
  };
  document.getElementById('crDiff').innerHTML = Object.entries(diffs).map(([k, html]) => `<li class="${k === crFmt ? 'cur' : ''}">${html}</li>`).join('');
}

function crSetFormat(fmt) {
  if (fmt === crFmt) return;
  const p = crParse(crExpr.value, crFmt);
  let expr = null, why = '';
  if (!p.err) {
    const c = crConvert(p, fmt);
    expr = c.expr;
    why = c.err;
  }
  const from = CR_FORMATS[crFmt].name;
  crFmt = fmt;
  crNotice.textContent = expr ? '' : `Couldn't convert from ${from}${why ? ': ' + why : ''}. Loaded an example instead.`;
  crExpr.value = expr || CR_DEFAULTS[fmt];
  const p2 = crParse(crExpr.value, fmt);
  crBuildRows(p2.tokens || {});
  crRenderStatic();
  runCr();
}

document.querySelectorAll('#crFormat button').forEach(b => { b.onclick = () => crSetFormat(b.dataset.fmt); });
crExpr.addEventListener('input', () => { crNotice.textContent = ''; runCr(); });
crUtc.addEventListener('change', runCr);
document.getElementById('crCopy').onclick = e => copyText(crExpr.value.trim(), e.currentTarget);
crExpr.value = CR_DEFAULTS.linux;
crBuildRows(crParse(crExpr.value, 'linux').tokens);
crRenderStatic();

/* boot with Unix Time Converter */
selectTool('Unix Time Converter');
ta.value = SAMPLE;
