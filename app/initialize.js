import Territory from 'models/territory.js';
import SearchView from 'views/search_view.js';
import TerritoryView from 'views/territory_view.js';

document.addEventListener('DOMContentLoaded', () => {
  // do your setup here
  // console.log('Initialized app');

  window.searchView = new SearchView;
  window.territoryView = new TerritoryView;
});
