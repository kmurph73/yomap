import Territory from '../models/territory.js';
// import map from '../../node_modules/lodash/map.js';

class TerritoryView {
  constructor() {
    this.territoryDiv = $('#territory-hold');
  }

  addTerritory(t) {
    let html = this.renderTerritory(t);
    this.territoryDiv.append(html);
  }

  renderTerritory(t) {
    return `
      <div class="dropdown" data-id='${t.id}'>
        <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown">
          ${t.name}
        </button>
        <div class="dropdown-menu">
          <a class="dropdown-item" href="#">Reset</a>
          <a class="dropdown-item" href="#">Go to</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">Remove</a>
        </div>
      </div>`
  }
}

export default TerritoryView;
