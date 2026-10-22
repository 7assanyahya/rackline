import Icon from './Icon.jsx';
import { getLang, setLang } from '../i18n.js';
import { AUTHOR, INSTAGRAM, INSTAGRAM_URL } from './Credits.jsx';

const MORE = [
  { proxy: '#tapeToggle', label: 'Show or hide labels' },
  { proxy: '#cableToggle', label: 'Show or hide cables' },
  { proxy: '#autoBtn', label: 'Auto manage cables' },
  { proxy: '#dataBtn', label: 'Backup or restore' },
  { proxy: '#helpBtn', label: 'Help & tips' },
];
const NAV = [
  { sheet: 'lib', icon: 'plusCircle', label: 'Add' },
  { sheet: 'insp', icon: 'sliders', label: 'Details', id: 'bnDetails' },
  { proxy: '#undo', icon: 'undo', label: 'Undo' },
  { proxy: '#redo', icon: 'redo', label: 'Redo' },
  { sheet: 'more', icon: 'ellipsis', label: 'More' },
];
const MORE_VIEWS = [
  { id: 'both', label: 'Front and back', icon: 'rack' },
  { id: 'side', label: 'Side', icon: 'rack' },
  { id: 'site', label: 'Whole site', icon: 'rack' },
  { id: 'report', label: 'Report', icon: 'sliders' },
];

/* Phone-only pieces: the View menu, the "More" sheet, selection bar and bottom toolbar. */
export default function PhoneChrome() {
  return (
    <>
      <div className="pop menu" id="viewMenu" role="menu" aria-label="More views">
        {MORE_VIEWS.map((v) => (
          <button key={v.id} role="menuitemradio" data-view={v.id}>
            <Icon name="check" className="ico chk" /><span>{v.label}</span>
          </button>
        ))}
      </div>
      <div className="sheet" id="moreSheet" aria-label="More options">
        <div className="sheethead"><span /><b>More</b><button className="textbtn" data-closesheet="">Done</button></div>
        <div className="more-list">
          <div className="group">
            <div className="row">
              <label htmlFor="pz">Rack size</label>
              <input type="range" id="pz" min="0.6" max="3" step="0.1" defaultValue="1" />
            </div>
            <button className="row rowbtn" onClick={() => setLang(getLang() === 'ar' ? 'en' : 'ar')}>
              <span>Language</span><span className="rowval" data-notr="">{getLang() === 'ar' ? 'English' : 'العربية'}</span>
            </button>
            <div className="row">
              <label>Units</label>
              <div className="seg" role="group"><button data-sys="metric">Metric</button><button data-sys="us">US</button></div>
            </div>
          </div>
          <div className="group">
            {MORE.map((m) => <button key={m.proxy} className="row rowbtn" data-proxy={m.proxy}>{m.label}</button>)}
          </div>
          <div className="group">
            <button className="row rowbtn tint" data-proxy="#newBtn">New project</button>
          </div>
          <div className="group">
            <div className="row"><span>Made by</span><span className="rowval" data-notr="" dir="ltr">{AUTHOR}</span></div>
            <a className="row rowbtn" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              <span>Instagram</span><span className="rowval tintval" data-notr="" dir="ltr">@{INSTAGRAM}</span>
            </a>
          </div>
          <p className="credits sheet-credits"><span>Rackline is free and open source.</span></p>
        </div>
      </div>
      <div id="sheetBack" data-closesheet="" hidden />
      <div id="selbar" hidden />
      <nav className="bnav" aria-label="Toolbar">
        {NAV.map((n) => (
          <button key={n.label} id={n.id} data-sheet={n.sheet} data-proxy={n.proxy}>
            <Icon name={n.icon} /><span>{n.label}</span>
          </button>
        ))}
      </nav>
      <button className="fab" id="fab"><Icon name="plus" className="ico sm" /> Add device</button>
    </>
  );
}
