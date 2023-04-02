import { NextConfig } from 'next';

const config: NextConfig = {
  webpack(config, options) {
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    });
    return config;
  },
};

export default config;
