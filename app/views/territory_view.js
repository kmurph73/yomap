import Territory from '../models/territory.js';
// import map from '../../node_modules/lodash/map.js';

class TerritoryView {
  constructor() {
    this.territoryDiv = $('#territory-hold');
    this.territoryDiv.on('click', 'a.dropdown-item', this.clickTerritory.bind(this))
  }

  clickTerritory(e) {
    e.preventDefault();

    let t = $(e.currentTarget);
    let id = t.closest('.dropdown').attr('data-id');
    let territory = Territory.findById(id);

    if (t.hasClass('reset')) {
      window.mapView.resetTerritory(territory);
    } else if (t.hasClass('goto')) {
      window.mapView.gotoTerritory(territory);
    } else if (t.hasClass('bringtocenter')) {
      window.mapView.bringtoCenter(territory);
    } else if (t.hasClass('remove')) {
      let dropdown = this.territoryDiv.find(`div.dropdown[data-id="${territory.id}"]`);
      dropdown.remove();

      window.mapView.removeTerritory(territory);
    }
  }

  addTerritory(t) {
    let html = this.renderTerritory(t);
    this.territoryDiv.append(html);
  }

  renderTerritory(t) {
    return `
      <div class="dropdown pl-2" data-id='${t.id}'>
        <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown">
          ${t.name}
        </button>
        <div class="dropdown-menu">
          <a class="dropdown-item reset" href="#">Reset</a>
          <a class="dropdown-item goto" href="#">Go to</a>
          <a class="dropdown-item bringtocenter" href="#">Bring to center</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item remove" href="#">Remove</a>
        </div>
      </div>`
  }
}

export default TerritoryView;
