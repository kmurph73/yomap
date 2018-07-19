import find from 'lodash/find';

import {gmapifyPolygons} from './../map_util.js';

class Territory {
  constructor(attrs) {
    this.polygons = [];
    this.mappedPolygons = [];

    Object.assign(this, attrs);
    this.id = this.getId()
  }

  getId() {
   return [this.type, this.abbrev || this.terse].join('-')
  }

  friendlyName() {
    let name = this.name;

    if (this.type == 'city') {
      name = name + ` (${this.state.toUpperCase()})`
    } else if (this.type == 'state') {
      name = name + ` (${this.country.toUpperCase()})`
    }

    return name;
  }

  badgeClass() {
    switch(this.type) {
      case 'city': return 'info'
      case 'state': return 'light'
      case 'country': return 'dark'
    }
  }

  static findById(id) {
    return find(window.allTerritories, t => t.id == id)
  }

  getURL() {
    const root = 'https://s3-us-west-2.amazonaws.com/yodap'
    var url;

    if (this.type == 'country') {
      url = `${root}/countries/${this.abbrev}.json`
    } else if (this.type == 'state') {
      url = `${root}/states/${this.abbrev}.json`
    } else if (this.type == 'city') {
      url = `${root}/cities/${this.country}/${this.state}/${this.terse}.json`
    }

    return url;
  }

  getCenter() {
    let bounds = new google.maps.LatLngBounds()
    let polygons = this.polygons
    let points = polygons[0][0]

    points.forEach((p) => {
      bounds.extend(p)
    })

    return bounds.getCenter()
  }

  fetchPoints() {
    let url = this.getURL();

    $.getJSON({
      url: url,
      success: (resp) => {
        this.polygons = gmapifyPolygons(resp.polygons);
        window.mapView.addTerritory(this);
      },
      error: (err) => {
      }
    });
  }
}

export default Territory;
