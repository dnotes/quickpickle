import quickpickle from "quickpickle";

export default {
  plugins: [quickpickle()],
  optimizeDeps: {
    exclude: ['unicorn-magic'],
  },
  test: {
    quickpickle: {
      failTags: ['@fail', '@fails', '@should-fail'],
      explodeTags: [
        ['@tag1', '@tag2'],
      ],
    }
  }
}