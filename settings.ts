type AnimationMode = 'flyTo' | 'easeTo' | 'moveTo'

export default {
  date: {
    dateFormat: 'DD.MM.YYYY',
    dateTimeFormat: 'DD.MM.YYYY HH:mm',
    timeFormat: 'hh:mm'
  },
  map: {
    animation: {
      duration: 250,
      mode: 'flyTo' as AnimationMode
    },
    coordinates: [
      24.9217484, // longitude
      60.1669635  // latitude
    ],
    heading: 290,
    minZoom: 4,
    maxZoom: 24,
    pitch: 40,
    zoom: 19,
    style: 'mapbox://styles/wirrareka/ck58q9vxr15391cmnw0qfppju',
    defaultFont: "Klokantech Noto Sans Regular"
  },
  mapbox: {
    token: '-mapbox-token-here-'
  },
  proximiio: {
    token: '-proximiio-token-here-'
  }
}