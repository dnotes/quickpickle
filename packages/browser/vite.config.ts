import quickpickle from "quickpickle";

export default {
  plugins: [quickpickle()],
  optimizeDeps: {
    exclude: ['unicorn-magic'],
  },
}