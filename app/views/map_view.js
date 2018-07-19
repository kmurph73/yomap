class MapView {
  constructor() {
    this.territories = [];
  }

  resetTerritory(t) {
    this.removeTerritory(t);
    this.addTerritory(t);
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
    t.mappedPolygons.forEach((p) => {
      p.setMap(null)
    })
  }

  addTerritory(t) {
    t.polygons.forEach((coords) => {
      let polygon = this.addPolygon(coords);
      t.mappedPolygons.push(polygon);
    })
  }

  addPolygon(coords) {
    let polygon = new google.maps.Polygon({
      map: window.map,
      paths: coords,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      draggable: true,
      geodesic: true
    })

    return polygon;
  }
}

export default MapView;
