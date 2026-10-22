export default function Inspector() {
  return (
    <aside className="pane insp sheet" id="inspSheet" aria-label="Details">
      <div className="sheethead"><b>Details</b><button className="btn" data-closesheet="">Done</button></div>
      <div id="insp" />
    </aside>
  );
}
