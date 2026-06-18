// ──────────────────────────────────────────────────────────────
// De route door Leeuwarden.
//
// Tijden zijn "HH:MM" strings (24u). Stops die ná middernacht
// vallen krijgen een dag-offset (+1) zodat de chronologie klopt.
// Tussen elke stop zit looptijd → die gaten gebruikt de Live ETA
// bar om "onderweg naar …" te tonen.
//
// Pas hier gewoon de tijden aan; de rest van de app rekent erop.
// ──────────────────────────────────────────────────────────────

export const STOPS = [
  {
    id: 'start',
    name: 'Het Vertrek',
    type: 'start',
    address: 'Jan Jelles Hofleane 169',
    startTime: '19:00',
    endTime: '19:30',
    photoCaptured: false,
  },
  {
    id: 'blauwhuis',
    name: 'Café Blauwhuis',
    type: 'stop',
    address: 'Hoekstersingel 1',
    startTime: '19:45',
    endTime: '20:15',
    photoCaptured: false,
  },
  {
    id: 'us-mem',
    name: 'Café ús mem',
    type: 'stop',
    address: 'Bij de Put 6',
    startTime: '20:30',
    endTime: '21:00',
    photoCaptured: false,
  },
  {
    id: 'drunken-dragon',
    name: 'The Drunken Dragon',
    type: 'stop',
    address: 'Weerd 13',
    startTime: '21:15',
    endTime: '21:45',
    photoCaptured: false,
  },
  {
    id: 'hoogstraat',
    name: 'Grote Hoogstraat 38',
    type: 'stop',
    address: 'Grote Hoogstraat 38',
    startTime: '22:00',
    endTime: '22:30',
    photoCaptured: false,
  },
  {
    id: 'oranje-bierhuis',
    name: 'Oranje Bierhuis',
    type: 'stop',
    address: 'Auckamastraatje 2',
    startTime: '22:45',
    endTime: '23:15',
    photoCaptured: false,
  },
  {
    id: 'de-twin',
    name: 'Café De Twin',
    type: 'stop',
    address: 'Nieuwesteeg 2',
    startTime: '23:30',
    endTime: '23:59',
    photoCaptured: false,
  },
  {
    id: 'bar-de',
    name: 'Café Bar-Dé',
    type: 'stop',
    address: 'Baljéestraat 19',
    startTime: '00:15', // na middernacht
    endTime: '00:45',
    dayOffset: 1,
    photoCaptured: false,
  },
  {
    id: 'scooters',
    name: "Muziekcafé Scooter'S",
    type: 'end',
    address: 'Ruiterskwartier 61',
    startTime: '01:00',
    endTime: '03:00',
    dayOffset: 1,
    photoCaptured: false,
  },
]
