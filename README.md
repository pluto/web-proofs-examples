# Web Proofs Examples

![License](https://img.shields.io/badge/license-MIT-blue.svg)

This repository demonstrates how to integrate the [@plutoxyz/web-proofs](https://www.npmjs.com/package/@plutoxyz/web-proofs) library in both vanilla JavaScript and React applications.

ℹ️ The default option for generating Web Proofs is to use the Pluto-hosted notary. Developers do not need to set up the [prover](https://github.com/pluto/web-prover) or host it themselves, unless they explicitly want to self-host this infrastructure or build custom infrastructure.

## Quick Start

1. Install dependencies

```bash
npm install
```

2. Run examples

Basic examples:

```bash
npm run vanilla # Basic vanilla JavaScript example
npm run react # Basic React example
```

Advanced examples with configuration UI:

```bash
npm run vanilla:advanced # Advanced vanilla JavaScript example
npm run react:advanced # Advanced React example
```

Navigate to `http://localhost:5173/` in your browser.

## Basic Examples

Demonstrate minimal setup required to integrate web-proofs:

- Simple proof generation
- Default configuration
- No UI customization

### Vanilla JavaScript

- Basic implementation: `examples/vanilla-js/index.js`
- HTML template: `examples/vanilla-js/index.html`

### React

- Basic component: `examples/react/App.jsx`
- Entry point:`examples/react/main.jsx`

## Advanced Examples

Show full capabilities with:

- Configurable prover mode (Origo/TLSN)
- Device mode selection (iOS/Chrome Extension)
- QR code size adjustment
- Error handling options
- Loading state customization
- Styling customization
- Debug mode

### Vanilla JavaScript

- Advanced implementation: `examples/vanilla-js/advanced/index.js`
- HTML template:`examples/vanilla-js/advanced/index.html`

### React

- Advanced component: `examples/react/advanced/App.jsx`
- Configuration component: `examples/react/advanced/ProveConfig.jsx`
- Entry point: `examples/react/advanced/main.jsx`

## Documentation

For detailed documentation and integration guides, visit [docs.pluto.xyz](https://docs.pluto.dev/reference/react-sdk)

## Community

- [Telegram](https://t.me/pluto_xyz) - Community chat and support

## License

MIT License - see [LICENSE.md](LICENSE.md) for details.
