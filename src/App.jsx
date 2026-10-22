import { useEffect } from 'react';
import TopBar from './components/TopBar.jsx';
import Library from './components/Library.jsx';
import Stage from './components/Stage.jsx';
import Inspector from './components/Inspector.jsx';
import PhoneChrome from './components/PhoneChrome.jsx';
import { mountRackline } from './engine/rackline.js';

/*
  React renders the app shell once. The rack engine then takes over the
  stage, library list, inspector and overlays (it draws faceplates, cables
  and the 3D scene directly), so these components never re-render.
*/
export default function App() {
  useEffect(() => { mountRackline(); }, []);
  return (
    <>
      <div className="app">
        <TopBar />
        <div className="main">
          <Library />
          <Stage />
          <Inspector />
        </div>
      </div>
      <PhoneChrome />
      <div id="overlayRoot" />
      <div className="toast" id="toast" hidden />
    </>
  );
}
