import {MapboxOverlay as DeckOverlay} from '@deck.gl/mapbox';
import {GeoJsonLayer, ArcLayer} from '@deck.gl/layers';
import mapboxgl from 'mapbox-gl';

const port = 5000

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const AIR_PORTS = 'plages.json';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json',
  center: [-7.05, 33.86],
  zoom: 4,
  bearing: -15,
  pitch: 40
});

const deckOverlay = new DeckOverlay({
  layers: [
    new GeoJsonLayer({
      id: 'airports',
      data: AIR_PORTS,
      // Styles
      filled: true,
      pointRadiusMinPixels: 2,
      pointRadiusScale: 2000,
      getPointRadius: f => f.properties.Frequ_parj/10000+5,
      getFillColor: [200, 0, 80, 180],
      // Interactive props
      pickable: true,
      autoHighlight: true,
      onClick: info =>
        // eslint-disable-next-line
        info.object && alert(`${info.object.properties.nom} (${info.object.properties.Frequ_parj})`)
    }),
    new ArcLayer({
      id: 'arcs',
      data: AIR_PORTS,
      dataTransform: d => d.features.filter(f => f.properties.Frequ_parj < 10000),
      // Styles
      getSourcePosition: f => [-7.05, 33.86], // Rabat
      getTargetPosition: f => f.geometry.coordinates,
      getSourceColor: [0, 128, 200],
      getTargetColor: [200, 0, 80],
      getWidth: 1
    })
  ]
});


map.addControl(deckOverlay);
map.addControl(new mapboxgl.NavigationControl());
