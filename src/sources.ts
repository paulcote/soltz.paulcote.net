import './style.css';
import { applyStatic, lang } from './i18n';

applyStatic();
document.title = lang === 'en' ? 'Data sources — Solar Noon in Canada' : 'Sources de données — Midi solaire au Canada';
