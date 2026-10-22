import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {App} from './App';
import {FootballExtension} from './components/FootballExtension';
import {FootballMotionEnhancer} from './components/FootballMotionEnhancer';
import {FootballMenuEnhancer} from './components/FootballMenuEnhancer';
import './styles.css';

createRoot(document.getElementById('root')!).render(<StrictMode><App/><FootballExtension/><FootballMotionEnhancer/><FootballMenuEnhancer/></StrictMode>);
