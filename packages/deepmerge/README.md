# deepmerge (patched)

A local, patched copy of `deepmerge@4.3.1`. The upstream package has no release
that fixes CVE-2026-93753 (prototype poisoning through `mergeObject()`), and the
fix pull request was not merged, so this workspace package replaces it for every
dependency in the repository.

The only change from upstream is that `mergeObject()` refuses to copy the
`__proto__`, `constructor` and `prototype` keys from either the target or the
source object. Everything else is byte-for-byte the upstream `dist/cjs.js`.
