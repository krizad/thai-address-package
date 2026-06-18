# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-18

### Added

- Dual ESM/CJS package output via tsup
- Comprehensive Vitest test suite (48 tests)
- JSDoc `@param` descriptions on all exported functions
- Typed JSON data interfaces (`ProvinceRaw`, `DistrictRaw`, `SubDistrictRaw`)
- Proper `SearchLevel` return types (removed `any[]`)
- `sideEffects: false` in package.json for tree-shaking
- `engines` field requiring Node.js >= 18
- `.npmignore` to exclude source/tests/scripts from npm package
- `.editorconfig` forconsistent coding style
- Husky + lint-staged pre-commit hooks
- `typecheck` and `test:coverage` scripts

### Changed

- Build system: switched from raw `tsc` to `tsup` for dual ESM/CJS output
- `package.json` `exports` map now provides proper conditional exports for `import`/`require`
- `files` field now only includes `dist/` (data is bundled by tsup)
- `main` field updated to `./dist/index.js`, added `module` for ESM

## [1.0.5] - Previous release

- Initial lightweight Thai address lookup engine