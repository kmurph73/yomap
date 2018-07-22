import map from 'lodash/map';
import reject from 'lodash/reject';

class Polygon {
  constructor(coords, territory) {
    this.territory = territory;
    this.originalCoords = this.coords = coords;
    this.originalCenter = this.getCenter()
    this.accumulatedLatDiff = 0
    this.accumulatedLngDiff = 0
  }

  dragStart(e) {
    this.startingLat = e.latLng.lat()
    this.startingLng = e.latLng.lng()
  }

  dragEnd(e) {
    this.accumulatedLatDiff += (this.startingLat - e.latLng.lat())
    this.accumulatedLngDiff += (this.startingLng - e.latLng.lng())

    this.coords = this.gmapPolygon.getPaths().getArray().map(c => c.getArray().map(j => j))

    if (window.cmdPressed) {
      this.movePolygons(this.accumulatedLatDiff, this.accumulatedLngDiff);
    }
  }

  addToMap() {
    this.createGmapPolygon();

    google.maps.event.addListener(this.gmapPolygon, 'dragstart', this.dragStart.bind(this));
    google.maps.event.addListener(this.gmapPolygon, 'dragend', this.dragEnd.bind(this));
  }

  removeFromMap() {
    google.maps.event.clearInstanceListeners(this.gmapPolygon);
    this.gmapPolygon.setMap(null);
  }

  reset() {
    this.accumulatedLatDiff = 0
    this.accumulatedLngDiff = 0
    this.coords = this.originalCoords
    this.removeFromMap()
    this.addToMap()
  }

  remove() {
    this.removeFromMap();
    //this.territory.polygons = reject(this.territory.polygons, p => p === this);
  }

  getCenter() {
    let bounds = new google.maps.LatLngBounds()
    let points = this.originalCoords[0]

    points.forEach((p) => {
      bounds.extend(p)
    })

    return bounds.getCenter()
  }

  createGmapPolygon() {
    this.gmapPolygon = new google.maps.Polygon({
      map: window.map,
      paths: this.coords,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      draggable: true,
      geodesic: true
    })
  }

  move(latDiff, lngDiff) {
    this.removeFromMap()

    this.accumulatedLatDiff = latDiff
    this.accumulatedLngDiff = lngDiff

    this.coords = map(this.originalCoords, (coords) => {
      return map(coords, (c) => {
        return new google.maps.LatLng(c.lat() - latDiff, c.lng() - lngDiff)
      });
    })

    this.addToMap();
  }

  movePolygons(latDiff, lngDiff) {
    this.territory.polygons.forEach((p) => {
      if (p === this) return

      p.move(latDiff, lngDiff)
    })
  }
}

export default Polygon;
