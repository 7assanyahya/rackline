const MORE = [
  { proxy: '#tapeToggle', label: 'Show or hide labels' },
  { proxy: '#cableToggle', label: 'Show or hide cables' },
  { proxy: '#autoBtn', label: 'Auto manage cables' },
  { proxy: '#redo', label: '↷ Redo' },
  { proxy: '#newBtn', label: 'New project', primary: true },
  { proxy: '#dataBtn', label: 'Backup or restore' },
  { proxy: '#helpBtn', label: 'Help & tips' },
];
const NAV = [
  { sheet: 'lib', icon: '＋', label: 'Add' },
  { sheet: 'insp', icon: '☰', label: 'Details', id: 'bnDetails' },
  { proxy: '#undo', icon: '↶', label: 'Undo' },
  { sheet: 'more', icon: '⋯', label: 'More' },
];

/* Phone-only pieces: the "More" sheet, selection bar and bottom menu. */
export default function PhoneChrome() {
  return (
    <>
      <div className="sheet" id="moreSheet" aria-label="More options">
        <div className="sheethead"><b>More</b><button className="btn" data-closesheet="">Done</button></div>
        <div className="more-list">
          <div className="fld">
            <label htmlFor="pz">Rack size on screen</label>
            <input type="range" id="pz" min="0.6" max="3" step="0.1" defaultValue="1" style={{ accentColor: 'var(--accent)' }} />
          </div>
          <div className="fld">
            <label>Units</label>
            <div className="seg" role="group"><button data-sys="metric">Metric</button><button data-sys="us">US</button></div>
          </div>
          {MORE.map((m) => <button key={m.proxy} className={'btn' + (m.primary ? ' primary' : '')} data-proxy={m.proxy}>{m.label}</button>)}
        </div>
      </div>
      <div id="sheetBack" data-closesheet="" hidden />
      <div id="selbar" hidden />
      <nav className="bnav" aria-label="Phone menu">
        {NAV.map((n) => (
          <button key={n.label} id={n.id} data-sheet={n.sheet} data-proxy={n.proxy}><i>{n.icon}</i>{n.label}</button>
        ))}
      </nav>
      <button className="fab" id="fab">＋ Add device</button>
    </>
  );
}
