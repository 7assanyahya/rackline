export default function Library() {
  return (
    <aside className="pane lib sheet" id="libSheet" aria-label="Device library">
      <div className="sheethead"><b>Add a device</b><button className="btn" data-closesheet="">Done</button></div>
      <div className="lib-head">
        <p className="ph">Device library</p>
        <input className="search" id="q" type="search" placeholder="Search: PC, router, NAS, switch, XLR…" />
        <div className="cats" id="cats" />
      </div>
      <div className="lib-list" id="libList" />
      <p className="lib-note">Drag a device into the rack, or tap it to drop it in the highest free slot. Drawn as generic models; specs are typical values for planning.</p>
    </aside>
  );
}
