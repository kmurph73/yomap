import find from 'lodash/find';

class Territory {
  constructor(attrs) {
    this.polygons = [];

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

    if (self.type == 'country') {
      url = `${root}/countries/${self.abbrev}}.json`
    } else if (self.type == 'state') {
      url = `${root}/states/${this.abbrev}.json`
    } else if (self.type == 'city') {
      url = `${root}/cities/${this.country}/${this.state}/${this.terse}.json`
    }

    return url;
  }

  fetchPoints() {
    let url = getURL();
    $.getJSON(url).then((resp) => {
    })
  }
}

export default Territory;
