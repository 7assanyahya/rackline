import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import { initI18n } from './i18n.js';

initI18n();

createRoot(document.getElementById('root')).render(<App />);
