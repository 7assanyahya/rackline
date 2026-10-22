import Logo from './Logo.jsx';
import Icon from './Icon.jsx';
import { getLang, setLang } from '../i18n.js';

const VIEWS = [
  { id: 'front', label: 'Front' },
  { id: 'rear', label: 'Rear' },
  { id: 'both', label: 'Both', title: 'Front and rear side by side, to wire between them', more: true },
  { id: 'side', label: 'Side', more: true },
  { id: 'site', label: 'Site', title: 'Every rack together, with the cables between them', more: true },
  { id: '3d', label: '3D', title: 'Turn the rack around in 3D' },
  { id: 'report', label: 'Report', more: true },
];
const MODES = [
  { id: 'arrange', label: 'Arrange', title: "Devices snap to free slots and can't overlap" },
  { id: 'free', label: 'Free move', title: 'Put devices at any U you want, even between units or on top of each other' },
  { id: 'wire', label: 'Wire', title: 'Drag between ports to run cables' },
];
const SNAPS = [
  { v: '1', label: '1U', title: 'Whole rack units' },
  { v: '0.5', label: '½U', title: 'Half a rack unit' },
  { v: '0.3333333', label: '⅓U · hole', title: 'One rail hole (a third of a U)' },
  { v: '0', label: 'Off', title: 'No snapping' },
];
const TOOLS = [
  { id: 'tapeToggle', label: 'Labels', title: 'Show or hide the tape labels on devices', pressed: true },
  { id: 'cableToggle', label: 'Cables', title: 'Show or hide cables', pressed: true },
  { id: 'autoBtn', label: 'Auto manage', title: 'Route every cable neatly through the side channels' },
  { id: 'undo', label: '↶ Undo', title: 'Undo (Ctrl+Z)' },
  { id: 'redo', label: '↷ Redo', title: 'Redo (Ctrl+Shift+Z)' },
  { id: 'newBtn', label: 'New project', primary: true },
  { id: 'dataBtn', label: 'Backup', title: 'Copy or restore your project' },
  { id: 'helpBtn', label: '?', aria: 'Help' },
];

export default function TopBar() {
  return (
    <header className="top">
      <div className="brand" aria-label="Rackline">
        <Logo />
        <span>Rackline</span>
      </div>
      <div className="proj"><input id="projName" aria-label="Project name" /></div>
      <button className="iconbtn" id="moreBtn" data-sheet="more" aria-label="More options"><Icon name="ellipsis" /></button>
      <div className="strip">
        <div className="seg" role="group" aria-label="View" id="views">
          {VIEWS.map((v) => <button key={v.id} data-view={v.id} title={v.title} className={v.more ? 'vx' : undefined}>{v.label}</button>)}
          <button id="viewMore" className="phoneonly" data-pop="viewMenu" aria-haspopup="menu"><span id="viewMoreLbl">More</span><Icon name="chevronDown" className="ico sm" /></button>
        </div>
        <div className="seg modebar" role="group" aria-label="Mode" id="modes">
          {MODES.map((m) => <button key={m.id} data-mode={m.id} title={m.title}>{m.label}</button>)}
        </div>
        <div className="snapwrap" id="snapWrap" hidden>
          <span>Snap</span>
          <div className="seg" role="group" aria-label="Snap step" id="snaps">
            {SNAPS.map((s) => <button key={s.v} data-snap={s.v} title={s.title}>{s.label}</button>)}
          </div>
        </div>
        <div className="seg phoneonly" role="group" aria-label="Zoom" id="zoomSeg">
          <button data-zoomstep="-1" aria-label="Zoom out"><Icon name="minus" className="ico sm" /></button>
          <button data-zoomstep="1" aria-label="Zoom in"><Icon name="plus" className="ico sm" /></button>
        </div>
      </div>
      <div className="tools">
        <label className="zoom" htmlFor="zoom">Scale <input type="range" id="zoom" min="300" max="700" step="10" /></label>
        <button className="btn" id="langBtn" data-notr="" lang={getLang() === 'ar' ? 'en' : 'ar'} onClick={() => setLang(getLang() === 'ar' ? 'en' : 'ar')}
          title={getLang() === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}>{getLang() === 'ar' ? 'English' : 'العربية'}</button>
        {TOOLS.map((t) => (
          <button key={t.id} id={t.id} className={'btn' + (t.primary ? ' primary' : '')} title={t.title}
            aria-label={t.aria} aria-pressed={t.pressed ? 'true' : undefined}>{t.label}</button>
        ))}
      </div>
    </header>
  );
}
