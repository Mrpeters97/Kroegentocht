// ──────────────────────────────────────────────────────────────
// De route door Leeuwarden.
//
// Tijden zijn "HH:MM" strings (24u). De getoonde tijd is de geplande
// aankomsttijd (met ± want het zijn schattingen). 'endTime' bepaalt
// alleen wanneer een stop intern op "geweest" springt — de gaten
// ertussen tonen "onderweg naar …". Stops ná middernacht krijgen een
// dayOffset (+1) zodat de chronologie klopt.
//
// Pas hier gewoon de tijden aan; de rest van de app rekent erop.
// ──────────────────────────────────────────────────────────────

export const STOPS = [
  {
    id: 'start',
    name: 'Het Vertrek',
    type: 'start',
    address: 'Jan Jelles Hofleane 169',
    startTime: '20:00',
    endTime: '20:30',
    photoCaptured: false,
  },
  {
    id: 'blauwhuis',
    name: 'Café Blauwhuis',
    type: 'stop',
    address: 'Hoekstersingel 1',
    startTime: '22:00',
    endTime: '22:35',
    photoCaptured: false,
  },
  {
    id: 'us-mem',
    name: 'Café ús mem',
    type: 'stop',
    address: 'Bij de Put 6',
    startTime: '22:45',
    endTime: '23:20',
    photoCaptured: false,
  },
  {
    id: 'goodevening',
    name: 'Café Goodevening',
    type: 'stop',
    address: 'Grote Hoogstraat 38',
    startTime: '23:30',
    endTime: '23:59',
    photoCaptured: false,
  },
  {
    id: 'drunken-dragon',
    name: 'The Drunken Dragon',
    type: 'stop',
    address: 'Weerd 13',
    startTime: '00:15', // na middernacht
    endTime: '00:50',
    dayOffset: 1,
    photoCaptured: false,
  },
  {
    id: 'de-twin',
    name: 'Café De Twin',
    type: 'stop',
    address: 'Nieuwesteeg 2',
    startTime: '01:00',
    endTime: '01:35',
    dayOffset: 1,
    photoCaptured: false,
  },
  {
    id: 'bar-de',
    name: 'Café Bar-Dé',
    type: 'stop',
    address: 'Baljéestraat 19',
    startTime: '01:45',
    endTime: '02:20',
    dayOffset: 1,
    photoCaptured: false,
  },
  {
    id: 'scooters',
    name: "Muziekcafé Scooter'S",
    type: 'end',
    address: 'Ruiterskwartier 61',
    startTime: '02:30',
    endTime: '04:00',
    dayOffset: 1,
    photoCaptured: false,
  },
]
