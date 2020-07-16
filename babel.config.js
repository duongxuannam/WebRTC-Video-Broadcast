module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  env: {
    production: {
      plugins: ['transform-remove-console'],
    },
  },
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    [
      'module-resolver',
      {
        cwd: 'babelrc',
        alias: {
          //   navigation: './src/navigation',
          //   api: './src/api',
          //   assets: './src/assets',
          //   components: './src/components',
          //   screens: './src/screens',
          //   languages: './src/languages',
          //   utils: './src/utils',
          //   constants: './src/constants',
          //   configureStore: './src/configureStore',
          //   data: './src/data',
          //   services: './src/services',
          //   manager: './src/manager',
        },
        extensions: ['.js'],
      },
    ],
  ],
  retainLines: true,
};
