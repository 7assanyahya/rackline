# Rackline

Rackline is a rack planner that runs in your browser. Use it to lay out a home lab, studio, gaming setup, security cabinet, small office or touring A/V rig: place devices, wire them up, and check that everything fits before you build it.

Everything is in one file, `index.html`. There's no build step, server or account.

## Features

**Building racks**
- A library of 65 devices: audio, video, lighting, network, power, utility, and a Home & DIY section (PCs, servers, NAS, Wi-Fi router, modem, PS5, PS4, NVRs, Raspberry Pis, keystone panels, UPS and more).
- **Make your own device:** set the height, depth, weight, power and look, then add your own ports on the front and back, with a live preview.
- **Custom patch panels** with up to 48 labelled ports (XLR, etherCON, RJ45, BNC, LC fiber, powerCON).
- Devices can be mounted on the front rails or the back rails.
- **Arrange mode** snaps devices into free slots. **Free move** lets you place a device at any U, even between units: snap to ½U, ⅓U (one rail hole) or turn snapping off.
- Several racks per project, plus a **Site** view that shows them all with the links between them.

**Cables**
- Typed cables: Network (Cat6), HDMI, Power (IEC), Power adapter (DC), USB, Fiber, Coax/SDI, Audio and Speaker. Each type has its own look, and the type is detected from the ports you connect.
- Drag from port to port to connect them, drag a plug to move it, and drag the middle of a cable to bend it.
- Warns you when the two ends don't match (for example RJ45 to HDMI means you need an adapter) and when a device isn't plugged into power.
- **Auto manage** routes every cable neatly through the side channels. **Colour by type** gives each cable type its own colour.
- Shows the length of each cable run and suggests the cable size to buy.

**Views**
- **Front, Rear, Both** (front and back side by side), **Side** (shows how deep everything sits), **Site** and **Report**.
- **3D view** (three.js): orbit around the road case, see every faceplate and back panel, watch cables run as 3D tubes, drag devices, and wire by tapping one port then another.
  - Lights on / Dim room modes, LED strips (seven colours or rainbow), and a working Rack Light device.
  - Spinning fans and an optional **Fan sound** that reacts to how many fans are in view.

**Planning**
- Totals for space used, weight, power draw and current, in metric (230 V) or US units (120 V).
- Labels, label colours and groups, and you can highlight a group to find its devices.
- The **Report** lists every device, patch port and cable, and copies to plain text.
- Undo and redo, starter templates, and backup or restore of your project as JSON.
- Works on phones: a bottom menu, slide-up panels, and touch-and-hold to drag.

## Starter templates

Home lab · Gaming & media · Home security · Network closet · Small office · Home studio · Touring A/V (two racks) · Blank rack

## Run it locally

Open `index.html` in a modern browser. That's all.

The 3D view loads three.js from a CDN the first time you open it, so it needs an internet connection then. Google Fonts are also loaded from the web. Everything else works offline.

## Deploy to Vercel

```bash
npx vercel --prod
```

Run this in the repo folder. Vercel serves `index.html` as a static site with no settings needed. If you import the repo in the Vercel dashboard instead, choose **Other** as the framework and leave the build command empty.

## Where your data lives

Projects are saved in your browser's local storage on the device you're using. Nothing is sent to a server. To move a project to another device or browser, use **Backup → Copy JSON**, then **Load pasted project** on the other one.

## Notes

- Devices in the library are generic models with typical specs, for planning only. They aren't tied to any manufacturer or brand.
- Libraries: [three.js r128](https://threejs.org/) with OrbitControls, loaded from cdnjs and jsDelivr.
