import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {App} from './App';
import {FootballExtension} from './components/FootballExtension';
import './styles.css';

createRoot(document.getElementById('root')!).render(<StrictMode><App/><FootballExtension/></StrictMode>);
