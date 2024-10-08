import { quickpickle } from './src';

export default {
  plugins: [quickpickle()],
  resolve: {
    alias: {
      'quickpickle': __dirname + '/src', // only needed because this is the quickpickle repository
    }
  },
};
