/*
  Extra device library. Each entry is a generic rack device used for planning.

  Fields
    id      unique id (never change it once released: saved projects use it)
    cat     audio | video | light | net | power | compute | secur | home | util
    c       short code printed on the faceplate ('' for none)
    name    name shown in the library
    h       height in rack units
    d       depth in mm, kg weight, w max power draw in watts
    face    black | grey | silver (default black)
    handles true to draw rack handles (2U and up)
    open    true for shelves: front zones are objects sitting on the shelf
    front / rear  faceplate zones. One row = array of zones; several rows =
            array of arrays. Zones:
              ports: xlr ecn spk rj45 bnc sfp lc iec pcon hdmi out us usb jack dc
                     { t, n, rows }   (every port can be wired)
              parts: logo gap screen{w} grille{w} handle lace brush led btn knob
                     pwr fan bay hdd pcie slot brk obj{k}
*/
const P = (t, n = 1, rows) => (rows ? { t, n, rows } : { t, n });
const LOGO = { t: 'logo' }, GAP = { t: 'gap' }, PWR = { t: 'pwr' };
const scr = (w) => ({ t: 'screen', w });
const gr = (w) => ({ t: 'grille', w });
const obj = (k, n = 1) => ({ t: 'obj', k, n });

/* switch builder: ports + uplinks on the front, power and fans on the back */
const sw = (id, c, name, ports, opt = {}) => ({
  id, cat: opt.cat || 'net', c, name, h: opt.h || 1, d: opt.d || 250, kg: opt.kg || 3.5, w: opt.w || 40, face: opt.face || 'grey',
  front: opt.h === 2
    ? [[LOGO, P('led', 4), GAP, P('rj45', ports / 2, 2)], [GAP, P('rj45', ports / 2, 2), ...(opt.sfp ? [P('sfp', opt.sfp, 2)] : [])]]
    : [LOGO, P('led', 2), GAP, P('rj45', ports, 2), ...(opt.sfp ? [P('sfp', opt.sfp, 2)] : [])],
  rear: opt.rear || [P('fan', opt.poe ? 2 : 1), GAP, P('iec', opt.poe ? 2 : 1)],
});
const blank = (id, h) => ({ id, cat: 'util', c: '', name: `Blank Panel ${h}U`, h, d: 10, kg: .35 * h, w: 0, front: [], rear: [] });

export const EXTRA_DEVICES = [
  /* ---------------- Audio ---------------- */
  { id: 'x_rx1', cat: 'audio', c: 'RX-1', name: 'Wireless Receiver 1-ch (half rack)', h: 1, d: 210, kg: 1.4, w: 12, front: [LOGO, scr(1.6), P('btn', 3), GAP, P('led', 3), PWR], rear: [P('bnc', 2), P('xlr', 1), P('jack'), P('dc')] },
  { id: 'x_rx8', cat: 'audio', c: 'RX-8', name: 'Wireless Receiver 8-ch', h: 1, d: 360, kg: 5.6, w: 60, front: [LOGO, scr(1.5), scr(1.5), scr(1.5), scr(1.5), P('btn', 4), PWR], rear: [P('bnc', 4), P('xlr', 8), P('rj45', 2), P('iec')] },
  { id: 'x_iem1', cat: 'audio', c: 'TX-1', name: 'In-Ear Transmitter 1-ch', h: 1, d: 240, kg: 2.2, w: 14, front: [LOGO, scr(1.8), P('knob'), P('btn', 3), GAP, P('jack'), PWR], rear: [P('bnc'), P('xlr', 2), P('dc')] },
  { id: 'x_comb', cat: 'audio', c: 'AC-8', name: 'IEM Antenna Combiner 8-in', h: 1, d: 260, kg: 3, w: 15, front: [LOGO, P('led', 8), GAP, P('bnc'), PWR], rear: [P('bnc', 8), GAP, P('iec')] },
  { id: 'x_mix3', cat: 'audio', c: 'MX-32', name: 'Rack Digital Mixer 32-ch (3U)', h: 3, d: 250, kg: 7.5, w: 70, handles: true,
    front: [[LOGO, scr(3), GAP, P('knob', 6)], [P('btn', 16), GAP, P('led', 8)], [P('xlr', 8), P('jack', 4), P('usb'), PWR]],
    rear: [[P('xlr', 16)], [P('xlr', 16)], [P('rj45', 3), P('usb'), GAP, P('iec')]] },
  { id: 'x_sb16', cat: 'audio', c: 'SB-16', name: 'Stage Box 16×8', h: 2, d: 220, kg: 5, w: 30, handles: true, front: [[P('xlr', 12)], [P('xlr', 12)]], rear: [[LOGO, GAP], [P('rj45', 2), GAP, P('pcon')]] },
  { id: 'x_sb48', cat: 'audio', c: 'SB-48', name: 'Stage Box 48×16', h: 4, d: 260, kg: 13, w: 70, handles: true, front: [[P('xlr', 16)], [P('xlr', 16)], [P('xlr', 16)], [P('xlr', 16)]], rear: [[LOGO, GAP], [P('rj45', 2), P('sfp', 2)], [GAP, P('pcon', 2)], [GAP]] },
  { id: 'x_amp2', cat: 'audio', c: 'PA-2', name: 'Power Amplifier 2×600 W (1U)', h: 1, d: 330, kg: 5, w: 400, front: [gr(2.5), LOGO, P('led', 4), P('knob', 2), gr(2.5), PWR], rear: [P('fan'), P('xlr', 2), P('spk', 2), GAP, P('iec')] },
  { id: 'x_amp8', cat: 'audio', c: 'PA-8', name: 'Power Amplifier 8-ch (2U)', h: 2, d: 480, kg: 15, w: 1600, handles: true, front: [[gr(3), LOGO, scr(1.4), gr(3)], [P('led', 16), GAP, PWR]], rear: [[P('fan', 2), P('xlr', 8)], [P('spk', 8), P('rj45', 2), P('pcon')]] },
  { id: 'x_dsp', cat: 'audio', c: 'DX-88', name: 'DSP Matrix 8×8', h: 1, d: 240, kg: 2.8, w: 25, front: [LOGO, P('led', 16), GAP, scr(1.4), PWR], rear: [P('xlr', 16), P('rj45', 2), P('iec')] },
  { id: 'x_ai2', cat: 'audio', c: 'AI-2', name: 'USB Audio Interface 2-in (half rack)', h: 1, d: 160, kg: 1.1, w: 5, front: [LOGO, P('xlr', 2), P('knob', 3), P('led', 4), P('jack')], rear: [P('jack', 4), P('usb'), GAP, P('dc')] },
  { id: 'x_aes', cat: 'audio', c: 'AE-8', name: 'Dante to AES/EBU Interface', h: 1, d: 200, kg: 1.8, w: 12, front: [LOGO, P('led', 8), GAP, PWR], rear: [P('xlr', 8), P('rj45', 2), P('iec')] },
  { id: 'x_di4', cat: 'audio', c: 'DI-4', name: 'Rack DI Box 4-ch', h: 1, d: 140, kg: 2, w: 0, front: [LOGO, P('jack', 8), GAP, P('btn', 8)], rear: [P('xlr', 4), GAP] },
  { id: 'x_di8', cat: 'audio', c: 'DI-8', name: 'Rack DI Box 8-ch', h: 1, d: 160, kg: 2.6, w: 0, front: [LOGO, P('jack', 16), GAP, P('btn', 8)], rear: [P('xlr', 8), GAP] },
  { id: 'x_comp', cat: 'audio', c: 'CP-2', name: 'Stereo Compressor', h: 1, d: 200, kg: 2.5, w: 15, front: [LOGO, P('knob', 6), P('led', 10), P('knob', 6), PWR], rear: [P('xlr', 4), P('jack', 4), P('iec')] },
  { id: 'x_eq', cat: 'audio', c: 'EQ-31', name: 'Graphic EQ 2×31-band (2U)', h: 2, d: 200, kg: 4, w: 20, front: [[LOGO, P('btn', 31)], [P('btn', 31), PWR]], rear: [[P('xlr', 4), GAP], [P('jack', 4), GAP, P('iec')]] },
  { id: 'x_fx', cat: 'audio', c: 'FX-1', name: 'Reverb / Effects Processor', h: 1, d: 210, kg: 2.2, w: 15, front: [LOGO, scr(2), P('knob', 4), P('btn', 6), PWR], rear: [P('xlr', 4), P('jack', 2), P('usb'), P('iec')] },
  { id: 'x_hpa', cat: 'audio', c: 'HP-4', name: 'Headphone Amplifier 4-ch', h: 1, d: 170, kg: 1.8, w: 10, front: [LOGO, P('knob', 4), P('jack', 4), GAP, P('led', 4), PWR], rear: [P('xlr', 2), P('jack', 4), P('dc')] },
  { id: 'x_play', cat: 'audio', c: 'MP-1', name: 'Media Player (USB / SD)', h: 1, d: 220, kg: 2.4, w: 12, front: [LOGO, P('slot'), scr(2.2), P('btn', 6), P('usb'), PWR], rear: [P('xlr', 2), P('jack', 2), P('rj45'), P('iec')] },
  { id: 'x_icom', cat: 'audio', c: 'IC-4', name: 'Intercom Base Station 4-ch', h: 1, d: 240, kg: 2.8, w: 25, front: [LOGO, P('xlr'), P('knob', 4), P('btn', 4), scr(1.2), PWR], rear: [P('xlr', 4), P('rj45', 2), P('iec')] },
  { id: 'x_clk', cat: 'audio', c: 'WC-8', name: 'Word Clock Generator', h: 1, d: 200, kg: 2, w: 10, front: [LOGO, scr(1.4), P('led', 6), GAP, P('btn', 3), PWR], rear: [P('bnc', 8), P('xlr', 2), P('iec')] },
  { id: 'x_patch48', cat: 'audio', c: '', name: 'TRS Patchbay 48-point', h: 1, d: 90, kg: 1.6, w: 0, front: [GAP, P('jack', 48, 2), GAP], rear: [GAP, P('jack', 48, 2), GAP] },
  { id: 'x_xlrpp', cat: 'audio', c: '', name: 'XLR Panel 16 (front + back)', h: 1, d: 60, kg: 1.2, w: 0, front: [GAP, P('xlr', 16), GAP], rear: [GAP, P('xlr', 16), GAP] },

  /* ---------------- Video ---------------- */
  { id: 'x_sw1me', cat: 'video', c: 'PS-1', name: 'Production Switcher 1 M/E (1U)', h: 1, d: 300, kg: 3.5, w: 60, front: [LOGO, scr(1.6), P('btn', 10), P('led', 6), PWR], rear: [P('bnc', 12, 2), P('hdmi', 2), P('rj45'), P('iec')] },
  { id: 'x_sw4me', cat: 'video', c: 'PS-4', name: 'Production Switcher 4 M/E (3U)', h: 3, d: 420, kg: 13, w: 320, handles: true, front: [[LOGO, scr(2.4), GAP, P('led', 12)], [gr(7)], [P('btn', 8), GAP, PWR]], rear: [[P('bnc', 20)], [P('bnc', 20)], [P('sfp', 4), P('rj45', 2), GAP, P('iec'), P('iec')]] },
  { id: 'x_rt12', cat: 'video', c: 'VR-12', name: 'SDI Router 12×12', h: 1, d: 160, kg: 1.8, w: 20, face: 'silver', front: [LOGO, P('btn', 12), scr(1.2)], rear: [P('bnc', 24, 2), P('rj45'), P('iec')] },
  { id: 'x_rt40', cat: 'video', c: 'VR-40', name: 'SDI Router 40×40 (2U)', h: 2, d: 240, kg: 6, w: 80, face: 'silver', front: [[LOGO, P('btn', 20)], [scr(2), P('btn', 20)]], rear: [[P('bnc', 40, 2)], [P('bnc', 40, 2), P('rj45', 2), P('iec')]] },
  { id: 'x_conv', cat: 'video', c: 'CV-4', name: 'Converter Shelf · 4× HDMI ↔ SDI', h: 1, d: 180, kg: 1.6, w: 20, front: [LOGO, P('led', 8), GAP, PWR], rear: [P('hdmi', 4), P('bnc', 8), P('iec')] },
  { id: 'x_udx', cat: 'video', c: 'UDX', name: 'Up / Down / Cross Converter', h: 1, d: 220, kg: 2, w: 25, front: [LOGO, scr(2), P('btn', 6), P('knob'), PWR], rear: [P('bnc', 6), P('hdmi', 2), P('sfp'), P('rj45'), P('iec')] },
  { id: 'x_enc', cat: 'video', c: 'ST-4', name: 'Streaming Encoder 4-ch', h: 1, d: 260, kg: 2.6, w: 45, front: [LOGO, scr(2.2), P('btn', 4), P('usb'), GAP, P('led', 4), PWR], rear: [P('bnc', 4), P('hdmi', 4), P('rj45', 2), P('iec')] },
  { id: 'x_dec', cat: 'video', c: 'SD-2', name: 'Stream Decoder 2-ch', h: 1, d: 220, kg: 2, w: 30, front: [LOGO, scr(1.6), P('btn', 3), GAP, PWR], rear: [P('bnc', 2), P('hdmi', 2), P('rj45'), P('iec')] },
  { id: 'x_mon7', cat: 'video', c: '', name: 'Rack Monitor 3× 5" (3U)', h: 3, d: 90, kg: 4, w: 45, handles: true, front: [[GAP], [scr(2.6), GAP, scr(2.6), GAP, scr(2.6)], [P('btn', 9), GAP]], rear: [[GAP], [P('bnc', 6), P('hdmi', 3)], [GAP, P('dc')]] },
  { id: 'x_da', cat: 'video', c: 'DA-8', name: 'Video Distribution Amp 1:8', h: 1, d: 150, kg: 1.4, w: 12, front: [LOGO, P('led', 8), GAP, PWR], rear: [P('bnc', 10, 2), P('dc')] },
  { id: 'x_sync', cat: 'video', c: 'SG-1', name: 'Sync & Test Generator', h: 1, d: 230, kg: 2.4, w: 18, front: [LOGO, scr(1.8), P('btn', 6), GAP, PWR], rear: [P('bnc', 8), P('rj45'), P('iec')] },
  { id: 'x_ccu', cat: 'video', c: 'CCU', name: 'Camera Control Unit', h: 1, d: 320, kg: 3.6, w: 60, front: [LOGO, scr(1.4), P('knob', 4), P('btn', 4), P('led', 4), PWR], rear: [P('lc'), P('bnc', 4), P('rj45'), P('iec')] },
  { id: 'x_hmx', cat: 'video', c: 'HM-88', name: 'HDMI Matrix 8×8', h: 1, d: 220, kg: 2.6, w: 30, front: [LOGO, scr(1.4), P('btn', 16), PWR], rear: [P('hdmi', 16, 2), P('rj45'), P('iec')] },
  { id: 'x_hdbt', cat: 'video', c: 'HB-4', name: 'HDBaseT Transmitter Shelf 4×', h: 1, d: 160, kg: 1.6, w: 30, front: [LOGO, P('led', 8), GAP], rear: [P('hdmi', 4), P('rj45', 4), P('dc')] },
  { id: 'x_wall', cat: 'video', c: 'VW-9', name: 'Video Wall Controller (2U)', h: 2, d: 420, kg: 9, w: 260, handles: true, front: [[LOGO, scr(2.4), GAP, P('btn', 4), PWR], [gr(8)]], rear: [[P('hdmi', 9), P('fan', 2)], [P('hdmi', 4), P('rj45', 2), P('usb', 2), GAP, P('iec')]] },
  { id: 'x_rec4', cat: 'video', c: 'RD-4', name: 'ISO Recorder 4-ch', h: 1, d: 260, kg: 2.8, w: 40, front: [LOGO, P('slot', 2), scr(2), P('btn', 6)], rear: [P('bnc', 8), P('hdmi', 2), P('rj45'), P('usb'), P('iec')] },

  /* ---------------- Lighting ---------------- */
  { id: 'x_node8', cat: 'light', c: 'AN-8', name: 'Art-Net / sACN Node 8-universe', h: 1, d: 200, kg: 2.4, w: 18, front: [LOGO, scr(1.4), P('xlr', 8), P('rj45', 2), PWR], rear: [P('pcon', 1, undefined), GAP] },
  { id: 'x_gw2', cat: 'light', c: 'DG-2', name: 'Ethernet to DMX Gateway 2-port', h: 1, d: 160, kg: 1.2, w: 8, front: [LOGO, P('led', 4), GAP, P('xlr', 2), P('rj45')], rear: [P('iec')] },
  { id: 'x_merge', cat: 'light', c: 'DM-2', name: 'DMX Merger / Backup', h: 1, d: 170, kg: 1.6, w: 8, front: [LOGO, P('led', 6), P('btn', 3), GAP, P('xlr', 3)], rear: [P('xlr', 3), GAP, P('iec')] },
  { id: 'x_relay', cat: 'light', c: 'RP-12', name: 'Relay / Switch Pack 12-ch (2U)', h: 2, d: 360, kg: 9, w: 40, handles: true, front: [[LOGO, scr(1.4), GAP, P('led', 12)], [P('brk', 12), GAP, P('xlr', 2)]], rear: [[P('out', 6)], [P('out', 6), GAP, P('pcon')]] },
  { id: 'x_socap', cat: 'light', c: 'PD-32', name: 'Lighting Power Distro 32A (2U)', h: 2, d: 300, kg: 10, w: 0, handles: true, front: [[LOGO, scr(1.2), GAP, P('led', 6)], [P('brk', 12), GAP]], rear: [[P('out', 6), GAP], [P('out', 6), P('pcon', 2)]] },
  { id: 'x_tc', cat: 'light', c: 'TC-1', name: 'Timecode Reader / Generator', h: 1, d: 190, kg: 1.8, w: 10, front: [LOGO, scr(2.4), P('btn', 4), GAP, PWR], rear: [P('xlr', 2), P('bnc', 2), P('rj45'), P('usb'), P('iec')] },
  { id: 'x_wing', cat: 'light', c: 'LW-1', name: 'Lighting Playback Wing (4U)', h: 4, d: 200, kg: 8, w: 40, handles: true, front: [[LOGO, scr(3), GAP], [P('knob', 10), GAP], [P('btn', 20)], [P('btn', 20), P('usb')]], rear: [[GAP], [P('usb', 2), P('rj45')], [P('xlr', 2)], [GAP, P('dc')]] },

  /* ---------------- Network ---------------- */
  sw('x_sw8', 'NS-8', 'Network Switch 8-port', 8, { d: 180, kg: 1.6, w: 15 }),
  sw('x_sw24p', 'NS-24P', 'PoE+ Switch 24-port + 4 SFP', 24, { sfp: 4, poe: true, d: 300, kg: 4.8, w: 450 }),
  sw('x_sw48', 'NS-48', 'Network Switch 48-port + 4 SFP', 48, { sfp: 4, d: 300, kg: 4.5, w: 60 }),
  sw('x_sw48p', 'NS-48P', 'PoE+ Switch 48-port + 4 SFP', 48, { sfp: 4, poe: true, d: 420, kg: 7, w: 900 }),
  { id: 'x_sw10g', cat: 'net', c: 'AG-24', name: '10G SFP+ Aggregation Switch 24-port', h: 1, d: 360, kg: 5, w: 120, face: 'grey', front: [LOGO, P('led', 2), GAP, P('sfp', 24, 2), P('rj45', 2)], rear: [P('fan', 2), GAP, P('iec', 2)] },
  { id: 'x_core', cat: 'net', c: 'CS-2', name: 'Core Switch 48 + 8× 25G (2U)', h: 2, d: 450, kg: 11, w: 300, handles: true, face: 'grey', front: [[LOGO, P('led', 4), GAP, P('rj45', 24, 2)], [GAP, P('rj45', 24, 2), P('sfp', 8, 2)]], rear: [[P('fan', 3), GAP], [P('rj45'), GAP, P('iec', 2)]] },
  { id: 'x_fw', cat: 'net', c: 'FW-1', name: 'Business Firewall 1U', h: 1, d: 300, kg: 4, w: 60, front: [LOGO, scr(1.2), P('led', 4), GAP, P('rj45', 8, 2), P('sfp', 2), P('usb')], rear: [P('fan'), GAP, P('iec')] },
  { id: 'x_wlc', cat: 'net', c: 'WC-1', name: 'Wi-Fi Controller', h: 1, d: 250, kg: 3, w: 40, front: [LOGO, P('led', 6), GAP, P('rj45', 4), P('sfp', 2)], rear: [GAP, P('iec')] },
  { id: 'x_ont', cat: 'net', c: '', name: 'Fiber ONT + Router (on shelf)', h: 2, d: 250, kg: 2.4, w: 20, open: true, front: [GAP, obj('modem'), obj('router'), GAP], rear: [GAP, P('lc'), P('rj45'), P('dc'), GAP, P('rj45', 5), P('dc'), GAP] },
  { id: 'x_cat6_48', cat: 'net', c: '', name: 'Cat6 Patch Panel 48-port (2U)', h: 2, d: 40, kg: 1.6, w: 0, front: [[GAP, P('rj45', 24), GAP], [GAP, P('rj45', 24), GAP]], rear: [[GAP, P('rj45', 24), GAP], [GAP, P('rj45', 24), GAP]] },
  { id: 'x_cat6_12', cat: 'net', c: '', name: 'Cat6 Patch Panel 12-port (10")', h: 1, d: 40, kg: .5, w: 0, front: [GAP, P('rj45', 12), GAP], rear: [GAP, P('rj45', 12), GAP] },
  { id: 'x_fib24', cat: 'net', c: '', name: 'Fiber Patch 24× LC', h: 1, d: 140, kg: 1.8, w: 0, front: [GAP, P('lc', 24), GAP], rear: [GAP, P('lc', 24), GAP] },
  { id: 'x_fib48', cat: 'net', c: '', name: 'Fiber Patch 48× LC (2U)', h: 2, d: 160, kg: 2.6, w: 0, front: [[GAP, P('lc', 24), GAP], [GAP, P('lc', 24), GAP]], rear: [[GAP, P('lc', 24), GAP], [GAP, P('lc', 24), GAP]] },
  { id: 'x_coax', cat: 'net', c: '', name: 'Coax F-Type Panel 16', h: 1, d: 50, kg: .9, w: 0, front: [GAP, P('bnc', 16), GAP], rear: [GAP, P('bnc', 16), GAP] },
  { id: 'x_poe8', cat: 'net', c: 'PI-8', name: 'PoE Injector Panel 8-port', h: 1, d: 200, kg: 2.6, w: 260, front: [LOGO, P('led', 8), GAP, P('rj45', 16, 2)], rear: [GAP, P('iec')] },
  { id: 'x_mcc', cat: 'net', c: 'MC-16', name: 'Media Converter Chassis 16-slot (2U)', h: 2, d: 280, kg: 6, w: 100, front: [[LOGO, P('rj45', 16), P('led', 4)], [P('sfp', 16), GAP, PWR]], rear: [[P('fan', 2), GAP], [GAP, P('iec', 2)]] },
  { id: 'x_cons', cat: 'net', c: 'CN-16', name: 'Console Server 16-port', h: 1, d: 260, kg: 3, w: 25, front: [LOGO, P('led', 4), GAP, P('rj45', 16, 2), P('usb')], rear: [P('rj45', 2), P('sfp'), GAP, P('iec')] },
  { id: 'x_lte', cat: 'net', c: 'LT-1', name: '4G / 5G Backup Router', h: 1, d: 200, kg: 1.6, w: 15, front: [LOGO, P('led', 6), GAP, P('rj45', 4)], rear: [P('bnc', 4), GAP, P('dc')] },

  /* ---------------- Servers & PCs ---------------- */
  { id: 'x_srv10', cat: 'compute', c: 'SRV-1', name: '1U Server · 10× 2.5" bays', h: 1, d: 720, kg: 17, w: 650, face: 'grey', front: [P('hdd', 5), GAP, P('led', 2), PWR], rear: [P('iec'), P('iec'), P('usb', 2), P('rj45', 4), P('sfp', 2), P('hdmi'), P('pcie', 2)] },
  { id: 'x_srv12', cat: 'compute', c: 'SRV-2', name: '2U Storage Server · 12× 3.5" bays', h: 2, d: 740, kg: 28, w: 800, handles: true, face: 'grey', front: [[P('hdd', 4), GAP], [P('hdd', 4), LOGO, PWR]], rear: [[P('iec'), P('iec'), P('fan', 2), P('pcie', 3)], [P('usb', 2), P('rj45', 4), P('sfp', 2), P('hdmi')]] },
  { id: 'x_srv24', cat: 'compute', c: 'SRV-24', name: '2U Server · 24× 2.5" bays', h: 2, d: 730, kg: 26, w: 900, handles: true, face: 'grey', front: [[P('hdd', 5), GAP], [P('hdd', 5), PWR]], rear: [[P('iec'), P('iec'), P('pcie', 6)], [P('usb', 2), P('rj45', 4), P('sfp', 4), P('hdmi')]] },
  { id: 'x_srv36', cat: 'compute', c: 'ST-36', name: '4U Storage Server · 36 bays', h: 4, d: 750, kg: 45, w: 1200, handles: true, front: [[P('hdd', 4), GAP], [P('hdd', 4), GAP], [P('hdd', 4), GAP], [P('hdd', 4), PWR]], rear: [[P('fan', 3), GAP], [P('pcie', 7), GAP], [P('rj45', 4), P('sfp', 2), P('usb', 2)], [P('iec'), P('iec'), GAP]] },
  { id: 'x_gpu', cat: 'compute', c: 'GPU-8', name: '4U GPU Server · 8 GPUs', h: 4, d: 800, kg: 50, w: 3200, handles: true, front: [[LOGO, GAP, P('led', 2), PWR], [gr(8.6)], [gr(8.6)], [P('hdd', 4), GAP]], rear: [[P('fan', 4), GAP], [P('pcie', 8), GAP], [P('rj45', 2), P('sfp', 4), P('usb', 2)], [P('iec', 4), GAP]] },
  { id: 'x_jbod', cat: 'compute', c: 'JB-12', name: 'JBOD Expansion 12 bays (2U)', h: 2, d: 600, kg: 24, w: 250, handles: true, front: [[P('hdd', 4), GAP], [P('hdd', 4), PWR]], rear: [[P('fan', 2), P('sfp', 2)], [P('iec'), P('iec'), GAP]] },
  { id: 'x_ws3', cat: 'compute', c: 'WS-3U', name: 'Rackmount Workstation 3U', h: 3, d: 500, kg: 15, w: 750, handles: true, front: [[LOGO, GAP, P('led', 2), PWR], [P('bay'), gr(4.5)], [P('usb', 4), P('jack', 2), GAP]], rear: [[P('fan'), P('usb', 6, 2), P('rj45', 2), P('hdmi', 3)], [P('pcie', 7), GAP], [P('iec'), GAP]] },
  { id: 'x_macmini', cat: 'compute', c: '', name: 'Mac mini Shelf ×2 (1U)', h: 1, d: 230, kg: 3, w: 80, open: true, front: [GAP, obj('macmini', 2), GAP], rear: [GAP, P('rj45', 2), P('hdmi', 2), P('usb', 4), P('iec', 2), GAP] },
  { id: 'x_studio', cat: 'compute', c: '', name: 'Desktop Studio Computer Shelf (3U)', h: 3, d: 230, kg: 4.5, w: 300, open: true, front: [GAP, obj('studio'), GAP], rear: [GAP, P('rj45'), P('hdmi'), P('usb', 4), P('iec'), GAP] },
  { id: 'x_kvm8', cat: 'compute', c: 'KVM-8', name: 'KVM Switch 8-port', h: 1, d: 200, kg: 2.2, w: 10, front: [LOGO, P('btn', 8), P('led', 8), GAP, P('usb', 2)], rear: [P('hdmi', 9), P('usb', 9), P('dc')] },
  { id: 'x_kbd', cat: 'compute', c: '', name: 'Keyboard Tray (1U)', h: 1, d: 400, kg: 3, w: 0, front: [{ t: 'handle' }], rear: [] },
  { id: 'x_tape', cat: 'compute', c: 'TL-1', name: 'Tape Autoloader (2U)', h: 2, d: 750, kg: 18, w: 90, front: [[LOGO, scr(2), GAP, P('btn', 4)], [P('slot', 2), gr(4), PWR]], rear: [[P('fan'), GAP, P('rj45')], [P('sfp', 2), GAP, P('iec')]] },
  { id: 'x_nas4u', cat: 'compute', c: 'NAS-4', name: 'NAS 1U · 4 drive bays', h: 1, d: 480, kg: 9, w: 80, face: 'grey', front: [P('hdd', 4), LOGO, PWR], rear: [P('fan', 2), P('rj45', 4), P('usb', 2), GAP, P('iec')] },

  /* ---------------- Power ---------------- */
  { id: 'x_pdu12', cat: 'power', c: 'PDU-12', name: 'PDU 12× C13 (1U)', h: 1, d: 120, kg: 2.2, w: 0, front: [P('out', 12)], rear: [GAP, P('iec')] },
  { id: 'x_pdum', cat: 'power', c: 'PDU-M', name: 'Metered PDU 8 outlets', h: 1, d: 180, kg: 2.6, w: 5, front: [LOGO, scr(1.4), GAP, P('out', 8)], rear: [P('rj45'), GAP, P('iec')] },
  { id: 'x_pdus', cat: 'power', c: 'PDU-S', name: 'Switched PDU 8 outlets', h: 1, d: 200, kg: 2.8, w: 6, front: [LOGO, scr(1.2), P('led', 8), P('out', 8)], rear: [P('rj45', 2), GAP, P('iec')] },
  { id: 'x_strip', cat: 'power', c: '', name: 'Power Strip 10 outlets + 2 USB', h: 1, d: 100, kg: 1.6, w: 0, front: [PWR, P('usb', 2), GAP, P('us', 10)], rear: [GAP, P('iec')] },
  { id: 'x_ups3k', cat: 'power', c: 'UPS-3K', name: 'UPS 3000 VA (2U)', h: 2, d: 600, kg: 38, w: 50, handles: true, front: [[LOGO, scr(2), GAP, P('led', 4), PWR], [gr(8.6)]], rear: [[P('fan'), P('rj45'), P('usb'), GAP, P('out', 4)], [P('out', 4), GAP, P('iec')]] },
  { id: 'x_ups5k', cat: 'power', c: 'UPS-5K', name: 'UPS 5000 VA (3U)', h: 3, d: 650, kg: 55, w: 70, handles: true, front: [[LOGO, scr(2.4), GAP, P('led', 4), PWR], [gr(8.6)], [gr(8.6)]], rear: [[P('fan', 2), P('rj45'), P('usb')], [P('out', 8)], [P('pcon', 2), GAP, P('iec')]] },
  { id: 'x_batt', cat: 'power', c: 'EBM', name: 'UPS Battery Pack (2U)', h: 2, d: 600, kg: 45, w: 0, handles: true, front: [[LOGO, GAP, P('led', 2)], [gr(8.6)]], rear: [[GAP, P('pcon')], [GAP]] },
  { id: 'x_ats', cat: 'power', c: 'ATS', name: 'Automatic Transfer Switch', h: 1, d: 260, kg: 4, w: 5, front: [LOGO, P('led', 4), scr(1.2), GAP, P('out', 6)], rear: [P('iec'), P('iec'), P('rj45')] },
  { id: 'x_3ph', cat: 'power', c: 'PD-3P', name: '3-Phase Distro 32A (2U)', h: 2, d: 300, kg: 9, w: 0, handles: true, front: [[LOGO, scr(1.6), GAP, P('led', 6)], [P('brk', 9), GAP, P('pcon', 6)]], rear: [[GAP, P('pcon')], [GAP]] },

  /* ---------------- Security ---------------- */
  { id: 'x_nvr8', cat: 'secur', c: 'NVR-8', name: 'NVR 8-ch PoE (1U)', h: 1, d: 280, kg: 3.2, w: 110, front: [LOGO, P('led', 4), GAP, P('usb'), PWR], rear: [P('rj45', 8, 2), P('rj45'), P('hdmi'), P('usb'), GAP, P('iec')] },
  { id: 'x_dvr16', cat: 'secur', c: 'DVR-16', name: 'DVR 16-ch Coax (1U)', h: 1, d: 300, kg: 3.6, w: 40, front: [LOGO, P('led', 4), GAP, P('usb'), PWR], rear: [P('bnc', 16, 2), P('rj45'), P('hdmi'), P('usb'), P('iec')] },
  { id: 'x_camsw', cat: 'secur', c: 'CS-16P', name: 'Camera PoE Switch 16 + 2 uplink', h: 1, d: 260, kg: 3.4, w: 250, face: 'grey', front: [LOGO, P('led', 2), GAP, P('rj45', 18, 2)], rear: [P('fan'), GAP, P('iec')] },
  { id: 'x_alarm', cat: 'secur', c: 'AL-1', name: 'Alarm Panel (on shelf)', h: 2, d: 200, kg: 3, w: 20, open: true, front: [GAP, obj('box'), GAP], rear: [GAP, P('rj45'), P('dc'), GAP] },
  { id: 'x_acs', cat: 'secur', c: 'AC-4', name: 'Access Control Controller 4-door', h: 1, d: 220, kg: 2.2, w: 30, front: [LOGO, P('led', 8), GAP, PWR], rear: [P('rj45', 5), GAP, P('dc')] },
  { id: 'x_vms', cat: 'secur', c: 'VMS', name: 'Video Management Server 2U', h: 2, d: 600, kg: 20, w: 450, handles: true, front: [[P('hdd', 4), GAP], [P('hdd', 4), PWR]], rear: [[P('fan', 2), P('pcie', 2)], [P('rj45', 4), P('hdmi', 2), P('iec'), P('iec')]] },
  { id: 'x_secmon', cat: 'secur', c: '', name: 'Security Monitor 15" (8U)', h: 8, d: 70, kg: 6, w: 30, front: [[GAP], [GAP], [scr(7.5)], [scr(7.5)], [scr(7.5)], [scr(7.5)], [GAP], [P('btn', 6), GAP]], rear: [[GAP], [GAP], [GAP], [P('hdmi'), P('bnc', 2)], [GAP], [GAP], [GAP], [GAP, P('dc')]] },

  /* ---------------- Home & DIY ---------------- */
  { id: 'x_avr', cat: 'home', c: 'AVR', name: 'AV Receiver (4U)', h: 4, d: 380, kg: 11, w: 500, front: [[LOGO, GAP, scr(3), GAP], [P('knob'), GAP, P('btn', 10), GAP, P('knob')], [GAP], [P('jack'), P('usb'), P('hdmi'), GAP, PWR]], rear: [[P('hdmi', 8), P('rj45')], [P('jack', 8)], [P('spk', 9)], [P('usb'), GAP, P('iec')]] },
  { id: 'x_bluray', cat: 'home', c: '', name: 'Blu-ray Player (on shelf)', h: 2, d: 260, kg: 2.4, w: 20, open: true, front: [GAP, obj('ps4'), GAP], rear: [GAP, P('hdmi'), P('rj45'), P('iec'), GAP] },
  { id: 'x_xsx', cat: 'home', c: '', name: 'Xbox Series X (on shelf)', h: 4, d: 300, kg: 4.5, w: 200, open: true, front: [GAP, obj('tower'), GAP], rear: [GAP, P('hdmi'), P('rj45'), P('usb', 2), P('iec'), GAP] },
  { id: 'x_nsw', cat: 'home', c: '', name: 'Nintendo Switch Dock (on shelf)', h: 3, d: 160, kg: 1, w: 40, open: true, front: [GAP, obj('dock'), GAP], rear: [GAP, P('hdmi'), P('usb', 2), P('dc'), GAP] },
  { id: 'x_atv', cat: 'home', c: '', name: 'Apple TV / Streaming Box ×2 (1U)', h: 1, d: 120, kg: .9, w: 12, open: true, front: [obj('stream', 2), GAP], rear: [P('hdmi', 2), P('rj45', 2), P('dc', 2), GAP] },
  { id: 'x_stb', cat: 'home', c: '', name: 'Cable / Satellite Box (on shelf)', h: 2, d: 240, kg: 1.6, w: 18, open: true, front: [GAP, obj('box'), GAP], rear: [GAP, P('bnc'), P('hdmi'), P('rj45'), P('dc'), GAP] },
  { id: 'x_hub', cat: 'home', c: '', name: 'Smart Home Hub + Bridges (1U)', h: 1, d: 160, kg: .8, w: 8, open: true, front: [obj('mini'), obj('stream'), GAP], rear: [P('rj45', 2), P('usb'), P('dc', 2), GAP] },
  { id: 'x_samp', cat: 'home', c: '', name: 'Streaming Amp ×2 (on shelf)', h: 2, d: 220, kg: 4.2, w: 250, open: true, front: [GAP, obj('macmini', 2), GAP], rear: [GAP, P('rj45', 2), P('hdmi', 2), P('spk', 4), P('iec', 2), GAP] },
  { id: 'x_mesh', cat: 'home', c: '', name: 'Wi-Fi Mesh Base (on shelf)', h: 2, d: 180, kg: 1, w: 15, open: true, front: [GAP, obj('modem'), GAP], rear: [GAP, P('rj45', 3), P('dc'), GAP] },
  { id: 'x_gpc', cat: 'home', c: 'GX-4U', name: 'Gaming PC 4U (RGB, glass front)', h: 4, d: 480, kg: 14, w: 650, handles: true, front: [[LOGO, GAP, P('led', 6), PWR], [P('fan', 3), GAP], [gr(8)], [P('usb', 4), P('jack', 2), GAP]], rear: [[P('fan'), GAP, P('iec')], [P('usb', 8, 2), P('rj45'), P('hdmi', 4), P('jack', 5)], [P('pcie', 7), GAP], [gr(8)]] },
  { id: 'x_sbc', cat: 'home', c: 'SBC-8', name: 'Single-Board Computer Mount 8× (1U)', h: 1, d: 110, kg: 1.2, w: 40, front: [obj('pi', 8), GAP], rear: [P('rj45', 8), P('dc', 2)] },
  { id: 'x_ups1u', cat: 'home', c: 'UPS-600', name: 'Compact UPS 600 VA (1U)', h: 1, d: 300, kg: 7, w: 10, front: [LOGO, P('led', 3), GAP, gr(3), PWR], rear: [P('us', 4), P('usb'), GAP, P('iec')] },

  /* ---------------- Utility ---------------- */
  blank('x_b3', 3), blank('x_b4', 4),
  { id: 'x_vent2', cat: 'util', c: '', name: 'Vent Panel 2U', h: 2, d: 10, kg: .7, w: 0, front: [[gr(8.9)], [gr(8.9)]], rear: [[gr(8.9)], [gr(8.9)]] },
  { id: 'x_shelf1', cat: 'util', c: '', name: 'Cantilever Shelf 1U', h: 1, d: 250, kg: 1.8, w: 0, open: true, front: [], rear: [] },
  { id: 'x_shelf4', cat: 'util', c: '', name: 'Vented Shelf 4U', h: 4, d: 500, kg: 5, w: 0, open: true, front: [], rear: [] },
  { id: 'x_drw1', cat: 'util', c: '', name: 'Rack Drawer 1U', h: 1, d: 350, kg: 3.5, w: 0, front: [{ t: 'handle' }], rear: [] },
  { id: 'x_drw2', cat: 'util', c: '', name: 'Rack Drawer 2U', h: 2, d: 400, kg: 5.5, w: 0, front: [[GAP], [{ t: 'handle' }]], rear: [] },
  { id: 'x_drw4', cat: 'util', c: '', name: 'Rack Drawer 4U', h: 4, d: 450, kg: 9, w: 0, front: [[GAP], [{ t: 'handle' }], [GAP], [GAP]], rear: [] },
  { id: 'x_cm1', cat: 'util', c: '', name: 'Horizontal Cable Manager 1U', h: 1, d: 80, kg: .8, w: 0, front: [{ t: 'brush' }], rear: [{ t: 'lace' }] },
  { id: 'x_cm2', cat: 'util', c: '', name: 'Horizontal Cable Manager 2U', h: 2, d: 100, kg: 1.4, w: 0, front: [[{ t: 'brush' }], [{ t: 'brush' }]], rear: [[{ t: 'lace' }], [{ t: 'lace' }]] },
  { id: 'x_fan2', cat: 'util', c: '', name: 'Fan Tray 2U · 4 fans', h: 2, d: 160, kg: 2.2, w: 40, front: [[gr(8.6)], [gr(8.6)]], rear: [[GAP, P('fan', 4), GAP], [GAP, P('iec')]] },
  { id: 'x_env', cat: 'util', c: 'EN-1', name: 'Environment Monitor (temp / humidity)', h: 1, d: 140, kg: 1, w: 6, front: [LOGO, scr(1.6), P('led', 4), GAP], rear: [P('rj45', 3), P('jack', 4), P('dc')] },
  { id: 'x_lamp2', cat: 'util', c: 'RL-2', name: 'LED Rack Light Bar', h: 1, d: 60, kg: .6, w: 8, front: [GAP, P('led', 12), GAP, PWR], rear: [P('iec')] },
  { id: 'x_mon1u', cat: 'util', c: '', name: 'Rack LCD Monitor Drawer 17" (1U)', h: 1, d: 550, kg: 12, w: 25, front: [LOGO, { t: 'handle' }, P('led', 2)], rear: [P('hdmi'), P('usb', 2), P('dc')] },
];

/* New shelf objects used above (drawn in both 2D and 3D) */
export const EXTRA_CATS = {
  compute: { n: 'Servers & PCs', c: '--c-compute' },
  secur: { n: 'Security', c: '--c-secur' },
};
