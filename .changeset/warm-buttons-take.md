---
"@quickpickle/playwright": minor
---

Fix: creating vs switching identities, setting browser size on create

- Some steps were improperly creating *and switching* identities, when they should only have created identities.
- Browser size should be set for each identity at its creation, not when switching.

BREAKING CHANGE:

The following step definitions no longer switch identity, but only create new identities.
Anyone using these step definitions to set identity will need to change them to the variants
beginning with "as" or "I am". Also, for clarity, extra variants with "the" have been removed.

- Given a/an {string}
- Given a user {string}
- Given a/an {string} user/role/browser/identity