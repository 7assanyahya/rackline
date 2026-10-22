# Contributing to Rackline

Thanks for helping. Rackline is a community project, and new devices, translations, bug fixes and design ideas are all welcome.

## Ways to help

- **Request or add a device.** Open a *Device request* issue, or add it yourself (see below).
- **Translate.** Improve the Arabic text or add a new language.
- **Report a bug.** Open a *Bug report* with steps to reproduce and a screenshot.
- **Suggest a feature.** Open a *Feature request* and describe the problem it solves.

## Getting started

```bash
git clone https://github.com/7assanyahya/rackline.git
cd rackline
npm install
npm run dev
```

Open the address Vite prints (usually http://localhost:5173). Before opening a pull request, check that the production build passes:

```bash
npm run build
```

## Project layout

| Path | What it is |
|---|---|
| `src/components/` | React components for the app shell (top bar, library, stage, inspector, phone toolbar) |
| `src/engine/rackline.js` | The rack engine: 2D drawing, cables, inspector, report and the three.js 3D view |
| `src/engine/devices-extra.js` | The extended device library (the easiest place to contribute) |
| `src/i18n.js`, `src/i18n/ar.js` | Language support and the Arabic translation |
| `src/icons.js` | Line icons shared by React and the engine |
| `src/styles.css` | Styles, themes, phone layout and right-to-left rules |

## Adding a device

Add an entry to `EXTRA_DEVICES` in `src/engine/devices-extra.js`. The comment at the top of that file explains every field. A minimal example:

```js
{ id: 'x_myswitch', cat: 'net', c: 'SW-8', name: 'Network Switch 8-port',
  h: 1, d: 200, kg: 1.8, w: 15,
  front: [{ t: 'logo' }, { t: 'gap' }, { t: 'rj45', n: 8 }],
  rear:  [{ t: 'gap' }, { t: 'iec', n: 1 }] }
```

Guidelines:

- **Keep ids stable.** Saved projects refer to devices by `id`, so never rename or reuse one.
- **Use generic names** that describe the device, not a brand's logo or trade dress. A well-known product name is fine when it helps people find a size (for example a console on a shelf), but don't copy logos or artwork.
- **Use realistic sizes.** Height in rack units, depth in millimetres, weight in kilograms and typical maximum power in watts.
- **Put the ports where they really are,** front or back, so wiring makes sense. Every port type listed in the file comment can be wired.
- Check the device in the **Front**, **Rear**, **Side** and **3D** views before you open a pull request.

## Adding or improving a translation

Text is written in English in the code and translated as the page renders.

1. Add `"English text": "Translation"` pairs to the dictionary in `src/i18n/ar.js`, or create a new file for another language.
2. Text with changing parts (names, numbers) goes in `PATTERNS` at the bottom of that file.
3. To add a new language, register it in the `LANGS` object in `src/i18n.js`, with `dir: 'rtl'` if it's written right to left.
4. Switch language with the language button in the top bar (or **More → Language** on a phone) and check every screen.

Device model names, port names (RJ45, HDMI…) and anything the user types are intentionally left untranslated.

## Pull requests

- Keep each pull request focused on one change.
- Describe what changed and why, and add screenshots for anything visual, including a phone-size screenshot.
- Make sure `npm run build` passes. GitHub Actions runs it on every pull request.
- By contributing, you agree that your work is released under the [MIT License](LICENSE).

## Code of conduct

Everyone taking part is expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
