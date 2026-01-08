---
"quickpickle": minor
---

Add parsing for DocString data with media types of `json` or `yaml`. Gherkin 6 syntax specifies that a `DocString` data type can have a `mediaType` property; this is an expansion to that syntax, providing automated parsing for data of types `json` or `yaml` (or `yml`). The parsed data will be available under the `data` property of the DocString variable. If the data doesn't parse properly, the parser will throw an error.

```gherkin
  Given the following data:
    ```yaml
      foo: bar
    ```
  Then the value of docString.data.foo should be "bar"
```
