export type Lang = 'fr' | 'en';

const fr = {
  title: "Midi solaire au Canada — heure d'été, heure normale, lever et coucher",
  ogTitle: 'Midi solaire au Canada',
  metaDesc: "Carte interactive du midi solaire au Canada : décalage par rapport à 12:00, lever et coucher du soleil, selon la date et l'heure d'été ou l'heure normale toute l'année.",
  ogAlt: 'Carte du Canada colorée selon le décalage du midi solaire par rapport à 12:00',
  ogLocale: 'fr_CA',
  'subtitle': 'Décalage du midi solaire',
  today: "Aujourd'hui",
  dayAria: "Jour de l'année",
  marksAria: 'Repères',
  marksLegend: '<span class="key season"></span> solstices et équinoxes <span class="key dst"></span> changements d\'heure',
  modesAria: "Mode d'heure",
  'mode.current': 'Règles actuelles',
  'mode.dst': "Heure d'été toute l'année",
  'mode.std': "Heure normale toute l'année",
  'modeLower.current': 'règles actuelles',
  'modeLower.dst': "heure d'été toute l'année",
  'modeLower.std': "heure normale toute l'année",
  'modeSub.current': 'règles actuelles (avec C.-B., Alberta, Manitoba et T.N.-O. permanents)',
  recent: "Changements récents : <b>C.-B.</b> (UTC−7), <b>Alberta</b> (UTC−6) et <b>Manitoba</b> (UTC−5) et <b>T.N.-O.</b> (UTC−6) en heure d'été permanente",
  recentTip: "Ces régions ne changent pas d'heure, quel que soit le mode choisi",
  currentTip: "Avec C.-B., Alberta, Manitoba et T.N.-O. en heure d'été permanente",
  legendTitle: 'Midi solaire vs 12:00 (minutes)',
  lineKey: 'Midi solaire à 12:00 exactement',
  note: "Couleur : heure civile du midi solaire (moment où le soleil est le plus haut) moins 12:00. Positif = après midi. Les lignes brunes sont les limites de fuseaux horaires. Dans les régions qui n'observent pas l'heure d'été (Saskatchewan, Yukon, nord-est de la C.-B., Basse-Côte-Nord), l'heure ne change dans aucun mode. Limites de fuseaux approximatives. Survolez la carte pour le détail.",
  cities: 'Comparaison par ville',
  city: 'Ville',
  rise: 'Lever',
  noon: 'Midi solaire',
  set: 'Coucher',
  dayLen: 'Durée du jour',
  gap: 'Écart vs 12:00',
  west: 'O',
  hourUnit: 'h',
  switchTo: 'English',
  footer: 'Conçu à Québec par',
  rights: '© 2026 Tous droits réservés',
  sources: 'Sources de données',
  'region.Colombie-Britannique': 'Colombie-Britannique',
  'region.Prairies': 'Prairies',
  'region.Ontario': 'Ontario',
  'region.Québec': 'Québec',
  'region.Atlantique': 'Atlantique',
  'region.Nord': 'Nord',
  'zone.pacific': "Pacifique (C.-B., UTC−7 toute l'année)",
  'zone.yukon': 'Yukon (UTC−7 fixe)',
  'zone.mtn-fixed': 'Montagnes (fixe)',
  'zone.alberta': "Alberta (UTC−6 toute l'année)",
  'zone.mountain': 'Montagnes',
  'zone.nwt': "Territoires du Nord-Ouest (UTC−6 toute l'année)",
  'zone.cst': 'Centre (fixe)',
  'zone.central': 'Centre',
  'zone.manitoba': "Manitoba (UTC−5 toute l'année)",
  'zone.eastern': 'Est',
  'zone.atlantic': 'Atlantique',
  'zone.ast': 'Atlantique (fixe)',
  'zone.nst': 'Terre-Neuve',
  'mark.mar': 'Équinoxe de mars',
  'mark.jun': 'Solstice de juin',
  'mark.sep': 'Équinoxe de septembre',
  'mark.dec': 'Solstice de décembre',
  'mark.dstStart': "Passage à l'heure d'été",
  'mark.dstEnd': "Retour à l'heure normale",
  'city.Montréal': 'Montréal',
  'city.Québec': 'Québec',
};

const en: typeof fr = {
  title: 'Solar Noon in Canada — daylight time, standard time, sunrise and sunset',
  ogTitle: 'Solar Noon in Canada',
  metaDesc: "Interactive map of solar noon across Canada: offset from 12:00, sunrise and sunset by date, with daylight or standard time all year.",
  ogAlt: 'Map of Canada coloured by how far solar noon falls from 12:00',
  ogLocale: 'en_CA',
  subtitle: 'Solar noon offset',
  today: 'Today',
  dayAria: 'Day of the year',
  marksAria: 'Markers',
  marksLegend: '<span class="key season"></span> solstices and equinoxes <span class="key dst"></span> clock changes',
  modesAria: 'Time mode',
  'mode.current': 'Current rules',
  'mode.dst': 'Daylight time all year',
  'mode.std': 'Standard time all year',
  'modeLower.current': 'current rules',
  'modeLower.dst': 'daylight time all year',
  'modeLower.std': 'standard time all year',
  'modeSub.current': 'current rules (with B.C., Alberta, Manitoba and N.W.T. permanent)',
  recent: 'Recent changes: <b>B.C.</b> (UTC−7), <b>Alberta</b> (UTC−6) and <b>Manitoba</b> (UTC−5) and <b>N.W.T.</b> (UTC−6) on permanent daylight time',
  recentTip: 'These regions do not change their clocks, whichever mode is selected',
  currentTip: 'With B.C., Alberta, Manitoba and N.W.T. on permanent daylight time',
  legendTitle: 'Solar noon vs 12:00 (minutes)',
  lineKey: 'Solar noon at exactly 12:00',
  note: 'Colour: clock time of solar noon (when the sun is highest) minus 12:00. Positive = after noon. Brown lines are time zone boundaries. In regions that do not observe daylight saving time (Saskatchewan, Yukon, north-eastern B.C., Quebec Lower North Shore), the clock does not change in any mode. Zone boundaries are approximate. Hover over the map for details.',
  cities: 'City comparison',
  city: 'City',
  rise: 'Sunrise',
  noon: 'Solar noon',
  set: 'Sunset',
  dayLen: 'Day length',
  gap: 'Offset vs 12:00',
  west: 'W',
  hourUnit: 'h',
  switchTo: 'Français',
  footer: 'Designed in Quebec City by',
  rights: '© 2026 All rights reserved',
  sources: 'Data sources',
  'region.Colombie-Britannique': 'British Columbia',
  'region.Prairies': 'Prairies',
  'region.Ontario': 'Ontario',
  'region.Québec': 'Quebec',
  'region.Atlantique': 'Atlantic',
  'region.Nord': 'North',
  'zone.pacific': 'Pacific (B.C., UTC−7 all year)',
  'zone.yukon': 'Yukon (fixed UTC−7)',
  'zone.mtn-fixed': 'Mountain (fixed)',
  'zone.alberta': 'Alberta (UTC−6 all year)',
  'zone.mountain': 'Mountain',
  'zone.nwt': 'Northwest Territories (UTC−6 all year)',
  'zone.cst': 'Central (fixed)',
  'zone.central': 'Central',
  'zone.manitoba': 'Manitoba (UTC−5 all year)',
  'zone.eastern': 'Eastern',
  'zone.atlantic': 'Atlantic',
  'zone.ast': 'Atlantic (fixed)',
  'zone.nst': 'Newfoundland',
  'mark.mar': 'March equinox',
  'mark.jun': 'June solstice',
  'mark.sep': 'September equinox',
  'mark.dec': 'December solstice',
  'mark.dstStart': 'Clocks go forward',
  'mark.dstEnd': 'Clocks go back',
  'city.Montréal': 'Montreal',
  'city.Québec': 'Quebec City',
};

const dicts = { fr, en };
export type Key = keyof typeof fr;

const initial = (): Lang => (new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'fr');
export let lang: Lang = initial();

export const t = (key: string): string => (dicts[lang] as Record<string, string>)[key] ?? (dicts.fr as Record<string, string>)[key] ?? key;
/** Translation if the key exists, else the fallback (used for names like cities). */
export const tOr = (key: string, fallback: string): string => (dicts[lang] as Record<string, string>)[key] ?? fallback;
export const locale = () => (lang === 'en' ? 'en-CA' : 'fr-CA');

/** Switch language, keep the URL (`?lang=`) and the page's static texts in sync. */
export function setLang(l: Lang): void {
  lang = l;
  const u = new URL(location.href);
  if (l === 'en') u.searchParams.set('lang', 'en');
  else u.searchParams.delete('lang');
  history.replaceState(null, '', u);
  applyStatic();
}

export function applyStatic(): void {
  const root = document.documentElement;
  root.lang = lang;
  // The sources page keeps its own title and description.
  if (document.body.dataset.page !== 'sources') {
    document.title = t('title');
    const meta = (sel: string, key: string) => document.querySelector(sel)?.setAttribute('content', t(key));
    meta('meta[name=description]', 'metaDesc');
    meta('meta[property="og:description"]', 'metaDesc');
    meta('meta[name="twitter:description"]', 'metaDesc');
    meta('meta[property="og:title"]', 'ogTitle');
    meta('meta[name="twitter:title"]', 'ogTitle');
    meta('meta[property="og:image:alt"]', 'ogAlt');
    meta('meta[property="og:locale"]', 'ogLocale');
  }
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => (el.textContent = t(el.dataset.i18n!)));
  document.querySelectorAll<HTMLElement>('[data-i18n-html]').forEach((el) => (el.innerHTML = t(el.dataset.i18nHtml!)));
  document.querySelectorAll<HTMLElement>('[data-i18n-title]').forEach((el) => (el.title = t(el.dataset.i18nTitle!)));
  document.querySelectorAll<HTMLElement>('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria!)));
  // Links to other pages carry the language along.
  document.querySelectorAll<HTMLAnchorElement>('a[data-keep-lang]').forEach((a) => {
    const base = a.getAttribute('href')!.split('?')[0];
    a.setAttribute('href', lang === 'en' ? `${base}?lang=en` : base);
  });
}
