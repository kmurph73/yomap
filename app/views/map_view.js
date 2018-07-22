import Polygon from 'models/polygon.js';

class MapView {
  constructor() {
    this.territories = [];
  }

  resetTerritory(t) {
    t.reset();
  }

  gotoTerritory(t) {
    window.map.setCenter(t.getCenter())

    var zoom;
    switch (t.type) {
      case 'city':
        zoom = 10;
        break;
      case 'state':
        zoom = 5;
        break;
      case 'country':
        zoom = 4;
        break;
    }

    window.map.setZoom(zoom)
  }

  removeTerritory(t) {
    t.remove()
  }

  addTerritory(t) {
    t.addPolygons()
  }
}

export default MapView;
