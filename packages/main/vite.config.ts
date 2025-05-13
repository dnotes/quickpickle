import { quickpickle, type QuickPickleConfigSetting } from './src';
const qpOptions:QuickPickleConfigSetting = {}

export default {
  plugins: [quickpickle(qpOptions)],
  resolve: {
    alias: {
      'quickpickle': __dirname + '/src', // only needed because this is the quickpickle repository
    }
  },
};
