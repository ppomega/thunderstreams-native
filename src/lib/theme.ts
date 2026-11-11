export const darkColors = {
  bg: '#1b0618',
  surface: '#290924',
  surfaceAlt: '#5d0076',
  accent: '#d946ef',
  accentStrong: '#c026d3',
  button: '#ec4899', // pink-500, "Watch Now"
  gold: '#facc15',
  brandYellow: '#facc15',
  text: '#ffffff',
  muted: '#e1d7e1',
  border: 'rgba(255,255,255,0.12)',
  overlay: 'rgba(13,3,12,0.68)',
  skeleton: 'rgba(131,24,67,0.55)', // pink-900/55
};

export const lightColors = {
  bg: '#fffde5', surface: '#fffef5', surfaceAlt: '#fff6a6', accent: '#ffe500', accentStrong: '#ffe500',
  button: '#ffe500', gold: '#725d00', brandYellow: '#ffe500', text: '#181307', muted: '#48402c', border: 'rgba(92,76,0,0.2)',
  overlay: 'rgba(39,31,12,0.62)', skeleton: 'rgba(255,229,0,0.2)',
};

// Kept as the dark palette for components that have not yet opted into the theme context.
export const colors = darkColors;

export const fonts = {
  body: 'KindSans',
  brand: 'OriginTech',
};
