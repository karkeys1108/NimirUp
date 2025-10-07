export interface ColorPalette {
  primary: string;
  secondary: string;
  tertiary: string;
  accent: string;
  light: string;
  white: string;
  black: string;
  shadow: string;
  overlay: string;
}

const baseDarkColors: ColorPalette = {
  primary: '#f1f5f2',
  secondary: '#bac2b4',
  tertiary: '#4c514d',
  accent: '#9ccf3f',
  light: '#242a24',
  white: '#141714',
  black: '#070807',
  shadow: 'rgba(0, 0, 0, 0.55)',
  overlay: 'rgba(20, 23, 20, 0.85)',
};

export const darkColors: ColorPalette = baseDarkColors;

export const lightColors: ColorPalette = {
  primary: '#1f2c25',
  secondary: '#5b6957',
  tertiary: '#ecefef',
  accent: '#9ccf3f',
  light: '#f5f7f4',
  white: '#ffffff',
  black: '#0b0b0b',
  shadow: 'rgba(0, 0, 0, 0.08)',
  overlay: 'rgba(255, 255, 255, 0.85)',
};

let currentColors: ColorPalette = darkColors;

export const colors: ColorPalette = new Proxy({} as ColorPalette, {
  get: (_target, prop: keyof ColorPalette) => currentColors[prop],
}) as ColorPalette;

export const setCurrentColors = (palette: ColorPalette) => {
  currentColors = palette;
};

export const getGradients = (palette: ColorPalette) => ({
  primary: [palette.primary, palette.secondary],
  accent: [palette.accent, '#b8e02f'],
  overlay: ['rgba(57, 63, 56, 0.9)', 'rgba(57, 63, 56, 0.6)', 'rgba(57, 63, 56, 0.8)'],
});