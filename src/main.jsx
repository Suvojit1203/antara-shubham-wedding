import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import './gallery.css';
import './custom.css';
import './celebration-motion.css';
import './gallery-celebration.css';
import './mobile-polish.css';
import './flip-countdown.css';

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
