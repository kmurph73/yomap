import Territory from '../models/territory.js';
import flatten from 'lodash/flatten';

// import flatten from '../../node_modules/lodash/flatten.js';
// import map from '../../node_modules/lodash/map.js';

class SearchView {
  constructor() {
    this.ele = $('#search-hold');
    this.dropdownMenu = this.ele.find('.dropdown-menu');

    let input = $('#search-input');
    input.on('input', this.onInput.bind(this));
    input.on('keydown', this.onKeydown.bind(this));
    input.on('focus', this.onFocus.bind(this));
    this.dropdownMenu.on('click', 'a.dropdown-item', this.clickDropdownItem.bind(this))

    $.getJSON({
      url: 'https://s3-us-west-2.amazonaws.com/yodap/places.json.gz',
      success: function(places) {
        window.countries = places.filter(p => p.type == 'country').map(p => new Territory(p));
        window.states = places.filter(p => p.type == 'state').map(p => new Territory(p));
        window.cities = places.filter(p => p.type == 'city').map(p => new Territory(p));
        window.allTerritories = flatten([countries, states, cities]);
      }.bind(this)
    })

    $(document).click((event) => {
      if(!$(event.target).closest('#search-dropdown-hold').length) {
        this.dropdownMenu.removeClass('show');
      }
    });
  }

  addItem(ele) {
    ele.classList.add('active')
    $('#search-input').val('')
    setTimeout(() => this.closeDropdown(), 5)

    let t = Territory.findById(ele.getAttribute('data-id'))
    window.territoryView.addTerritory(t)
  }

  clickDropdownItem(e) {
    this.dropdownMenu.find('a.active').removeClass('active')
    this.addItem(e.currentTarget)
  }

  openDropdown() {
    this.dropdownMenu.addClass('show')
  }

  closeDropdown() {
    this.dropdownMenu.removeClass('show')
  }

  onFocus(e) {
    if (e.currentTarget.value.length) {
      this.openDropdown()
    }
  }

  moveSelection(dir) {
    let active = this.dropdownMenu.find('.active')[0];
    let children = this.dropdownMenu.children();

    let index = active ? children.index(active) : -1;

    let ele = children[index + dir];

    if (!ele) {
      ele = dir == -1 ? children.last()[0] : children.first()[0]
    }

    children.removeClass('active')

    if (ele) {
      ele.classList.add('active')
    }
  }

  hitEnter() {
    let item;
    if (item = this.dropdownMenu.find('.active')[0]) {
      this.addItem(item);
    }
  }

  hitEsc() {
    this.closeDropdown()
  }

  goUp() { this.moveSelection(-1) }
  goDown() { this.moveSelection(1) }

  onKeydown(e) {
    if (e.which == 40) {
      this.goDown();
    } else if (e.which == 38) {
      this.goUp();
    } else if (e.which == 13) {
      this.hitEnter()
    } else if (e.which == 27) {
      this.hitEsc();
    }
  }

  onInput(e) {
    let val = e.currentTarget.value;
    let matches = this.findMatches(val);

    if (matches.length) {
      this.dropdownMenu[0].innerHTML = this.renderDropdownHtml(matches);
      this.openDropdown()
    } else {
      this.closeDropdown()
    }
  }

  renderDropdownHtml(matches) {
    let html = []

    matches.forEach((t) => {
      html.push(`
        <a class='dropdown-item' data-id='${t.id}' href='#'>
          ${t.friendlyName()}
          <span class="badge badge-${t.badgeClass()}">${t.type}</span>
        </a>
      `)
    })

    return html.join('')
  }

  findMatches(query) {
    if (query.length > 2) {
      query = new RegExp(query.replace(/\s|\(|\)/, ''), "i")
    } else {
      query = new RegExp('^' + query.replace(/\s|\(|\)/, ''), "i")
    }

    let matches = [];

    ['countries', 'states', 'cities'].some((thing) => {
      let things = window[thing];

      return things.some((t) => {
        if (query.test(t.terse)) {
          matches.push(t)
        }

        return matches.length >= 20;
      })
    })

    return matches;
  }
}

export default SearchView;
