/*
  Language support. English is the source language; other languages are
  applied to the page as it renders, so the engine and React components
  keep plain English strings. Arabic switches the layout to right-to-left
  (rack drawings stay left-to-right, like the real hardware).
*/
import { AR, PATTERNS } from './i18n/ar.js';

const KEY = 'rackline.lang';
const LANGS = { en: { dict: null }, ar: { dict: AR, patterns: PATTERNS, dir: 'rtl' } };
let lang = 'en';
try {
  const saved = localStorage.getItem(KEY);
  lang = saved && LANGS[saved] ? saved : (navigator.language || '').toLowerCase().startsWith('ar') ? 'ar' : 'en';
} catch (e) { /* storage blocked: stay in English */ }

export const getLang = () => lang;
export function setLang(next) {
  try { localStorage.setItem(KEY, next); } catch (e) { /* ignore */ }
  location.reload();
}

/* Content the user typed, device drawings and the 3D scene are never translated */
const SKIP = '.bay,.mini,.pv,.tape,.tapecell,.cables,svg,canvas,.sbar,.pc,.grp,.rtab,#projName,textarea,[data-notr]';

function translate(s) {
  const L = LANGS[lang];
  if (!L.dict || !s) return null;
  if (L.dict[s]) return L.dict[s];
  for (const [re, fn] of L.patterns) { const m = s.match(re); if (m) return fn(m); }
  if (s.includes(' · ')) {
    const parts = s.split(' · '), out = parts.map((p) => translate(p) || p);
    if (out.some((x, i) => x !== parts[i])) return out.join(' · ');
  }
  return null;
}
function doText(node) {
  const v = node.nodeValue; if (!v || !/[A-Za-z]/.test(v)) return;
  const m = v.match(/^(\s*)([\s\S]*?)(\s*)$/), tr = translate(m[2]);
  if (tr && tr !== m[2]) node.nodeValue = m[1] + tr + m[3];
}
function doAttrs(el) {
  for (const a of ['title', 'placeholder', 'aria-label']) {
    const v = el.getAttribute && el.getAttribute(a);
    if (v && /[A-Za-z]/.test(v)) { const tr = translate(v.trim()); if (tr && tr !== v) el.setAttribute(a, tr); }
  }
}
function walk(root) {
  if (root.nodeType === 3) { const p = root.parentElement; if (p && !p.closest(SKIP)) doText(root); return; }
  if (root.nodeType !== 1 || root.closest(SKIP)) return;
  doAttrs(root);
  const w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.nodeType === 1 && n.matches(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  let n; while ((n = w.nextNode())) { if (n.nodeType === 3) doText(n); else doAttrs(n); }
}

export function initI18n() {
  const L = LANGS[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = L.dir || 'ltr';
  if (!L.dict) return;
  const t = translate(document.title); if (t) document.title = t;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap';
  document.head.appendChild(link);
  new MutationObserver((list) => {
    for (const r of list) {
      if (r.type === 'childList') r.addedNodes.forEach(walk);
      else if (r.type === 'characterData') { const p = r.target.parentElement; if (p && !p.closest(SKIP)) doText(r.target); }
      else if (r.type === 'attributes' && !r.target.closest(SKIP)) doAttrs(r.target);
    }
  }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['title', 'placeholder', 'aria-label'] });
}
