import { quickpickle } from './src';

export default {
  plugins: [quickpickle()],
  test: {
    include : [ '{features,test,tests}/**/*.feature', 'tests/**/*.test.ts' ],
  },
  resolve: {
    alias: {
      'quickpickle': __dirname + '/src', // only needed because this is the quickpickle repository
    }
  },
};
