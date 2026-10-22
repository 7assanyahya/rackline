export default function Stage() {
  return (
    <main className="stage" id="stage">
      <div className="racktabs" id="tabs" role="tablist" />
      <div className="canvas" id="canvas" />
      <p className="hint" id="hint">Drag devices to move them · Arrow keys nudge the selected device · Delete removes · Ctrl+D duplicates</p>
    </main>
  );
}
