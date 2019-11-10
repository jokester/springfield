module.exports = ({ config, mode }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('ts-loader'),
    options: {
      transpileOnly: false,
      compilerOptions: {
        jsx: 'react',
      },
    },
  });
  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};
