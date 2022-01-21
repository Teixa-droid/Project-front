import CracoAlias from 'craco-alias';

export const style = {
  postcss: {
    plugins: [require('tailwindcss'), require('autoprefixer')],
  },
};
export const plugins = [
  {
    plugin: CracoAlias,
    options: {
      source: 'options',
      baseUrl: './',
      aliases: {
        '*': './src',
      },
    },
  },
];
