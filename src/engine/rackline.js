/*
  Rackline engine: rack drawing, devices, cables, the 2D views and the
  three.js 3D view. React renders the page shell (see src/components), then
  App calls mountRackline() once to bring it to life.
*/
import { svgIcon as I } from '../icons.js';
import { EXTRA_DEVICES, EXTRA_CATS } from './devices-extra.js';

let mounted = false;

export function mountRackline() {
  if (mounted) return;
  mounted = true;

const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,9);

const CATS={home:{n:'Home & DIY',c:'--c-home'},mine:{n:'My devices',c:'--c-mine'},audio:{n:'Audio',c:'--c-audio'},video:{n:'Video',c:'--c-video'},light:{n:'Lighting',c:'--c-light'},net:{n:'Network',c:'--c-net'},power:{n:'Power',c:'--c-power'},util:{n:'Utility',c:'--c-util'}};
{const o={};Object.entries(CATS).forEach(([k,v])=>{o[k]=v;if(k==='net'){o.compute=EXTRA_CATS.compute;o.secur=EXTRA_CATS.secur}});Object.keys(CATS).forEach(k=>delete CATS[k]);Object.assign(CATS,o)}
const TAPES=[['#f2f0e9','White'],['#f4d03f','Yellow'],['#e8743b','Orange'],['#d64545','Red',1],['#3f9b5c','Green',1],['#3f72c9','Blue',1],['#7a52c7','Purple',1],['#222222','Black',1]];
const DARK_TAPE=new Set(TAPES.filter(t=>t[2]).map(t=>t[0]));

const LIB=[
 {id:'pc4',cat:'home',c:'ATX-4U',name:'Rackmount PC 4U (ATX)',h:4,d:450,kg:12,w:450,handles:1,
  front:[[{t:'logo'},{t:'gap'},{t:'led',n:2},{t:'pwr'}],[{t:'bay',n:2},{t:'gap'}],[{t:'grille',w:8.4}],[{t:'usb',n:2},{t:'jack',n:2},{t:'gap'},{t:'btn'}]],
  rear:[[{t:'fan'},{t:'gap'},{t:'iec'},{t:'pwr'}],[{t:'usb',n:6,rows:2},{t:'rj45'},{t:'hdmi',n:2},{t:'jack',n:3},{t:'gap'}],[{t:'pcie',n:7},{t:'gap'}],[{t:'grille',w:8}]]},
 {id:'pc2',cat:'home',c:'PC-2U',name:'Rackmount PC 2U (mATX)',h:2,d:400,kg:8,w:300,handles:1,
  front:[[{t:'logo'},{t:'gap'},{t:'usb',n:2},{t:'led',n:2},{t:'pwr'}],[{t:'bay'},{t:'grille',w:4.6}]],
  rear:[[{t:'fan'},{t:'usb',n:4,rows:2},{t:'rj45'},{t:'hdmi'},{t:'gap'},{t:'iec'}],[{t:'pcie',n:4},{t:'gap'},{t:'grille',w:3}]]},
 {id:'srv1',cat:'home',c:'SRV-1U',name:'1U Server · 4 drive bays',h:1,d:580,kg:14,w:350,face:'grey',
  front:[{t:'hdd',n:4},{t:'gap'},{t:'led',n:2},{t:'pwr'}],rear:[{t:'iec'},{t:'iec'},{t:'gap'},{t:'usb',n:2},{t:'rj45',n:4},{t:'hdmi'}]},
 {id:'nas',cat:'home',c:'NAS-8',name:'NAS 2U · 8 drive bays',h:2,d:480,kg:13,w:120,handles:1,
  front:[[{t:'hdd',n:4},{t:'logo'}],[{t:'hdd',n:4},{t:'pwr'}]],rear:[[{t:'fan',n:2},{t:'gap'},{t:'iec'}],[{t:'rj45',n:4},{t:'sfp',n:2},{t:'usb',n:2},{t:'gap'}]]},
 {id:'netshelf',cat:'home',c:'',name:'Shelf: Modem + Wi-Fi Router',h:2,d:300,kg:4.5,w:30,open:1,
  front:[{t:'gap'},{t:'obj',k:'modem'},{t:'obj',k:'router'},{t:'gap'}],rear:[{t:'gap'},{t:'bnc'},{t:'rj45'},{t:'dc'},{t:'gap'},{t:'rj45',n:5},{t:'dc'},{t:'gap'}]},
 {id:'router',cat:'home',c:'',name:'Wi-Fi Router (on shelf)',h:2,d:250,kg:2.8,w:18,open:1,front:[{t:'gap'},{t:'obj',k:'router'},{t:'gap'}],rear:[{t:'gap'},{t:'rj45',n:5},{t:'dc'},{t:'gap'}]},
 {id:'modem',cat:'home',c:'',name:'Cable / Fiber Modem (on shelf)',h:2,d:220,kg:2.2,w:12,open:1,front:[{t:'gap'},{t:'obj',k:'modem'},{t:'gap'}],rear:[{t:'gap'},{t:'bnc'},{t:'rj45'},{t:'dc'},{t:'gap'}]},
 {id:'minipc',cat:'home',c:'',name:'Mini PCs ×3 (on 1U shelf)',h:1,d:200,kg:2.6,w:60,open:1,front:[{t:'obj',k:'mini',n:3},{t:'gap'}],rear:[{t:'rj45',n:3},{t:'hdmi',n:3},{t:'dc',n:3},{t:'gap'}]},
 {id:'console',cat:'home',c:'',name:'Game Console (on shelf)',h:2,d:320,kg:4.5,w:200,open:1,front:[{t:'gap'},{t:'obj',k:'console'},{t:'gap'}],rear:[{t:'gap'},{t:'hdmi'},{t:'rj45'},{t:'usb',n:2},{t:'gap'}]},
 {id:'ps5',cat:'home',c:'',name:'PS5 Console (on shelf)',h:3,d:390,kg:4.5,w:200,open:1,front:[{t:'gap'},{t:'obj',k:'ps5'},{t:'gap'}],rear:[{t:'gap'},{t:'hdmi'},{t:'rj45'},{t:'usb',n:2},{t:'iec'},{t:'gap'}]},
 {id:'ps4',cat:'home',c:'',name:'PS4 Console (on shelf)',h:2,d:290,kg:2.1,w:165,open:1,front:[{t:'gap'},{t:'obj',k:'ps4'},{t:'gap'}],rear:[{t:'gap'},{t:'hdmi'},{t:'rj45'},{t:'iec'},{t:'gap'}]},
 {id:'stream',cat:'home',c:'',name:'Streaming Box (on shelf)',h:1,d:120,kg:.4,w:8,open:1,front:[{t:'obj',k:'stream'},{t:'gap'}],rear:[{t:'hdmi'},{t:'rj45'},{t:'dc'},{t:'gap'}]},
 {id:'hnas4',cat:'home',c:'',name:'Home NAS 4-bay (on shelf)',h:4,d:240,kg:5.5,w:45,open:1,front:[{t:'gap'},{t:'obj',k:'hnas'},{t:'gap'}],rear:[{t:'gap'},{t:'rj45',n:2},{t:'usb'},{t:'dc'},{t:'gap'}]},
 {id:'hnas2',cat:'home',c:'',name:'Home NAS 2-bay (on shelf)',h:4,d:230,kg:3,w:25,open:1,front:[{t:'gap'},{t:'obj',k:'hnas2'},{t:'gap'}],rear:[{t:'gap'},{t:'rj45'},{t:'usb'},{t:'dc'},{t:'gap'}]},
 {id:'hdmisw',cat:'home',c:'HX-42',name:'HDMI Switch 4×2 (1U)',h:1,d:180,kg:1.6,w:12,front:[{t:'logo'},{t:'led',n:6},{t:'gap'},{t:'btn',n:4}],rear:[{t:'hdmi',n:6},{t:'gap'},{t:'rj45'},{t:'dc'}]},
 {id:'avpanel',cat:'home',c:'',name:'AV Pass-Through Panel (HDMI + USB)',h:1,d:50,kg:.6,w:0,front:[{t:'gap'},{t:'hdmi',n:4},{t:'usb',n:4},{t:'gap'}],rear:[{t:'gap'},{t:'hdmi',n:4},{t:'usb',n:4},{t:'gap'}]},
 {id:'nvr16',cat:'home',c:'NVR-16',name:'NVR 16-ch PoE 1U',h:1,d:330,kg:4.2,w:220,front:[{t:'logo'},{t:'led',n:4},{t:'gap'},{t:'usb'},{t:'pwr'}],rear:[{t:'rj45',n:16,rows:2},{t:'rj45'},{t:'hdmi'},{t:'usb'},{t:'gap'},{t:'iec'}]},
 {id:'nvr32',cat:'home',c:'NVR-32',name:'NVR 32-ch 2U · 8 drives',h:2,d:480,kg:11,w:90,handles:1,front:[[{t:'hdd',n:4},{t:'logo'}],[{t:'hdd',n:4},{t:'usb'},{t:'pwr'}]],rear:[[{t:'fan',n:2},{t:'rj45',n:2},{t:'hdmi',n:2},{t:'gap'}],[{t:'usb',n:2},{t:'gap'},{t:'iec'}]]},
 {id:'pi',cat:'home',c:'PI-4',name:'Raspberry Pi Mount 1U (4×)',h:1,d:110,kg:.9,w:20,front:[{t:'obj',k:'pi',n:4},{t:'gap'},{t:'led',n:4}],rear:[{t:'rj45',n:4},{t:'gap'},{t:'dc'}]},
 {id:'sw16',cat:'home',c:'SW-16',name:'Unmanaged Switch 16-port',h:1,d:180,kg:1.8,w:12,face:'grey',front:[{t:'logo'},{t:'led',n:2},{t:'gap'},{t:'rj45',n:16,rows:2}],rear:[{t:'gap'},{t:'iec'}]},
 {id:'key24',cat:'home',c:'',name:'Keystone Patch Panel 24-port',h:1,d:40,kg:.8,w:0,front:[{t:'gap'},{t:'rj45',n:24},{t:'gap'}],rear:[{t:'gap'},{t:'rj45',n:24},{t:'gap'}]},
 {id:'brush',cat:'home',c:'',name:'Brush Pass-Through Panel',h:1,d:20,kg:.4,w:0,front:[{t:'brush'}],rear:[{t:'brush'}]},
 {id:'kvm',cat:'home',c:'KVM-1',name:'1U KVM Console Drawer',h:1,d:600,kg:14,w:25,front:[{t:'logo'},{t:'handle'},{t:'led',n:2}],rear:[{t:'usb',n:2},{t:'hdmi'},{t:'gap'},{t:'iec'}]},
 {id:'pdus',cat:'home',c:'PDU-8',name:'Basic PDU · 8 US outlets',h:1,d:150,kg:1.8,w:0,front:[{t:'pwr'},{t:'gap'},{t:'us',n:8}],rear:[{t:'gap'},{t:'iec'}]},
 {id:'upsh',cat:'home',c:'UPS-1U',name:'Slim UPS 1U · 1000 VA',h:1,d:400,kg:13,w:20,front:[{t:'logo'},{t:'screen',w:1.4},{t:'led',n:3},{t:'gap'},{t:'grille',w:3},{t:'pwr'}],rear:[{t:'us',n:6},{t:'gap'},{t:'iec'}]},
 {id:'fan1',cat:'home',c:'',name:'Fan Tray 1U',h:1,d:150,kg:1.3,w:15,front:[{t:'grille',w:8.6}],rear:[{t:'gap'},{t:'fan',n:3},{t:'gap'},{t:'iec'}]},
 {id:'ai',cat:'audio',c:'AI-8',name:'Studio Audio Interface 8-in',h:1,d:220,kg:2.6,w:20,face:'grey',front:[{t:'logo'},{t:'xlr',n:2},{t:'knob',n:6},{t:'led',n:8},{t:'jack',n:2},{t:'pwr'}],rear:[{t:'xlr',n:6},{t:'usb'},{t:'rj45'},{t:'iec'}]},
 {id:'wr4',cat:'audio',c:'RX-4',name:'4-ch Wireless Receiver',h:1,d:330,kg:4.8,w:40,face:'black',
  front:[{t:'logo'},{t:'screen',w:1.9},{t:'btn',n:3},{t:'screen',w:1.9},{t:'btn',n:3},{t:'led',n:4},{t:'pwr'}],rear:[{t:'bnc',n:2},{t:'xlr',n:4},{t:'rj45',n:2},{t:'iec'}]},
 {id:'wr2',cat:'audio',c:'RX-2',name:'2-ch Wireless Receiver',h:1,d:290,kg:3.9,w:26,face:'black',
  front:[{t:'logo'},{t:'screen',w:2.4},{t:'knob',n:2},{t:'gap'},{t:'led',n:6},{t:'pwr'}],rear:[{t:'bnc',n:2},{t:'xlr',n:2},{t:'rj45'},{t:'iec'}]},
 {id:'ant',cat:'audio',c:'AD-14',name:'Antenna Distribution 1:4',h:1,d:220,kg:2.6,w:12,face:'black',
  front:[{t:'logo'},{t:'led',n:4},{t:'gap'},{t:'bnc',n:2},{t:'pwr'}],rear:[{t:'bnc',n:10},{t:'iec'}]},
 {id:'iem',cat:'audio',c:'TX-2',name:'Dual In-Ear Transmitter',h:1,d:260,kg:3.4,w:30,face:'black',
  front:[{t:'logo'},{t:'screen',w:1.8},{t:'knob',n:2},{t:'screen',w:1.8},{t:'knob',n:2},{t:'pwr'}],rear:[{t:'bnc',n:2},{t:'xlr',n:4},{t:'iec'}]},
 {id:'pre8',cat:'audio',c:'MP-8',name:'8-ch Mic Preamp',h:1,d:280,kg:4.1,w:35,face:'grey',
  front:[{t:'logo'},{t:'knob',n:8},{t:'led',n:8},{t:'pwr'}],rear:[{t:'xlr',n:8},{t:'rj45',n:2},{t:'iec'}]},
 {id:'proc',cat:'audio',c:'SP-48',name:'Speaker Processor 4×8',h:1,d:300,kg:4.5,w:40,face:'black',
  front:[{t:'logo'},{t:'screen',w:2.6},{t:'btn',n:12},{t:'knob'}],rear:[{t:'xlr',n:12},{t:'rj45',n:2},{t:'iec'}]},
 {id:'nai',cat:'audio',c:'NA-16',name:'Network Audio Interface 16×16',h:1,d:250,kg:3,w:30,face:'silver',
  front:[{t:'logo'},{t:'led',n:16},{t:'gap'},{t:'screen',w:1.4},{t:'pwr'}],rear:[{t:'xlr',n:8},{t:'rj45',n:2},{t:'iec'}]},
 {id:'amp',cat:'audio',c:'PA-4K',name:'Power Amplifier 4×1500 W',h:2,d:470,kg:16,w:1200,face:'black',handles:1,
  front:[{t:'grille',w:2.6},{t:'logo'},{t:'led',n:8},{t:'screen',w:1.4},{t:'grille',w:2.6},{t:'pwr'}],rear:[[{t:'fan',n:2},{t:'gap'},{t:'xlr',n:4}],[{t:'spk',n:4},{t:'rj45',n:2},{t:'gap'},{t:'pcon'}]]},
 {id:'eng',cat:'audio',c:'DM-64',name:'Digital Mixer Engine 64-ch',h:3,d:420,kg:11,w:180,face:'black',handles:1,
  front:[[{t:'logo'},{t:'screen',w:3.2},{t:'gap'},{t:'led',n:12}],[{t:'grille',w:5.4},{t:'btn',n:6},{t:'pwr'}],[{t:'slot',n:2},{t:'gap'},{t:'rj45',n:2},{t:'sfp',n:2}]],
  rear:[[{t:'xlr',n:16}],[{t:'xlr',n:16}],[{t:'rj45',n:4},{t:'sfp',n:2},{t:'gap'},{t:'iec'},{t:'iec'}]]},
 {id:'stb',cat:'audio',c:'SB-32',name:'Stage Box 32×16',h:3,d:250,kg:9.5,w:60,face:'black',handles:1,
  front:[[{t:'xlr',n:16}],[{t:'xlr',n:16}],[{t:'xlr',n:16}]],rear:[[{t:'logo'},{t:'gap'}],[{t:'rj45',n:2},{t:'gap'},{t:'pcon'}],[{t:'gap'}]]},

 {id:'mtx',cat:'video',c:'VR-16',name:'SDI Matrix Router 16×16',h:1,d:180,kg:2.2,w:30,face:'silver',
  front:[{t:'logo'},{t:'btn',n:16},{t:'screen',w:1.3}],rear:[{t:'bnc',n:32,rows:2},{t:'rj45'},{t:'iec'}]},
 {id:'mv',cat:'video',c:'MV-16',name:'Multiviewer 16-input',h:1,d:220,kg:2.6,w:35,face:'black',
  front:[{t:'logo'},{t:'led',n:16},{t:'gap'},{t:'pwr'}],rear:[{t:'bnc',n:16,rows:2},{t:'hdmi',n:2},{t:'rj45'},{t:'iec'}]},
 {id:'ms',cat:'video',c:'MS-2',name:'Media Server',h:2,d:480,kg:14,w:650,face:'black',handles:1,
  front:[[{t:'logo'},{t:'screen',w:2.2},{t:'gap'},{t:'btn',n:2},{t:'pwr'}],[{t:'grille',w:8}]],rear:[[{t:'fan',n:3},{t:'hdmi',n:4}],[{t:'rj45',n:4},{t:'sfp',n:2},{t:'gap'},{t:'iec'},{t:'iec'}]]},
 {id:'scl',cat:'video',c:'SC-1',name:'Scaler / Converter',h:1,d:200,kg:1.8,w:18,face:'grey',
  front:[{t:'logo'},{t:'screen',w:2},{t:'btn',n:6},{t:'knob'}],rear:[{t:'bnc',n:4},{t:'hdmi',n:2},{t:'rj45'},{t:'iec'}]},
 {id:'rec',cat:'video',c:'RD-2',name:'Dual-Channel Recorder',h:1,d:240,kg:2.4,w:30,face:'black',
  front:[{t:'logo'},{t:'slot',n:2},{t:'screen',w:2},{t:'btn',n:6}],rear:[{t:'bnc',n:6},{t:'hdmi'},{t:'rj45'},{t:'iec'}]},
 {id:'ledp',cat:'video',c:'LP-4',name:'LED Wall Processor',h:2,d:400,kg:8,w:120,face:'black',handles:1,
  front:[[{t:'logo'},{t:'screen',w:2.4},{t:'gap'},{t:'knob'},{t:'btn',n:6}],[{t:'grille',w:6},{t:'pwr'}]],rear:[[{t:'rj45',n:12},{t:'sfp',n:4}],[{t:'hdmi',n:2},{t:'bnc',n:4},{t:'gap'},{t:'iec'}]]},
 {id:'swv',cat:'video',c:'PS-2',name:'Production Switcher 2 M/E',h:2,d:380,kg:7.5,w:150,face:'black',handles:1,
  front:[[{t:'logo'},{t:'screen',w:2},{t:'gap'},{t:'led',n:10}],[{t:'grille',w:6},{t:'pwr'}]],rear:[[{t:'bnc',n:20}],[{t:'bnc',n:12},{t:'rj45',n:2},{t:'iec'},{t:'iec'}]]},

 {id:'node4',cat:'light',c:'AN-4',name:'Art-Net Node 4-universe',h:1,d:180,kg:1.9,w:12,face:'black',
  front:[{t:'logo'},{t:'screen',w:1.5},{t:'xlr',n:4},{t:'rj45',n:2},{t:'pwr'}],rear:[{t:'pcon',k:'g'},{t:'gap'}]},
 {id:'spl8',cat:'light',c:'DS-8',name:'DMX Splitter 8-way',h:1,d:160,kg:1.7,w:8,face:'grey',
  front:[{t:'logo'},{t:'xlr',n:8},{t:'led',n:8}],rear:[{t:'xlr',n:2},{t:'gap'},{t:'iec'}]},
 {id:'dim',cat:'light',c:'DP-6',name:'Dimmer Pack 6×10 A',h:3,d:380,kg:13,w:90,face:'black',handles:1,
  front:[[{t:'logo'},{t:'screen',w:1.6},{t:'gap'},{t:'led',n:6}],[{t:'brk',n:6},{t:'gap'},{t:'out',n:6}],[{t:'grille',w:7},{t:'xlr',n:2}]],rear:[[{t:'fan',n:2},{t:'gap'}],[{t:'gap'},{t:'pcon',n:2}],[{t:'gap'}]]},
 {id:'wdmx',cat:'light',c:'WD-1',name:'Wireless DMX Transceiver',h:1,d:150,kg:1.1,w:6,face:'black',
  front:[{t:'logo'},{t:'led',n:6},{t:'screen',w:1.2},{t:'gap'},{t:'xlr',n:2},{t:'bnc'}],rear:[{t:'iec'}]},
 {id:'lpc',cat:'light',c:'LC-2',name:'Lighting Control Processor',h:2,d:420,kg:9,w:300,face:'black',handles:1,
  front:[[{t:'logo'},{t:'screen',w:3},{t:'gap'},{t:'btn',n:4}],[{t:'xlr',n:4},{t:'rj45',n:2},{t:'gap'},{t:'pwr'}]],rear:[[{t:'fan',n:2},{t:'hdmi',n:2}],[{t:'rj45',n:4},{t:'gap'},{t:'iec'}]]},

 {id:'sw24',cat:'net',c:'NS-24',name:'Network Switch 24-port + 4 SFP',h:1,d:250,kg:3.5,w:45,face:'grey',
  front:[{t:'logo'},{t:'led',n:4},{t:'rj45',n:24,rows:2},{t:'sfp',n:4,rows:2}],rear:[{t:'fan',n:1},{t:'gap'},{t:'iec'}]},
 {id:'sw8',cat:'net',c:'NS-8P',name:'PoE Switch 8-port',h:1,d:200,kg:2.4,w:150,face:'black',
  front:[{t:'logo'},{t:'screen',w:1.3},{t:'gap'},{t:'ecn',n:8},{t:'sfp',n:2}],rear:[{t:'pcon',k:'g'},{t:'gap'}]},
 {id:'rtr',cat:'net',c:'RF-1',name:'Router / Firewall',h:1,d:230,kg:2.8,w:40,face:'black',
  front:[{t:'logo'},{t:'led',n:8},{t:'gap'},{t:'rj45',n:8},{t:'sfp',n:2}],rear:[{t:'fan'},{t:'gap'},{t:'iec'}]},
 {id:'fib',cat:'net',c:'FP-12',name:'Fiber Patch 12× LC',h:1,d:120,kg:1.4,w:0,face:'black',
  front:[{t:'gap'},{t:'lc',n:12},{t:'gap'}],rear:[{t:'gap'},{t:'lc',n:12},{t:'gap'}]},

 {id:'pd8',cat:'power',c:'PD-8',name:'Power Distro 8 outlets',h:1,d:180,kg:2.6,w:0,face:'black',
  front:[{t:'pcon'},{t:'brk',n:2},{t:'out',n:8}],rear:[{t:'gap'}]},
 {id:'cond',cat:'power',c:'PC-1',name:'Power Conditioner',h:1,d:260,kg:5.5,w:5,face:'black',
  front:[{t:'logo'},{t:'screen',w:1.8},{t:'led',n:6},{t:'gap'},{t:'out'},{t:'pwr'}],rear:[{t:'out',n:8},{t:'iec'}]},
 {id:'ups',cat:'power',c:'UP-15',name:'UPS 1500 VA',h:2,d:450,kg:24,w:30,face:'black',handles:1,
  front:[[{t:'logo'},{t:'screen',w:2},{t:'gap'},{t:'led',n:4},{t:'pwr'}],[{t:'grille',w:8}]],rear:[[{t:'fan'},{t:'gap'},{t:'out',n:4}],[{t:'out',n:4},{t:'gap'},{t:'iec'}]]},
 {id:'seq',cat:'power',c:'SQ-8',name:'Power Sequencer 8-ch',h:1,d:250,kg:4.2,w:6,face:'grey',
  front:[{t:'logo'},{t:'led',n:8},{t:'gap'},{t:'knob'},{t:'pwr'}],rear:[{t:'out',n:8},{t:'pcon'}]},

 {id:'pp',cat:'util',c:'PP',name:'Custom Patch Panel',h:1,d:60,kg:1.2,w:0,face:'black',custom:1},
 {id:'b1',cat:'util',c:'',name:'Blank Panel 1U',h:1,d:10,kg:.4,w:0,face:'black',front:[],rear:[]},
 {id:'b2',cat:'util',c:'',name:'Blank Panel 2U',h:2,d:10,kg:.7,w:0,face:'black',front:[],rear:[]},
 {id:'vent',cat:'util',c:'',name:'Vent Panel 1U',h:1,d:10,kg:.4,w:0,face:'black',front:[{t:'grille',w:8.9}],rear:[{t:'grille',w:8.9}]},
 {id:'shelf',cat:'util',c:'',name:'Cantilever Shelf 2U',h:2,d:350,kg:3,w:0,face:'black',open:1,front:[],rear:[]},
 {id:'drw',cat:'util',c:'',name:'Rack Drawer 3U',h:3,d:400,kg:7.5,w:0,face:'black',front:[[{t:'gap'}],[{t:'handle'}],[{t:'gap'}]],rear:[]},
 {id:'lace',cat:'util',c:'',name:'Cable Lacing Bar',h:1,d:80,kg:.5,w:0,face:'black',open:1,front:[{t:'lace'}],rear:[{t:'lace'}]},
 {id:'lamp',cat:'util',c:'RL-1',name:'Rack Light',h:1,d:120,kg:1,w:10,face:'black',front:[{t:'logo'},{t:'gap'},{t:'knob'},{t:'pwr'}],rear:[{t:'iec'}]},
];
EXTRA_DEVICES.forEach(d=>{if(!LIB.some(x=>x.id===d.id))LIB.push(d)});
LIB.forEach(d=>{d.face=d.face||'black'});
const LIBM=Object.fromEntries(LIB.map(d=>[d.id,d]));
function syncCustom(){
  for(let i=LIB.length-1;i>=0;i--) if(LIB[i].mine){delete LIBM[LIB[i].id];LIB.splice(i,1)}
  (state.custom||[]).forEach(d=>{d.mine=1;LIB.push(d);LIBM[d.id]=d});
}
const STYLE_ZONES={
  blank:()=>[],
  vents:h=>Array.from({length:h},()=>[{t:'grille',w:8.6}]),
  lights:(h,c)=>[[{t:'logo'},{t:'screen',w:1.6},{t:'led',n:6},{t:'gap'},{t:'rj45',n:4},{t:'usb',n:2},{t:'pwr'}],...Array.from({length:h-1},()=>[{t:'grille',w:8.6}])],
  drives:h=>Array.from({length:h},()=>[{t:'hdd',n:4},{t:'gap'}]),
  shelf:()=>[{t:'gap'},{t:'obj',k:'box'},{t:'gap'}],
};
const PP_TYPES={xlr:{n:'XLR',perU:16,rows:1},ecn:{n:'etherCON',perU:16,rows:1},rj45:{n:'RJ45',perU:24,rows:2},bnc:{n:'BNC',perU:24,rows:2},lc:{n:'LC duplex',perU:24,rows:2},pcon:{n:'powerCON',perU:12,rows:1}};

/* ---------- state ---------- */
const KEY='rackline.v1';
const mk=(dev,u,o={})=>({id:uid(),dev,u,mount:'front',name:'',group:'',tape:'#f2f0e9',...o});
const defaultSys=()=>/^en-US|^es-US/i.test(navigator.language||'')?'us':'metric';
const baseZoom=()=>Math.min(460,Math.max(300,(window.innerWidth||900)-110));
function wrapProject(name,racks,links){return {name,view:'front',zoom:baseZoom(),tape:true,sys:state?.sys||defaultSys(),custom:state?.custom||[],active:racks[0].id,racks,links:links||[]}}
const K='#1d1f22',BL='#2f6fd6',RD='#d63c3c',YE='#f2c230',WH='#e9e9e4',CY='#38b6d8',GR='#2f9e57';
function tplHome(){
  const rooms=['Office','Office 2','Living rm','Living TV','Bedroom 1','Bedroom 2','Kitchen','Garage','AP Hall','AP Upstairs','Camera Front','Camera Back','Doorbell','Printer','Spare','Spare'];
  const pp=mk('pp',16,{name:'WALL JACKS',group:'Network',tape:'#3f72c9',panel:{n:16,type:'rj45',labels:rooms}}), sw=mk('sw16',14,{name:'CORE SWITCH',group:'Network',tape:'#3f72c9'}),
    net=mk('netshelf',12,{name:'INTERNET',group:'Network',tape:'#3f72c9'}), pi=mk('pi',11,{name:'PI CLUSTER',group:'Compute',tape:'#3f9b5c'}),
    kvm=mk('kvm',10,{name:'CONSOLE',group:'Compute',tape:'#3f9b5c'}), pc=mk('pc4',6,{name:'HOME SERVER',group:'Compute',tape:'#3f9b5c'}),
    nas=mk('nas',4,{name:'NAS · BACKUPS',group:'Storage',tape:'#f4d03f'}), pw=mk('pdus',3,{name:'POWER',group:'Power',tape:'#d64545'}),
    ups=mk('upsh',2,{name:'UPS',group:'Power',tape:'#d64545'}), fan=mk('fan1',1,{name:'FANS'});
  const cables=[0,1,2,3,4,5,8,9].map((i,k)=>cab(pp,i,sw,k,i>=8?YE:BL,i===8?'AP Hall':''));
  cables.push(
    cab(pc,7,sw,10,BL,'Server','rear','front'), cab(nas,1,sw,11,BL,'NAS','rear','front'), cab(net,4,sw,12,RD,'Router','rear','front'), cab(pi,0,sw,13,BL,'Pis','rear','front'),
    cab(net,1,net,3,BL,'WAN','rear','rear'), cab(kvm,2,pc,8,K,'Console HDMI','rear','rear'), cab(kvm,0,pc,1,K,'Console USB','rear','rear'),
    cab(pc,0,pw,0,K,'','rear','front'), cab(nas,0,pw,1,K,'','rear','front'), cab(sw,0,pw,2,K,'','rear','front'), cab(kvm,3,pw,3,K,'','rear','front'),
    cab(net,2,pw,4,K,'Modem PSU','rear','front'), cab(net,8,pw,5,K,'Router PSU','rear','front'), cab(fan,0,pw,6,K,'','rear','front'), cab(pi,4,pw,7,K,'Pi PSU','rear','front'),
    cab(ups,0,pw,0,K,'UPS → PDU','rear','rear'));
  return wrapProject('Home Lab Rack',[{id:uid(),name:'Home Lab',units:16,depth:600,items:[pp,mk('brush',15),sw,net,pi,kvm,pc,nas,pw,ups,fan],cables}]);
}
function tplStudio(){
  const tie=['Vox Mic','Gtr Amp','Bass DI','Keys L','Keys R','Kick','Snare','OH L','OH R','Room L','Room R','Talkback','Mon L','Mon R','Spare','Spare'];
  const pw=mk('pdus',8,{name:'POWER',group:'Power',tape:'#d64545'}), ai=mk('ai',7,{name:'INTERFACE',group:'Audio',tape:'#f4d03f'}), pre=mk('pre8',6,{name:'PREAMPS',group:'Audio',tape:'#f4d03f'}),
    pc=mk('pc2',4,{name:'DAW PC',group:'Computer',tape:'#3f9b5c'}), pp=mk('pp',2,{name:'TIE LINES',group:'Audio',tape:'#e8743b',panel:{n:16,type:'xlr',labels:tie}}), lamp=mk('lamp',1);
  const cables=[0,1,2,3,4,5,6,7].map(i=>cab(pp,i,pre,i,K,'','rear','rear'));
  cables.push(cab(pre,8,ai,7,BL,'Dante','rear','rear'), cab(ai,6,pc,0,K,'USB audio','rear','rear'),
    cab(ai,8,pw,0,K,'','rear','front'), cab(pre,10,pw,1,K,'','rear','front'), cab(pc,6,pw,2,K,'','rear','front'), cab(lamp,0,pw,3,K,'','rear','front'));
  return wrapProject('Home Studio Rack',[{id:uid(),name:'Studio Desk',units:8,depth:450,items:[pw,ai,pre,pc,mk('brush',3),pp,lamp],cables}]);
}
const cab=(a,ap,b,bp,color,lbl,af='front',bf='front')=>({id:uid(),a:{item:a.id,face:af,pi:ap},b:{item:b.id,face:bf,pi:bp},color,label:lbl||'',bend:null,route:'managed'});
function tplGaming(){
  const jacks=mk('key24',18,{name:'WALL JACKS',group:'Network',tape:'#3f72c9'}), plate=mk('avpanel',17,{name:'TO TV',group:'Media',tape:'#f4d03f'}),
    sw=mk('sw16',15,{name:'SWITCH',group:'Network',tape:'#3f72c9'}), hx=mk('hdmisw',14,{name:'HDMI SWITCH',group:'Media',tape:'#f4d03f'}),
    wifi=mk('router',12,{name:'WI-FI',group:'Network',tape:'#3f72c9'}), nas=mk('hnas4',8,{name:'MEDIA NAS',group:'Media',tape:'#f4d03f'}),
    ps5=mk('ps5',5,{name:'PS5',group:'Gaming',tape:'#3f9b5c'}), ps4=mk('ps4',3,{name:'PS4',group:'Gaming',tape:'#3f9b5c'}),
    tv=mk('stream',2,{name:'TV BOX',group:'Media',tape:'#f4d03f'}), pw=mk('pdus',1,{name:'POWER',group:'Power',tape:'#d64545'});
  const K='#1d1f22', cables=[
    cab(sw,0,wifi,1,'#d63c3c','Uplink','front','rear'), cab(sw,1,ps5,1,'#2f6fd6','PS5','front','rear'), cab(sw,2,ps4,1,'#2f6fd6','PS4','front','rear'),
    cab(sw,3,nas,0,'#2f6fd6','NAS','front','rear'), cab(sw,4,tv,1,'#2f6fd6','TV box','front','rear'),
    cab(jacks,0,sw,8,'#f2c230','Living TV'), cab(jacks,1,sw,9,'#f2c230','Office'), cab(jacks,2,sw,10,'#f2c230','Bedroom'),
    cab(ps5,0,hx,0,K,'PS5 HDMI','rear','rear'), cab(ps4,0,hx,1,K,'PS4 HDMI','rear','rear'), cab(tv,0,hx,2,K,'TV box HDMI','rear','rear'), cab(hx,4,plate,0,K,'To TV','rear','rear'),
    cab(ps5,4,pw,0,K,'','rear','front'), cab(ps4,2,pw,1,K,'','rear','front'), cab(nas,3,pw,2,K,'','rear','front'), cab(wifi,5,pw,3,K,'','rear','front'),
    cab(tv,2,pw,4,K,'','rear','front'), cab(sw,0,pw,5,K,'','rear','front'), cab(hx,7,pw,6,K,'','rear','front')];
  const P=wrapProject('Gaming & Media Rack',[{id:uid(),name:'Media Center',units:18,depth:500,items:[jacks,plate,mk('brush',16),sw,hx,wifi,nas,ps5,ps4,tv,pw],cables}]);
  P.view='both';return P;
}
function tplEmpty(units){return wrapProject('My Rack',[{id:uid(),name:`${units}U Rack`,units,depth:units>=22?1000:600,items:[]}])}
function tplSecurity(){
  const cams=['Front door','Driveway','Garage','Backyard','Side gate','Porch','Hallway','Shed','Spare','Spare','Spare','Spare','Spare','Spare','Spare','Spare'];
  const pp=mk('pp',12,{name:'CAMERAS',group:'Cameras',tape:'#2f9e57',panel:{n:16,type:'rj45',labels:cams}}),
    nvr=mk('nvr16',10,{name:'NVR',group:'Cameras',tape:'#2f9e57'}), net=mk('netshelf',8,{name:'INTERNET',group:'Network',tape:'#3f72c9'}),
    sw=mk('sw16',7,{name:'SWITCH',group:'Network',tape:'#3f72c9'}), nas=mk('hnas2',3,{name:'BACKUP NAS',group:'Storage',tape:'#f4d03f'}),
    ups=mk('upsh',2,{name:'UPS',group:'Power',tape:'#d64545'}), pw=mk('pdus',1,{name:'POWER',group:'Power',tape:'#d64545'});
  const cables=[0,1,2,3,4,5,6,7].map(i=>cab(pp,i,nvr,i,GR,'','front','rear'));
  cables.push(cab(nvr,16,sw,0,BL,'NVR uplink','rear','front'),cab(net,4,sw,1,RD,'Router','rear','front'),cab(net,1,net,3,BL,'WAN','rear','rear'),cab(nas,0,sw,2,BL,'NAS','rear','front'),
    cab(nvr,19,pw,0,K,'','rear','front'),cab(net,2,pw,1,K,'Modem PSU','rear','front'),cab(net,8,pw,2,K,'Router PSU','rear','front'),cab(sw,0,pw,3,K,'','rear','front'),cab(nas,2,pw,4,K,'NAS PSU','rear','front'),
    cab(ups,0,pw,0,K,'UPS → PDU','rear','rear'));
  const P=wrapProject('Home Security Rack',[{id:uid(),name:'Security',units:12,depth:450,items:[pp,mk('brush',11),nvr,net,sw,nas,ups,pw],cables}]);
  P.view='both';return P;
}
function tplOffice(){
  const desks=['Desk 1','Desk 2','Desk 3','Desk 4','Desk 5','Desk 6','Desk 7','Desk 8','Printer','Meeting rm'];
  const pp=mk('pp',18,{name:'DESKS',group:'Network',tape:'#3f72c9',panel:{n:24,type:'rj45',labels:desks}}), sw=mk('sw24',16,{name:'CORE',group:'Network',tape:'#3f72c9'}),
    fw=mk('rtr',14,{name:'FIREWALL',group:'Network',tape:'#d64545'}), kvm=mk('kvm',13,{name:'CONSOLE',group:'Servers',tape:'#3f9b5c'}),
    s1=mk('srv1',11,{name:'SERVER 1',group:'Servers',tape:'#3f9b5c'}), s2=mk('srv1',10,{name:'SERVER 2',group:'Servers',tape:'#3f9b5c'}),
    nas=mk('nas',8,{name:'FILES',group:'Storage',tape:'#f4d03f'}), ups=mk('ups',4,{name:'UPS',group:'Power',tape:'#d64545'}), pw=mk('pdus',3,{name:'POWER',group:'Power',tape:'#d64545'});
  const cables=desks.map((d,i)=>cab(pp,i,sw,i,BL));
  cables.push(cab(fw,0,sw,23,RD,'Uplink'),cab(s1,4,sw,16,GR,'SRV1','rear','front'),cab(s2,4,sw,17,GR,'SRV2','rear','front'),cab(nas,1,sw,18,YE,'NAS','rear','front'),
    cab(kvm,2,s1,8,K,'KVM HDMI','rear','rear'),cab(kvm,0,s1,2,K,'KVM USB','rear','rear'),
    cab(sw,0,pw,0,K,'','rear','front'),cab(fw,0,pw,1,K,'','rear','front'),cab(s1,0,pw,2,K,'PSU A','rear','front'),cab(s2,0,pw,3,K,'PSU A','rear','front'),
    cab(nas,0,pw,4,K,'','rear','front'),cab(kvm,3,pw,5,K,'','rear','front'),
    cab(s1,1,ups,0,RD,'PSU B','rear','rear'),cab(s2,1,ups,1,RD,'PSU B','rear','rear'),cab(ups,2,pw,0,K,'UPS → PDU','rear','rear'));
  return wrapProject('Small Office Rack',[{id:uid(),name:'Office',units:18,depth:800,items:[pp,mk('brush',17),sw,mk('brush',15),fw,kvm,mk('vent',12),s1,s2,nas,ups,pw,mk('b2',1)],cables}]);
}
function tplCloset(){
  const jacks=mk('key24',9,{name:'ROOMS',group:'Network',tape:'#3f72c9'}), sw=mk('sw16',7,{name:'SWITCH',group:'Network',tape:'#3f72c9'}),
    net=mk('netshelf',5,{name:'INTERNET',group:'Network',tape:'#3f72c9'}), ha=mk('minipc',4,{name:'HOME ASSISTANT',group:'Smart home',tape:'#3f9b5c'}),
    lamp=mk('lamp',2), pw=mk('pdus',1,{name:'POWER',group:'Power',tape:'#d64545'});
  const cables=[0,1,2,3,4,5].map(i=>cab(jacks,i,sw,i,BL));
  cables.push(cab(net,4,sw,15,RD,'Router','rear','front'),cab(net,1,net,3,BL,'WAN','rear','rear'),cab(ha,0,sw,14,GR,'HA','rear','front'),
    cab(sw,0,pw,0,K,'','rear','front'),cab(net,2,pw,1,K,'Modem PSU','rear','front'),cab(net,8,pw,2,K,'Router PSU','rear','front'),cab(ha,6,pw,3,K,'HA PSU','rear','front'),cab(lamp,0,pw,4,K,'','rear','front'));
  return wrapProject('Network Closet',[{id:uid(),name:'Wall Cabinet',units:9,depth:350,items:[jacks,mk('brush',8),sw,net,ha,mk('vent',3),lamp,pw],cables}]);
}
function sample(){
  const lines=['Kick In','Kick Out','Snare Top','Snare Bot','Hi-Hat','Tom 1','Tom 2','Floor','OH L','OH R','Bass DI','Gtr 1','Gtr 2','Keys L','Keys R','Spare'];
  const pd=mk('pd8',12,{name:'MAINS IN',group:'Power',tape:'#d64545'}), rxA=mk('wr4',11,{name:'VOX 1–4',group:'RF',tape:'#f4d03f'}), rxB=mk('wr4',10,{name:'VOX 5–8',group:'RF',tape:'#f4d03f'}),
    ant=mk('ant',9,{name:'ANT A/B',group:'RF',tape:'#f4d03f'}), ie1=mk('iem',8,{name:'IEM 1/2',group:'Monitors',tape:'#e8743b'}), ie2=mk('iem',7,{name:'IEM 3/4',group:'Monitors',tape:'#e8743b'}),
    fib=mk('fib',6,{mount:'rear',name:'FIBER TO STAGE',group:'Network',tape:'#3f72c9'}), eng=mk('eng',3,{name:'ENGINE A',group:'Console'}),
    fsw=mk('sw8',2,{name:'AUDIO NET',group:'Network',tape:'#3f72c9'}), pp=mk('pp',1,{name:'DRUM LINES',group:'Console',panel:{n:16,type:'xlr',labels:lines}});
  const c1=[cab(rxA,6,fsw,0,BL,'RX 1–4','rear','front'),cab(rxB,6,fsw,1,BL,'RX 5–8','rear','front'),cab(eng,32,fsw,2,BL,'Engine','rear','front'),
    cab(ant,2,rxA,0,WH,'Ant A','rear','rear'),cab(ant,3,rxA,1,WH,'Ant B','rear','rear'),cab(ant,4,rxB,0,WH,'','rear','rear'),cab(ant,5,rxB,1,WH,'','rear','rear'),
    ...[0,1,2,3].map(i=>cab(rxA,2+i,eng,i,K,'','rear','rear')),...[0,1,2,3].map(i=>cab(rxB,2+i,eng,4+i,K,'','rear','rear')),
    cab(eng,16,ie1,2,K,'IEM 1','rear','rear'),cab(eng,17,ie1,3,K,'IEM 2','rear','rear'),cab(eng,18,ie2,2,K,'IEM 3','rear','rear'),cab(eng,19,ie2,3,K,'IEM 4','rear','rear'),
    ...[0,1,2,3,4,5,6,7].map(i=>cab(pp,i,eng,8+i,K,'','rear','rear')),
    cab(fsw,8,fib,0,CY,'To stage','front','front'),
    cab(rxA,8,pd,1,K,'','rear','front'),cab(rxB,8,pd,2,K,'','rear','front'),cab(ant,10,pd,3,K,'','rear','front'),cab(ie1,6,pd,4,K,'','rear','front'),
    cab(ie2,6,pd,5,K,'','rear','front'),cab(eng,38,pd,6,K,'PSU A','rear','front'),cab(eng,39,pd,7,K,'PSU B','rear','front'),cab(fsw,0,pd,8,K,'','rear','front')];
  const cond=mk('cond',8,{name:'CLEAN POWER',group:'Power',tape:'#d64545'}), mtx=mk('mtx',7,{name:'SDI ROUTER',group:'Signal',tape:'#7a52c7'}),
    mv=mk('mv',6,{name:'MULTIVIEW',group:'Signal',tape:'#7a52c7'}), ms=mk('ms',4,{name:'MEDIA A',group:'Playback',tape:'#3f9b5c'}),
    scl=mk('scl',3,{name:'SCALER LED',group:'Signal',tape:'#7a52c7'}), vsw=mk('sw24',2,{name:'VIDEO NET',group:'Network',tape:'#3f72c9'});
  const c2=[cab(ms,0,scl,4,K,'Media → scaler','rear','rear'),cab(scl,0,mtx,0,WH,'SDI in','rear','rear'),cab(mtx,16,mv,0,WH,'','rear','rear'),cab(mtx,17,mv,1,WH,'','rear','rear'),
    cab(mtx,32,vsw,0,BL,'','rear','front'),cab(mv,18,vsw,1,BL,'','rear','front'),cab(ms,4,vsw,2,BL,'','rear','front'),cab(scl,6,vsw,3,BL,'','rear','front'),
    cab(mtx,33,cond,0,K,'','rear','rear'),cab(mv,19,cond,1,K,'','rear','rear'),cab(ms,10,cond,2,K,'PSU A','rear','rear'),cab(ms,11,cond,3,K,'PSU B','rear','rear'),
    cab(scl,7,cond,4,K,'','rear','rear'),cab(vsw,0,cond,5,K,'','rear','rear')];
  const links=[cab(fsw,7,vsw,23,YE,'FOH ↔ Video','front','front'),cab(fsw,9,vsw,24,CY,'Fiber trunk','front','front')];
  const P=wrapProject('Spring Tour 2027 · FOH & Video World',[
    {id:uid(),name:'FOH Audio',units:12,depth:600,items:[pd,rxA,rxB,ant,ie1,ie2,mk('vent',6),fib,eng,fsw,pp],cables:c1},
    {id:uid(),name:'Video World',units:8,depth:500,items:[cond,mtx,mv,ms,scl,vsw,mk('b1',1)],cables:c2}],links);
  P.view='site';return P;
}
let state=null, firstRun=false;
try{state=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){state=null}
if(!state||!Array.isArray(state.racks)||!state.racks.length){state=null;state=tplHome();firstRun=true}
state.sys=state.sys||defaultSys(); state.custom=state.custom||[];
syncCustom();
const ui={sel:null,cat:'all',q:'',hl:null,arm:null};
let hist=[],fut=[];
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}
function updHist(){$('#undo').disabled=!hist.length;$('#redo').disabled=!fut.length}
function snap(){hist.push(JSON.stringify(state));if(hist.length>60)hist.shift();fut=[];updHist()}
function restore(json){state=JSON.parse(json);syncCustom();if(ui.sel&&!findItem(ui.sel))ui.sel=null;save();renderLibrary();renderAll();updHist()}
function undo(){if(!hist.length)return;fut.push(JSON.stringify(state));restore(hist.pop());toast('Undone')}
function redo(){if(!fut.length)return;hist.push(JSON.stringify(state));restore(fut.pop());toast('Redone')}
const isUS=()=>state.sys==='us';
const fD=mm=>isUS()?(mm/25.4).toFixed(1)+'″':Math.round(mm)+' mm';
const fKg=kg=>isUS()?(kg*2.2046).toFixed(1)+' lb':(+kg).toFixed(1)+' kg';
const VOLTS=()=>isUS()?120:230;

const rack=()=>state.racks.find(r=>r.id===state.active)||state.racks[0];
function findItem(id){for(const r of state.racks){const it=r.items.find(i=>i.id===id);if(it)return {r,it}}return null}
const devOf=it=>LIBM[it.dev];
function ppH(p){const t=PP_TYPES[p.type]||PP_TYPES.xlr;return Math.max(1,Math.ceil(p.n/t.perU))}
const hOf=it=>it.panel?ppH(it.panel):devOf(it).h;
const dOf=it=>devOf(it).d;
const label=it=>it.name||devOf(it).name;

const EPS=1e-6;
function ovlU(au,ah,bu,bh){const a0=au-1,a1=a0+ah,b0=bu-1,b1=b0+bh;return a0<b1-EPS&&b0<a1-EPS}
const ovl=(a,b)=>ovlU(a.u,hOf(a),b.u,hOf(b));
function snapU(v){const s=+(state.snap??(1/3));const st=s>0?s:0.01;return Math.round(Math.round(v/st)*st*1000)/1000}
function fmtU(u){const w=Math.floor(u+EPS),f=u-w;if(f<0.01)return ''+w;
  const F=[[.5,'½'],[1/3,'⅓'],[2/3,'⅔'],[.25,'¼'],[.75,'¾']].find(([x])=>Math.abs(f-x)<0.01);return F?w+F[1]:u.toFixed(2)}
function conflicts(r,cand,ignore){
  const out=[];
  for(const o of r.items){
    if(o.id===ignore)continue;
    if(!ovlU(cand.u,cand.h,o.u,hOf(o)))continue;
    if(o.mount===cand.mount||dOf(o)+cand.d>r.depth) out.push(o);
  }
  return out;
}
function fits(r,cand,ignore){return cand.u>=1-EPS&&cand.u+cand.h-1<=r.units+EPS&&!conflicts(r,cand,ignore).length}
function overlaps(r){
  const ids=new Set(), pairs=[];
  r.items.forEach((a,i)=>r.items.slice(i+1).forEach(b=>{
    if(!ovl(a,b))return;
    if(a.mount===b.mount||dOf(a)+dOf(b)>r.depth){ids.add(a.id);ids.add(b.id);pairs.push([a,b])}
  }));
  return {ids,pairs};
}
const isFree=()=>state.mode==='free';
const inBounds=(r,c)=>c.u>=1-EPS&&c.u+c.h-1<=r.units+EPS;
function canPlace(r,c,ignore){return isFree()?inBounds(r,c):fits(r,c,ignore)}
function firstFree(r,h,d,mount='front'){for(let top=r.units;top>=h;top--){const u=top-h+1;if(fits(r,{u,h,d,mount}))return u}return null}

/* ---------- faceplate rendering ---------- */
const rep=(n,s)=>Array.from({length:n},(_,i)=>typeof s==='function'?s(i):s).join('');
const PORTS={xlr:'p-xlr',ecn:'p-ecn',spk:'p-spk',rj45:'p-rj45',bnc:'p-bnc',sfp:'p-sfp',lc:'p-lc',iec:'p-iec',pcon:'p-pcon',hdmi:'p-hdmi',out:'p-out',brk:'p-brk',slot:'p-slot',fan:'p-fan',knob:'p-knob',btn:'p-btn',led:'p-led',pwr:'p-pwr',usb:'p-usb',jack:'p-jack',bay:'p-bay',hdd:'p-hdd',pcie:'p-pcie',us:'p-us',dc:'p-dc'};
const CABLE_TYPES={
  net:{n:'Network (Cat6)',ports:['rj45','ecn'],col:'#2f6fd6',tc:'#2f6fd6',w:1},
  hdmi:{n:'HDMI',ports:['hdmi'],col:'#1d1f22',tc:'#8c55d6',w:1.3,plug:'rect'},
  power:{n:'Power (IEC)',ports:['iec','out','us','pcon'],col:'#1d1f22',tc:'#d63c3c',w:1.5,plug:'rect'},
  dc:{n:'Power adapter (DC)',ports:['dc','out','us'],col:'#1d1f22',tc:'#ef7d2c',w:.8,brick:1},
  usb:{n:'USB',ports:['usb'],col:'#1d1f22',tc:'#e9e9e4',w:.9,plug:'rect'},
  fiber:{n:'Fiber (LC / SFP)',ports:['lc','sfp'],col:'#38b6d8',tc:'#38b6d8',w:.75},
  coax:{n:'Coax / SDI (BNC)',ports:['bnc'],col:'#e9e9e4',tc:'#f2c230',w:1.1},
  audio:{n:'Audio (XLR / jack)',ports:['xlr','jack'],col:'#1d1f22',tc:'#2f9e57',w:1.1},
  speaker:{n:'Speaker',ports:['spk'],col:'#ef7d2c',tc:'#e05aa0',w:1.4},
};
const PNAME={dc:'DC power',xlr:'XLR',ecn:'etherCON',spk:'Speaker',rj45:'RJ45',bnc:'BNC',sfp:'SFP',lc:'LC fiber',iec:'IEC power',pcon:'powerCON',hdmi:'HDMI',out:'Outlet',usb:'USB',jack:'Jack',us:'US outlet'};
const OBJ={router:'<i style="left:10%"></i><i style="left:46%"></i><i style="left:82%"></i><b></b>'};
function zone(z,dev,ctx){
  const n=z.n||1;
  switch(z.t){
    case 'logo': return dev.c?`<b class="z-logo">${esc(dev.c)}</b>`:'';
    case 'gap': return '<span class="z-gap"></span>';
    case 'screen': return `<span class="z-screen" style="width:calc(var(--u)*${z.w})"><i></i></span>`;
    case 'grille': return `<span class="z-grille" style="width:calc(var(--u)*${z.w})"></span>`;
    case 'handle': return '<span class="z-handle"></span>';
    case 'lace': return '<span class="z-lace"></span>';
    case 'brush': return '<span class="z-brush"></span>';
    case 'obj': return rep(n,`<span class="o o-${z.k}">${OBJ[z.k]||'<b></b>'}</span>`);
  }
  const cls=PORTS[z.t]; if(!cls)return '';
  const rows=z.rows||1, cols=Math.ceil(n/rows);
  const one=()=>{
    if(!PNAME[z.t]) return `<span class="p ${cls} ${z.k||''}"></span>`;
    const pi=ctx.i++; ctx.c[z.t]=(ctx.c[z.t]||0)+1;
    return `<span class="p ${cls} ${z.k||''}" data-pi="${pi}" data-pt="${z.t}" data-face="${ctx.face}" title="${PNAME[z.t]} ${ctx.c[z.t]}"></span>`;
  };
  return `<span class="zp" style="grid-template-columns:repeat(${cols},auto)">${rep(n,one)}</span>`;
}
function portName(it,face,pi){
  const dev=devOf(it);
  if(dev.custom){const p=it.panel,lb=(p.labels||[])[pi];return `${PP_TYPES[p.type].n} ${pi+1}${lb?` (${lb})`:''}`}
  const z=dev[face]||[], rows=Array.isArray(z[0])?z:[z], c={}; let i=0;
  for(const r of rows)for(const x of r){if(!PNAME[x.t])continue;for(let k=0;k<(x.n||1);k++){c[x.t]=(c[x.t]||0)+1;if(i===pi)return `${PNAME[x.t]} ${c[x.t]}`;i++}}
  return `port ${pi+1}`;
}
function endName(e){const f=findItem(e.item);if(!f)return '(removed device)';return `${label(f.it)} · ${e.face==='rear'&&f.it.mount==='front'?'back ':''}${portName(f.it,e.face,e.pi)}`}
function rowsFor(dev,side,it){
  if(dev.custom){
    const p=it.panel, t=PP_TYPES[p.type]||PP_TYPES.xlr, totalRows=ppH(p)*t.rows, per=Math.ceil(p.n/totalRows);
    const cls=PORTS[p.type], out=[];
    for(let r=0;r<totalRows;r++){
      let cells='';
      for(let i=r*per;i<Math.min(p.n,(r+1)*per);i++){
        const lb=(p.labels||[])[i]||String(i+1);
        cells+=`<span class="pc"><span class="p ${cls}" data-pi="${i}" data-pt="${p.type}" data-face="${side}" title="${esc(PP_TYPES[p.type].n+' '+(i+1)+' · '+lb)}"></span><em title="${esc(lb)}">${esc(lb)}</em></span>`;
      }
      out.push(`<div class="row" style="justify-content:center">${cells}</div>`);
    }
    return out.join('');
  }
  const z=dev[side]||[]; const rows=Array.isArray(z[0])?z:[z];
  const ctx={i:0,c:{},face:side};
  return rows.map(r=>`<div class="row">${r.map(x=>zone(x,dev,ctx)).join('')}</div>`).join('');
}
function earsHTML(h,handles,side){
  return `<div class="ear ${side}">${rep(h,'<i class="screw"></i>')}${handles&&h>1?'<i class="handle"></i>':''}</div>`;
}
function faceInner(dev,it,side,withEars){
  const h=it?hOf(it):dev.h;
  return (withEars?earsHTML(h,dev.handles,'l'):'')+`<div class="plate">${rowsFor(dev,side,it)}</div>`+(withEars?earsHTML(h,dev.handles,'r'):'');
}

/* ---------- rack (front / rear) ---------- */
const isPhone=()=>window.matchMedia('(max-width:760px)').matches;
function effZoom(){const st=document.getElementById('stage');const sw=st?st.clientWidth:1200;
  if(isPhone()){const vw=document.documentElement.clientWidth||390;return Math.round(Math.max(200,vw-108)*(state.pzoom||1))}
  if(state.view==='site'){const pairs=Math.max(1,state.racks.length),both=(state.siteFace||'both')==='both',n=pairs*(both?2:1);
    const over=40+n*86+(both?pairs*52:0)+(pairs-1)*36+(both?0:(n-1)*0);return Math.max(100,Math.min(state.zoom,Math.floor((sw-over)/n)))}
  if(state.view!=='both')return state.zoom;return Math.max(240,Math.min(state.zoom,Math.floor((sw-36-36-2*84-48)/2)))}
const uPx=()=>Math.round(effZoom()/10.86*10)/10;
function rackHTML(r,view){
  const U=uPx(), W=effZoom();
  let nums=''; for(let u=r.units;u>=1;u--) nums+=`<div style="height:${U}px">${u}</div>`;
  const ov=overlaps(r).ids;
  const devs=r.items.map(it=>{
    const dev=devOf(it), h=hOf(it), top=(r.units-(it.u+h-1))*U;
    const facing = view==='front' ? it.mount==='front' : it.mount==='rear';
    const sel=ui.sel===it.id?' sel':'', dim=(ui.hl&&it.group!==ui.hl?' dim':'')+(ov.has(it.id)?' overlap':'');
    const pos=`top:${top}px;height:${h*U-1}px`;
    const tape=state.tape&&it.name?`<span class="tape${DARK_TAPE.has(it.tape)?' dk':''}" style="--tape:${esc(it.tape)}">${esc(it.name)}</span>`:'';
    if(facing){
      return `<div class="dev f-${dev.face}${dev.open?' open':''}${sel}${dim}" data-id="${it.id}" style="${pos}" title="${esc(label(it))} · ${uRange(it)}">${faceInner(dev,it,'front',true)}${tape}</div>`;
    }
    // looking at the back of a device mounted on the other rails
    const shallow = dev.d<=15 || (dev.open && !(dev.rear&&dev.rear.length));
    if(shallow) return '';
    if((view==='rear'&&it.mount==='front')||(view==='front'&&it.mount==='rear')){
      const hasRear = dev.custom || (dev.rear&&dev.rear.length);
      if(view==='rear' && hasRear){
        return `<div class="dev chassis f-${dev.face}${sel}${dim}" data-id="${it.id}" style="${pos}" title="${esc(label(it))} (back panel)">${faceInner(dev,it,'rear',false)}${tape}</div>`;
      }
      return `<div class="dev behind${sel}${dim}" data-id="${it.id}" style="${pos}">${view==='front'?'REAR':'FRONT'} · ${esc(label(it))}</div>`;
    }
    return '';
  }).join('');
  return `<div class="rackwrap"><div class="case" style="--u:${U}px;width:${W+24}px">
    <div class="cap"><b>${esc(r.name)}</b><span>${r.units}U · ${fD(r.depth)} · ${view==='front'?'FRONT VIEW':'REAR VIEW'}</span></div>
    <div class="bay" data-rack="${r.id}" data-view="${view}" style="height:${U*r.units}px">
      <div class="unums l">${nums}</div><div class="unums r">${nums}</div>
      <div class="rail l"></div><div class="rail r"></div>${devs}
      ${r.items.length?'':`<div class="emptybay">This rack is empty<small>Drag a device in from the library, or tap one to drop it in the top free slot.</small></div>`}
      <div class="ghost" hidden></div>
    </div><div style="height:10px"></div></div></div>`;
}

/* ---------- cables ---------- */
const CABLE_COLS=[['#1d1f22','Black'],['#d63c3c','Red'],['#2f6fd6','Blue'],['#f2c230','Yellow'],['#2f9e57','Green'],['#e9e9e4','White'],['#ef7d2c','Orange'],['#8c55d6','Purple'],['#38b6d8','Cyan'],['#e05aa0','Pink']];
const LEN_M=[0.3,0.5,1,1.5,2,3,5,10,15,20], LEN_FT=[1,2,3,5,7,10,15,25,50];
const cablesOf=r=>(r.cables=r.cables||[]);
function visFace(it,view){
  const dev=devOf(it);
  if(view==='front') return it.mount==='front'?'front':null;
  if(view==='rear') return it.mount==='rear'?'front':((dev.custom||(dev.rear&&dev.rear.length))?'rear':null);
  return null;
}
const sameEnd=(a,b)=>a.item===b.item&&a.face===b.face&&a.pi===b.pi;
function allCables(){return [...state.racks.flatMap(r=>cablesOf(r)),...(state.links=state.links||[])]}
function findCable(id){return id?allCables().find(c=>c.id===id):null}
function removeCable(id){state.racks.forEach(r=>{r.cables=cablesOf(r).filter(c=>c.id!==id)});state.links=(state.links||[]).filter(c=>c.id!==id)}
function addCable(c){const fa=findItem(c.a.item),fb=findItem(c.b.item);if(fa&&fb&&fa.r===fb.r)cablesOf(fa.r).push(c);else (state.links=state.links||[]).push(c)}
function removeCablesFor(itemId){const keep=c=>c.a.item!==itemId&&c.b.item!==itemId;state.racks.forEach(r=>{r.cables=cablesOf(r).filter(keep)});state.links=(state.links||[]).filter(keep)}
const linksOf=r=>(state.links||[]).filter(c=>[c.a.item,c.b.item].some(id=>r.items.some(i=>i.id===id)));
function scopeCables(){return state.view==='site'||(typeof T3!=='undefined'&&T3.isSite())?allCables():cablesOf(rack()).concat(linksOf(rack()))}
function cableAt(r,e){return allCables().find(c=>sameEnd(c.a,e)||sameEnd(c.b,e))}
function portEl(bay,e){return bay.querySelector(`.dev[data-id="${e.item}"] .p[data-pi="${e.pi}"][data-face="${e.face}"]`)}
function center(el,br){const r=el.getBoundingClientRect();return {x:r.left+r.width/2-br.left,y:r.top+r.height/2-br.top}}
function geom(A,B,bend,U){
  const dist=Math.hypot(B.x-A.x,B.y-A.y), sag=U*0.5+dist*0.22;
  const dx=(bend?.dx||0)*U, dy=(bend?.dy||0)*U;
  const c1={x:A.x+dx,y:A.y+sag+dy}, c2={x:B.x+dx,y:B.y+sag+dy};
  const mid={x:(A.x+B.x)/2+0.75*dx,y:(A.y+B.y)/2+0.75*(sag+dy)};
  return {d:`M${A.x.toFixed(1)} ${A.y.toFixed(1)} C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${B.x.toFixed(1)} ${B.y.toFixed(1)}`,mid,sag};
}
function bendFor(A,B,P,U){
  const dist=Math.hypot(B.x-A.x,B.y-A.y), sag=U*0.5+dist*0.22;
  return {dx:((P.x-(A.x+B.x)/2)*4/3)/U, dy:(((P.y-(A.y+B.y)/2)*4/3)-sag)/U};
}
function lenText(mm){
  if(!mm) return '';
  const need=mm*1.15/1000;
  if(isUS()){const ft=need*3.281, pick=LEN_FT.find(x=>x>=ft)||Math.ceil(ft);return `≈ ${(mm/304.8).toFixed(1)} ft run · use a ${pick} ft cable`}
  const pick=LEN_M.find(x=>x>=need)||Math.ceil(need);return `≈ ${(mm/1000).toFixed(2)} m run · use a ${pick} m cable`;
}
let wdrag=null;
function bayFor(e){
  const f=findItem(e.item); if(!f)return null;
  for(const bay of document.querySelectorAll('#canvas .bay[data-view]')){
    if(visFace(f.it,bay.dataset.view)!==e.face)continue;
    const el=portEl(bay,e); if(el)return {bay,el};
  }
  return null;
}
function roundPath(pts,rad){
  let d=`M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for(let i=1;i<pts.length-1;i++){
    const a=pts[i-1],p=pts[i],b=pts[i+1],l1=Math.hypot(p.x-a.x,p.y-a.y),l2=Math.hypot(b.x-p.x,b.y-p.y);
    if(l1<.5||l2<.5){d+=` L${p.x.toFixed(1)} ${p.y.toFixed(1)}`;continue}
    const rr=Math.min(rad,l1/2,l2/2),p1={x:p.x+(a.x-p.x)/l1*rr,y:p.y+(a.y-p.y)/l1*rr},p2={x:p.x+(b.x-p.x)/l2*rr,y:p.y+(b.y-p.y)/l2*rr};
    d+=` L${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q${p.x.toFixed(1)} ${p.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  const z=pts[pts.length-1];return d+` L${z.x.toFixed(1)} ${z.y.toFixed(1)}`;
}
function managedGeom(A,B,chX,U,w,lane,sameBay){
  const drop=U*0.3+lane*w*1.25;
  if(sameBay&&Math.abs(A.y-B.y)<U*0.6){const yb=Math.max(A.y,B.y)+drop;
    return {d:roundPath([A,{x:A.x,y:yb},{x:B.x,y:yb},B],w*2.4),mid:{x:(A.x+B.x)/2,y:yb}}}
  const pts=[A,{x:A.x,y:A.y+drop},{x:chX,y:A.y+drop},{x:chX,y:B.y+drop},{x:B.x,y:B.y+drop},B];
  return {d:roundPath(pts,w*2.4),mid:{x:chX,y:(A.y+B.y)/2+drop}};
}
function portType(it,face,pi){
  const dev=devOf(it); if(dev.custom)return it.panel.type;
  const z=dev[face]||[],rows=Array.isArray(z[0])?z:[z];let i=0;
  for(const r of rows)for(const x of r){if(!PNAME[x.t])continue;for(let k=0;k<(x.n||1);k++){if(i===pi)return x.t;i++}}
  return null;
}
function endPT(e){const f=findItem(e.item);return f?portType(f.it,e.face,e.pi):null}
const TYPE_ORDER=['net','hdmi','power','dc','usb','fiber','coax','audio','speaker'];
function detectType(ta,tb){
  let k=TYPE_ORDER.find(k=>CABLE_TYPES[k].ports.includes(ta)&&CABLE_TYPES[k].ports.includes(tb));
  if(k)return {key:k,mismatch:false};
  k=TYPE_ORDER.find(k=>CABLE_TYPES[k].ports.includes(ta))||TYPE_ORDER.find(k=>CABLE_TYPES[k].ports.includes(tb))||'net';
  return {key:k,mismatch:!!(ta&&tb)};
}
function cableInfo(c){
  const ta=endPT(c.a),tb=endPT(c.b),d=detectType(ta,tb);
  const key=c.type&&CABLE_TYPES[c.type]?c.type:d.key, T=CABLE_TYPES[key];
  const mismatch=!(T.ports.includes(ta)&&T.ports.includes(tb))&&!!(ta&&tb);
  return {key,T,mismatch,ta,tb,auto:!c.type};
}
const TYPE_COL={rj45:'#2f6fd6',ecn:'#2f6fd6',sfp:'#38b6d8',lc:'#38b6d8',hdmi:'#8c55d6',usb:'#e9e9e4',xlr:'#1d1f22',spk:'#ef7d2c',bnc:'#f2c230',iec:'#d63c3c',us:'#d63c3c',out:'#d63c3c',pcon:'#d63c3c',jack:'#2f9e57'};
function stubText(e){const f=findItem(e.item);if(!f)return 'to removed device';
  if(f.r.id!==state.active&&state.view!=='site')return esc(`to rack ${f.r.name}: ${label(f.it)}`);
  const atBack=visFace(f.it,'rear')===e.face;return esc(`to ${atBack?'back':'front'}: ${label(f.it)}`)}
let stubSpots=[];
function stubBusy(B,right){if(stubSpots.some(p=>p.r===right&&Math.abs(p.y-B.y)<15&&Math.abs(p.x-B.x)<40))return true;stubSpots.push({x:B.x,y:B.y,r:right});return false}
function drawCables(){stubSpots=[];
  const cv=$('#canvas'), svg=cv.querySelector('svg.wires'); if(!svg)return;
  const r=rack(),U=uPx(),cr=cv.getBoundingClientRect(),wire=state.mode==='wire';
  cv.querySelectorAll('.p.used').forEach(p=>p.classList.remove('used'));
  const wt=wire&&state.wireType&&state.wireType!=='auto'?CABLE_TYPES[state.wireType]:null;
  cv.querySelectorAll('.p[data-pi]').forEach(p=>p.classList.toggle('dimport',!!(wt&&!wt.ports.includes(p.dataset.pt))));
  const mmPerPx=482.6/effZoom(),w=Math.max(2.5,U*0.1);
  const rel=b=>{const x=b.getBoundingClientRect();return {l:x.left-cr.left,r:x.right-cr.left,t:x.top-cr.top,b:x.bottom-cr.top}};
  const list=[],lanes={};
  for(const c of (state.view==='site'?allCables():cablesOf(r).concat(linksOf(r)))){
    const la=bayFor(c.a),lb=bayFor(c.b); if(!la&&!lb)continue;
    if(la)la.el.classList.add('used'); if(lb)lb.el.classList.add('used');
    if(wdrag&&wdrag.kind==='rewire'&&wdrag.cid===c.id)continue;
    const o={c,la,lb}; list.push(o);
    if(la&&lb){o.A=center(la.el,cr);o.B=center(lb.el,cr);
      if(c.route==='managed'){
        const ba=rel(la.bay),bb=rel(lb.bay);
        if(la.bay===lb.bay){const side=(o.A.x+o.B.x)/2<(ba.l+ba.r)/2?'L':'R',rail=(ba.r-ba.l)*0.056;
          o.ch0=side==='L'?ba.l+rail*1.25:ba.r-rail*1.25;o.dir=side==='L'?1:-1;o.key=la.bay.dataset.view+side;o.same=true}
        else if(ba.l<bb.r&&bb.l<ba.r){o.ch0=Math.max(ba.r,bb.r)+(isPhone()?8:14);o.dir=1;o.key='xs';o.same=false}
        else{const L=ba.l<bb.l?ba:bb,R=ba.l<bb.l?bb:ba;o.ch0=(L.r+R.l)/2;o.dir=0;o.key='x';o.same=false}
        o.span=Math.abs(o.A.y-o.B.y);(lanes[o.key]=lanes[o.key]||[]).push(o);
      }}
  }
  for(const k in lanes)lanes[k].sort((a,b)=>a.span-b.span).forEach((o,i,arr)=>{o.lane=i;o.n=arr.length});
  let out='';
  for(const o of list){
    const c=o.c,sel=ui.selCable===c.id,col=esc(c.color);let g,A,B,stub=null;
    if(o.A&&o.B){A=o.A;B=o.B;
      if(c.route==='managed'){const chX=o.dir?o.ch0+o.dir*o.lane*w*1.5:o.ch0+(o.lane-(o.n-1)/2)*w*1.5;g=managedGeom(A,B,chX,U,w,o.lane,o.same)}
      else g=geom(A,B,c.bend,U);
    } else {
      const L=o.la||o.lb,other=o.la?c.b:c.a,br=rel(L.bay);A=center(L.el,cr);
      const right=A.x>(br.l+br.r)/2;B={x:right?br.r+16:br.l-16,y:A.y+U*0.9};
      g=geom(A,B,null,U*0.6);stub={right,other};
    }
    const ci=cableInfo(c), W=w*ci.T.w;
    const plug=(P,ang)=>ci.T.plug==='rect'
      ? `<rect x="${(P.x-W*1.2).toFixed(1)}" y="${(P.y-W*1.6).toFixed(1)}" width="${(W*2.4).toFixed(1)}" height="${(W*3.2).toFixed(1)}" rx="${(W*.4).toFixed(1)}" fill="${col}" stroke="#000" stroke-width="1.2"/>`
      : `<circle cx="${P.x}" cy="${P.y}" r="${W*1.05}" fill="${col}" stroke="#000" stroke-width="1.2"/>`;
    out+=`<g data-cid="${c.id}">
      <path d="${g.d}" fill="none" stroke="rgba(0,0,0,.45)" stroke-width="${W+3}" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="wire" d="${g.d}" fill="none" stroke="${col}" stroke-width="${W}" stroke-linecap="round" stroke-linejoin="round"${stub?' stroke-dasharray="5 4"':ci.key==='fiber'?' stroke-dasharray="14 2"':''}/>
      <path d="${g.d}" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="${Math.max(1,W*.25)}" stroke-linecap="round" transform="translate(0,-${(W*.22).toFixed(1)})"/>
      ${ci.mismatch?`<path d="${g.d}" fill="none" stroke="#f06262" stroke-width="${W+2}" stroke-opacity=".5" stroke-dasharray="3 6"/>`:''}
      ${sel?`<path d="${g.d}" fill="none" stroke="#ffd23f" stroke-width="${W+6}" stroke-opacity=".35" stroke-linecap="round"/>`:''}
      <path class="hit" d="${g.d}" fill="none" stroke="transparent" stroke-width="${Math.max(14,W+10)}"/>
      ${plug(A)}
      ${stub?`<path d="M${B.x} ${B.y-5} L${B.x+(stub.right?7:-7)} ${B.y} L${B.x} ${B.y+5} Z" fill="${col}" stroke="#000"/>
        ${state.view==='site'||isPhone()||stubBusy(B,stub.right)?`<title>${stubText(stub.other)}</title>`:`<text x="${B.x+(stub.right?10:-10)}" y="${B.y+4}" text-anchor="${stub.right?'start':'end'}" font-family="IBM Plex Mono, monospace" font-size="11" fill="#fff" stroke="#111" stroke-width="3" paint-order="stroke">${stubText(stub.other)}</text>`}`
      :plug(B)}
      ${ci.T.brick&&!stub?`<rect x="${(g.mid.x-W*4.5).toFixed(1)}" y="${(g.mid.y-W*2.6).toFixed(1)}" width="${(W*9).toFixed(1)}" height="${(W*5.2).toFixed(1)}" rx="2" fill="#24272b" stroke="#000"/><rect x="${(g.mid.x-W*3).toFixed(1)}" y="${(g.mid.y-W*.6).toFixed(1)}" width="${(W*6).toFixed(1)}" height="${(W*1.2).toFixed(1)}" fill="#3a3f45"/>`:''}
      ${c.label&&!stub?`<text x="${g.mid.x}" y="${g.mid.y-W-(ci.T.brick?W*3:4)}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="${Math.max(10,U*.26)}" fill="#fff" stroke="#111" stroke-width="3" paint-order="stroke">${esc(c.label)}</text>`:''}
      ${(wire||sel)&&!stub?`<circle class="knob" data-knob="${c.id}" cx="${g.mid.x}" cy="${g.mid.y}" r="${sel?7:5}" fill="#ffd23f" stroke="#111" stroke-width="1.5"><title>Drag to reshape</title></circle>`:''}
    </g>`;
  }
  if(wdrag&&(wdrag.kind==='wire'||wdrag.kind==='rewire')&&wdrag.from&&wdrag.p){
    const f=bayFor(wdrag.from);
    if(f){const A=center(f.el,cr),g=geom(A,wdrag.p,null,U);
      out+=`<path d="${g.d}" fill="none" stroke="${esc(wdrag.color)}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="${wdrag.kind==='wire'?'6 5':''}" opacity=".9"/><circle cx="${wdrag.p.x}" cy="${wdrag.p.y}" r="${w*1.3}" fill="${esc(wdrag.color)}" stroke="#ffd23f" stroke-width="2"/>`}
  }
  svg.innerHTML=out;
  svg.querySelectorAll('g[data-cid]').forEach(g=>{const o=list.find(x=>x.c.id===g.dataset.cid);const p=g.querySelector('.wire');if(o&&o.A&&o.B&&p&&p.getTotalLength)o.c.len=Math.round(p.getTotalLength()*mmPerPx)});
}
function sideCablesSVG(r,U,D,k){
  const pos=e=>{const f=findItem(e.item);if(!f)return null;const it=f.it,dev=devOf(it),h=hOf(it),top=(r.units-(it.u+h-1))*U,dd=Math.min(D-12,dev.d*k);
    const x=it.mount==='front'?(e.face==='front'?6:6+dd):(e.face==='front'?D-6:D-6-dd);
    return {x,y:top+h*U*(0.25+0.5*((e.pi*0.37)%1))}};
  const w=Math.max(2,U*0.08);let out='';
  for(const c of cablesOf(r)){const A=pos(c.a),B=pos(c.b);if(!A||!B)continue;
    const g=geom(A,B,null,U*0.8),sel=ui.selCable===c.id;
    out+=`<g data-cid="${c.id}"><path d="${g.d}" fill="none" stroke="rgba(0,0,0,.5)" stroke-width="${w+2}" stroke-linecap="round"/><path d="${g.d}" fill="none" stroke="${esc(c.color)}" stroke-width="${w}" stroke-linecap="round"/>${sel?`<path d="${g.d}" fill="none" stroke="#ffd23f" stroke-width="${w+6}" stroke-opacity=".4"/>`:''}<path class="hit" d="${g.d}" fill="none" stroke="transparent" stroke-width="12"/><circle cx="${A.x}" cy="${A.y}" r="${w}" fill="${esc(c.color)}" stroke="#000"/><circle cx="${B.x}" cy="${B.y}" r="${w}" fill="${esc(c.color)}" stroke="#000"/></g>`}
  return `<svg class="cables" aria-label="Cables seen from the side">${out}</svg>`;
}

/* ---------- side view ---------- */
function sideHTML(r){
  const U=uPx(), D=Math.max(220,Math.round(effZoom()*0.9)), k=D/r.depth;
  const bars=r.items.map(it=>{
    const dev=devOf(it), h=hOf(it), d=dev.d, top=(r.units-(it.u+h-1))*U;
    const clash = d>r.depth || r.items.some(o=>o.id!==it.id&&ovl(it,o)&&(o.mount===it.mount||dOf(o)+d>r.depth));
    const w=Math.min(D,Math.max(6,d*k));
    const side=it.mount==='front'?`left:6px`:`right:6px`;
    return `<div class="sbar${it.mount==='rear'?' rear':''}${clash?' clash':''}${ui.sel===it.id?' sel':''}" data-id="${it.id}" style="top:${top}px;height:${h*U-1}px;width:${w-6}px;${side}" title="${esc(label(it))} · ${fD(d)} deep"><b>${esc(label(it))}</b><span>${fD(d)}</span></div>`;
  }).join('');
  let ticks='';
  if(isUS()){const inch=r.depth/25.4, st=inch>30?6:4; for(let i=0;i<=inch;i+=st){const x=i*25.4*k;ticks+=`<i style="left:${x}px"></i><span style="left:${x}px">${i}″</span>`}}
  else {const step=r.depth>700?200:100; for(let mm=0;mm<=r.depth;mm+=step){const x=mm*k;ticks+=`<i style="left:${x}px"></i><span style="left:${x}px">${mm}</span>`}}
  return `<div class="rackwrap"><div class="case side" style="--u:${U}px;width:${D+24}px">
    <div class="cap"><b>${esc(r.name)}</b><span>${r.units}U · ${fD(r.depth)} · SIDE VIEW</span></div>
    <div class="sidelabels"><span>◀ FRONT RAIL</span><span>REAR RAIL ▶</span></div>
    <div class="bay" data-rack="${r.id}" style="height:${U*r.units}px">
      <div class="siderail" style="left:0"></div><div class="siderail" style="right:0"></div>${bars}${sideCablesSVG(r,U,D,k)}
    </div>
    <div class="ruler" style="width:${D}px">${ticks}</div></div></div>`;
}

/* ---------- stats & report ---------- */
function stats(r){
  let used=0,kg=8+r.units*0.9,w=0; const groups={}; const warns=[];
  const occ=[];
  for(const it of r.items){
    const dev=devOf(it),h=hOf(it);
    if(dev.id!=='lace'&&it.mount==='front') occ.push([it.u-1,it.u-1+h]);
    kg+=dev.kg; w+=dev.w;
    if(it.group) groups[it.group]=(groups[it.group]||0)+1;
    if(dev.d>r.depth) warns.push(`${label(it)} is ${fD(dev.d)} deep but the rack is only ${fD(r.depth)}. Pick a deeper rack or a shorter device.`);
  }
  occ.sort((a,b)=>a[0]-b[0]); let cs=0,ce=0;
  for(const [a,b] of occ){if(a>ce){used+=ce-cs;cs=a;ce=b}else ce=Math.max(ce,b)}
  used+=ce-cs; used=Math.round(Math.min(r.units,used)*100)/100;
  for(const [a,b] of overlaps(r).pairs) warns.push(`${label(a)} and ${label(b)} overlap (${uRange(a)} / ${uRange(b)}). Move one, or it won't fit in real life.`);
  return {used,free:Math.round((r.units-used)*100)/100,kg,w,amps:w/VOLTS(),groups,warns};
}
function devRows(r){return [...r.items].sort((a,b)=>b.u-a.u||(a.mount>b.mount?1:-1))}
function uRange(it){const h=hOf(it);return h>1?`U${fmtU(it.u+h-1)}–${fmtU(it.u)}`:`U${fmtU(it.u)}`}

function reportHTML(){
  let tot={kg:0,w:0,n:0};
  const racks=state.racks.map(r=>{
    const s=stats(r); tot.kg+=s.kg; tot.w+=s.w; tot.n+=r.items.length;
    const rows=devRows(r).map(it=>{const dev=devOf(it);return `<tr><td class="u">${uRange(it)}</td><td>${it.name?`<span class="tapecell${DARK_TAPE.has(it.tape)?' dk':''}" style="--tape:${esc(it.tape)}">${esc(it.name)}</span>`:'—'}</td><td>${esc(dev.name)}${it.panel?` (${it.panel.n}× ${PP_TYPES[it.panel.type].n})`:''}</td><td>${esc(it.group||'—')}</td><td>${it.mount}</td><td class="n">${fD(dev.d)}</td><td class="n">${fKg(dev.kg)}</td><td class="n">${dev.w}</td></tr>`}).join('');
    const pps=r.items.filter(i=>i.panel).map(it=>`<div><h4 style="font-size:16px">${esc(label(it))} · ${uRange(it)} · ${it.panel.n}× ${PP_TYPES[it.panel.type].n}</h4><ol class="plist">${rep(it.panel.n,i=>`<li>${esc((it.panel.labels||[])[i]||'—')}</li>`)}</ol></div>`).join('');
    return `<section><h4>${esc(r.name)} <small style="font-family:var(--f-mono);font-size:12px;color:var(--muted);letter-spacing:0">${r.units}U · ${fD(r.depth)} · ${s.used}U used · ${fKg(s.kg)} · ${s.w} W</small></h4>
      ${s.warns.map(w=>`<div class="warn">${esc(w)}</div>`).join('')}
      <div class="tblwrap"><table><thead><tr><th>Pos</th><th>Label</th><th>Device</th><th>Group</th><th>Mount</th><th style="text-align:right">Depth</th><th style="text-align:right">Weight</th><th style="text-align:right">W</th></tr></thead><tbody>${rows||'<tr><td colspan="8" class="empty">No devices yet.</td></tr>'}</tbody></table></div>
      ${pps}
      ${cablesOf(r).length?`<div><h4 style="font-size:16px">Cables (${cablesOf(r).length})</h4><div class="tblwrap"><table><thead><tr><th>#</th><th>Type</th><th>From</th><th>To</th><th>Colour</th><th>Label</th><th>Length</th></tr></thead><tbody>${cablesOf(r).map((c,i)=>{const ci=cableInfo(c);return `<tr><td class="u">${i+1}</td><td>${esc(ci.T.n)}${ci.mismatch?' <span style="color:var(--bad)">· adapter needed</span>':''}</td><td>${esc(endName(c.a))}</td><td>${esc(endName(c.b))}</td><td><span class="cswatch" style="--s:${esc(c.color)};display:inline-block;vertical-align:middle;cursor:default"></span> ${esc((CABLE_COLS.find(x=>x[0]===c.color)||['','Custom'])[1])}</td><td>${esc(c.label||'—')}</td><td style="white-space:nowrap">${c.len?esc(lenText(c.len).split(' · ')[1]||''):'—'}</td></tr>`}).join('')}</tbody></table></div></div>`:''}
      </section>`;
  }).join('');
  return `<article class="report"><header><div><p class="ph">Rack report</p><h2>${esc(state.name)}</h2></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary" data-act="copyReport">Copy report as text</button></div></header>
    <dl class="kv" style="max-width:360px"><dt>Racks</dt><dd>${state.racks.length}</dd><dt>Devices</dt><dd>${tot.n}</dd><dt>Total weight incl. racks</dt><dd>${fKg(tot.kg)}</dd><dt>Max power draw</dt><dd>${tot.w} W · ${(tot.w/VOLTS()).toFixed(1)} A @ ${VOLTS()} V</dd></dl>
    ${racks}
    ${(state.links||[]).length?`<section><h4>Between racks (${state.links.length})</h4><div class="tblwrap"><table><thead><tr><th>#</th><th>Type</th><th>From</th><th>To</th><th>Label</th><th>Length</th></tr></thead><tbody>${state.links.map((c,i)=>{const ci=cableInfo(c),fa=findItem(c.a.item),fb=findItem(c.b.item);return `<tr><td class="u">${i+1}</td><td>${esc(ci.T.n)}</td><td>${esc((fa?fa.r.name+' · ':'')+endName(c.a))}</td><td>${esc((fb?fb.r.name+' · ':'')+endName(c.b))}</td><td>${esc(c.label||'—')}</td><td style="white-space:nowrap">${c.len?esc(lenText(c.len).split(' · ')[1]||''):'—'}</td></tr>`}).join('')}</tbody></table></div></section>`:''}
    </article>`;
}
function reportText(){
  const L=[`${state.name}`,`Generated ${new Date().toLocaleDateString()}`,''];
  for(const r of state.racks){
    const s=stats(r);
    L.push(`== ${r.name} — ${r.units}U, ${fD(r.depth)} deep — ${s.used}U used, ${fKg(s.kg)}, ${s.w} W ==`);
    for(const it of devRows(r)){const dev=devOf(it);L.push(`${uRange(it).padEnd(9)} ${(it.name||'-').padEnd(16)} ${dev.name}${it.panel?` (${it.panel.n}x ${PP_TYPES[it.panel.type].n})`:''}${it.group?` [${it.group}]`:''}${it.mount==='rear'?' (rear rails)':''}`)}
    for(const it of r.items.filter(i=>i.panel)){L.push(`  Patch ${label(it)}:`);it.panel.labels&&rep(0,'');for(let i=0;i<it.panel.n;i++)L.push(`    ${String(i+1).padStart(2)}  ${(it.panel.labels||[])[i]||'-'}`)}
    cablesOf(r).forEach((c,i)=>L.push(`  Cable ${i+1} [${cableInfo(c).T.n}${cableInfo(c).mismatch?', adapter needed':''}]: ${endName(c.a)} -> ${endName(c.b)}${c.label?` "${c.label}"`:''} (${(CABLE_COLS.find(x=>x[0]===c.color)||['','custom'])[1]}${c.len?', '+(lenText(c.len).split(' · ')[1]||''):''})`));
    for(const w of s.warns)L.push(`  ! ${w}`);
    L.push('');
  }
  (state.links||[]).forEach((c,k)=>{const fa=findItem(c.a.item),fb=findItem(c.b.item);L.push(`Link ${k+1} [${cableInfo(c).T.n}]: ${fa?fa.r.name+' / ':''}${endName(c.a)} -> ${fb?fb.r.name+' / ':''}${endName(c.b)}${c.label?` "${c.label}"`:''}`)});
  return L.join('\n');
}

/* ---------- render ---------- */
function renderLibrary(){
  const hasMine=LIB.some(d=>d.cat==='mine'); if(ui.cat==='mine'&&!hasMine)ui.cat='all';
  $('#cats').innerHTML=[['all','All',''],...Object.entries(CATS).filter(([k])=>k!=='mine'||hasMine).map(([k,v])=>[k,v.n,v.c])].map(([k,n,c])=>`<button class="chip" data-cat="${k}" aria-pressed="${ui.cat===k}" style="${c?`--cc:var(${c})`:''}">${c?'<i></i>':''}${n}</button>`).join('');
  const q=ui.q.trim().toLowerCase();
  const list=LIB.filter(d=>(ui.cat==='all'||d.cat===ui.cat)&&(!q||(d.name+' '+d.c+' '+d.h+'u '+CATS[d.cat].n+' '+JSON.stringify(d.front||'')+' '+JSON.stringify(d.rear||'')).toLowerCase().includes(q)));
  const mu=18;
  const maker=`<button class="libitem make" data-act="makeDev">＋ Make your own device<small>Any size and look, with your own ports on the front and back</small></button>`;
  $('#libList').innerHTML=maker+(list.map(d=>{
    const fake=d.custom?{panel:{n:16,type:'xlr',labels:[]}}:null;
    return `<button class="libitem" draggable="true" data-lib="${d.id}" title="Add ${esc(d.name)} to the rack">
      <div class="mini dev f-${d.face}${d.open?' open':''}" style="position:relative;--u:${mu}px;height:${d.h*mu}px;width:${Math.round(mu*10.86)}px">${faceInner(d,fake,'front',true)}</div>
      <div class="meta"><span class="nm">${esc(d.name)}</span><span class="add">＋ Add</span></div>
      <div class="meta"><span class="cat" style="--cc:var(${CATS[d.cat].c})"><i></i>${CATS[d.cat].n}</span><span class="sp">${d.h}U · ${fD(d.d)} · ${fKg(d.kg)}${d.w?` · ${d.w} W`:''}</span></div>
    </button>`}).join('')||`<p class="empty">Nothing matches “${esc(ui.q)}”. Try a shorter word, or make your own device above.</p>`);
}
function renderTabs(){
  $('#tabs').innerHTML=state.racks.map(r=>`<button class="rtab" role="tab" data-rack="${r.id}" aria-selected="${r.id===rack().id}">${esc(r.name)}<small>${r.units}U</small></button>`).join('')+`<button class="btn" data-act="addRack" style="margin-left:4px">+ Rack</button>`;
}
function renderStage(){
  const r=rack(), v=state.view, c=$('#canvas');
  $('#tabs').hidden=v==='report';
  if(v==='site'){$('#tabs').innerHTML=`<span class="ph" style="margin-right:6px">Whole site · ${state.racks.length} rack${state.racks.length>1?'s':''} · ${(state.links||[]).length} between racks</span><div class="seg" role="group" aria-label="Site face"><button data-siteface="both" aria-pressed="${(state.siteFace||'both')==='both'}">Front + back</button><button data-siteface="front" aria-pressed="${state.siteFace==='front'}">Fronts</button><button data-siteface="rear" aria-pressed="${state.siteFace==='rear'}">Backs</button></div><button class="btn" data-act="addRack" style="margin-left:4px">+ Rack</button>`} else renderTabs();
  const rackView=v==='front'||v==='rear'||v==='both'||v==='site';
  $('#hint').hidden=!rackView;
  state.mode=state.mode||'arrange';
  c.classList.toggle('wiremode',state.mode==='wire'&&rackView);
  c.classList.toggle('free',state.mode==='free');
  c.classList.toggle('nocables',state.cables===false&&state.mode!=='wire');
  c.classList.toggle('is3d',v==='3d');
  if(v==='3d'){if(!c.querySelector('#t3wrap'))c.innerHTML=T3.shellHTML();fit3D();T3.show(c.querySelector('#t3wrap'));requestAnimationFrame(fit3D)}
  else{T3.hide();
  c.innerHTML = v==='report'?reportHTML(): v==='side'?sideHTML(r): v==='both'?rackHTML(r,'front')+rackHTML(r,'rear'): v==='site'?state.racks.map(rk=>(state.siteFace||'both')==='both'?`<div class="sitepair">${rackHTML(rk,'front')}${rackHTML(rk,'rear')}</div>`:rackHTML(rk,state.siteFace)).join(''): rackHTML(r,v);
  }
  if(v==='site')c.querySelectorAll(`.bay[data-rack="${r.id}"]`).forEach(b=>b.closest('.case').classList.add('activecase'));
  if(rackView) c.insertAdjacentHTML('beforeend','<svg class="cables wires" aria-label="Cables"></svg>');
  document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.view===v));
  {const OV={both:'Front + back',side:'Side',site:'Site',report:'Report'},lb=$('#viewMoreLbl'),vm=$('#viewMore');if(lb)lb.textContent=OV[v]||'More';if(vm)vm.setAttribute('aria-pressed',String(!!OV[v]))}
  document.body.classList.toggle('is3dview',v==='3d');
  document.querySelectorAll('#modes button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===state.mode));
  $('#snapWrap').hidden=state.mode!=='free';
  const sn=+(state.snap??(1/3));
  document.querySelectorAll('#snaps button').forEach(b=>b.setAttribute('aria-pressed',Math.abs(+b.dataset.snap-sn)<0.001));
  $('#cableToggle').setAttribute('aria-pressed',state.cables!==false);
  $('#hint').textContent = v==='site'&&state.mode!=='wire'?'Site view · Every rack side by side · Switch to Wire mode and drag from a port in one rack to a port in another to link them · Tap a rack to edit it'
    : state.mode==='wire'
    ? 'Wire mode · Drag from a port to another port to connect · Use Both to wire front to back · Drag a plug to move it, drop it in empty space to unplug · Drag the yellow dot to reshape'
    : state.mode==='free'
    ? 'Free move · Drag devices to any U, even between units (pick the snap step at the top) · Type a position like 6.5 in the side panel · Overlaps show a red dashed outline'
    : 'Drag devices to move them · Arrow keys nudge the selected device · Delete removes · Ctrl+D duplicates';
  if(rackView) drawCables();
}
/* Size the 3D view to the space that is really left on screen */
function fit3D(){
  const w=document.getElementById('t3wrap');if(!w)return;
  const r=w.getBoundingClientRect(),vh=window.innerHeight;let h;
  if(isPhone()){const nav=document.querySelector('.bnav'),navH=nav?nav.getBoundingClientRect().height:0;h=vh-(r.top+window.scrollY)-navH-4}
  else if(window.matchMedia('(max-width:1100px)').matches)h=Math.min(vh*.78,vh-r.top-16+window.scrollY);
  else{const sr=$('#stage').getBoundingClientRect();h=sr.bottom-r.top-14}
  w.style.flex='none';w.style.height=Math.max(320,Math.round(h))+'px';
}
window.addEventListener('resize',()=>{if(state.view==='3d')requestAnimationFrame(fit3D)});
window.addEventListener('orientationchange',()=>setTimeout(fit3D,250));
function swatches(cur){return `<div class="swatches">${TAPES.map(([c,n])=>`<button class="sw" data-tape="${c}" style="--s:${c}" aria-label="${n} tape" aria-pressed="${cur===c}" title="${n}"></button>`).join('')}</div>`}
function renderInsp(){
  const r=rack(), s=stats(r), found=ui.sel&&findItem(ui.sel);
  const cab=findCable(ui.selCable);
  let top='';
  if(cab){
    const ci=cableInfo(cab);
    top=`<section class="sec"><div><p class="ph">Selected cable · ${esc(ci.T.n)}</p><h3>${esc(cab.label||ci.T.n)}</h3>
      <div class="sub">${cab.len?esc(lenText(cab.len)):'Open the view where both ends are visible to measure it.'}</div></div>
      <dl class="kv" style="grid-template-columns:auto 1fr"><dt>From</dt><dd style="text-align:left;font-family:var(--f-body)">${esc(endName(cab.a))}</dd><dt>To</dt><dd style="text-align:left;font-family:var(--f-body)">${esc(endName(cab.b))}</dd></dl>
      ${ci.mismatch?`<div class="warn">These ports don't match: ${esc(PNAME[ci.ta]||'?')} → ${esc(PNAME[ci.tb]||'?')}. You'll need an adapter or a different port.</div>`:''}
      <div class="fld"><label for="cType">Cable type</label><select id="cType"><option value="">Auto · ${esc(CABLE_TYPES[detectType(ci.ta,ci.tb).key].n)}</option>${TYPE_ORDER.map(k=>`<option value="${k}" ${cab.type===k?'selected':''}>${CABLE_TYPES[k].n}</option>`).join('')}</select></div>
      <div class="fld"><label for="cLabel">Cable label</label><input id="cLabel" maxlength="24" value="${esc(cab.label||'')}" placeholder="e.g. Uplink, NAS LAN 1"></div>
      <div class="fld"><label>Colour</label><div class="swatches">${CABLE_COLS.map(([c,n])=>`<button class="cswatch" data-ccol="${c}" style="--s:${c}" aria-label="${n}" title="${n}" aria-pressed="${cab.color===c}"></button>`).join('')}</div></div>
      <div class="fld"><label>Route</label><div class="seg" role="group"><button data-route="loose" aria-pressed="${cab.route!=='managed'}" title="A free hanging curve you can bend">Loose curve</button><button data-route="managed" aria-pressed="${cab.route==='managed'}" title="Neatly dressed through the side channel">Managed</button></div></div>
      <div class="actions"><button class="btn" data-act="cableReset">Reset shape</button><button class="btn danger" data-act="cableDel">Unplug cable</button><button class="btn" data-act="cableDone" style="margin-left:auto">Done</button></div>
      <p class="sub" style="margin:0">Tip: drag the yellow dot on the cable to bend it. In Wire mode you can drag a plug to another port.</p></section>`;
  } else if(found){
    const it=found.it, dev=devOf(it), h=hOf(it), groups=[...new Set(state.racks.flatMap(x=>x.items.map(i=>i.group)).filter(Boolean))];
    top=`<section class="sec">
      <div><p class="ph">Selected device</p><h3>${esc(dev.name)}</h3>
      <div class="sub" style="--cc:var(${CATS[dev.cat].c})"><i></i>${CATS[dev.cat].n} · ${esc(found.r.name)} · ${uRange(it)}</div></div>
      <div class="specs"><div class="spec"><b>${h}U</b><small>Height</small></div><div class="spec"><b>${isUS()?(dev.d/25.4).toFixed(1):dev.d}</b><small>${isUS()?'in':'mm'} deep</small></div><div class="spec"><b>${isUS()?(dev.kg*2.2046).toFixed(1):dev.kg}</b><small>${isUS()?'lb':'kg'}</small></div><div class="spec"><b>${dev.w}</b><small>watts</small></div></div>
      <div class="fld"><label for="fName">Label</label><input id="fName" maxlength="28" value="${esc(it.name)}" placeholder="Give it a name, e.g. GAMING PC"></div>
      <div class="fld"><label>Label colour</label>${swatches(it.tape)}</div>
      <div class="fld"><label for="fGroup">Group</label><input id="fGroup" list="groupList" value="${esc(it.group)}" placeholder="e.g. Network, Storage, Audio"><datalist id="groupList">${groups.map(g=>`<option value="${esc(g)}">`).join('')}</datalist></div>
      <div class="fld"><label>Mounted on</label><div class="seg" role="group"><button data-mount="front" aria-pressed="${it.mount==='front'}" title="Screwed to the front rails">Front rails</button><button data-mount="rear" aria-pressed="${it.mount==='rear'}" title="Screwed to the back rails">Back rails</button></div></div>
      <div class="fld"><label for="fU">Position · bottom U</label>
        <div class="stepper"><button class="btn" data-act="down" aria-label="Move down one step">▼</button><input id="fU" type="number" min="1" max="${found.r.units-h+1}" step="${isFree()?'any':'1'}" value="${it.u}" style="width:86px;text-align:center;font-family:var(--f-mono)"><button class="btn" data-act="up" aria-label="Move up one step">▲</button><span class="sub">${uRange(it)}</span></div>
        <span class="sub">${isFree()?`Free move: ▲▼ move by the snap step. Type any U, like 6.5, to sit between units.`:'Arrange: ▲▼ jump to the next free gap. Switch to Free move to place it anywhere, even between U.'}</span>
        ${Math.abs(it.u-Math.round(it.u))>EPS?`<button class="btn" data-act="snapWhole" style="justify-self:start">Snap back to whole U (U${Math.round(it.u)})</button>`:''}</div>
      ${it.panel?`<div class="two"><div class="fld"><label for="ppN">Ports</label><select id="ppN">${[4,8,12,16,24,32,48].map(n=>`<option ${n===it.panel.n?'selected':''}>${n}</option>`).join('')}</select></div>
        <div class="fld"><label for="ppT">Connector</label><select id="ppT">${Object.entries(PP_TYPES).map(([k,v])=>`<option value="${k}" ${k===it.panel.type?'selected':''}>${v.n}</option>`).join('')}</select></div></div>
        <div class="fld"><label for="ppL">Port labels, one per line</label><textarea id="ppL">${esc((it.panel.labels||[]).join('\n'))}</textarea></div>`:''}
      ${dev.mine?'<button class="btn" data-act="editDev" style="justify-self:start">Edit device design &amp; ports</button>':''}
      <div class="actions"><button class="btn" data-act="dup">Duplicate</button><button class="btn danger${ui.arm==='del'?' armed':''}" data-act="del">${ui.arm==='del'?'Click again to remove':'Remove'}</button><button class="btn" data-act="desel" style="margin-left:auto">Done</button></div>
    </section>`;
  } else {
    top=`<section class="sec"><div><p class="ph">Rack settings</p><h3>${esc(r.name)}</h3><div class="sub">Tap any device in the rack to name, colour, group or move it.</div></div>
      <div class="fld"><label for="rName">Rack name</label><input id="rName" value="${esc(r.name)}"></div>
      <div class="two"><div class="fld"><label for="rUnits">Height</label><select id="rUnits">${[4,6,8,10,12,14,16,18,20,24,28,32,38,42,48].map(n=>`<option value="${n}" ${n===r.units?'selected':''}>${n}U</option>`).join('')}</select></div>
      <div class="fld"><label for="rDepth">Usable depth (${isUS()?'in':'mm'})</label><input id="rDepth" type="number" ${isUS()?`min="8" max="48" step="0.5" value="${(r.depth/25.4).toFixed(1)}"`:`min="200" max="1200" step="10" value="${r.depth}"`}></div></div>
      <div class="actions"><button class="btn" data-act="dupRack">Duplicate rack</button><button class="btn danger${ui.arm==='delRack'?' armed':''}" data-act="delRack" ${state.racks.length<2?'disabled':''}>${ui.arm==='delRack'?'Click again to delete':'Delete rack'}</button></div></section>`;
  }
  const gs=Object.entries(s.groups);
  if(state.view==='site'&&!cab){const L=state.links||[],inside=state.racks.reduce((a,x)=>a+cablesOf(x).length,0),devs=state.racks.reduce((a,x)=>a+x.items.length,0);
    const nm=e=>{const f=findItem(e.item);return f?`${f.r.name} · ${endName(e)}`:endName(e)};
    top=`<section class="sec"><div><p class="ph">Whole site</p><h3>${esc(state.name)}</h3></div>
      <dl class="kv"><dt>Racks</dt><dd>${state.racks.length}</dd><dt>Devices</dt><dd>${devs}</dd><dt>Cables inside racks</dt><dd>${inside}</dd><dt>Links between racks</dt><dd>${L.length}</dd></dl>
      ${L.length?`<div class="groups">${L.map(c=>`<button class="grp" data-pickcable="${c.id}" style="align-items:flex-start"><span style="font-size:12px">${esc(nm(c.a))}<br>→ ${esc(nm(c.b))}</span><span>${esc(cableInfo(c).T.n)}</span></button>`).join('')}</div>`
        :'<p class="empty">No links between racks yet. In Wire mode, drag from a port in one rack to a port in another.</p>'}
      <p class="sub" style="margin:0">The settings below are for the highlighted rack. Tap another rack to switch.</p></section>`+top}
  if(state.mode==='wire'&&!cab) top=`<section class="sec"><div class="callout"><b>Wire mode is on</b><ol>
    <li>Press on a port and drag to another port to run a cable.</li>
    <li>Drag a plug off its port to move it. Drop it on empty space to unplug.</li>
    <li>Drag the yellow dot in the middle of a cable to bend it.</li>
    <li>Tap a cable to set its colour, label and see the length to buy.</li>
    <li>Use <b>Both</b> to wire a front port to a back panel. In Front or Rear alone, those cables show as a short dashed lead.</li></ol></div>
    <div class="actions"><button class="btn primary" data-act="autoManage">Auto manage cables</button><button class="btn" data-act="colourType">Colour by type</button><button class="btn" data-act="loosen">Loosen all</button></div>
    <div class="fld"><label for="wType">Cable type</label><select id="wType"><option value="auto">Auto · match the port you start from</option>${TYPE_ORDER.map(k=>`<option value="${k}" ${state.wireType===k?'selected':''}>${CABLE_TYPES[k].n}</option>`).join('')}</select>
      <span class="sub">Picking a type dims the ports it can't plug into.</span></div>
    <div class="fld"><label>New cable colour</label><div class="swatches"><button class="btn" data-newcol="auto" aria-pressed="${!state.wireColor||state.wireColor==='auto'}" style="padding:2px 8px;font-size:12px" title="Real-world colour for the cable type">Auto</button>${CABLE_COLS.map(([c,n])=>`<button class="cswatch" data-newcol="${c}" style="--s:${c}" aria-label="${n}" title="${n}" aria-pressed="${state.wireColor===c}"></button>`).join('')}</div></div></section>`+top;
  $('#insp').innerHTML=top+`<section class="sec"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><p class="ph">${esc(r.name)} totals</p>
    <div class="seg" role="group" aria-label="Units"><button data-sys="metric" aria-pressed="${!isUS()}" title="mm, kg, 230 V">Metric</button><button data-sys="us" aria-pressed="${isUS()}" title="inches, lb, 120 V">US</button></div></div>
    <div><div class="meter" role="img" aria-label="${s.used} of ${r.units} U used"><i style="width:${s.used/r.units*100}%"></i></div></div>
    <dl class="kv"><dt>Space used</dt><dd>${s.used} / ${r.units}U</dd><dt>Free</dt><dd>${s.free}U</dd><dt>Weight incl. rack</dt><dd>${fKg(s.kg)}</dd><dt>Max power draw</dt><dd>${s.w} W</dd><dt>Current @ ${VOLTS()} V</dt><dd>${s.amps.toFixed(1)} A</dd><dt>Cables</dt><dd>${cablesOf(r).length}</dd></dl>
    ${(()=>{const cs=cablesOf(r);if(!cs.length)return '';const inf=cs.map(cableInfo),by={};inf.forEach(i=>{by[i.key]=(by[i.key]||0)+1});
      const isPow=i=>i.key==='power'||i.key==='dc', hasPow=inf.some(isPow);
      const unp=hasPow?r.items.filter(it=>devOf(it).w>0&&!/"t":"(out|us)"/.test(JSON.stringify([devOf(it).front,devOf(it).rear]))&&!cs.some((c,k)=>isPow(inf[k])&&(c.a.item===it.id||c.b.item===it.id))):[];
      const mis=inf.filter(i=>i.mismatch).length;
      return `<div class="cats">${Object.entries(by).map(([k,n])=>`<span class="chip" style="--cc:${CABLE_TYPES[k].tc};cursor:default"><i></i>${esc(CABLE_TYPES[k].n)} · ${n}</span>`).join('')}</div>
        ${unp.length?`<div class="warn">Not plugged into power yet: ${unp.map(it=>esc(label(it))).join(', ')}</div>`:''}
        ${mis?`<div class="warn">${mis} cable${mis>1?'s join ports':' joins ports'} that don't match. Check the report.</div>`:''}`})()}
    ${cablesOf(r).length&&state.mode!=='wire'?'<div class="actions"><button class="btn" data-act="autoManage">Auto manage cables</button><button class="btn" data-act="colourType">Colour by type</button></div>':''}
    ${s.warns.length?`<div class="warns">${s.warns.map(w=>`<div class="warn">${esc(w)}</div>`).join('')}</div>`:''}
    </section><section class="sec"><p class="ph">Groups</p>${gs.length?`<div class="groups">${gs.map(([g,n])=>`<button class="grp" data-grp="${esc(g)}" aria-pressed="${ui.hl===g}"><span>${esc(g)}</span><span>${n}</span></button>`).join('')}</div><div class="sub">Click a group to highlight its devices.</div>`:'<p class="empty">Give devices a group to see them here.</p>'}</section>`;
}
const _renderInsp=renderInsp;renderInsp=function(){_renderInsp();renderSelbar()};
function renderAll(){
  $('#projName').value=state.name;
  $('#zoom').value=state.zoom;
  $('#tapeToggle').setAttribute('aria-pressed',state.tape);
  renderTabs();renderStage();renderInsp();
}
function openSheet(name){closeSheets();const el=name==='lib'?$('#libSheet'):name==='insp'?$('#inspSheet'):$('#moreSheet');if(!el)return;
  el.classList.add('open');el.scrollTop=0;$('#sheetBack').hidden=false;
  if(name==='more'){$('#pz').value=state.pzoom||1;document.querySelectorAll('#moreSheet [data-sys]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.sys===state.sys))}}
function closeSheets(){document.querySelectorAll('.sheet.open').forEach(x=>x.classList.remove('open'));const b=$('#sheetBack');if(b)b.hidden=true}
function renderSelbar(){const b=$('#selbar');if(!b)return;const f=ui.sel&&findItem(ui.sel),c=findCable(ui.selCable);
  if(f){b.innerHTML=`<div class="sb-t"><b>${esc(label(f.it))}</b><span>${uRange(f.it)} · ${esc(f.r.name)}</span></div><button class="cbtn" data-act="down" aria-label="Move down">${I('chevronDown')}</button><button class="cbtn" data-act="up" aria-label="Move up">${I('chevronUp')}</button><button class="pill" data-sheet="insp">Edit</button><button class="cbtn" data-act="desel" aria-label="Deselect">${I('xmark')}</button>`;b.hidden=false}
  else if(c){const ci=cableInfo(c);b.innerHTML=`<div class="sb-t"><b>${esc(c.label||ci.T.n)}</b><span>${esc(endName(c.a))} → ${esc(endName(c.b))}</span></div><button class="cbtn danger" data-act="cableDel" aria-label="Unplug cable">${I('unplug')}</button><button class="pill" data-sheet="insp">Edit</button><button class="cbtn" data-act="cableDone" aria-label="Deselect">${I('xmark')}</button>`;b.hidden=false}
  else b.hidden=true;
  const d=$('#bnDetails');if(d)d.classList.toggle('hot',!!(f||c));}
let tt;function toast(m,withUndo){const t=$('#toast');t.innerHTML=esc(m)+(withUndo?'<button type="button" data-act="toastUndo">Undo</button>':'');t.hidden=false;clearTimeout(tt);tt=setTimeout(()=>t.hidden=true,withUndo?5000:2600)}
const narrow=()=>window.matchMedia('(max-width:1100px)').matches;

/* ---------- actions ---------- */
function addDevice(devId,u,mount='front'){
  const r=rack(), dev=LIBM[devId];
  const it={id:uid(),dev:devId,u:0,mount,name:'',group:'',tape:'#f2f0e9'};
  if(dev.custom) it.panel={n:16,type:'xlr',labels:[]};
  const h=hOf(it);
  if(u==null){u=firstFree(r,h,dev.d,mount);
    if(u==null&&isFree()&&h<=r.units) u=r.units-h+1;
    if(u==null){toast(`No ${h}U gap left in ${r.name}. Switch to Free move to stack it anyway, or make the rack taller.`);return}}
  if(!canPlace(r,{u,h,d:dev.d,mount})){toast(blockMsg(r,{u,h,d:dev.d,mount}));return}
  snap(); it.u=u; r.items.push(it); ui.sel=it.id; ui.arm=null; save();
  if(state.view==='report') state.view='front';
  renderStage();renderInsp();renderTabs();
  toast(`Added ${dev.name} at ${uRange(it)}`,true);
  if(isPhone()) closeSheets(); else if(narrow()) $('#stage').scrollIntoView({behavior:'smooth',block:'start'});
}
function blockMsg(r,c,ignore){
  if(c.u<1||c.u+c.h-1>r.units) return `That doesn’t fit inside ${r.units}U.`;
  const o=conflicts(r,c,ignore)[0];
  return o.mount===c.mount?`That spot is taken by ${label(o)} (${uRange(o)}).`:`Not enough depth next to ${label(o)}: ${fD(dOf(o))} + ${fD(c.d)} is more than ${fD(r.depth)}.`;
}
function moveItem(id,u,mount){
  const f=findItem(id); if(!f)return false;
  const {r,it}=f, c={u,h:hOf(it),d:dOf(it),mount:mount||it.mount};
  if(!canPlace(r,c,id)){toast(blockMsg(r,c,id)+(isFree()?'':' Tip: Free move lets you put it anywhere.'));return false}
  snap(); it.u=u; it.mount=c.mount; save(); renderStage(); renderInsp(); return true;
}
function nudge(dir){const f=findItem(ui.sel);if(!f)return;const {r,it}=f,h=hOf(it);
  if(isFree()){const st=+(state.snap??(1/3))>0?+(state.snap??(1/3)):0.1;const u=snapU(it.u+dir*st);if(!inBounds(r,{u,h})){toast(dir>0?'Already at the top.':'Already at the bottom.');return}moveItem(it.id,u);return}
  for(let u=it.u+dir;u>=1&&u+h-1<=r.units;u+=dir){if(fits(r,{u,h,d:dOf(it),mount:it.mount},it.id)){moveItem(it.id,u);return}}
  toast(dir>0?'No free space above.':'No free space below.');}
function dupItem(){const f=findItem(ui.sel);if(!f)return;const {r,it}=f,h=hOf(it);
  const u=firstFree(r,h,dOf(it),it.mount); if(u==null){toast('No room left for a copy.');return}
  snap(); const c=JSON.parse(JSON.stringify(it)); c.id=uid(); c.u=u; r.items.push(c); ui.sel=c.id; save(); renderStage(); renderInsp(); toast(`Copied to ${uRange(c)}.`)}
function delItem(){const f=findItem(ui.sel);if(!f)return;snap();f.r.items=f.r.items.filter(i=>i.id!==ui.sel);
  removeCablesFor(ui.sel);ui.sel=null;ui.arm=null;save();closeSheets();renderStage();renderInsp();toast('Device removed',true)}

/* ---------- events ---------- */
let suppressClick=false;
const swallow=()=>{suppressClick=true;setTimeout(()=>suppressClick=false,60)};
function autoManage(){
  const cs=scopeCables();
  if(!cs.length){toast('No cables yet. Switch to Wire mode and drag from one port to another.');return}
  snap();cs.forEach(c=>{c.route='managed';c.bend=null});save();
  if(state.view==='side'||state.view==='report')state.view='both';
  renderStage();renderInsp();toast(`Tidied ${cs.length} cable${cs.length>1?'s':''} into the side channels`,true);
}
function colourByType(){
  const cs=scopeCables();if(!cs.length){toast('No cables to colour yet.');return}
  snap();cs.forEach(c=>{c.color=cableInfo(c).T.tc});
  save();renderStage();renderInsp();toast('Coloured by type: network blue, HDMI purple, power red, DC orange, USB white, fiber cyan, coax yellow, audio green',true);
}
function loosenAll(){const cs=scopeCables();if(!cs.length)return;snap();cs.forEach(c=>{c.route=null;c.bend=null});save();renderStage();renderInsp();toast('All cables set back to loose curves',true)}
function delCable(){if(!ui.selCable)return;snap();removeCable(ui.selCable);ui.selCable=null;save();renderStage();renderInsp();toast('Cable unplugged',true)}
function closePops(){document.querySelectorAll('.pop.open').forEach(p=>p.classList.remove('open'));document.querySelectorAll('[data-pop][aria-expanded="true"]').forEach(b=>b.setAttribute('aria-expanded','false'))}
function placePop(el,anchor){
  const a=anchor.getBoundingClientRect(),vw=document.documentElement.clientWidth,vh=window.innerHeight,m=10;
  el.style.left='0px';el.style.top='0px';const w=el.offsetWidth,h=el.offsetHeight;
  let x,y;
  if(anchor.closest('.t3-side')){x=document.documentElement.dir==='rtl'?a.right+10:a.left-w-10;y=a.top+a.height/2-h/2}
  else{x=a.right-w;y=a.bottom+8;if(x<m)x=a.left}
  x=Math.max(m,Math.min(vw-w-m,x));y=Math.max(m,Math.min(vh-h-m,y));
  el.style.left=x+'px';el.style.top=y+'px';
}
window.addEventListener('resize',closePops);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePops()});
document.addEventListener('click',e=>{
  if(suppressClick){suppressClick=false;return}
  const popBtn=e.target.closest&&e.target.closest('[data-pop]');
  if(popBtn){const el=document.getElementById(popBtn.dataset.pop),was=el&&el.classList.contains('open');closePops();if(el&&!was){el.classList.add('open');popBtn.setAttribute('aria-expanded','true');placePop(el,popBtn)}return}
  const inPop=e.target.closest&&e.target.closest('.pop');
  if(!inPop||(inPop.classList.contains('menu')&&e.target.closest('button')))closePops();
  const sh=e.target.closest&&e.target.closest('[data-sheet],[data-closesheet],[data-proxy],[data-zoomstep]');
  if(sh){
    if(sh.dataset.sheet){openSheet(sh.dataset.sheet)}
    else if(sh.hasAttribute('data-closesheet')){closeSheets()}
    else if(sh.dataset.proxy){closeSheets();const tgt=$(sh.dataset.proxy);if(tgt&&!tgt.disabled)tgt.click()}
    else if(state.view==='3d'){T3.zoom(+sh.dataset.zoomstep)}
    else{state.pzoom=Math.max(.6,Math.min(3,Math.round(((state.pzoom||1)+(+sh.dataset.zoomstep)*.25)*100)/100));save();renderStage();toast(`Rack size ${Math.round(state.pzoom*100)}%`)}
    return;
  }
  const cg=e.target.closest&&e.target.closest('g[data-cid]');
  if(cg){ui.selCable=cg.dataset.cid;ui.sel=null;ui.arm=null;renderStage();renderInsp();return}
  const t=e.target.closest('button,[data-id],.bay');
  if(!t)return;
  if(t.dataset.pickcable){ui.selCable=t.dataset.pickcable;ui.sel=null;renderStage();renderInsp();return}
  if(t.dataset.siteface){state.siteFace=t.dataset.siteface;save();renderStage();return}
  if(t.dataset.snap!==undefined){state.snap=+t.dataset.snap;save();renderStage();renderInsp();toast(state.snap===0?'Snap off: place devices anywhere':`Snapping to ${t.textContent}`);return}
  if(t.dataset.mode){state.mode=t.dataset.mode;save();renderStage();renderInsp();
    toast(state.mode==='wire'?'Wire mode: drag from one port to another':state.mode==='free'?'Free move: put devices at any U, overlaps allowed':'Arrange: devices snap into free gaps');return}
  if(t.dataset.route){const c=findCable(ui.selCable);if(c){snap();c.route=t.dataset.route==='managed'?'managed':null;c.bend=null;save();renderStage();renderInsp()}return}
  if(t.dataset.ccol){const c=findCable(ui.selCable);if(c){snap();c.color=t.dataset.ccol;save();drawCables();renderInsp()}return}
  if(t.dataset.newcol){state.wireColor=t.dataset.newcol;save();renderInsp();return}
  if(t.dataset.cat){ui.cat=t.dataset.cat;renderLibrary();return}
  if(t.dataset.lib){addDevice(t.dataset.lib);return}
  if(t.dataset.view){state.view=t.dataset.view;save();renderStage();return}
  if(t.classList.contains('rtab')){state.active=t.dataset.rack;ui.sel=null;ui.arm=null;save();renderTabs();renderStage();renderInsp();return}
  if(t.dataset.grp!==undefined){ui.hl=ui.hl===t.dataset.grp?null:t.dataset.grp;renderStage();renderInsp();return}
  if(t.dataset.sys){state.sys=t.dataset.sys;save();renderLibrary();renderStage();renderInsp();return}
  if(t.dataset.tpl){pickTemplate(t.dataset.tpl);return}
  if(t.dataset.tape){const f=findItem(ui.sel);if(f){snap();f.it.tape=t.dataset.tape;save();renderStage();renderInsp()}return}
  if(t.dataset.mount){const f=findItem(ui.sel);if(f&&f.it.mount!==t.dataset.mount)moveItem(f.it.id,f.it.u,t.dataset.mount);return}
  if(t.dataset.id&&!t.matches('button')){e.stopPropagation();ui.sel=t.dataset.id;ui.arm=null;ui.selCable=null;const f=findItem(ui.sel);if(f&&f.r.id!==state.active){state.active=f.r.id;renderTabs()}renderStage();renderInsp();return}
  if(t.classList.contains('bay')&&state.view==='site'&&t.dataset.rack&&t.dataset.rack!==state.active){state.active=t.dataset.rack;ui.sel=null;ui.selCable=null;save();renderStage();renderInsp();return}
  if(t.classList.contains('bay')){if(ui.sel||ui.selCable){ui.sel=null;ui.selCable=null;ui.arm=null;renderStage();renderInsp()}return}
  const a=t.dataset.act; if(!a)return;
  const r=rack();
  if(a==='toastUndo'){$('#toast').hidden=true;undo();return}
  if(a==='makeDev'){closeSheets();openMaker();return}
  if(a==='editDev'){closeSheets();const f=findItem(ui.sel);if(f)openMaker(LIBM[f.it.dev]);return}
  if(a==='cableDel'){delCable();return}
  if(a==='autoManage'){autoManage();return}
  if(a==='colourType'){colourByType();return}
  if(a==='loosen'){loosenAll();return}
  if(a==='snapWhole'){const f=findItem(ui.sel);if(f){const was=state.mode;state.mode='free';const ok=moveItem(f.it.id,Math.max(1,Math.min(f.r.units-hOf(f.it)+1,Math.round(f.it.u))));state.mode=was;if(ok)toast(`Snapped to ${uRange(f.it)}`,true)}return}
  if(a==='cableDone'){ui.selCable=null;renderStage();renderInsp();return}
  if(a==='cableReset'){const c=findCable(ui.selCable);if(c){snap();c.bend=null;save();drawCables();renderInsp()}return}
  if(a==='up')nudge(1); else if(a==='down')nudge(-1);
  else if(a==='dup')dupItem();
  else if(a==='del'){if(ui.arm==='del')delItem();else{ui.arm='del';renderInsp()}}
  else if(a==='desel'){ui.sel=null;ui.arm=null;renderStage();renderInsp()}
  else if(a==='addRack'){snap();const n={id:uid(),name:`Rack ${state.racks.length+1}`,units:12,depth:600,items:[]};state.racks.push(n);state.active=n.id;ui.sel=null;save();if(state.view==='report')state.view='front';renderAll();toast('New 12U rack added')}
  else if(a==='dupRack'){snap();const n=JSON.parse(JSON.stringify(r));n.id=uid();n.name=r.name+' copy';const map={};n.items.forEach(i=>{const o=i.id;i.id=uid();map[o]=i.id});n.cables=cablesOf(n).map(c=>({...c,id:uid(),a:{...c.a,item:map[c.a.item]||c.a.item},b:{...c.b,item:map[c.b.item]||c.b.item}}));state.racks.push(n);state.active=n.id;save();renderAll();toast('Rack duplicated')}
  else if(a==='delRack'){if(ui.arm==='delRack'){snap();r.items.forEach(i=>removeCablesFor(i.id));state.racks=state.racks.filter(x=>x.id!==r.id);state.active=state.racks[0].id;ui.arm=null;ui.sel=null;save();renderAll();toast('Rack deleted',true)}else{ui.arm='delRack';renderInsp()}}
  else if(a==='copyReport'){copy(reportText(),'Report copied to clipboard')}
});
function copy(text,msg){
  const done=()=>toast(msg);
  try{navigator.clipboard.writeText(text).then(done,()=>fallback())}catch(e){fallback()}
  function fallback(){openData(text,'Copy this text');}
}

$('#insp').addEventListener('focusin',e=>{if(e.target.matches('input,textarea,select'))snap()});
$('#insp').addEventListener('input',e=>{
  const id=e.target.id, f=findItem(ui.sel), r=rack();
  if(id==='fName'&&f){f.it.name=e.target.value;save();renderStage()}
  else if(id==='fGroup'&&f){f.it.group=e.target.value.trim();save();renderStage()}
  else if(id==='ppL'&&f){f.it.panel.labels=e.target.value.split('\n');save();renderStage()}
  else if(id==='rName'){r.name=e.target.value;save();renderStage();renderTabs()}
  else if(id==='cLabel'){const c=findCable(ui.selCable);if(c){c.label=e.target.value;save();drawCables()}}
});
$('#insp').addEventListener('change',e=>{
  const id=e.target.id, f=findItem(ui.sel), r=rack();
  if(id==='fGroup'){renderInsp()}
  if(id==='wType'){state.wireType=e.target.value;save();drawCables();return}
  if(id==='cType'){const c=findCable(ui.selCable);if(c){snap();if(e.target.value)c.type=e.target.value;else delete c.type;save();drawCables();renderInsp()}return}
  if(id==='fU'&&f){hist.pop();const raw=+String(e.target.value).replace(',','.');const u=isFree()?Math.round(raw*1000)/1000:Math.round(raw);if(!moveItem(f.it.id,u))renderInsp();return}
  if((id==='ppN'||id==='ppT')&&f){
    const p={...f.it.panel,[id==='ppN'?'n':'type']:id==='ppN'?+e.target.value:e.target.value};
    const c={u:f.it.u,h:ppH(p),d:dOf(f.it),mount:f.it.mount};
    if(!fits(f.r,c,f.it.id)){toast(`A ${c.h}U panel doesn’t fit here. ${blockMsg(f.r,c,f.it.id)}`);renderInsp();return}
    f.it.panel=p;f.r.cables=cablesOf(f.r).filter(c=>!((c.a.item===f.it.id&&c.a.pi>=p.n)||(c.b.item===f.it.id&&c.b.pi>=p.n)));save();renderStage();renderInsp();
  }
  if(id==='rUnits'){const n=+e.target.value;const over=r.items.find(i=>i.u+hOf(i)-1>n);
    if(over){toast(`${label(over)} sits at ${uRange(over)}. Move it before shrinking to ${n}U.`);e.target.value=r.units;return}
    r.units=n;save();renderAll()}
  if(id==='rDepth'){const raw=+e.target.value, mm=isUS()?raw*25.4:raw;r.depth=Math.round(Math.max(200,Math.min(1220,mm||600)));save();renderStage();renderInsp()}
});
$('#projName').addEventListener('focus',snap);
$('#projName').addEventListener('input',e=>{state.name=e.target.value;save()});
$('#q').addEventListener('input',e=>{ui.q=e.target.value;renderLibrary()});
$('#zoom').addEventListener('input',e=>{state.zoom=+e.target.value;save();renderStage()});
$('#tapeToggle').addEventListener('click',()=>{state.tape=!state.tape;save();renderAll()});
$('#autoBtn').addEventListener('click',autoManage);
$('#pz').addEventListener('input',e=>{state.pzoom=+e.target.value;save();renderStage()});
$('#cableToggle').addEventListener('click',()=>{state.cables=state.cables===false;save();renderStage()});
$('#undo').addEventListener('click',undo);
$('#redo').addEventListener('click',redo);
$('#newBtn').addEventListener('click',()=>openWelcome(false));
$('#helpBtn').addEventListener('click',openHelp);
$('#fab').addEventListener('click',()=>{$('.lib').scrollIntoView({behavior:'smooth',block:'start'});setTimeout(()=>$('#q').focus({preventScroll:true}),400)});
$('#dataBtn').addEventListener('click',()=>openData(JSON.stringify(state,null,1),'Save / Load project'));

document.addEventListener('keydown',e=>{
  const typing=e.target.matches('input,textarea,select');
  if(e.key==='Escape'&&$('#overlayRoot').innerHTML){$('#overlayRoot').innerHTML='';return}
  if(e.key==='Escape'&&document.querySelector('.sheet.open')){closeSheets();return}
  if((e.ctrlKey||e.metaKey)&&!typing&&((e.key.toLowerCase()==='z'&&e.shiftKey)||e.key.toLowerCase()==='y')){e.preventDefault();redo();return}
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'&&!typing){e.preventDefault();undo();return}
  if(!typing&&ui.selCable&&(e.key==='Delete'||e.key==='Backspace')){e.preventDefault();delCable();return}
  if(!typing&&e.key==='Escape'&&ui.selCable){ui.selCable=null;renderStage();renderInsp();return}
  if(typing||!ui.sel)return;
  if(e.key==='ArrowUp'){e.preventDefault();nudge(1)}
  else if(e.key==='ArrowDown'){e.preventDefault();nudge(-1)}
  else if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();delItem()}
  else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='d'){e.preventDefault();dupItem()}
  else if(e.key==='Escape'){ui.sel=null;renderStage();renderInsp()}
});

/* drag & drop */
let drag=null;
document.addEventListener('dragstart',e=>{
  const l=e.target.closest('[data-lib]'), d=e.target.closest('.dev[data-id]');
  if(l){const dev=LIBM[l.dataset.lib];drag={kind:'lib',id:dev.id,h:dev.custom?1:dev.h,d:dev.d,grab:0,mount:state.view==='rear'?'rear':'front'}}
  else return;
  e.dataTransfer.effectAllowed='move';try{e.dataTransfer.setData('text/plain',drag.id)}catch(_){}
});
function targetU(bay,e){return uFromY(bay,e.clientY,drag.h,drag.grab||0,0)}
document.addEventListener('dragover',e=>{
  const bay=e.target.closest('.bay'); if(!drag||!bay||state.view==='report'||state.view==='side')return;
  e.preventDefault();
  if(bay.dataset.view) drag.mount=bay.dataset.view==='rear'?'rear':'front';
  if(bay.dataset.rack) state.active=bay.dataset.rack;
  const r=rack(),U=uPx(),u=targetU(bay,e),g=bay.querySelector('.ghost');
  const cc={u,h:drag.h,d:drag.d,mount:drag.mount}, ok=canPlace(r,cc,null);
  g.hidden=false;g.classList.toggle('bad',!ok);g.classList.toggle('warn',ok&&conflicts(r,cc,null).length>0);g.style.top=(r.units-(u+drag.h-1))*U+'px';g.style.height=drag.h*U+'px';
});
document.addEventListener('dragleave',e=>{const bay=e.target.closest('.bay');if(bay&&!bay.contains(e.relatedTarget)){const g=bay.querySelector('.ghost');if(g)g.hidden=true}});
document.addEventListener('drop',e=>{
  const bay=e.target.closest('.bay'); if(!drag||!bay)return; e.preventDefault();
  const u=targetU(bay,e);
  if(drag.kind==='lib')addDevice(drag.id,u,drag.mount); else moveItem(drag.id,u);
  drag=null; renderStage();
});
document.addEventListener('dragend',()=>{drag=null;document.querySelectorAll('.ghost').forEach(g=>g.hidden=true)});

/* pointer dragging: devices (Arrange / Free) and cables (Wire) — works with mouse and touch */
let pdrag=null;
function portUnder(x,y){
  const els=document.elementsFromPoint(x,y);
  let p=els.find(el=>el.matches&&el.matches('.p[data-pi]'));
  if(p)return p;
  // forgiving touch target: nearest port within 14px
  let best=null,bd=isPhone()?24:14;
  document.querySelectorAll('#canvas .bay .p[data-pi]').forEach(el=>{const r=el.getBoundingClientRect(),d=Math.hypot(r.left+r.width/2-x,r.top+r.height/2-y);if(d<bd){bd=d;best=el}});
  return best;
}
function uFromY(bay,clientY,h,grab,grabPx){
  const r=rack(),U=uPx(),rc=bay.getBoundingClientRect();let u;
  if(isFree()){const topPx=clientY-rc.top-(grabPx||0);u=snapU(r.units-topPx/U-h+1)}
  else{const idx=Math.floor((clientY-rc.top)/U)-grab;u=r.units-idx-h+1}
  return Math.max(1,Math.min(r.units-h+1,u));
}
$('#canvas').addEventListener('pointerdown',e=>{
  if(e.button>0)return;
  const v=state.view; if(!['front','rear','both','site'].includes(v))return;
  const r=rack(),U=uPx(),cr=$('#canvas').getBoundingClientRect(),P={x:e.clientX-cr.left,y:e.clientY-cr.top};
  const knob=e.target.closest('[data-knob]');
  if(knob){e.preventDefault();snap();wdrag={kind:'bend',cid:knob.dataset.knob};ui.selCable=knob.dataset.knob;return}
  if(state.mode==='wire'){
    const port=portUnder(e.clientX,e.clientY), devEl=port&&port.closest('.dev[data-id]');
    if(!port||!devEl)return;
    e.preventDefault();
    const end={item:devEl.dataset.id,face:port.dataset.face,pi:+port.dataset.pi}, ex=cableAt(r,end);
    if(!ex&&port.classList.contains('dimport')){toast(`That's a ${PNAME[port.dataset.pt]||'different'} port. Pick ${CABLE_TYPES[state.wireType].n} ports, or set Cable type to Auto.`);return}
    const tmpCol=(state.wireColor&&state.wireColor!=='auto')?state.wireColor:CABLE_TYPES[state.wireType&&state.wireType!=='auto'?state.wireType:detectType(port.dataset.pt,port.dataset.pt).key].col;
    if(ex){const moving=sameEnd(ex.a,end)?'a':'b';snap();wdrag={kind:'rewire',cid:ex.id,moving,from:ex[moving==='a'?'b':'a'],color:ex.color,p:P}}
    else wdrag={kind:'wire',from:end,color:tmpCol,p:P};
    ui.selCable=null;drawCables();return;
  }
  const bay=e.target.closest('.bay'); if(!bay)return;
  if(bay.dataset.rack&&bay.dataset.rack!==state.active)state.active=bay.dataset.rack;
  const devEl=e.target.closest('.dev[data-id]'); if(!devEl)return;
  const f=findItem(devEl.dataset.id); if(!f)return;
  const rc=devEl.getBoundingClientRect();
  pdrag={id:f.it.id,el:devEl,bay,y0:e.clientY,x0:e.clientX,grab:Math.floor((e.clientY-rc.top)/U),grabPx:e.clientY-rc.top,h:hOf(f.it),d:dOf(f.it),mount:f.it.mount,u:f.it.u,moved:false,armed:e.pointerType!=='touch'};
  if(!pdrag.armed){const pd=pdrag;pd.timer=setTimeout(()=>{if(pdrag===pd){pd.armed=true;pd.el.classList.add('lifted');try{navigator.vibrate&&navigator.vibrate(12)}catch(_){}}},280)}
});
window.addEventListener('pointermove',e=>{
  if(wdrag){
    const cr=$('#canvas').getBoundingClientRect(),P={x:e.clientX-cr.left,y:e.clientY-cr.top};
    if(wdrag.kind==='bend'){const c=findCable(wdrag.cid);if(!c)return;const la=bayFor(c.a),lb=bayFor(c.b);if(!la||!lb)return;c.route=null;c.bend=bendFor(center(la.el,cr),center(lb.el,cr),P,uPx())}
    else wdrag.p=P;
    drawCables();return;
  }
  if(!pdrag)return;
  const dy=e.clientY-pdrag.y0;
  if(!pdrag.armed){if(Math.abs(dy)>8||Math.abs(e.clientX-pdrag.x0)>8){clearTimeout(pdrag.timer);pdrag=null}return}
  if(!pdrag.moved&&Math.abs(dy)<4)return;
  pdrag.moved=true;pdrag.el.classList.add('dragging');pdrag.el.style.transform=`translateY(${dy}px)`;
  const r=rack(),U=uPx(),u=uFromY(pdrag.bay,e.clientY,pdrag.h,pdrag.grab,pdrag.grabPx),g=pdrag.bay.querySelector('.ghost');
  pdrag.el.title=`U${fmtU(u)}`;
  const c={u,h:pdrag.h,d:pdrag.d,mount:pdrag.mount},ok=canPlace(r,c,pdrag.id),clash=conflicts(r,c,pdrag.id).length>0;
  g.hidden=false;g.classList.toggle('bad',!ok);g.classList.toggle('warn',ok&&clash);g.style.top=(r.units-(u+pdrag.h-1))*U+'px';g.style.height=pdrag.h*U+'px';
  pdrag.u=u;drawCables();
});
window.addEventListener('pointerup',e=>{
  if(wdrag){
    const w=wdrag; wdrag=null; const r=rack();
    if(w.kind==='bend'){save();swallow();renderInsp();drawCables();return}
    const port=portUnder(e.clientX,e.clientY), devEl=port&&port.closest('.dev[data-id]');
    const end=port&&devEl&&$('#canvas').contains(port)?{item:devEl.dataset.id,face:port.dataset.face,pi:+port.dataset.pi}:null;
    if(w.kind==='wire'){
      if(end&&!sameEnd(end,w.from)){
        if(cableAt(r,end))toast('That port already has a cable. Drag its plug off first.');
        else if(port.classList.contains('dimport'))toast(`That isn't a ${CABLE_TYPES[state.wireType].n} port.`);
        else{snap();const c={id:uid(),a:w.from,b:end,label:'',bend:null,route:null};if(state.wireType&&state.wireType!=='auto')c.type=state.wireType;
          const ci=cableInfo(c);c.color=(!state.wireColor||state.wireColor==='auto')?ci.T.col:state.wireColor;addCable(c);ui.selCable=c.id;save();
          toast(ci.mismatch?`${ci.T.n} connected, but the ports don't match (${PNAME[ci.ta]} → ${PNAME[ci.tb]}). You'll need an adapter.`:`${ci.T.n} cable: ${endName(c.a)} → ${endName(c.b)}`,true)}
      }
    } else {
      const c=findCable(w.cid);
      if(c&&end&&sameEnd(end,c[w.moving])){hist.pop();updHist()}
      else if(c&&end&&!sameEnd(end,w.from)){const other=cableAt(r,end);if(other&&other.id!==c.id){hist.pop();updHist();toast('That port already has a cable.')}else{c[w.moving]=end;c.bend=null;removeCable(c.id);addCable(c);ui.selCable=c.id;save();toast('Cable moved',true)}}
      else if(c&&!end){removeCable(c.id);if(ui.selCable===c.id)ui.selCable=null;save();toast('Cable unplugged',true)}
      else {hist.pop();updHist()}
    }
    swallow();renderStage();renderInsp();return;
  }
  if(pdrag){const p=pdrag;pdrag=null;clearTimeout(p.timer);if(!p.moved)p.el.classList.remove('lifted');
    if(p.moved){swallow();ui.sel=p.id;ui.selCable=null;if(!moveItem(p.id,p.u)){renderStage();renderInsp()}}}
});
document.addEventListener('touchmove',e=>{if((pdrag&&pdrag.armed)||wdrag)e.preventDefault()},{passive:false});
window.addEventListener('pointercancel',()=>{if(pdrag){const m=pdrag.moved;clearTimeout(pdrag.timer);pdrag=null;if(m)renderStage()}if(wdrag){wdrag=null;drawCables()}});
let lastW=window.innerWidth;
window.addEventListener('resize',()=>{const w=window.innerWidth,changed=w!==lastW;lastW=w;if(isPhone()){if(changed)renderStage();return}if(state.view==='site'||state.view==='both')renderStage();else if(['front','rear'].includes(state.view))drawCables()});

/* save/load overlay */
function openData(text,title){
  const isProj=title.startsWith('Save');
  $('#overlayRoot').innerHTML=`<div class="overlay" id="ov"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="ovT">
    <h3 id="ovT" style="margin:0;font-family:var(--f-display);font-size:24px">${esc(title)}</h3>
    <p class="sub" style="margin:0">${isProj?'Your project is kept in this browser automatically. To move it elsewhere, copy this JSON and keep it; paste a saved project here and choose Load to restore it.':'Select all and copy.'}</p>
    <textarea id="ovText" spellcheck="false">${esc(text)}</textarea>
    <div class="actions">${isProj?'<button class="btn primary" id="ovCopy">Copy JSON</button><button class="btn" id="ovLoad">Load pasted project</button><button class="btn" id="ovReset">Start a new project</button>':''}<button class="btn" id="ovClose" style="margin-left:auto">Close</button></div></div></div>`;
  const ta=$('#ovText');ta.focus();ta.select();
  const close=()=>$('#overlayRoot').innerHTML='';
  $('#ovClose').onclick=close;$('#ov').onclick=e=>{if(e.target.id==='ov')close()};
  if(isProj){
    $('#ovCopy').onclick=()=>{try{navigator.clipboard.writeText(ta.value).then(()=>toast('Project JSON copied'),()=>{ta.select();toast('Press Ctrl+C to copy')})}catch(e){ta.select();toast('Press Ctrl+C to copy')}};
    $('#ovLoad').onclick=()=>{const prev=JSON.stringify(state);try{const s=JSON.parse(ta.value);if(!Array.isArray(s.racks)||!s.racks.length)throw 0;
      s.custom=s.custom||[];s.sys=s.sys||state.sys;state=s;syncCustom();
      for(const r of s.racks)for(const i of r.items){if(!LIBM[i.dev])throw 0}
      hist.push(prev);fut=[];updHist();ui.sel=null;save();renderLibrary();renderAll();close();toast('Project loaded',true)}catch(e){state=JSON.parse(prev);syncCustom();toast('That text isn’t a Rackline project. Paste the full text from Copy JSON.')}};
    $('#ovReset').onclick=()=>{close();openWelcome(false)};
  }
}

/* welcome / templates */
function shell(title,body,foot){
  $('#overlayRoot').innerHTML=`<div class="overlay" id="ov"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="ovT">
    <h3 id="ovT" style="margin:0;font-family:var(--f-display);font-size:26px;line-height:1.1">${title}</h3>${body}
    <div class="actions">${foot||''}<button class="btn" id="ovClose" style="margin-left:auto">Close</button></div></div></div>`;
  const close=()=>$('#overlayRoot').innerHTML='';
  $('#ovClose').onclick=close;$('#ov').onclick=e=>{if(e.target.id==='ov')close()};
  return close;
}
function openWelcome(first){
  const close=shell(first?'Welcome to Rackline':'Start a new project',
   `${first?'<img class="wl-icon" src="/apple-touch-icon.png" alt="" width="72" height="72">':''}<p class="sub" style="margin:0">${first?'What are you building? ':''}${first?'Pick a starting point. Everything is editable, and your work saves in this browser automatically.':'Pick a starting point. Your current project is replaced, and Undo brings it back.'}</p>
    <div class="tpl-grid">
      <button class="tpl" data-tpl="home"><em>16U · DIY</em><b>Home lab</b><span>PC, NAS, modem + Wi-Fi router shelf, Raspberry Pis, switch, wall-jack patch panel, UPS.</span></button>
      <button class="tpl" data-tpl="gaming"><em>18U · DIY · wired</em><b>Gaming &amp; media</b><span>PS5, PS4, home NAS, HDMI switch, Wi-Fi router and power, with network, HDMI and power cables run.</span></button>
      <button class="tpl" data-tpl="security"><em>12U · DIY · wired</em><b>Home security</b><span>16-channel PoE NVR, camera patch panel, modem + router, backup NAS, UPS.</span></button>
      <button class="tpl" data-tpl="closet"><em>9U wall cabinet</em><b>Network closet</b><span>Room jacks, switch, internet shelf, Home Assistant mini PC.</span></button>
      <button class="tpl" data-tpl="office"><em>18U · Small business</em><b>Small office</b><span>Desk patch panel, 24-port switch, firewall, two servers, NAS, UPS.</span></button>
      <button class="tpl" data-tpl="studio"><em>8U · DIY</em><b>Home studio</b><span>DAW PC, audio interface, preamps, XLR tie-line panel, power strip.</span></button>
      <button class="tpl" data-tpl="tour"><em>2 racks · Pro</em><b>Touring A/V</b><span>Wireless mics, in-ears, mixer engine, plus a video world rack.</span></button>
      <div class="tpl"><em>Your size</em><b>Blank rack</b><span>Start from nothing.</span>
        <div style="display:flex;gap:6px;margin-top:6px"><select id="tplUnits" aria-label="Rack height" style="flex:1;border:1px solid var(--line);background:var(--panel);border-radius:7px;padding:5px">${[4,6,8,9,12,15,16,18,22,24,27,32,42].map(n=>`<option value="${n}" ${n===12?'selected':''}>${n}U</option>`).join('')}</select><button class="btn primary" data-tpl="empty">Create</button></div></div>
    </div>`, first?'':'');
  if(first) $('#ovClose').textContent='Keep the home lab';
}
function pickTemplate(k){
  const keepFirst=firstRun&&!hist.length;
  const prev=JSON.stringify(state);
  const T={home:tplHome,studio:tplStudio,tour:sample,gaming:tplGaming,security:tplSecurity,office:tplOffice,closet:tplCloset};
  const s= T[k]?T[k](): tplEmpty(+($('#tplUnits')?.value||12));
  if(!keepFirst){hist.push(prev);fut=[];}
  firstRun=false;
  state=s;ui.sel=null;ui.hl=null;syncCustom();save();renderLibrary();renderAll();updHist();
  $('#overlayRoot').innerHTML='';
  if(k!=='tour'&&k!=='empty'){ui.cat='home';renderLibrary()}
  toast(keepFirst?'Ready. Drag devices in from the library.':'New project started',!keepFirst);
}
function openHelp(){
  shell('How to use Rackline',`<ol class="tips">
    <li><b>Add gear:</b> drag a device from the library into the rack, or tap it and it drops into the highest free slot.</li>
    <li><b>Move it:</b> drag a device up or down, or select it and use <kbd>↑</kbd> <kbd>↓</kbd>.</li>
    <li><b>Name it:</b> select a device and type a label. Pick a colour and a group so you can find things fast.</li>
    <li><b>Something not in the list?</b> Use <b>Make your own device</b> at the top of the library for any size, depth and look.</li>
    <li><b>Check the fit:</b> the Side view shows how deep everything sits. Red means two devices would bump into each other or a device is deeper than the rack.</li>
    <li><b>Front &amp; back:</b> devices can be mounted on the back rails too. Shallow gear like patch panels often goes there.</li>
    <li><b>Share the plan:</b> the Report view lists every device, label and patch port, ready to copy.</li>
    <li>Shortcuts: <kbd>Ctrl</kbd>+<kbd>Z</kbd> undo · <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> redo · <kbd>Ctrl</kbd>+<kbd>D</kbd> duplicate · <kbd>Delete</kbd> remove · <kbd>Esc</kbd> deselect</li>
  </ol>
  <p class="credits help-credits"><span>Rackline is made by</span> <b data-notr dir="ltr">Hassan Yahya</b> <a href="https://www.instagram.com/v3h3/" target="_blank" rel="noopener noreferrer" data-notr>${I('instagram','ico sm')}<span dir="ltr">@v3h3</span></a></p>`);
}

/* custom device maker */
const PW={xlr:.5,ecn:.5,spk:.5,pcon:.52,iec:.52,us:.48,out:.63,rj45:.35,hdmi:.38,usb:.28,sfp:.44,lc:.28,bnc:.31,jack:.21,dc:.25};
const PORT_PICK=['rj45','sfp','lc','hdmi','usb','bnc','xlr','jack','ecn','spk','iec','dc','us','out','pcon'];
const QUICK=[['rj45',4,'4× RJ45'],['rj45',8,'8× RJ45'],['hdmi',2,'2× HDMI'],['usb',2,'2× USB'],['sfp',2,'2× SFP'],['xlr',4,'4× XLR'],['bnc',2,'2× BNC'],['iec',1,'Power inlet'],['dc',1,'DC power'],['us',4,'4× outlets']];
function layoutFace(h,style,face,groups,code){
  const CAP=9.1, rows=Array.from({length:h},()=>({z:[],w:0})); let over=false, placed=0;
  const front=face==='front';
  if(front&&style==='shelf'){rows[h-1].z.push({t:'obj',k:'box'});rows[h-1].w+=2.4}
  else if(front&&code&&style!=='blank'&&style!=='vents'){rows[0].z.push({t:'logo'});rows[0].w+=1.1}
  let ri=0;
  for(const g of groups){
    const pw=PW[g.t]||.4; let left=Math.max(0,Math.min(48,Math.round(g.n)||0));
    while(left>0){
      while(ri<h&&CAP-rows[ri].w<pw)ri++;
      if(ri>=h){over=true;break}
      const k=Math.min(left,Math.floor((CAP-rows[ri].w)/pw));
      rows[ri].z.push({t:g.t,n:k});rows[ri].w+=k*pw;left-=k;placed+=k;
    }
    if(over)break;
  }
  rows.forEach((r,i)=>{const rem=CAP-r.w;
    if(!front){r.z.unshift({t:'gap'});r.z.push({t:'gap'});return}
    if(style==='vents'&&rem>1.2)r.z.push({t:'gap'},{t:'grille',w:+(rem-0.4).toFixed(1)});
    else if(style==='drives'&&rem>=2)r.z.unshift({t:'hdd',n:Math.floor(rem/2)});
    else if(style==='lights'&&i===0){r.z.push({t:'gap'});if(rem>2.8)r.z.push({t:'screen',w:1.4});if(rem>1.3)r.z.push({t:'led',n:4});if(rem>.5)r.z.push({t:'pwr'})}
    else r.z.push({t:'gap'});
  });
  return {zones:h===1?rows[0].z:rows.map(r=>r.z),over,placed};
}
function countPorts(zones){const rows=Array.isArray(zones[0])?zones:[zones];let n=0;rows.forEach(r=>r.forEach(z=>{if(PNAME[z.t])n+=(z.n||1)}));return n}
function openMaker(E){
  const u=isUS();
  const st={front:(E?.ports?.front||[]).map(x=>({...x})),rear:E?.ports?(E.ports.rear||[]).map(x=>({...x})):[{t:'iec',n:1}]};
  const val=(v,d)=>v==null?d:v;
  const close=shell(E?`Edit “${esc(E.name)}”`:'Make your own device',`
    <p class="sub" style="margin:0">Build any device you own: pick its size and look, then add the ports on the front and the back. Every port you add can be wired.</p>
    <div class="fld"><label for="mkName">Name</label><input id="mkName" maxlength="40" value="${esc(E?.name||'')}" placeholder="e.g. Gaming PC in 4U case"></div>
    <div class="two">
      <div class="fld"><label for="mkH">Height</label><select id="mkH">${[1,2,3,4,5,6,7,8].map(n=>`<option value="${n}" ${n===val(E?.h,2)?'selected':''}>${n}U</option>`).join('')}</select></div>
      <div class="fld"><label for="mkD">Depth (${u?'in':'mm'})</label><input id="mkD" type="number" min="1" value="${E?(u?(E.d/25.4).toFixed(1):E.d):(u?'12':'300')}"></div>
      <div class="fld"><label for="mkKg">Weight (${u?'lb':'kg'})</label><input id="mkKg" type="number" min="0" step="0.1" value="${E?(u?(E.kg*2.2046).toFixed(1):E.kg):(u?'8':'4')}"></div>
      <div class="fld"><label for="mkW">Power (watts)</label><input id="mkW" type="number" min="0" value="${val(E?.w,100)}"></div>
    </div>
    <div class="two">
      <div class="fld"><label for="mkStyle">Front looks like</label><select id="mkStyle">${[['lights','Lights, screen & buttons'],['vents','Vents / mesh'],['drives','Drive bays'],['shelf','Shelf with a box on it'],['blank','Plain panel']].map(([k,n])=>`<option value="${k}" ${(E?.style||'lights')===k?'selected':''}>${n}</option>`).join('')}</select></div>
      <div class="fld"><label for="mkFace">Colour</label><select id="mkFace">${[['black','Black'],['grey','Grey'],['silver','Silver']].map(([k,n])=>`<option value="${k}" ${(E?.face||'black')===k?'selected':''}>${n}</option>`).join('')}</select></div>
    </div>
    <div class="fld"><label for="mkCat">Show it in</label><select id="mkCat"><option value="mine">My devices</option>${Object.entries(CATS).filter(([k])=>k!=='mine').map(([k,v])=>`<option value="${k}" ${E?.cat===k?'selected':''}>${v.n}</option>`).join('')}</select></div>
    <div class="fld pvwrap"><label>Preview</label><div class="pv"><small>FRONT</small><div id="pvF"></div><small>BACK</small><div id="pvR"></div></div><p class="sub" id="pvNote" style="margin:0"></p></div>
    <div class="portcols">${['front','rear'].map(f=>`<div class="fld portcol"><label>${f==='front'?'Front ports':'Back ports'}</label>
      <div class="plist" id="pl-${f}"></div>
      <div class="quick">${QUICK.map(([t,n,l])=>`<button type="button" class="btn" data-quick="${f}:${t}:${n}">+ ${l}</button>`).join('')}</div>
      <button type="button" class="btn" data-padd="${f}" style="justify-self:start">+ Add another port type</button></div>`).join('')}</div>
    <p class="warn" id="mkErr" hidden></p>`,
    `<button class="btn primary" id="mkSave">${E?'Save changes':'Create and add to rack'}</button>`);
  const list=f=>{$('#pl-'+f).innerHTML=st[f].length?st[f].map((g,i)=>`<div class="prow">
      <select class="pt" data-face="${f}" data-i="${i}" aria-label="Port type">${PORT_PICK.map(t=>`<option value="${t}" ${t===g.t?'selected':''}>${PNAME[t]}</option>`).join('')}</select>
      <input class="pn" type="number" min="1" max="48" data-face="${f}" data-i="${i}" value="${g.n}" aria-label="How many">
      <button type="button" class="btn" data-prm="${f}:${i}" aria-label="Remove these ports">×</button></div>`).join(''):'<p class="sub" style="margin:0">No ports yet. Tap a button below to add some.</p>'};
  const build=()=>{
    const name=$('#mkName').value.trim(), h=+$('#mkH').value, dRaw=+$('#mkD').value, kgRaw=+$('#mkKg').value, w=Math.max(0,Math.round(+$('#mkW').value||0)), style=$('#mkStyle').value;
    const d=Math.max(10,Math.round(u?dRaw*25.4:dRaw)||300), kg=+((u?kgRaw/2.2046:kgRaw)||0).toFixed(1);
    const code=(name||'My device').replace(/[^A-Za-z0-9 ]/g,'').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,4).toUpperCase();
    const F=layoutFace(h,style,'front',st.front,code), B=layoutFace(h,style,'rear',st.rear,'');
    const def={id:E?E.id:'c_'+uid(),cat:$('#mkCat').value,c:['shelf','blank','vents'].includes(style)?'':code,name:name||'My device',h,d,kg,w,face:$('#mkFace').value,open:style==='shelf'?1:0,
      front:F.zones,rear:B.zones,mine:1,style,ports:{front:st.front.map(x=>({...x})),rear:st.rear.map(x=>({...x}))}};
    return {def,name,dRaw,F,B};
  };
  const preview=()=>{
    const {def,F,B}=build(), U=Math.max(22,Math.min(34,Math.floor(($('#pvF').parentElement.clientWidth-30)/10.86))), W=Math.round(U*10.86);
    $('#pvF').innerHTML=`<div class="mini dev f-${def.face}${def.open?' open':''}" style="position:relative;--u:${U}px;height:${def.h*U}px;width:${W}px">${faceInner(def,null,'front',true)}</div>`;
    $('#pvR').innerHTML=`<div class="mini dev f-${def.face}" style="position:relative;--u:${U}px;height:${def.h*U}px;width:${Math.round(W*.85)}px;margin-left:${Math.round(W*.075)}px;filter:brightness(.9)">${faceInner(def,null,'rear',false)}</div>`;
    const nf=countPorts(def.front), nr=countPorts(def.rear), want=f=>st[f].reduce((a,g)=>a+(Math.round(g.n)||0),0);
    const over=F.over||B.over;
    $('#pvNote').innerHTML=over?`<span style="color:var(--bad)">Not everything fits in ${def.h}U: showing ${nf} of ${want('front')} front and ${nr} of ${want('rear')} back ports. Make it taller or use fewer ports.</span>`:`${nf} front port${nf===1?'':'s'} and ${nr} back port${nr===1?'':'s'}, all wireable.`;
  };
  const refresh=()=>{list('front');list('rear');preview()};
  const ov=$('#ov');
  ov.addEventListener('input',e=>{const el=e.target;
    if(el.classList.contains('pn')){st[el.dataset.face][+el.dataset.i].n=Math.max(1,Math.min(48,Math.round(+el.value)||1));preview();return}
    if(el.matches('input,select'))preview();});
  ov.addEventListener('change',e=>{const el=e.target;if(el.classList.contains('pt')){st[el.dataset.face][+el.dataset.i].t=el.value;preview()}});
  ov.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.quick){const [f,t,n]=b.dataset.quick.split(':');const ex=st[f].find(g=>g.t===t);if(ex)ex.n=Math.min(48,ex.n+ +n);else st[f].push({t,n:+n});refresh()}
    else if(b.dataset.padd){st[b.dataset.padd].push({t:'rj45',n:1});refresh()}
    else if(b.dataset.prm){const [f,i]=b.dataset.prm.split(':');st[f].splice(+i,1);refresh()}});
  refresh();
  $('#mkName').focus();
  $('#mkSave').onclick=()=>{
    const {def,name,dRaw}=build();
    const err=m=>{const e=$('#mkErr');e.textContent=m;e.hidden=false};
    if(!name)return err('Give your device a name so you can find it later.');
    if(!(dRaw>0))return err('Enter a depth greater than zero.');
    snap();
    if(E){
      const i=state.custom.findIndex(x=>x.id===E.id); if(i>=0)state.custom[i]=def; else state.custom.push(def);
      syncCustom();
      const nf=countPorts(def.front), nr=countPorts(def.rear); let used=0;
      state.racks.forEach(r=>r.items.forEach(it=>{if(it.dev!==def.id)return;used++;
        if(it.u+def.h-1>r.units)it.u=Math.max(1,r.units-def.h+1);
        const bad=e=>e.item===it.id&&((e.face==='front'&&e.pi>=nf)||(e.face==='rear'&&e.pi>=nr));
        allCables().filter(c=>bad(c.a)||bad(c.b)).forEach(c=>removeCable(c.id));
      }));
      save();close();renderLibrary();renderAll();toast(`Updated “${def.name}”${used?` · ${used} in your racks updated`:''}`,true);return;
    }
    state.custom.push(def);syncCustom();save();close();renderLibrary();
    const r=rack(), uu=firstFree(r,def.h,def.d);
    if(uu==null){toast(`Created “${def.name}”. There's no ${def.h}U gap in this rack yet; find it in the library.`);return}
    const it={id:uid(),dev:def.id,u:uu,mount:'front',name:def.name.toUpperCase().slice(0,20),group:'',tape:'#f2f0e9'};
    r.items.push(it);ui.sel=it.id;save();renderStage();renderInsp();toast(`Created “${def.name}” and added it at ${uRange(it)}`,true);
  };
}

/* =================== 3D view (three.js r128) =================== */
const T3=(()=>{
  let THREE=null;
  const UM=44.45, PX=96, PANEL=482.6, CHW=430, BASE=120, CASEW=578, WALLX=280, EAR=0.056;
  const PORT_SZ={xlr:[.42,.42],ecn:[.42,.42],spk:[.42,.42],rj45:[.27,.22],bnc:[.23,.23],sfp:[.36,.14],lc:[.2,.28],iec:[.44,.3],pcon:[.44,.44],hdmi:[.3,.12],out:[.55,.55],brk:[.22,.4],slot:[.7,.08],fan:[.78,.78],knob:[.3,.3],btn:[.2,.16],led:[.08,.08],pwr:[.24,.34],usb:[.2,.09],jack:[.13,.13],bay:[3.2,.8],hdd:[1.8,.6],pcie:[.16,.82],us:[.4,.55],dc:[.17,.17]};
  const OBJ_SZ={macmini:[4.4,.8],studio:[4.4,2.1],tower:[6.8,3.4],dock:[3.9,2.3],router:[2.6,.5],modem:[.62,1.55],mini:[1.1,.42],console:[2.7,.65],box:[2.2,.7],pi:[.95,.62],ps5:[4.6,2.3],ps4:[5,.85],hnas:[3.4,3.5],hnas2:[1.9,3.5],stream:[1.2,.36]};
  const OBJ_COL={macmini:0xd2d6d9,studio:0xd2d6d9,tower:0x141517,dock:0x1b1c1f,router:0xe3e6e8,modem:0xdadde0,mini:0x2c3135,console:0x17191c,box:0x41484e,pi:0x2e7d4f,ps5:0xeef0f1,ps4:0x1c1f23,hnas:0x2b3035,hnas2:0x2b3035,stream:0x141618};
  const OBJ_DEPTH={macmini:197,studio:197,tower:151,dock:60,router:180,modem:170,mini:110,console:260,box:200,pi:70,ps5:260,ps4:300,hnas:220,hnas2:220,stream:90};
  const FACE_BG={black:['#2c3136','#1d2125'],grey:['#58606a','#444b53'],silver:['#dde1e4','#bfc5ca']};
  const CH_BG={black:['#30363c','#24292e'],grey:['#4a525a','#3a4047'],silver:['#b9bfc4','#a9b0b6']};
  const INK={black:'#d6dbe0',grey:'#e6e9ec',silver:'#23282c'};
  const DIRS={'34':[.8,.5,1.15],front:[0,.12,1],back:[0,.12,-1],side:[1,.1,.02],top:[.002,1,.22]};
  let loading=null, R=null, GL=null, LEDS=null, FANS=null;
  const REDUCED=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const STRIPS={off:null,white:0xf4f1ea,blue:0x3d7bff,purple:0xa25bff,red:0xff3b3b,green:0x2fe07a,amber:0xffa424,rainbow:'rainbow'};
  const faceCache=new Map(), objCache=new Map(), misc=new Map();
  const tok=n=>(getComputedStyle(document.documentElement).getPropertyValue(n)||'').trim()||'#888888';
  const T=()=>state.t3||(state.t3={site:false,walls:'glass',spin:false});
  const C=h=>new THREE.Color(h).convertSRGBToLinear();
  const keyOf=e=>e.item+':'+e.face+':'+e.pi;

  /* ---------- loading ---------- */
  function ensure(){
    if(!loading){
      const fonts=document.fonts?Promise.all([document.fonts.load('700 26px "Barlow Condensed"'),document.fonts.load('24px "Permanent Marker"'),document.fonts.load('500 12px "IBM Plex Mono"')]).catch(()=>{}):Promise.resolve();
      loading=Promise.all([import('three'),import('three/examples/jsm/controls/OrbitControls.js'),fonts])
        .then(([T,O])=>{THREE={...T,OrbitControls:O.OrbitControls}})
        .catch(e=>{loading=null;throw e});
    }
    return loading;
  }

  /* ---------- canvas painting ---------- */
  function mkCanvas(w,h){const c=document.createElement('canvas');c.width=Math.max(2,Math.round(w));c.height=Math.max(2,Math.round(h));return c}
  function rr(g,x,y,w,h,r){r=Math.max(0,Math.min(r,w/2,h/2));g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
  function circ(g,x,y,r,f){g.beginPath();g.arc(x,y,Math.max(.5,r),0,Math.PI*2);g.fillStyle=f;g.fill()}
  function drawPart(g,t,cx,cy,s,v,i,silver){
    const B=(w,h)=>[cx-w*s/2,cy-h*s/2,w*s,h*s];
    switch(t){
      case 'xlr':case 'ecn':case 'spk':{const r=(v==='pc'?.18:.21)*s;circ(g,cx,cy,r+.04*s,'#59616a');circ(g,cx,cy,r,'#0b0c0e');g.fillStyle='#7f8891';
        if(t==='xlr'){circ(g,cx-r*.33,cy-r*.2,r*.13,'#7f8891');circ(g,cx+r*.33,cy-r*.2,r*.13,'#7f8891');circ(g,cx,cy+r*.38,r*.13,'#7f8891')}
        else if(t==='ecn'){g.fillRect(cx-r*.42,cy-r*.34,r*.84,r*.68);g.fillStyle='#0b0c0e';g.fillRect(cx-r*.28,cy-r*.2,r*.56,r*.4)}
        else g.fillRect(cx-r*.1,cy-r*.75,r*.2,r*.65);break}
      case 'rj45':{const [x,y,w,h]=B(v==='pc'?.22:.27,v==='pc'?.17:.22);g.fillStyle='#636b73';g.fillRect(x-1,y-1,w+2,h+2);g.fillStyle='#14171a';g.fillRect(x,y,w,h);g.fillStyle='#000';g.fillRect(x,y,w,h*.32);g.fillRect(cx-w*.18,y+h*.32,w*.36,h*.18);break}
      case 'bnc':{const r=.115*s;circ(g,cx,cy,r,'#c9ced3');circ(g,cx,cy,r*.8,'#111');circ(g,cx,cy,r*.3,'#c8a64a');break}
      case 'sfp':{const [x,y,w,h]=B(.36,.14);g.fillStyle='#79828a';g.fillRect(x-1,y-1,w+2,h+2);g.fillStyle='#090a0b';g.fillRect(x,y,w,h);break}
      case 'lc':{const [x,y,w,h]=B(.2,.28);g.fillStyle='#2f6fd6';g.fillRect(x,y,w*.45,h);g.fillRect(x+w*.55,y,w*.45,h);break}
      case 'iec':{const [x,y,w,h]=B(.44,.3);g.fillStyle='#0b0c0e';g.beginPath();g.moveTo(x,y);g.lineTo(x+w,y);g.lineTo(x+w,y+h*.6);g.lineTo(x+w*.8,y+h);g.lineTo(x+w*.2,y+h);g.lineTo(x,y+h*.6);g.closePath();g.fill();g.fillStyle='#5f676f';[.25,.5,.75].forEach(f=>g.fillRect(x+w*f-w*.05,y+h*.3,w*.1,h*.4));break}
      case 'pcon':{const r=.22*s,gr=v==='g';circ(g,cx,cy,r+.03*s,gr?'#5b6268':'#1d3f80');circ(g,cx,cy,r,gr?'#9aa1a8':'#2f6fd6');circ(g,cx,cy,r*.82,'#0b0c0e');break}
      case 'hdmi':{const [x,y,w,h]=B(.3,.12),tr=(p)=>{g.beginPath();g.moveTo(x-p,y-p);g.lineTo(x+w+p,y-p);g.lineTo(x+w*.9+p,y+h+p);g.lineTo(x+w*.1-p,y+h+p);g.closePath();g.fill()};g.fillStyle='#79828a';tr(1);g.fillStyle='#08090a';tr(0);break}
      case 'out':{const [x,y,w,h]=B(.55,.55);g.fillStyle='#141619';rr(g,x,y,w,h,.1*s);g.fill();circ(g,cx,cy,w*.46,'#2a2e33');circ(g,cx-w*.16,cy,w*.05,'#000');circ(g,cx+w*.16,cy,w*.05,'#000');break}
      case 'us':{const [x,y,w,h]=B(.4,.55);g.fillStyle='#e7e3d8';rr(g,x,y,w,h,.1*s);g.fill();g.fillStyle='#111';g.fillRect(x+w*.28,y+h*.16,w*.09,h*.34);g.fillRect(x+w*.64,y+h*.16,w*.09,h*.34);circ(g,cx,y+h*.78,w*.09,'#111');break}
      case 'brk':{const [x,y,w,h]=B(.22,.4);g.fillStyle='#000';g.fillRect(x-1,y-1,w+2,h+2);g.fillStyle='#f2f2f2';g.fillRect(x,y,w,h*.45);g.fillStyle='#111';g.fillRect(x,y+h*.45,w,h*.55);break}
      case 'slot':{const [x,y,w,h]=B(.7,.08);g.fillStyle='#000';g.fillRect(x,y,w,h);break}
      case 'fan':{const r=.39*s;circ(g,cx,cy,r,'#545b62');circ(g,cx,cy,r*.92,'#08090a');if(FANS)FANS.push({x:cx,y:cy,r});break}
      case 'knob':{const r=.15*s;circ(g,cx,cy,r,'#22272b');circ(g,cx-r*.15,cy-r*.2,r*.72,'#4a525a');g.fillStyle='#e9ecef';g.fillRect(cx-r*.1,cy-r*.9,r*.2,r*.6);break}
      case 'btn':{const [x,y,w,h]=B(.2,.16);g.fillStyle=i%3===0?(silver?'#3d7c52':'#5d8c6c'):(silver?'#8b939a':'#3b4249');rr(g,x,y,w,h,.03*s);g.fill();break}
      case 'led':{const r=.045*s,c=i%5===4?'#2b3237':(i%4===2?'#f5b12e':'#33d17a');if(i%5!==4){g.shadowColor=c;g.shadowBlur=r*3}circ(g,cx,cy,r,c);g.shadowBlur=0;if(i%5!==4){if(GL){GL.shadowColor=c;GL.shadowBlur=r*4;circ(GL,cx,cy,r*1.15,c);GL.shadowBlur=0}if(LEDS)LEDS.push({x:cx,y:cy,c})}break}
      case 'pwr':{const [x,y,w,h]=B(.24,.34);g.fillStyle='#000';g.fillRect(x-1,y-1,w+2,h+2);g.fillStyle='#0e1012';g.fillRect(x,y,w,h*.5);g.fillStyle='#2e3338';g.fillRect(x,y+h*.5,w,h*.5);g.fillStyle='#cfd4d8';g.fillRect(x+w*.42,y+h*.12,w*.16,h*.22);break}
      case 'usb':{const [x,y,w,h]=B(.2,.09);g.fillStyle='#7a838b';g.fillRect(x-1,y-1,w+2,h+2);g.fillStyle='#08090a';g.fillRect(x,y,w,h);g.fillStyle='#3164c4';g.fillRect(x+w*.12,y+h*.15,w*.76,h*.35);break}
      case 'jack':{const r=.065*s;circ(g,cx,cy,r,['#6dbb4a','#e06aa6','#4a8fe0'][i%3]);circ(g,cx,cy,r*.58,'#000');break}
      case 'dc':{const r=.085*s;circ(g,cx,cy,r,'#59616a');circ(g,cx,cy,r*.8,'#0b0c0e');circ(g,cx,cy,r*.25,'#c9ced3');break}
      case 'bay':{const [x,y,w,h]=B(3.2,.8),gr=g.createLinearGradient(0,y,0,y+h);gr.addColorStop(0,'#2c3237');gr.addColorStop(1,'#1c2024');g.fillStyle='#0c0d0f';g.fillRect(x-1,y-1,w+2,h+2);g.fillStyle=gr;g.fillRect(x,y,w,h);g.fillStyle='#0c0d0f';g.fillRect(x+w*.88,y,2,h);break}
      case 'hdd':{const [x,y,w,h]=B(1.8,.6),gr=g.createLinearGradient(0,y,0,y+h);gr.addColorStop(0,'#3a4148');gr.addColorStop(1,'#262b30');g.fillStyle='#0c0d0f';g.fillRect(x-1,y-1,w+2,h+2);g.fillStyle=gr;g.fillRect(x,y,w,h);g.fillStyle='#0b0c0e';for(let xx=x+w*.1;xx<x+w*.55;xx+=Math.max(3,s*.06))g.fillRect(xx,y+h*.25,Math.max(1.5,s*.03),h*.5);circ(g,x+w*.92,cy,h*.06,'#33d17a');if(GL){GL.shadowColor='#33d17a';GL.shadowBlur=6;circ(GL,x+w*.92,cy,h*.08,'#33d17a');GL.shadowBlur=0}if(LEDS)LEDS.push({x:x+w*.92,y:cy,c:'#33d17a'});break}
      case 'pcie':{const [x,y,w,h]=B(.16,.82);g.fillStyle='#5c646b';g.fillRect(x,y,w,h);g.fillStyle='#9aa2a9';for(let yy=y;yy<y+h;yy+=5)g.fillRect(x,yy,w,2);break}
    }
  }
  function objGlow(k){
    const key='g:'+k;if(objCache.has(key))return objCache.get(key);
    const [wu,hu]=OBJ_SZ[k]||[1,1],W=Math.round(wu*PX),H=Math.round(hu*PX),c=mkCanvas(W,H),g=c.getContext('2d'),s=PX;g.fillStyle='#000';g.fillRect(0,0,W,H);
    const glow=(col,fn)=>{g.shadowColor=col;g.shadowBlur=10;g.fillStyle=col;fn();g.shadowBlur=0};
    switch(k){
      case 'router':glow('#2fbf6e',()=>{for(let x=W*.22;x<W*.78;x+=.24*s)g.fillRect(x,H*.46,.1*s,.06*s)});break;
      case 'modem':glow('#2fbf6e',()=>{for(let y=H*.14;y<H*.55;y+=.17*s)g.fillRect(W*.44,y,.07*s,.07*s)});break;
      case 'mini':glow('#5aa9ff',()=>circ(g,W*.88,H*.42,.05*s,'#5aa9ff'));break;
      case 'box':glow('#33d17a',()=>circ(g,W*.1,H*.45,.05*s,'#33d17a'));break;
      case 'pi':glow('#ff4a4a',()=>circ(g,W*.06,H*.12,.04*s,'#ff4a4a'));glow('#33d17a',()=>circ(g,W*.06,H*.26,.04*s,'#33d17a'));break;
      case 'ps5':glow('#4aa8ff',()=>g.fillRect(W*.07,H*.48,W*.27,.06*s));break;
      case 'ps4':glow('#f2f2f2',()=>circ(g,W*.06,H*.47,.05*s,'#f2f2f2'));glow('#3d7bff',()=>g.fillRect(W*.2,H*.45,W*.6,H*.06));break;
      case 'hnas':case 'hnas2':glow('#33d17a',()=>{for(let y=H*.07;y<H*.17;y+=.14*s)g.fillRect(W*.12,y,.08*s,.07*s)});break;
      case 'stream':glow('#ffffff',()=>circ(g,W*.88,H*.42,.04*s,'#ffffff'));break;
      case 'macmini':case 'studio':glow('#ffffff',()=>circ(g,W*.9,H*(k==='studio'?.82:.55),.035*s,'#ffffff'));break;
      case 'tower':glow('#ffffff',()=>circ(g,W*.07,H*.2,.07*s,'#f2f2f2'));break;
      case 'dock':glow('#e60012',()=>g.fillRect(W*.06,H*.88,W*.1,.04*s));break;
    }
    objCache.set(key,c);return c;
  }
  function objCanvas(k){
    if(objCache.has(k))return objCache.get(k);
    const [wu,hu]=OBJ_SZ[k]||[1,1],W=Math.round(wu*PX),H=Math.round(hu*PX),c=mkCanvas(W,H),g=c.getContext('2d'),s=PX;
    const lg=(a,b,vert=true)=>{const gr=vert?g.createLinearGradient(0,0,0,H):g.createLinearGradient(0,0,W,0);gr.addColorStop(0,a);gr.addColorStop(1,b);return gr};
    switch(k){
      case 'router':g.fillStyle=lg('#f3f4f5','#c8cdd1');rr(g,0,0,W,H,.14*s);g.fill();g.fillStyle='#2fbf6e';for(let x=W*.22;x<W*.78;x+=.24*s)g.fillRect(x,H*.46,.1*s,.06*s);break;
      case 'modem':g.fillStyle=lg('#e9ebec','#c3c8cc',false);rr(g,0,0,W,H,.08*s);g.fill();g.fillStyle='#2fbf6e';for(let y=H*.14;y<H*.55;y+=.17*s)g.fillRect(W*.44,y,.07*s,.07*s);break;
      case 'mini':g.fillStyle=lg('#3b4147','#25292d');rr(g,0,0,W,H,.06*s);g.fill();circ(g,W*.88,H*.42,.04*s,'#5aa9ff');break;
      case 'console':g.fillStyle='#f2f3f4';rr(g,0,0,W,H,.05*s);g.fill();g.fillStyle='#16181b';g.fillRect(0,H*.48,W,H*.52);g.fillStyle='#0d0e10';g.fillRect(W*.08,H*.3,W*.37,.04*s);break;
      case 'box':g.fillStyle=lg('#5d656c','#3a4046');rr(g,0,0,W,H,.06*s);g.fill();circ(g,W*.1,H*.45,.04*s,'#33d17a');break;
      case 'pi':g.fillStyle='#2e7d4f';g.fillRect(0,0,W,H);g.fillStyle='#c9ced3';g.fillRect(W*.81,H*.1,W*.19,H*.3);g.fillRect(W*.81,H*.6,W*.19,H*.3);g.fillStyle='#d8dcdf';g.fillRect(W*.53,H*.33,W*.18,H*.34);g.fillStyle='#14171a';g.fillRect(W*.1,H*.3,.25*s,.25*s);break;
      case 'ps5':g.fillStyle='#f4f5f6';rr(g,0,0,W,H,.4*s);g.fill();g.fillStyle='#121316';g.fillRect(0,H*.27,W,H*.46);g.fillStyle='#4aa8ff';g.shadowColor='#4aa8ff';g.shadowBlur=8;g.fillRect(W*.07,H*.48,W*.27,.05*s);g.shadowBlur=0;break;
      case 'ps4':g.fillStyle=lg('#2a2d31','#22252a');rr(g,0,0,W,H,.14*s);g.fill();g.fillStyle='#0d0e10';g.fillRect(0,H*.45,W,H*.1);circ(g,W*.06,H*.47,.04*s,'#f2f2f2');break;
      case 'hnas':case 'hnas2':{g.fillStyle=lg('#3b4147','#24282c');rr(g,0,0,W,H,.12*s);g.fill();const n=k==='hnas'?4:2,bw=(W*.82)/n;for(let i=0;i<n;i++){g.fillStyle='#2f353b';g.fillRect(W*.09+i*bw+2,H*.2,bw-6,H*.72);g.fillStyle='#0f1113';g.fillRect(W*.09+i*bw+bw-6,H*.2,4,H*.72)}g.fillStyle='#33d17a';for(let y=H*.07;y<H*.17;y+=.14*s)g.fillRect(W*.12,y,.08*s,.07*s);break}
      case 'stream':g.fillStyle=lg('#24272b','#0d0e10');rr(g,0,0,W,H,.1*s);g.fill();circ(g,W*.88,H*.42,.03*s,'#fff');break;
      case 'macmini':case 'studio':g.fillStyle=lg('#eceef0','#c3c8cc');rr(g,0,0,W,H,.16*s);g.fill();if(k==='studio'){g.fillStyle='#1d2024';[.12,.2].forEach(f=>{rr(g,W*f,H*.72,.16*s,.08*s,.03*s);g.fill()});g.fillStyle='#2a2d31';g.fillRect(W*.34,H*.72,.32*s,.06*s)}circ(g,W*.9,H*(k==='studio'?.82:.55),.03*s,'#f4f4f4');break;
      case 'tower':g.fillStyle=lg('#1d1f22','#0b0c0d');rr(g,0,0,W,H,.1*s);g.fill();g.fillStyle='#050506';g.fillRect(W*.2,H*.18,W*.6,.05*s);circ(g,W*.07,H*.2,.08*s,'#2a2c30');g.fillStyle='#2a2c30';rr(g,W*.04,H*.75,.4*s,.1*s,.03*s);g.fill();break;
      case 'dock':g.fillStyle=lg('#26282b','#121315');rr(g,0,0,W,H,.12*s);g.fill();g.fillStyle='#e60012';g.fillRect(W*.06,H*.88,W*.1,.03*s);g.fillStyle='#3a3d41';g.fillRect(W*.1,H*.06,W*.8,.05*s);break;
    }
    objCache.set(k,c);return c;
  }
  function itemsFor(z,dev,rowH){
    const n=z.n||1;
    switch(z.t){
      case 'logo':return dev.c?[{t:'logo',w:Math.max(.4,dev.c.length*.155+.12),h:.3}]:[];
      case 'gap':return [{t:'gap',w:0,h:0,flex:1}];
      case 'screen':return [{t:'screen',w:z.w,h:.4}];
      case 'grille':return [{t:'grille',w:z.w,h:rowH*.72}];
      case 'handle':return [{t:'handle',w:0,h:.22,flex:1}];
      case 'lace':return [{t:'lace',w:0,h:.1,flex:1}];
      case 'brush':return [{t:'brush',w:0,h:rowH*.58,flex:1}];
      case 'obj':return Array.from({length:n},()=>({t:'obj',k:z.k,w:(OBJ_SZ[z.k]||[1,1])[0],h:(OBJ_SZ[z.k]||[1,1])[1]}));
    }
    const sz=PORT_SZ[z.t];if(!sz)return [];
    const rows=z.rows||1,cols=Math.ceil(n/rows);
    return [{t:'ports',pt:z.t,k:z.k,n,rows,cols,pw:sz[0],ph:sz[1],w:cols*sz[0]+(cols-1)*.08,h:rows*sz[1]+(rows-1)*.07}];
  }
  function drawFace(dev,it,side,o){
    const h=it?hOf(it):dev.h,W=Math.round(10.86*PX*(o.chassis?CHW/PANEL:1)),H=Math.round(h*PX),c=mkCanvas(W,H),g=c.getContext('2d');
    const ports=[],objs=[],silver=dev.face==='silver',earW=o.ears?W*EAR:0;
    const gc=mkCanvas(W,H),gg=gc.getContext('2d');gg.fillStyle='#000';gg.fillRect(0,0,W,H);const pGL=GL,pL=LEDS,pF=FANS;GL=gg;LEDS=[];FANS=[];
    const bg=(o.chassis?CH_BG:FACE_BG)[dev.face]||FACE_BG.black;
    if(!o.transparent){const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,bg[0]);gr.addColorStop(1,bg[1]);g.fillStyle=gr;g.fillRect(0,0,W,H);g.fillStyle='rgba(255,255,255,.1)';g.fillRect(0,0,W,2);g.fillStyle='rgba(0,0,0,.45)';g.fillRect(0,H-2,W,2)}
    else if(o.ears){g.fillStyle=bg[1];g.fillRect(0,0,earW,H);g.fillRect(W-earW,0,earW,H);g.fillStyle='#3b4248';g.fillRect(earW,H-.12*PX,W-2*earW,.12*PX)}
    if(o.ears){
      g.fillStyle='rgba(0,0,0,.28)';g.fillRect(earW-1,0,2,H);g.fillRect(W-earW-1,0,2,H);
      for(let i=0;i<h;i++)[earW/2,W-earW/2].forEach(x=>{const y=(i+.5)*PX,r=.1*PX,gr=g.createRadialGradient(x-r*.3,y-r*.35,1,x,y,r);gr.addColorStop(0,'#e1e5e8');gr.addColorStop(.6,'#7d858c');gr.addColorStop(1,'#4d545a');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,7);g.fill();g.fillStyle='#3a3f44';g.fillRect(x-r*.6,y-r*.12,r*1.2,r*.24)});
    }
    const x0=earW+.14*PX,pw=W-2*earW-.28*PX,y0=.06*PX,ph=H-.12*PX;
    if(dev.custom){
      const p=(it&&it.panel)||{n:16,type:'xlr',labels:[]},tt=PP_TYPES[p.type]||PP_TYPES.xlr,totalRows=ppH(p)*tt.rows,per=Math.ceil(p.n/totalRows),rowH=ph/totalRows;
      const small=(p.type==='xlr'||p.type==='ecn')?[.36,.36]:p.type==='rj45'?[.22,.17]:(PORT_SZ[p.type]||[.3,.3]);
      for(let r=0;r<totalRows;r++){
        const a=r*per,b=Math.min(p.n,(r+1)*per),cnt=b-a;if(cnt<=0)continue;
        const cellW=Math.max(small[0],.5),gap=.14,tot=cnt*cellW+(cnt-1)*gap,k=tot*PX>pw?pw/(tot*PX):1,s=k*PX;
        let x=x0+(pw-tot*s)/2;const cy0=y0+rowH*(r+.5);
        for(let i=a;i<b;i++){
          const cx=x+cellW*s/2,py=cy0-.07*s;drawPart(g,p.type,cx,py,s,'pc',i,silver);ports.push({pi:i,t:p.type,u:cx/W,v:py/H});
          const lb=(p.labels||[])[i]||String(i+1);g.font=`500 ${Math.max(7,.12*s)}px "IBM Plex Mono",monospace`;g.textAlign='center';g.textBaseline='middle';
          const tw=Math.min(cellW*s,g.measureText(lb).width+4),ly=py+small[1]*s/2+2;g.fillStyle='#eceae2';g.fillRect(cx-tw/2,ly,tw,.14*s);
          g.save();g.beginPath();g.rect(cx-tw/2,ly,tw,.14*s);g.clip();g.fillStyle='#111';g.fillText(lb,cx,ly+.075*s);g.restore();
          x+=(cellW+gap)*s;
        }
      }
    } else {
      const z=dev[side]||[],rows=z.length?(Array.isArray(z[0])?z:[z]):[];
      const rowH=rows.length?ph/rows.length:ph;let pi=0;
      rows.forEach((row,ri)=>{
        const rh=rowH/PX,items=[];row.forEach(zz=>items.push(...itemsFor(zz,dev,rh)));
        const gaps=Math.max(0,items.length-1)*.14,fixed=items.reduce((a,b)=>a+b.w,0),nflex=items.filter(i=>i.flex).length,avail=pw/PX;
        let k=1,flexW=0;if(fixed+gaps>avail)k=Math.max(.3,(avail-gaps)/Math.max(fixed,.01));else if(nflex)flexW=(avail-fixed-gaps)/nflex;
        let x=x0;const cyRow=y0+rowH*(ri+.5),bottom=y0+rowH*(ri+1);
        items.forEach(itm=>{
          const w=(itm.flex?flexW:itm.w*k)*PX,hh=itm.h*k*PX,cy=o.open?bottom-hh/2-.13*PX:cyRow,s=k*PX;
          switch(itm.t){
            case 'logo':g.fillStyle=INK[dev.face]||INK.black;g.globalAlpha=.85;g.font=`700 ${.26*s}px "Barlow Condensed","Arial Narrow",sans-serif`;g.textBaseline='middle';g.textAlign='left';g.fillText(dev.c,x,cy);g.globalAlpha=1;break;
            case 'screen':g.fillStyle='#000';rr(g,x,cy-hh/2,w,hh,2);g.fill();g.fillStyle='#06110e';g.fillRect(x+2,cy-hh/2+2,w-4,hh-4);g.fillStyle='rgba(95,208,164,.55)';for(let yy=cy-hh/2+hh*.22;yy<cy+hh/2-hh*.22;yy+=4)g.fillRect(x+w*.1,yy,w*.8,1.2);gg.fillStyle='#0b2a22';gg.fillRect(x+2,cy-hh/2+2,w-4,hh-4);gg.fillStyle='#5fd0a4';for(let yy=cy-hh/2+hh*.22;yy<cy+hh/2-hh*.22;yy+=4)gg.fillRect(x+w*.1,yy,w*.8,1.2);LEDS.push({x:x+w/2,y:cy,c:'#5fd0a4',big:1});break;
            case 'grille':{g.fillStyle='rgba(0,0,0,.5)';rr(g,x,cy-hh/2,w,hh,2);g.fill();g.fillStyle=silver?'#2a2e33':'#090a0c';const st=.12*s;for(let xx=x+st*.25;xx<x+w-st*.3;xx+=st)g.fillRect(xx,cy-hh/2+2,.06*s,hh-4);break}
            case 'handle':{const gr=g.createLinearGradient(0,cy-hh/2,0,cy+hh/2);gr.addColorStop(0,'#c9ced2');gr.addColorStop(1,'#7d858c');g.fillStyle=gr;rr(g,x+w*.25,cy-hh/2,w*.5,hh,hh/2);g.fill();break}
            case 'lace':g.fillStyle='#9aa2a9';rr(g,x,cy-hh/2,w,hh,hh/2);g.fill();break;
            case 'brush':g.fillStyle='#0e1012';rr(g,x,cy-hh/2,w,hh,hh/2);g.fill();g.fillStyle='#262a2e';for(let xx=x+hh*.5;xx<x+w-hh*.5;xx+=3)g.fillRect(xx,cy-hh*.3,1,hh*.6);break;
            case 'obj':if(o.skipObjs)objs.push({k:itm.k,cx:(x+w/2)/W,cy:cy/H,w:w/W,h:hh/H});else{g.drawImage(objCanvas(itm.k),x,cy-hh/2,w,hh);gg.drawImage(objGlow(itm.k),x,cy-hh/2,w,hh)}break;
            case 'ports':{
              if(o.backing){g.fillStyle='#1c2024';rr(g,x-.06*s,cy-hh/2-.06*s,w+.12*s,hh+.12*s,.06*s);g.fill()}
              for(let q=0;q<itm.n;q++){const rI=Math.floor(q/itm.cols),cI=q%itm.cols,cx=x+(cI*(itm.pw+.08)+itm.pw/2)*s,py=cy-hh/2+(rI*(itm.ph+.07)+itm.ph/2)*s;
                drawPart(g,itm.pt,cx,py,s,itm.k,q,silver);if(PNAME[itm.pt])ports.push({pi:pi++,t:itm.pt,u:cx/W,v:py/H})}
              break}
          }
          x+=w+.14*PX;
        });
      });
    }
    if(o.tape&&state.tape&&it&&it.name){
      g.save();g.translate(W*.09,.05*PX);g.rotate(-1.2*Math.PI/180);g.font=`${.24*PX}px "Permanent Marker","Comic Sans MS",cursive`;
      const tw=Math.min(W*.44,g.measureText(it.name).width+.22*PX);g.fillStyle=it.tape||'#f2f0e9';g.shadowColor='rgba(0,0,0,.45)';g.shadowBlur=3;g.fillRect(0,0,tw,.3*PX);g.shadowBlur=0;
      g.fillStyle=DARK_TAPE.has(it.tape)?'#fff':'#141414';g.textBaseline='middle';g.textAlign='left';g.beginPath();g.rect(0,0,tw,.3*PX);g.clip();g.fillText(it.name,.11*PX,.16*PX);g.restore();
    }
    const leds=LEDS.map(l=>({u:l.x/W,v:l.y/H,c:l.c,big:l.big})),fans=FANS.map(f=>({u:f.x/W,v:f.y/H,r:f.r/W}));GL=pGL;LEDS=pL;FANS=pF;
    return {canvas:c,glow:gc,leds,fans,ports,objs,W,H};
  }
  function tex(c){const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=Math.min(8,R.renderer.capabilities.getMaxAnisotropy());return t}
  function face(dev,it,side,o){
    const key=[dev.id,side,dev.face,o.chassis?1:0,o.transparent?1:0,o.skipObjs?1:0,o.backing?1:0,o.tape&&state.tape&&it&&it.name?it.name+'|'+it.tape:'',JSON.stringify(dev.custom?(it&&it.panel):dev[side]),dev.c||'',it?hOf(it):dev.h].join('§');
    let f=faceCache.get(key);
    if(!f){if(faceCache.size>500){faceCache.forEach(v=>{v.tex.dispose();v.gtex.dispose()});faceCache.clear()}const d=drawFace(dev,it,side,o);f={...d,tex:tex(d.canvas),gtex:tex(d.glow)};faceCache.set(key,f)}
    return f;
  }
  function miscTex(k,make){if(misc.has(k))return misc.get(k);const t=tex(make());misc.set(k,t);return t}
  function railTex(units){return miscTex('rail'+units,()=>{const ppu=60,c=mkCanvas(24,units*ppu),g=c.getContext('2d'),gr=g.createLinearGradient(0,0,24,0);gr.addColorStop(0,'#7c858d');gr.addColorStop(.5,'#5c646c');gr.addColorStop(1,'#4a5157');g.fillStyle=gr;g.fillRect(0,0,24,c.height);
    g.fillStyle='#0a0b0d';for(let u=0;u<units;u++)[.143,.5,.857].forEach(f=>{rr(g,7,(u+f)*ppu-4.5,10,9,1.5);g.fill()});g.fillStyle='rgba(255,255,255,.22)';for(let u=0;u<=units;u++)g.fillRect(0,u*ppu,24,1);return c})}
  function numTex(units){return miscTex('num'+units,()=>{const ppu=60,c=mkCanvas(40,units*ppu),g=c.getContext('2d');g.fillStyle='#16191c';g.fillRect(0,0,40,c.height);g.fillStyle='#b4bdc5';g.font='500 22px "IBM Plex Mono",monospace';g.textAlign='center';g.textBaseline='middle';
    for(let u=units;u>=1;u--)g.fillText(String(u),20,(units-u+.5)*ppu);g.fillStyle='rgba(180,189,197,.3)';for(let i=1;i<units;i++)g.fillRect(6,i*ppu,28,1);return c})}
  function nameTex(rk){return miscTex('name'+rk.name+rk.units+rk.depth+state.sys,()=>{const c=mkCanvas(1024,88),g=c.getContext('2d');g.fillStyle='#e8ebee';g.font='700 54px "Barlow Condensed","Arial Narrow",sans-serif';g.textBaseline='middle';g.textAlign='left';
    g.fillText(rk.name.toUpperCase(),24,46,700);g.fillStyle='#9aa4ad';g.font='500 28px "IBM Plex Mono",monospace';g.textAlign='right';g.fillText(`${rk.units}U · ${fD(rk.depth)}`,1000,48);return c})}
  function blobTex(){return miscTex('blob',()=>{const c=mkCanvas(128,128),g=c.getContext('2d'),gr=g.createRadialGradient(64,64,4,64,64,64);gr.addColorStop(0,'rgba(0,0,0,.5)');gr.addColorStop(.6,'rgba(0,0,0,.22)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,128,128);return c})}

  /* ---------- scene setup ---------- */
  function init(){
    const renderer=new THREE.WebGLRenderer({antialias:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.outputEncoding=THREE.sRGBEncoding;
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,10,60000),controls=new THREE.OrbitControls(camera,renderer.domElement);
    controls.enableDamping=true;controls.dampingFactor=.09;controls.screenSpacePanning=true;controls.maxPolarAngle=Math.PI*.497;controls.minDistance=200;controls.maxDistance=20000;
    const hemi=new THREE.HemisphereLight(0xffffff,0x50565c,1.0);scene.add(hemi);
    const d1=new THREE.DirectionalLight(0xffffff,1.0);d1.position.set(1600,3200,2600);scene.add(d1);
    const d2=new THREE.DirectionalLight(0xdfe8ff,.55);d2.position.set(-2200,1800,-2600);scene.add(d2);
    const env=new THREE.Group(),root=new THREE.Group();scene.add(env,root);
    const S=(o)=>new THREE.MeshStandardMaterial(o);
    const M={case:S({color:C(0x24282c),roughness:.82,metalness:.05}),edge:S({color:C(0xb8bfc5),roughness:.35,metalness:.85}),chrome:S({color:C(0xd9dde0),roughness:.25,metalness:.9}),
      rail:S({color:C(0x5c646c),roughness:.45,metalness:.6}),wheel:S({color:C(0x151618),roughness:.7}),brick:S({color:C(0x1d2024),roughness:.6}),
      wall:S({color:C(0x39414a),roughness:.3,metalness:.1,transparent:true,opacity:.14,depthWrite:false,side:THREE.DoubleSide}),
      wallSolid:S({color:C(0x2a2f34),roughness:.8,metalness:.05}),
      proxy:new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,colorWrite:false})};
    M.blade=S({color:C(0x2a2e33),roughness:.55,metalness:.15,side:THREE.DoubleSide});M.guard=S({color:C(0x9aa2a9),roughness:.35,metalness:.8});M.hub=S({color:C(0x15171a),roughness:.5});
    R={hemi,d1,d2,fans:[],rainbow:[],renderer,scene,camera,controls,env,root,M,geoms:[],mats:[],pick:[],ports:new Map(),pending:[],devGroups:new Map(),rackGroups:new Map(),dirty:true,frameKey:null,wireFrom:null,wrap:null,raf:0};
    renderer.domElement.className='t3-canvas';
    controls.addEventListener('change',()=>{R.dirty=true});
    R.loop=()=>{const now=performance.now(),dt=Math.min(.05,(now-(R.lt||now))/1000);R.lt=now;if(R.tween)stepTween();animate(dt,now);const moved=controls.update();if(moved||R.dirty){renderer.render(scene,camera);R.dirty=false}};
    R.ro=new ResizeObserver(resize);
    R.h={chg:onUiChange,down:onDown,move:onMove,up:onUp,ui:onUiClick,dov:onDragOver,dlv:onDragLeave,drop:onDrop,key:onKey,leave:hideTip};
  }
  function resize(){if(!R||!R.wrap)return;const w=Math.max(10,R.wrap.clientWidth),h=Math.max(10,R.wrap.clientHeight);R.renderer.setSize(w,h,false);R.camera.aspect=w/h;R.camera.updateProjectionMatrix();R.dirty=true}
  function attach(wrap){
    if(R.wrap!==wrap){
      if(R.wrap)detach();
      R.wrap=wrap;wrap.insertBefore(R.renderer.domElement,wrap.firstChild);
      wrap.addEventListener('pointerdown',R.h.down,true);window.addEventListener('pointermove',R.h.move);window.addEventListener('pointerup',R.h.up);
      wrap.addEventListener('click',R.h.ui);wrap.addEventListener('change',R.h.chg);wrap.addEventListener('dragover',R.h.dov);wrap.addEventListener('dragleave',R.h.dlv);wrap.addEventListener('drop',R.h.drop);
      wrap.addEventListener('pointerleave',R.h.leave);document.addEventListener('keydown',R.h.key);
      R.ro.observe(wrap);resize();
    }
    R.renderer.setAnimationLoop(R.loop);
  }
  function detach(){
    const w=R.wrap;if(!w)return;
    w.removeEventListener('pointerdown',R.h.down,true);window.removeEventListener('pointermove',R.h.move);window.removeEventListener('pointerup',R.h.up);
    w.removeEventListener('click',R.h.ui);w.removeEventListener('change',R.h.chg);w.removeEventListener('dragover',R.h.dov);w.removeEventListener('dragleave',R.h.dlv);w.removeEventListener('drop',R.h.drop);
    w.removeEventListener('pointerleave',R.h.leave);document.removeEventListener('keydown',R.h.key);R.ro.disconnect();R.wrap=null;
  }
  function shellHTML(){return `<div class="t3wrap" id="t3wrap">
    <div class="t3-msg"><span>Loading 3D…</span></div>
    <div class="t3-top"><div class="seg mat" role="group" aria-label="What to show"><button data-t3site="0">This rack</button><button data-t3site="1">Whole site</button></div></div>
    <div class="t3-side" role="toolbar" aria-label="3D controls">
      <button class="fbtn mat" data-t3cam="34" title="Fit to view" aria-label="Fit to view">${I('scope')}</button>
      <button class="fbtn mat" data-pop="t3LightPop" title="Lighting" aria-label="Lighting" aria-haspopup="dialog">${I('lightbulb')}</button>
      <button class="fbtn mat" data-t3spin title="Spin" aria-label="Spin" aria-pressed="false">${I('rotate')}</button>
      <button class="fbtn mat" data-t3sound title="Fan sound" aria-label="Fan sound" aria-pressed="false">${I('speakerOff','ico off')}${I('speaker','ico on')}</button>
      <button class="fbtn mat zoombtn" data-zoomstep="1" title="Zoom in" aria-label="Zoom in">${I('plus')}</button>
      <button class="fbtn mat zoombtn" data-zoomstep="-1" title="Zoom out" aria-label="Zoom out">${I('minus')}</button>
    </div>
    <div class="t3-bottom"><div class="seg mat" role="group" aria-label="Camera"><button data-t3cam="34">Angle</button><button data-t3cam="front">Front</button><button data-t3cam="back">Back</button><button data-t3cam="side">Side</button><button data-t3cam="top">Top</button></div></div>
    <div class="pop mat" id="t3LightPop" role="dialog" aria-label="Lighting">
      <p class="pop-h">Room</p>
      <div class="seg" role="group" aria-label="Room lights"><button data-t3light="room">Lights on</button><button data-t3light="dim">Dim</button></div>
      <p class="pop-h">LED strip</p>
      <div class="swrow"><button class="swatch off" data-t3strip="off" style="--sw:transparent" aria-label="Off" title="Off"></button><button class="swatch" data-t3strip="white" style="--sw:#f4f1ea" aria-label="White" title="White"></button><button class="swatch" data-t3strip="blue" style="--sw:#3d7bff" aria-label="Blue" title="Blue"></button><button class="swatch" data-t3strip="purple" style="--sw:#a25bff" aria-label="Purple" title="Purple"></button><button class="swatch" data-t3strip="red" style="--sw:#ff3b3b" aria-label="Red" title="Red"></button><button class="swatch" data-t3strip="green" style="--sw:#2fe07a" aria-label="Green" title="Green"></button><button class="swatch" data-t3strip="amber" style="--sw:#ffa424" aria-label="Amber" title="Amber"></button><button class="swatch" data-t3strip="rainbow" style="--sw:conic-gradient(#ff3b3b,#ffa424,#ffe14d,#2fe07a,#3d7bff,#a25bff,#ff3b3b)" aria-label="Rainbow" title="Rainbow"></button></div>
      <p class="pop-h">Case sides</p>
      <div class="seg" role="group" aria-label="Case sides"><button data-t3walls="glass">Glass</button><button data-t3walls="solid">Solid</button><button data-t3walls="off">Open</button></div>
    </div>
    <div class="t3-tip" hidden></div><p class="t3-help" aria-live="polite"></p></div>`}
  function show(wrap){
    const msg=wrap.querySelector('.t3-msg');
    ensure().then(()=>{
      if(state.view!=='3d'||!document.body.contains(wrap))return;
      const first=!R||R.wrap!==wrap;if(!R)init();attach(wrap);if(msg)msg.hidden=true;build(first);
    }).catch(()=>{if(msg){msg.hidden=false;msg.innerHTML='<span>The 3D view couldn’t load. Reload the page and try again.</span><button class="btn" data-t3retry>Try again</button>';
      const b=msg.querySelector('[data-t3retry]');if(b)b.onclick=()=>{msg.innerHTML='<span>Loading 3D…</span>';show(wrap)}}});
  }
  function hide(){soundOff(true);if(!R)return;R.renderer.setAnimationLoop(null);detach();R.wireFrom=null;R.drag=null;R.down=null}

  /* ---------- building ---------- */
  const geo=g=>{R.geoms.push(g);return g};
  const mat=m=>{R.mats.push(m);return m};
  function box(w,h,d,x,y,z,m,parent,ud){const ms=new THREE.Mesh(geo(new THREE.BoxGeometry(w,h,d)),m);ms.position.set(x,y,z);if(ud)ms.userData=ud;(parent||R.root).add(ms);return ms}
  function plane(w,h,x,y,z,ry,m,parent,ud){const ms=new THREE.Mesh(geo(new THREE.PlaneGeometry(w,h)),m);ms.position.set(x,y,z);ms.rotation.y=ry||0;if(ud)ms.userData=ud;(parent||R.root).add(ms);return ms}
  function clear(){
    [R.root,R.env].forEach(gp=>{while(gp.children.length)gp.remove(gp.children[0])});
    R.geoms.forEach(g=>g.dispose());R.mats.forEach(m=>m.dispose());R.geoms=[];R.mats=[];R.pick=[];R.ports.clear();R.pending=[];R.devGroups.clear();R.rackGroups.clear();R.fans=[];R.rainbow=[];
  }
  function build(now){if(!R||!R.wrap)return;if(now){cancelAnimationFrame(R.raf);R.raf=0;doBuild();return}if(R.raf)return;R.raf=requestAnimationFrame(()=>{R.raf=0;doBuild()})}
  function doBuild(){
    if(!R||!R.wrap)return;
    clear();
    const t=T(),bg=tok('--bg');
    const dimR=t.light==='dim',bgc=dimR?'#07090b':bg;
    R.scene.background=new THREE.Color(bgc);R.scene.fog=new THREE.Fog(bgc,dimR?7000:12000,dimR?20000:30000);
    R.hemi.intensity=dimR?.14:1.0;R.hemi.color.set(dimR?0x8fa4c8:0xffffff);R.d1.intensity=dimR?.06:1.0;R.d2.intensity=dimR?.05:.55;
    const floor=plane(40000,40000,0,0,0,0,mat(new THREE.MeshStandardMaterial({color:C(dimR?'#16191d':tok('--panel-2')),roughness:1})),R.env);floor.rotation.x=-Math.PI/2;
    const lc=C(dimR?'#232931':tok('--line')),grid=new THREE.GridHelper(40000,160,lc,lc);grid.position.y=.5;grid.material.transparent=true;grid.material.opacity=.55;R.geoms.push(grid.geometry);R.mats.push(grid.material);R.env.add(grid);
    const racks=t.site?state.racks:[rack()],sp=CASEW+360;
    racks.forEach((rk,i)=>buildRack(rk,(i-(racks.length-1)/2)*sp,t.site&&racks.length>1&&rk.id===state.active));
    R.root.updateMatrixWorld(true);
    R.pending.forEach(p=>{R.ports.set(p.key,{p:p.g.localToWorld(p.local.clone()),n:new THREE.Vector3(0,0,p.nz).transformDirection(p.g.matrixWorld),rack:p.rack.id,rx:p.rx,t:p.t})});
    const selC=findCable(ui.selCable),len0=selC&&selC.len;
    if(state.cables!==false||state.mode==='wire')buildCables(t);
    highlights(racks);
    if(selC&&selC.len!==len0)setTimeout(renderInsp,0);
    uiSync();
    const key=t.site?'site:'+state.racks.map(r=>r.id+':'+r.units).join(','):'rack:'+rack().id+':'+rack().units+':'+rack().depth;
    if(key!==R.frameKey){R.frameKey=key;frame('34',false)}
    R.dirty=true;
  }
  function buildRack(rk,x,active){
    const G=new THREE.Group();G.position.x=x;R.root.add(G);R.rackGroups.set(rk.id,G);
    const H=rk.units*UM,D=rk.depth,zF=70,zB=-D-70,L=zF-zB,zc=(zF+zB)/2,yT=BASE+H,ud={kind:'rack',rack:rk.id},pk=m=>{R.pick.push(m);return m},M=R.M,t=T();
    pk(box(CASEW,50,L,0,BASE-25,zc,M.case,G,ud));pk(box(CASEW,50,L,0,yT+25,zc,M.case,G,ud));
    if(t.walls!=='off')[-1,1].forEach(s=>{const w=box(9,H,L-4,s*(WALLX+4.5),BASE+H/2,zc,t.walls==='solid'?M.wallSolid:M.wall,G);if(t.walls==='solid'){w.userData=ud;R.pick.push(w)}});
    const e=14,ex=CASEW/2-e/2+1;
    [[-1,zF-e/2+1],[1,zF-e/2+1],[-1,zB+e/2-1],[1,zB+e/2-1]].forEach(([s,z])=>pk(box(e,H+100,e,s*ex,BASE+H/2,z,M.edge,G,ud)));
    [BASE-50+e/2,yT+50-e/2].forEach(y=>{[zF-e/2+1,zB+e/2-1].forEach(z=>pk(box(CASEW,e,e,0,y,z,M.edge,G,ud)));[-1,1].forEach(s=>pk(box(e,e,L,s*ex,y,zc,M.edge,G,ud)))});
    [-1,1].forEach(s=>[BASE-50+13,yT+50-13].forEach(y=>[zF-13,zB+13].forEach(z=>box(28,28,28,s*(CASEW/2-12),y,z,M.chrome,G))));
    [-1,1].forEach(s=>[zF-60,zB+60].forEach(z=>{const w=new THREE.Mesh(geo(new THREE.CylinderGeometry(34,34,26,20)),M.wheel);w.rotation.z=Math.PI/2;w.position.set(s*(CASEW/2-70),34,z);G.add(w);box(64,8,64,s*(CASEW/2-70),68,z,M.chrome,G)}));
    const rf=mat(new THREE.MeshStandardMaterial({map:railTex(rk.units),metalness:.55,roughness:.45})),rl=M.rail;
    [-1,1].forEach(s=>{box(16,H,24,s*233,BASE+H/2,-12,[rl,rl,rl,rl,rf,rl],G);box(16,H,24,s*233,BASE+H/2,-D+12,[rl,rl,rl,rl,rl,rf],G)});
    const nm=mat(new THREE.MeshBasicMaterial({map:numTex(rk.units)}));plane(22,H,-259,BASE+H/2,1,0,nm,G);plane(22,H,259,BASE+H/2,-D-1,Math.PI,nm,G);
    const pm=mat(new THREE.MeshBasicMaterial({map:nameTex(rk),transparent:true}));plane(540,46,0,yT+25,zF+.8,0,pm,G);plane(540,46,0,yT+25,zB-.8,Math.PI,pm,G);
    const sh=plane(CASEW*1.5,L*1.35,0,1,zc,0,mat(new THREE.MeshBasicMaterial({map:blobTex(),transparent:true,depthWrite:false})),G);sh.rotation.x=-Math.PI/2;sh.userData.noFrame=true;
    if(active){const ln=new THREE.LineSegments(geo(new THREE.EdgesGeometry(new THREE.PlaneGeometry(CASEW+80,L+80))),mat(new THREE.LineBasicMaterial({color:C(tok('--accent'))})));ln.rotation.x=-Math.PI/2;ln.position.set(0,2,zc);G.add(ln)}
    const sc=STRIPS[t.strip||'off'];
    if(sc){const dimR=t.light==='dim',col=sc==='rainbow'?0xff3366:sc,sm=mat(new THREE.MeshBasicMaterial({color:C(col)}));if(sc==='rainbow')R.rainbow.push(sm.color);
      [zF-22,zB+22].forEach(z=>{box(CASEW-60,5,7,0,yT-5,z,sm,G);box(CASEW-60,5,7,0,BASE+5,z,sm,G)});
      [-1,1].forEach(sx=>box(5,H-20,7,sx*(WALLX-10),BASE+H/2,zF-22,sm,G));
      [[0,yT-60,zF-60],[0,yT-60,zB+60],[0,BASE+40,zc]].forEach(([lx,ly,lz],i)=>{const L=new THREE.PointLight(col,dimR?(i<2?1.5:.9):.45,dimR?2200:1500,2);L.position.set(lx,ly,lz);G.add(L);if(sc==='rainbow')R.rainbow.push(L.color)})}
    rk.items.forEach(it=>buildDevice(rk,it,G));
  }
  function handles(g,yc,Hm){[-1,1].forEach(s=>{const x=s*(PANEL/2-13.5),y1=yc-Hm*.36,y2=yc+Hm*.36,V=THREE.Vector3;
    g.add(new THREE.Mesh(geo(new THREE.TubeGeometry(rounded([new V(x,y1,3),new V(x,y1,26),new V(x,y2,26),new V(x,y2,3)],8),30,4,8,false)),R.M.chrome))})}
  function buildDevice(rk,it,G){
    const dev=devOf(it);if(!dev)return;
    const h=hOf(it),Hm=h*UM-.8,y0=BASE+(it.u-1)*UM+.4,yc=y0+Hm/2,d=Math.max(8,Math.min(dev.d,rk.depth+40));
    const g=new THREE.Group();g.userData={item:it.id};G.add(g);R.devGroups.set(it.id,g);
    const dim=!!(ui.hl&&it.group!==ui.hl),ud=f=>({kind:'dev',item:it.id,faces:f}),V=THREE.Vector3;
    const mk=o=>{const m=mat(new THREE.MeshStandardMaterial(o));if(dim){m.transparent=true;m.opacity=.18;m.depthWrite=false}return m};
    const edgeM=mk({color:C({black:0x1f2327,grey:0x474e56,silver:0xc3c9ce}[dev.face]||0x1f2327),roughness:.5,metalness:.35});
    const bodyM=mk({color:C({black:0x262b30,grey:0x3c434a,silver:0xa9b0b6}[dev.face]||0x262b30),roughness:.6,metalness:.3});
    const dimR=T().light==='dim',gI=dimR?1.7:.7;
    const faceM=f=>mk({map:f.tex,roughness:.48,metalness:.2,emissive:0xffffff,emissiveMap:f.gtex,emissiveIntensity:gI});
    const fx=(F,fn,nz,rw)=>addFx(g,F,fn,nz,rw,dimR,dim);
    const port=(face,F,fn,nz)=>F.ports.forEach(p=>R.pending.push({key:`${it.id}:${face}:${p.pi}`,g,local:fn(p.u,p.v),nz,rack:rk,rx:G.position.x,t:p.t}));
    const hasRear=!!(dev.custom||(dev.rear&&dev.rear.length));
    if(!dev.open){
      const F=face(dev,it,'front',{ears:true,tape:true});
      R.pick.push(box(PANEL,Hm,3,0,yc,1.5,[edgeM,edgeM,edgeM,edgeM,faceM(F),edgeM],g,ud({4:{face:'front',F}})));
      port('front',F,(u,v)=>new V(-PANEL/2+u*PANEL,yc+Hm/2-v*Hm,3.5),1);fx(F,(u,v,z)=>new V(-PANEL/2+u*PANEL,yc+Hm/2-v*Hm,3+z),1,PANEL);
      if(dev.handles&&h>1)handles(g,yc,Hm);
      if(dev.id==='lamp'){const wm=mat(new THREE.MeshBasicMaterial({color:C(0xffe7bf)}));box(PANEL*.62,4,8,0,y0+2,-4,wm,g);const L=new THREE.PointLight(0xffe2b0,dimR?2.2:.5,dimR?1700:900,2);L.position.set(0,y0-30,-120);g.add(L)}
      if(d>15){
        const CF=hasRear?face(dev,it,'rear',{chassis:true,tape:true}):null;
        R.pick.push(box(CHW,Hm-1.5,d,0,yc,-d/2,[bodyM,bodyM,bodyM,bodyM,bodyM,CF?faceM(CF):bodyM],g,ud(CF?{5:{face:'rear',F:CF}}:{})));
        if(CF){port('rear',CF,(u,v)=>new V(CHW/2-u*CHW,yc+Hm/2-v*Hm,-d-.5),-1);fx(CF,(u,v,z)=>new V(CHW/2-u*CHW,yc+Hm/2-v*Hm,-d-z),-1,CHW)}
      }
    } else {
      const F=face(dev,it,'front',{ears:true,transparent:true,skipObjs:true,open:true,tape:true});
      R.pick.push(plane(PANEL,Hm,0,yc,1.5,0,mk({map:F.tex,transparent:true,alphaTest:.05,roughness:.5,metalness:.2,side:THREE.DoubleSide}),g,ud({0:{face:'front',F}})));
      port('front',F,(u,v)=>new V(-PANEL/2+u*PANEL,yc+Hm/2-v*Hm,2.5),1);
      R.pick.push(box(CHW+12,3,d,0,y0+1.5,-d/2,bodyM,g,ud({})));
      let back=0;
      F.objs.forEach(o=>{
        const w=o.w*PANEL,hh=o.h*Hm,cx=-PANEL/2+o.cx*PANEL,od=Math.max(30,Math.min(d-16,OBJ_DEPTH[o.k]||200));back=Math.max(back,od+8);
        const sm=mk({color:C(OBJ_COL[o.k]||0x333333),roughness:.45,metalness:.1}),om=mk({map:tex2(o.k),roughness:.45,metalness:.1,emissive:0xffffff,emissiveMap:tex3(o.k),emissiveIntensity:gI});
        R.pick.push(box(w,hh,od,cx,y0+3+hh/2,-od/2-8,[sm,sm,sm,sm,om,sm],g,ud({})));
        if(o.k==='router')[.1,.46,.82].forEach(f=>{const a=new THREE.Mesh(geo(new THREE.CylinderGeometry(2.6,2.6,1.1*UM,8)),R.M.wheel);a.position.set(cx-w/2+f*w,y0+3+hh+1.1*UM/2,-od*.8);g.add(a)});
      });
      if(hasRear){
        const C=face(dev,it,'rear',{chassis:true,transparent:true,backing:true}),zb=-(back||d)-1;
        R.pick.push(plane(CHW,Hm,0,yc,zb,Math.PI,mk({map:C.tex,transparent:true,alphaTest:.05,side:THREE.DoubleSide}),g,ud({0:{face:'rear',F:C}})));
        port('rear',C,(u,v)=>new V(CHW/2-u*CHW,yc+Hm/2-v*Hm,zb-.5),-1);
      }
    }
    if(it.mount==='rear'){g.rotation.y=Math.PI;g.position.z=-rk.depth}
  }
  function tex2(k){return miscTex('obj:'+k,()=>objCanvas(k))}
  function tex3(k){return miscTex('objg:'+k,()=>objGlow(k))}
  function haloTex(){return miscTex('halo',()=>{const c=mkCanvas(64,64),g=c.getContext('2d'),gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.25,'rgba(255,255,255,.55)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);return c})}
  function makeFan(r){
    const grp=new THREE.Group(),rot=new THREE.Group(),n=7;
    for(let i=0;i<n;i++){const pv=new THREE.Group(),bl=new THREE.Mesh(geo(new THREE.BoxGeometry(r*.6,r*.34,1.4)),R.M.blade);bl.position.x=r*.52;bl.rotation.x=.5;pv.rotation.z=i*Math.PI*2/n;pv.add(bl);rot.add(pv)}
    const hub=new THREE.Mesh(geo(new THREE.CylinderGeometry(r*.28,r*.28,7,18)),R.M.hub);hub.rotation.x=Math.PI/2;rot.add(hub);
    rot.position.z=-2;grp.add(rot);
    [.97,.66,.36].forEach(k=>{const tr=new THREE.Mesh(geo(new THREE.TorusGeometry(r*k,Math.max(.8,r*.025),5,36)),R.M.guard);tr.position.z=2.5;grp.add(tr)});
    [0,Math.PI/2].forEach(a=>{const sp=new THREE.Mesh(geo(new THREE.BoxGeometry(r*1.94,Math.max(1.2,r*.04),1.2)),R.M.guard);sp.rotation.z=a+Math.PI/4;sp.position.z=2.5;grp.add(sp)});
    rot.userData.k=.85+Math.random()*.3;R.fans.push(rot);return grp;
  }
  function addFx(g,F,fn,nz,rw,dimR,dimDev){
    (F.fans||[]).forEach(f=>{const r=f.r*rw;if(r<4)return;const fg=makeFan(r*.94);fg.position.copy(fn(f.u,f.v,nz>0?3:4));if(nz<0)fg.rotation.y=Math.PI;g.add(fg)});
    if(!dimR||dimDev||!(F.leds&&F.leds.length))return;
    const pos=[],col=[];F.leds.forEach(l=>{const p=fn(l.u,l.v,1.5);pos.push(p.x,p.y,p.z);const c=new THREE.Color(l.c);col.push(c.r,c.g,c.b)});
    const bg=geo(new THREE.BufferGeometry());bg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));bg.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
    const pm=mat(new THREE.PointsMaterial({size:16,map:haloTex(),vertexColors:true,transparent:true,opacity:.9,depthWrite:false,blending:THREE.AdditiveBlending,sizeAttenuation:true}));
    g.add(new THREE.Points(bg,pm));
  }

  /* ---------- cables ---------- */
  function rounded(pts,rad){
    const P=[];pts.forEach(p=>{if(!P.length||P[P.length-1].distanceTo(p)>.5)P.push(p.clone())});
    const path=new THREE.CurvePath();if(P.length<2){P.push(P[0].clone().add(new THREE.Vector3(0,-1,0)))}
    let prev=P[0];
    for(let i=1;i<P.length-1;i++){
      const a=P[i-1],p=P[i],b=P[i+1],da=p.clone().sub(a),db=b.clone().sub(p),la=da.length(),lb=db.length();
      const r=Math.min(rad,la/2,lb/2),p1=p.clone().addScaledVector(da.normalize(),-r),p2=p.clone().addScaledVector(db.normalize(),r);
      if(prev.distanceTo(p1)>.3)path.add(new THREE.LineCurve3(prev,p1));
      path.add(new THREE.QuadraticBezierCurve3(p1,p.clone(),p2));prev=p2;
    }
    path.add(new THREE.LineCurve3(prev,P[P.length-1]));return path;
  }
  function pathFor(o,r){
    const {c,A,B}=o,V=THREE.Vector3,nA=A.n,nB=B.n,managed=c.route==='managed',lane=o.lane||0,step=r*2.5;
    if(A.rack!==B.rack){
      const a1=A.p.clone().addScaledVector(nA,40),b1=B.p.clone().addScaledVector(nB,40),fy=18+lane*step;
      return rounded([A.p,a1,new V(a1.x,fy,a1.z),new V(b1.x,fy,a1.z),new V(b1.x,fy,b1.z),b1,B.p],60);
    }
    const side=o.side,rx=A.rx;
    if(nA.z*nB.z>0){
      const out=22+(managed?(lane%6)*step:0),a1=A.p.clone().addScaledVector(nA,out),b1=B.p.clone().addScaledVector(nB,out);
      if(managed){
        const drop=12+Math.floor(lane/6)*step;
        if(Math.abs(A.p.y-B.p.y)<UM*.6){const yl=Math.min(A.p.y,B.p.y)-drop;return rounded([A.p,a1,new V(a1.x,yl,a1.z),new V(b1.x,yl,a1.z),b1,B.p],r*4)}
        const chX=rx+side*(248+Math.min(28,(lane%6)*step*.7));
        return rounded([A.p,a1,new V(a1.x,A.p.y-drop,a1.z),new V(chX,A.p.y-drop,a1.z),new V(chX,B.p.y-drop,a1.z),new V(b1.x,B.p.y-drop,a1.z),b1,B.p],r*4);
      }
      const dist=A.p.distanceTo(B.p),sag=30+dist*.22,bd=c.bend||{},mid=a1.clone().add(b1).multiplyScalar(.5);
      mid.y-=sag+(bd.dy||0)*UM;mid.x+=(bd.dx||0)*UM;mid.z+=nA.z*Math.min(70,dist*.06);
      return new THREE.CatmullRomCurve3([A.p,a1,mid,b1,B.p],false,'centripetal');
    }
    const chX=rx+side*(262+Math.min(14,lane*step*.5)),a1=A.p.clone().addScaledVector(nA,30),b1=B.p.clone().addScaledVector(nB,30);
    if(managed)return rounded([A.p,a1,new V(a1.x,A.p.y-14,a1.z),new V(chX,A.p.y-14,a1.z),new V(chX,B.p.y-14,a1.z),new V(chX,B.p.y-14,b1.z),new V(b1.x,B.p.y-14,b1.z),b1,B.p],r*4);
    const yA=A.p.y-40,yB=B.p.y-40;
    return new THREE.CatmullRomCurve3([A.p,a1,new V(chX,yA,a1.z+nA.z*10),new V(chX,(yA+yB)/2-70,(a1.z+b1.z)/2),new V(chX,yB,b1.z+nB.z*10),b1,B.p],false,'centripetal');
  }
  function stubPath(P){const V=THREE.Vector3,a1=P.p.clone().addScaledVector(P.n,40),s=(P.p.x-P.rx)<0?-1:1;return rounded([P.p,a1,new V(a1.x,30,a1.z),new V(a1.x,30,a1.z+P.n.z*160),new V(a1.x+s*120,30,a1.z+P.n.z*260)],50)}
  function buildCables(t){
    const list=t.site?allCables():cablesOf(rack()).concat(linksOf(rack())),items=[],lanes={};
    list.forEach(c=>{const A=R.ports.get(keyOf(c.a)),B=R.ports.get(keyOf(c.b));if(A||B)items.push({c,A,B,ci:cableInfo(c)})});
    items.forEach(o=>{if(!(o.A&&o.B))return;const lx=((o.A.p.x-o.A.rx)+(o.B.p.x-o.B.rx))/2;o.side=lx<0?-1:1;
      const k=o.A.rack===o.B.rack?o.A.rack+':'+o.side+':'+(o.A.n.z>0)+(o.B.n.z>0):'link';(lanes[k]=lanes[k]||[]).push(o)});
    Object.values(lanes).forEach(arr=>arr.sort((a,b)=>Math.abs(a.A.p.y-a.B.p.y)-Math.abs(b.A.p.y-b.B.p.y)).forEach((o,i)=>o.lane=i));
    items.forEach(o=>{
      const {c,A,B,ci}=o,r=Math.max(1.5,2.3*ci.T.w),curve=A&&B?pathFor(o,r):stubPath(A||B),len=curve.getLength();
      if(A&&B)c.len=Math.round(len);
      const segs=Math.max(24,Math.min(280,Math.round(len/9))),sel=ui.selCable===c.id;
      const m=mat(new THREE.MeshStandardMaterial({color:C(c.color||ci.T.col),roughness:.5,metalness:.05}));
      if(sel){m.emissive=C(0xffd23f);m.emissiveIntensity=.6}else if(ci.mismatch){m.emissive=C(0xf06262);m.emissiveIntensity=.35}
      R.root.add(new THREE.Mesh(geo(new THREE.TubeGeometry(curve,segs,r,8,false)),m));
      const px=new THREE.Mesh(geo(new THREE.TubeGeometry(curve,Math.max(12,segs>>2),Math.max(9,r*2.6),5,false)),R.M.proxy);px.userData={kind:'cable',cid:c.id};R.root.add(px);R.pick.push(px);
      [A,B].forEach(P=>{if(!P)return;const rect=ci.T.plug==='rect',L=20,ctr=P.p.clone().addScaledVector(P.n,L/2);
        if(rect)box(r*2.8,r*3.4,L,ctr.x,ctr.y,ctr.z,m);else{const cy=new THREE.Mesh(geo(new THREE.CylinderGeometry(r*1.7,r*1.7,L,12)),m);cy.rotation.x=Math.PI/2;cy.position.copy(ctr);R.root.add(cy)}});
      if(ci.T.brick&&A&&B){const mp=curve.getPointAt(.5);box(r*16,r*9,r*24,mp.x,mp.y,mp.z,R.M.brick)}
      if(!(A&&B)){const end=curve.getPointAt(1),tg=curve.getTangentAt(1),cone=new THREE.Mesh(geo(new THREE.ConeGeometry(r*3,r*7,12)),m);cone.position.copy(end);cone.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),tg.normalize());R.root.add(cone)}
    });
  }
  function highlights(racks){
    const add=(g,col)=>{const b=new THREE.Box3().setFromObject(g);b.expandByScalar(5);const hp=new THREE.Box3Helper(b,col);R.geoms.push(hp.geometry);R.mats.push(hp.material);R.root.add(hp)};
    racks.forEach(rk=>overlaps(rk).ids.forEach(id=>{const g=R.devGroups.get(id);if(g)add(g,C(0xf06262))}));
    if(ui.sel&&R.devGroups.get(ui.sel))add(R.devGroups.get(ui.sel),C(tok('--accent')));
    if(R.wireFrom){const P=R.ports.get(keyOf(R.wireFrom));if(P){const s=new THREE.Mesh(geo(new THREE.SphereGeometry(9,16,12)),mat(new THREE.MeshBasicMaterial({color:C(0xffd23f)})));s.position.copy(P.p).addScaledVector(P.n,8);R.root.add(s)}else R.wireFrom=null}
  }
  function uiSync(){
    const w=R.wrap;if(!w)return;const t=T();
    w.querySelectorAll('[data-t3site]').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.t3site==='1')===!!t.site)));
    w.querySelectorAll('[data-t3walls]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.t3walls===t.walls)));
    const sp=w.querySelector('[data-t3spin]');if(sp)sp.setAttribute('aria-pressed',String(!!t.spin));
    R.controls.autoRotate=!!t.spin;R.controls.autoRotateSpeed=1.1;
    w.querySelectorAll('[data-t3light]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.t3light===(t.light||'room'))));
    w.querySelectorAll('[data-t3strip]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.t3strip===(t.strip||'off'))));const sb=w.querySelector('[data-t3sound]');if(sb)sb.setAttribute('aria-pressed',String(!!AUD.on));
    const help=w.querySelector('.t3-help');
    const helpTxt=state.mode==='wire'?(R.wireFrom?`From ${endName(R.wireFrom)} · now tap the port to connect it to · Esc cancels`:'Wire mode · Tap a port, then tap another port to connect them · Tap a cable to edit it')
      :(matchMedia('(pointer:coarse)').matches?'Drag to turn · Pinch to zoom · Two fingers to pan · Tap a device to select it':'Drag to turn · Scroll to zoom · Right-drag to pan · Click a device to select it, then drag it up or down');
    if(help&&helpTxt!==R.helpTxt){R.helpTxt=helpTxt;help.textContent=helpTxt;help.classList.add('show');clearTimeout(R.helpT);R.helpT=setTimeout(()=>help.classList.remove('show'),state.mode==='wire'?7000:4500)}
  }

  function animate(dt,now){
    if(R.fans.length){const sp=(REDUCED?1.5:15)*dt;R.fans.forEach(f=>{f.rotation.z+=sp*f.userData.k});R.dirty=true}
    if(R.rainbow.length){const h=(now/1000*.07)%1;R.rainbow.forEach(c=>c.setHSL(h,1,.55));R.dirty=true}
    audioTick(now);
  }
  function onUiChange(e){const el=e.target;if(el&&el.matches('[data-t3strip]')){T().strip=el.value;save();build();if(el.value!=='off'&&T().light!=='dim')toast('Tip: switch to Dim to see the LED strip glow.')}}
  /* ---------- fan sound (Web Audio) ---------- */
  const AUD={ctx:null,master:null,bp:null,on:false,last:0};
  function audioGraph(){
    const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return false;
    const ctx=new Ctx(),len=ctx.sampleRate*3,buf=ctx.createBuffer(2,len,ctx.sampleRate);
    for(let ch=0;ch<2;ch++){const d=buf.getChannelData(ch);let last=0;for(let i=0;i<len;i++){const w=Math.random()*2-1;last=(last+.02*w)/1.02;d[i]=last*3.2+w*.06}}
    const src=ctx.createBufferSource();src.buffer=buf;src.loop=true;
    const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.frequency.value=260;bp.Q.value=.55;
    const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1800;
    const master=ctx.createGain();master.gain.value=0;
    const hum=ctx.createOscillator();hum.type='sine';hum.frequency.value=118;const hg=ctx.createGain();hg.gain.value=.05;
    const hum2=ctx.createOscillator();hum2.type='triangle';hum2.frequency.value=236;const hg2=ctx.createGain();hg2.gain.value=.018;
    const lfo=ctx.createOscillator();lfo.frequency.value=.23;const lg=ctx.createGain();lg.gain.value=18;lfo.connect(lg);lg.connect(bp.frequency);
    src.connect(bp);bp.connect(lp);lp.connect(master);hum.connect(hg);hg.connect(master);hum2.connect(hg2);hg2.connect(master);master.connect(ctx.destination);
    src.start();hum.start();hum2.start();lfo.start();
    Object.assign(AUD,{ctx,master,bp,hum,hum2});return true;
  }
  function soundOn(){
    if(!AUD.ctx&&!audioGraph()){toast('Sound isn’t supported in this browser.');return}
    AUD.ctx.resume();AUD.on=true;AUD.last=0;
    const n=R?R.fans.length:0;toast(n?`Playing ${n} fan${n>1?'s':''}. Zoom in to hear them louder.`:'No fans in view yet. Amps, servers, PCs, the NAS, UPS and fan trays have fans.');
  }
  function soundOff(silent){if(!AUD.ctx)return;AUD.on=false;const t0=AUD.ctx.currentTime;AUD.master.gain.cancelScheduledValues(t0);AUD.master.gain.setTargetAtTime(0,t0,.08);setTimeout(()=>{if(!AUD.on&&AUD.ctx)AUD.ctx.suspend()},400);if(!silent&&R&&R.wrap)uiSync()}
  function audioTick(now){
    if(!AUD.on||!AUD.ctx||now-AUD.last<150)return;AUD.last=now;
    const n=R.fans.length,dist=R.camera.position.distanceTo(R.controls.target),near=Math.max(.2,Math.min(1.5,2600/dist));
    const vol=n?Math.min(.34,.05+.016*n)*near:0,t0=AUD.ctx.currentTime;
    AUD.master.gain.setTargetAtTime(vol,t0,.25);AUD.bp.frequency.setTargetAtTime(220+Math.min(220,n*7),t0,.4);
    AUD.hum.frequency.setTargetAtTime(110+Math.min(60,n*2),t0,.4);AUD.hum2.frequency.setTargetAtTime(2*(110+Math.min(60,n*2)),t0,.4);
  }
  /* ---------- camera ---------- */
  function frame(k,anim){
    const bx=new THREE.Box3(),bb=new THREE.Box3();R.root.updateMatrixWorld(true);R.rackGroups.forEach(G=>G.traverse(o=>{if(o.isMesh&&!o.userData.noFrame){if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();bb.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld);bx.union(bb)}}));if(bx.isEmpty())return;
    const sph=bx.getBoundingSphere(new THREE.Sphere()),cam=R.camera,vf=cam.fov*Math.PI/180,hf=2*Math.atan(Math.tan(vf/2)*cam.aspect),f=Math.min(vf,hf);
    const dist=sph.radius/Math.sin(f/2)*1.0,dir=new THREE.Vector3(...(DIRS[k]||DIRS['34'])).normalize(),pos=sph.center.clone().addScaledVector(dir,dist),tgt=sph.center.clone();
    if(anim)R.tween={p0:cam.position.clone(),q0:R.controls.target.clone(),p1:pos,q1:tgt,s:performance.now(),d:650};
    else{cam.position.copy(pos);R.controls.target.copy(tgt);R.controls.update()}
    R.dirty=true;
  }
  function stepTween(){const w=R.tween,k=Math.min(1,(performance.now()-w.s)/w.d),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;R.camera.position.lerpVectors(w.p0,w.p1,e);R.controls.target.lerpVectors(w.q0,w.q1,e);R.dirty=true;if(k>=1)R.tween=null}

  /* ---------- picking & interaction ---------- */
  const rc=()=>R.rc||(R.rc=new THREE.Raycaster());
  function ray(x,y){const r=R.renderer.domElement.getBoundingClientRect(),ndc=new THREE.Vector2(((x-r.left)/r.width)*2-1,-((y-r.top)/r.height)*2+1);rc().setFromCamera(ndc,R.camera);return rc()}
  function nearPort(fi,uv,touch){const cu=uv.x,cv=1-uv.y,th=(touch?.5:.32)*PX;let best=null,bd=th;
    for(const p of fi.F.ports){const d=Math.hypot((p.u-cu)*fi.F.W,(p.v-cv)*fi.F.H);if(d<bd){bd=d;best=p}}return best?{face:fi.face,pi:best.pi,t:best.t}:null}
  function pick(x,y,touch,preferPort){
    const hits=ray(x,y).intersectObjects(R.pick,false);if(!hits.length)return null;
    const conv=h=>{const ud=h.object.userData||{};
      if(ud.kind==='cable')return {kind:'cable',cid:ud.cid,point:h.point};
      if(ud.kind==='dev'){const fi=ud.faces&&ud.faces[h.face?h.face.materialIndex:0];return {kind:'dev',item:ud.item,point:h.point,port:fi&&h.uv?nearPort(fi,h.uv,touch):null}}
      if(ud.kind==='rack')return {kind:'rack',rack:ud.rack,point:h.point};return null};
    if(preferPort)for(const h of hits.slice(0,8)){const q=conv(h);if(q&&q.kind==='dev'&&q.port)return q}
    for(const h of hits){const q=conv(h);if(q)return q}return null;
  }
  function hideTip(){const t=R&&R.wrap&&R.wrap.querySelector('.t3-tip');if(t)t.hidden=true}
  function tipAt(x,y,txt){const t=R.wrap&&R.wrap.querySelector('.t3-tip');if(!t)return;if(!txt){t.hidden=true;return}const wr=R.wrap.getBoundingClientRect();t.textContent=txt;t.hidden=false;
    t.style.left=Math.max(4,Math.min(wr.width-t.offsetWidth-4,x-wr.left+14))+'px';t.style.top=Math.min(wr.height-30,y-wr.top+16)+'px'}
  function hover(x,y){
    if(R.hq)return;R.hq=requestAnimationFrame(()=>{R.hq=0;if(!R.wrap||R.down||R.drag)return;
      const wire=state.mode==='wire',h=pick(x,y,false,wire);let txt='',cur='';
      if(h&&h.kind==='dev'){const f=findItem(h.item);if(f){if(wire&&h.port){const ex=cableAt(rack(),{item:h.item,face:h.port.face,pi:h.port.pi});txt=`${label(f.it)} · ${portName(f.it,h.port.face,h.port.pi)}${ex?' · has a cable':''}`;cur='crosshair'}
        else{txt=`${label(f.it)} · ${uRange(f.it)}`;cur=h.item===ui.sel&&!wire?'ns-resize':'pointer'}}}
      else if(h&&h.kind==='cable'){const c=findCable(h.cid);if(c){const ci=cableInfo(c);txt=`${c.label?c.label+' · ':''}${ci.T.n}: ${endName(c.a)} → ${endName(c.b)}`;cur='pointer'}}
      else if(h&&h.kind==='rack'){const rk=state.racks.find(q=>q.id===h.rack);txt=rk?rk.name:'';cur='pointer'}
      R.renderer.domElement.style.cursor=cur;tipAt(x,y,txt)});
  }
  function onDown(e){
    if(!R||e.target!==R.renderer.domElement)return;hideTip();
    const d=R.down={x:e.clientX,y:e.clientY,t:performance.now(),type:e.pointerType,moved:false};
    if(state.mode==='wire'||!ui.sel)return;
    const h=pick(e.clientX,e.clientY,e.pointerType==='touch',false);
    if(h&&h.kind==='dev'&&h.item===ui.sel){if(e.pointerType==='touch')d.timer=setTimeout(()=>{if(R.down===d&&!d.moved)startDrag(h)},320);else startDrag(h)}
  }
  function onMove(e){
    if(!R||!R.wrap)return;
    if(R.drag){updateDrag(e.clientX,e.clientY);return}
    if(R.down){if(Math.hypot(e.clientX-R.down.x,e.clientY-R.down.y)>6){R.down.moved=true;clearTimeout(R.down.timer)}return}
    if(e.pointerType!=='touch'&&e.target===R.renderer.domElement&&!e.buttons)hover(e.clientX,e.clientY);
  }
  function onUp(e){
    if(!R)return;
    if(R.drag){endDrag();R.down=null;return}
    const d=R.down;R.down=null;if(!d)return;clearTimeout(d.timer);
    if(d.moved||performance.now()-d.t>650||e.target!==R.renderer.domElement)return;
    click(e.clientX,e.clientY,d.type==='touch');
  }
  function click(x,y,touch){
    const wire=state.mode==='wire',h=pick(x,y,touch,wire);
    if(wire&&h&&h.kind==='dev'&&h.port)wireTap(h);
    else if(!h){if(R.wireFrom){R.wireFrom=null;toast('Cancelled')}ui.sel=null;ui.selCable=null}
    else if(h.kind==='cable'){ui.selCable=h.cid;ui.sel=null}
    else if(h.kind==='dev'){ui.sel=h.item;ui.selCable=null;ui.arm=null;const f=findItem(h.item);if(f&&f.r.id!==state.active){state.active=f.r.id;save();renderTabs()}}
    else if(h.kind==='rack'){ui.sel=null;ui.selCable=null;if(h.rack!==state.active){state.active=h.rack;save();renderTabs()}}
    renderInsp();build();
  }
  function wireTap(h){
    const end={item:h.item,face:h.port.face,pi:h.port.pi},ex=cableAt(rack(),end),wt=state.wireType&&state.wireType!=='auto'?CABLE_TYPES[state.wireType]:null;
    if(!R.wireFrom){
      if(ex){ui.selCable=ex.id;ui.sel=null;toast('That port already has a cable. It’s selected so you can edit or unplug it.');return}
      if(wt&&!wt.ports.includes(h.port.t)){toast(`That's a ${PNAME[h.port.t]} port. Pick a ${wt.n} port, or set Cable type to Auto.`);return}
      R.wireFrom=end;ui.selCable=null;toast(`${endName(end)} picked. Now tap the port to connect it to.`);return;
    }
    if(sameEnd(end,R.wireFrom)){R.wireFrom=null;toast('Cancelled');return}
    if(ex){toast('That port already has a cable. Unplug it first.');return}
    if(wt&&!wt.ports.includes(h.port.t)){toast(`That isn't a ${wt.n} port.`);return}
    snap();const c={id:uid(),a:R.wireFrom,b:end,label:'',bend:null,route:null};if(wt)c.type=state.wireType;
    const ci=cableInfo(c);c.color=(!state.wireColor||state.wireColor==='auto')?ci.T.col:state.wireColor;addCable(c);ui.selCable=c.id;ui.sel=null;R.wireFrom=null;save();
    toast(ci.mismatch?`${ci.T.n} connected, but the ports don't match (${PNAME[ci.ta]} → ${PNAME[ci.tb]}). You'll need an adapter.`:`${ci.T.n} cable: ${endName(c.a)} → ${endName(c.b)}`,true);
  }
  function ghostMesh(G,h,d,mount,depth){
    const m=mat(new THREE.MeshBasicMaterial({color:C(0x47c07c),transparent:true,opacity:.3,depthWrite:false})),dd=Math.min(d,depth)+8;
    const gh=new THREE.Mesh(geo(new THREE.BoxGeometry(PANEL+8,h*UM,dd)),m);gh.position.z=mount==='rear'?-depth+dd/2-4:4-dd/2;G.add(gh);return gh;
  }
  function paintGhost(gh,r,c,ignore,u){const ok=canPlace(r,c,ignore),clash=conflicts(r,c,ignore).length>0;gh.material.color.copy(C(!ok?0xf06262:clash?0xe0a53e:0x47c07c));gh.position.y=BASE+(u-1)*UM+c.h*UM/2;R.dirty=true;return ok}
  function startDrag(h){
    const f=findItem(h.item);if(!f)return;const g=R.devGroups.get(h.item),G=R.rackGroups.get(f.r.id);if(!g||!G)return;
    R.controls.enabled=false;const dir=new THREE.Vector3();R.camera.getWorldDirection(dir);dir.y=0;if(dir.lengthSq()<1e-4)dir.set(0,0,-1);dir.normalize();
    const hh=hOf(f.it);
    R.drag={item:f.it.id,r:f.r,g,G,plane:new THREE.Plane().setFromNormalAndCoplanarPoint(dir.negate(),h.point),grab:(h.point.y-BASE)/UM+1-f.it.u,h:hh,d:dOf(f.it),mount:f.it.mount,u:f.it.u,u0:f.it.u};
    R.drag.gh=ghostMesh(G,hh,R.drag.d,f.it.mount,f.r.depth);
    paintGhost(R.drag.gh,f.r,{u:f.it.u,h:hh,d:R.drag.d,mount:f.it.mount},f.it.id,f.it.u);
    try{if(R.down&&R.down.type==='touch'&&navigator.vibrate)navigator.vibrate(12)}catch(_){}
  }
  function updateDrag(x,y){
    const D=R.drag,pt=new THREE.Vector3();if(!ray(x,y).ray.intersectPlane(D.plane,pt))return;
    let u=(pt.y-BASE)/UM+1-D.grab;u=isFree()?snapU(u):Math.round(u);u=Math.max(1,Math.min(D.r.units-D.h+1,u));D.u=u;
    D.g.position.y=(u-D.u0)*UM;paintGhost(D.gh,D.r,{u,h:D.h,d:D.d,mount:D.mount},D.item,u);tipAt(x,y,`U${fmtU(u)}${D.h>1?'–'+fmtU(u+D.h-1):''}`);
  }
  function endDrag(){const D=R.drag;R.drag=null;R.controls.enabled=true;hideTip();if(Math.abs(D.u-D.u0)>1e-6){ui.sel=D.item;if(!moveItem(D.item,D.u))build()}else build()}
  function dropTarget(x,y){
    const rr_=ray(x,y),pt=new THREE.Vector3();let best=null;
    R.rackGroups.forEach((G,id)=>{const rk=state.racks.find(q=>q.id===id);if(!rk)return;const behind=R.camera.position.z<-rk.depth/2,z=behind?-rk.depth-4:4;
      const pl=new THREE.Plane(new THREE.Vector3(0,0,1),-z);if(!rr_.ray.intersectPlane(pl,pt))return;if(Math.abs(pt.x-G.position.x)>CASEW/2)return;
      best={rk,G,y:pt.y,mount:behind?'rear':'front'}});
    if(!best||!drag)return null;const h=drag.h||1;
    return {...best,u:Math.max(1,Math.min(best.rk.units-h+1,Math.round((best.y-BASE)/UM-h/2)+1)),h};
  }
  function onDragOver(e){
    if(!R||typeof drag==='undefined'||!drag||drag.kind!=='lib')return;e.preventDefault();
    const t=dropTarget(e.clientX,e.clientY);
    if(!t){if(R.dropG){R.dropG.visible=false;R.dirty=true}return}
    if(!R.dropG||R.dropG.parent!==t.G||R.dropG.userData.h!==t.h){if(R.dropG&&R.dropG.parent)R.dropG.parent.remove(R.dropG);R.dropG=ghostMesh(t.G,t.h,drag.d,t.mount,t.rk.depth);R.dropG.userData.h=t.h}
    R.dropG.visible=true;paintGhost(R.dropG,t.rk,{u:t.u,h:t.h,d:drag.d,mount:t.mount},null,t.u);
  }
  function onDragLeave(e){if(R&&R.dropG&&!R.wrap.contains(e.relatedTarget)){R.dropG.visible=false;R.dirty=true}}
  function onDrop(e){
    if(!R||!drag||drag.kind!=='lib')return;e.preventDefault();const t=dropTarget(e.clientX,e.clientY),id=drag.id;drag=null;
    if(R.dropG&&R.dropG.parent)R.dropG.parent.remove(R.dropG);R.dropG=null;
    if(!t){toast('Drop it onto a rack.');build();return}
    if(t.rk.id!==state.active){state.active=t.rk.id;renderTabs()}addDevice(id,t.u,t.mount);
  }
  function onKey(e){if(e.key==='Escape'&&R&&R.wireFrom){R.wireFrom=null;toast('Cancelled');build()}}
  function onUiClick(e){
    const b=e.target.closest('button');if(!b||!R)return;const t=T();
    if(b.dataset.t3site!==undefined){t.site=b.dataset.t3site==='1';save();R.frameKey=null;renderTabs();build(true)}
    else if(b.dataset.t3cam){t.spin=false;uiSync();frame(b.dataset.t3cam,true)}
    else if(b.dataset.t3walls){t.walls=b.dataset.t3walls;save();build()}
    else if(b.hasAttribute('data-t3spin')){t.spin=!t.spin;save();uiSync()}
    else if(b.dataset.t3light){t.light=b.dataset.t3light;save();build()}
    else if(b.dataset.t3strip){t.strip=b.dataset.t3strip;save();build();if(t.strip!=='off'&&t.light!=='dim')toast('Switch the room to Dim to see the LED strip glow.')}
    else if(b.hasAttribute('data-t3sound')){if(AUD.on)soundOff();else soundOn();uiSync()}
  }
  function zoom(step){if(!R||!R.wrap)return;const c=R.camera,t=R.controls.target,d=c.position.clone().sub(t),k=step>0?.8:1.25,len=Math.max(R.controls.minDistance,Math.min(R.controls.maxDistance,d.length()*k));R.tween={p0:c.position.clone(),q0:t.clone(),p1:t.clone().addScaledVector(d.normalize(),len),q1:t.clone(),s:performance.now(),d:250}}
  return {shellHTML,show,hide,build,zoom,isSite:()=>state.view==='3d'&&!!T().site,_R:()=>R};
})();

updHist();
renderLibrary();renderAll();
if(firstRun) openWelcome(true);

}
