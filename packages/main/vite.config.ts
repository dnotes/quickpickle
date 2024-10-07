import { quickpickle } from '.';

export default {
  plugins: [quickpickle()],
  test: {
    include : [ 'features/*.feature', 'tests/*.test.ts' ],
  },
  resolve: {
    alias: {
      'quickpickle': __dirname + '/src', // only needed because this is the quickpickle repository
    }
  }
};
