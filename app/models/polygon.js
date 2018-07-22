import map from 'lodash/map';
import reject from 'lodash/reject';

class Polygon {
  constructor(coords, territory) {
    this.territory = territory;
    this.originalCoords = this.coords = coords;
    this.originalCenter = this.center = this.getCenter()
  }

  dragStart(e) {
  }

  dragEnd(e) {
    this.coords = this.gmapPolygon.getPaths().getArray().map(c => c.getArray().map(j => j))

    this.center = this.getCenter()

    if (window.cmdPressed) {
      this.movePolygons();
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
    let points = this.coords[0]

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
    let lat = this.originalCenter.lat() + latDiff;
    let lng = this.originalCenter.lng() + lngDiff;
    this.gmapPolygon.moveTo(new google.maps.LatLng(lat, lng));
  }

  movePolygons() {
    let latDiff = this.center.lat() - this.originalCenter.lat()
    let lngDiff = this.center.lng() - this.originalCenter.lng()
    this.territory.polygons.forEach((p) => {
      if (p === this) return

      p.move(latDiff, lngDiff)
    })
  }
}

export default Polygon;
