(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("helpers.js", function(exports, require, module) {
"use strict";
});

;require.register("initialize.js", function(exports, require, module) {
'use strict';

var _territory = require('models/territory.js');

var _territory2 = _interopRequireDefault(_territory);

var _search_view = require('views/search_view.js');

var _search_view2 = _interopRequireDefault(_search_view);

var _territory_view = require('views/territory_view.js');

var _territory_view2 = _interopRequireDefault(_territory_view);

var _map_view = require('views/map_view.js');

var _map_view2 = _interopRequireDefault(_map_view);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function () {
  // do your setup here
  // console.log('Initialized app');

  window.searchView = new _search_view2.default();
  window.territoryView = new _territory_view2.default();
  window.mapView = new _map_view2.default();
});

$(window).keydown(function (evt) {
  if (evt.which == 91) {
    // cmd
    window.cmdPressed = true;
  }
}).keyup(function (evt) {
  if (evt.which == 91) {
    // cmd
    window.cmdPressed = false;
  }
});
});

require.register("map_util.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gmapifyPolygons = undefined;

var _reject = require('lodash/reject');

var _reject2 = _interopRequireDefault(_reject);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var gmapifyPoints = function gmapifyPoints(points) {
  return (0, _map2.default)(points, function (point) {
    return new google.maps.LatLng(point[1], point[0]);
  });
};

var gmapifyPolygons = exports.gmapifyPolygons = function gmapifyPolygons(polygons) {
  return (0, _map2.default)(polygons, function (poly) {
    var c, gon, i, innerCoords, len, outerCoords;
    gon = [];
    outerCoords = gmapifyPoints(purgeLonePoints(poly.outerCoords));
    innerCoords = (0, _map2.default)(poly.innerCoords, function (coords) {
      return gmapifyPoints(purgeLonePoints(coords));
    });
    gon.push(outerCoords);
    for (i = 0, len = innerCoords.length; i < len; i++) {
      c = innerCoords[i];
      gon.push(c);
    }
    return gon;
  });
};

var purgeLonePoints = function purgeLonePoints(coords) {
  return (0, _reject2.default)(coords, function (point) {
    return point.length < 2;
  });
};
});

require.register("models/polygon.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _reject = require('lodash/reject');

var _reject2 = _interopRequireDefault(_reject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Polygon = function () {
  function Polygon(coords, territory) {
    _classCallCheck(this, Polygon);

    this.territory = territory;
    this.originalCoords = this.coords = coords;
    this.accumulatedLatDiff = 0;
    this.accumulatedLngDiff = 0;
  }

  _createClass(Polygon, [{
    key: 'dragStart',
    value: function dragStart(e) {
      this.startingLat = e.latLng.lat();
      this.startingLng = e.latLng.lng();
    }
  }, {
    key: 'dragEnd',
    value: function dragEnd(e) {
      this.accumulatedLatDiff += this.startingLat - e.latLng.lat();
      this.accumulatedLngDiff += this.startingLng - e.latLng.lng();

      this.coords = this.gmapPolygon.getPaths().getArray().map(function (c) {
        return c.getArray().map(function (j) {
          return j;
        });
      });

      if (window.cmdPressed) {
        this.movePolygons(this.accumulatedLatDiff, this.accumulatedLngDiff);
      }
    }
  }, {
    key: 'addToMap',
    value: function addToMap() {
      this.createGmapPolygon();

      google.maps.event.addListener(this.gmapPolygon, 'dragstart', this.dragStart.bind(this));
      google.maps.event.addListener(this.gmapPolygon, 'dragend', this.dragEnd.bind(this));
    }
  }, {
    key: 'removeFromMap',
    value: function removeFromMap() {
      google.maps.event.clearInstanceListeners(this.gmapPolygon);
      this.gmapPolygon.setMap(null);
    }
  }, {
    key: 'remove',
    value: function remove() {
      var _this = this;

      this.removeFromMap();
      this.territory.polygons = (0, _reject2.default)(this.territory.polygons, function (p) {
        return p === _this;
      });
    }
  }, {
    key: 'createGmapPolygon',
    value: function createGmapPolygon() {
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
      });
    }
  }, {
    key: 'move',
    value: function move(latDiff, lngDiff) {
      this.removeFromMap();

      this.coords = (0, _map2.default)(this.originalCoords, function (coords) {
        return (0, _map2.default)(coords, function (c) {
          return new google.maps.LatLng(c.lat() - latDiff, c.lng() - lngDiff);
        });
      });

      this.addToMap();
    }
  }, {
    key: 'movePolygons',
    value: function movePolygons(latDiff, lngDiff) {
      var _this2 = this;

      this.territory.polygons.forEach(function (p) {
        if (p === _this2) return;

        p.move(latDiff, lngDiff);
      });
    }
  }]);

  return Polygon;
}();

exports.default = Polygon;
});

require.register("models/territory.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _find = require('lodash/find');

var _find2 = _interopRequireDefault(_find);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _polygon = require('models/polygon.js');

var _polygon2 = _interopRequireDefault(_polygon);

var _map_util = require('./../map_util.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Territory = function () {
  function Territory(attrs) {
    _classCallCheck(this, Territory);

    this.polygons = [];

    Object.assign(this, attrs);
    this.id = this.getId();
  }

  _createClass(Territory, [{
    key: 'getId',
    value: function getId() {
      return [this.type, this.abbrev || this.terse].join('-');
    }
  }, {
    key: 'remove',
    value: function remove() {
      this.polygons.forEach(function (p) {
        return p.remove();
      });
    }
  }, {
    key: 'addPolygon',
    value: function addPolygon(polygon) {
      this.polygons.push(polygon);
    }
  }, {
    key: 'friendlyName',
    value: function friendlyName() {
      var name = this.name;

      if (this.type == 'city') {
        name = name + (' (' + this.state.toUpperCase() + ')');
      } else if (this.type == 'state') {
        name = name + (' (' + this.country.toUpperCase() + ')');
      }

      return name;
    }
  }, {
    key: 'badgeClass',
    value: function badgeClass() {
      switch (this.type) {
        case 'city':
          return 'info';
        case 'state':
          return 'light';
        case 'country':
          return 'dark';
      }
    }
  }, {
    key: 'getURL',
    value: function getURL() {
      var root = 'https://s3-us-west-2.amazonaws.com/yodap';
      var url;

      if (this.type == 'country') {
        url = root + '/countries/' + this.abbrev + '.json';
      } else if (this.type == 'state') {
        url = root + '/states/' + this.abbrev + '.json';
      } else if (this.type == 'city') {
        url = root + '/cities/' + this.country + '/' + this.state + '/' + this.terse + '.json';
      }

      return url;
    }
  }, {
    key: 'getCenter',
    value: function getCenter() {
      var bounds = new google.maps.LatLngBounds();
      var polygons = this.polygons;
      var points = polygons[0][0];

      points.forEach(function (p) {
        bounds.extend(p);
      });

      return bounds.getCenter();
    }
  }, {
    key: 'addPolygons',
    value: function addPolygons() {
      this.polygons.forEach(function (p) {
        return p.addToMap();
      });
    }
  }, {
    key: 'fetchPoints',
    value: function fetchPoints() {
      var _this = this;

      var url = this.getURL();

      $.getJSON({
        url: url,
        success: function success(resp) {
          var coords = (0, _map_util.gmapifyPolygons)(resp.polygons);
          var polygons = (0, _map2.default)(coords, function (c) {
            return new _polygon2.default(c, _this);
          });
          _this.polygons = polygons;
          window.mapView.addTerritory(_this);
        },
        error: function error(err) {}
      });
    }
  }], [{
    key: 'findById',
    value: function findById(id) {
      return (0, _find2.default)(window.allTerritories, function (t) {
        return t.id == id;
      });
    }
  }]);

  return Territory;
}();

exports.default = Territory;
});

require.register("views/map_view.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _polygon = require('models/polygon.js');

var _polygon2 = _interopRequireDefault(_polygon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapView = function () {
  function MapView() {
    _classCallCheck(this, MapView);

    this.territories = [];
  }

  _createClass(MapView, [{
    key: 'resetTerritory',
    value: function resetTerritory(t) {
      this.removeTerritory(t);
      this.addTerritory(t);
    }
  }, {
    key: 'gotoTerritory',
    value: function gotoTerritory(t) {
      window.map.setCenter(t.getCenter());

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

      window.map.setZoom(zoom);
    }
  }, {
    key: 'removeTerritory',
    value: function removeTerritory(t) {
      t.remove();
    }
  }, {
    key: 'addTerritory',
    value: function addTerritory(t) {
      t.addPolygons();
    }
  }]);

  return MapView;
}();

exports.default = MapView;
});

require.register("views/search_view.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _territory = require('../models/territory.js');

var _territory2 = _interopRequireDefault(_territory);

var _flatten = require('lodash/flatten');

var _flatten2 = _interopRequireDefault(_flatten);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import flatten from '../../node_modules/lodash/flatten.js';
// import map from '../../node_modules/lodash/map.js';

var SearchView = function () {
  function SearchView() {
    var _this = this;

    _classCallCheck(this, SearchView);

    this.ele = $('#search-hold');
    this.dropdownMenu = this.ele.find('.dropdown-menu');

    var input = $('#search-input');
    input.on('input', this.onInput.bind(this));
    input.on('keydown', this.onKeydown.bind(this));
    input.on('focus', this.onFocus.bind(this));
    this.dropdownMenu.on('click', 'a.dropdown-item', this.clickDropdownItem.bind(this));

    $.getJSON({
      url: 'https://s3-us-west-2.amazonaws.com/yodap/places.json.gz',
      success: function (places) {
        window.countries = places.filter(function (p) {
          return p.type == 'country';
        }).map(function (p) {
          return new _territory2.default(p);
        });
        window.states = places.filter(function (p) {
          return p.type == 'state';
        }).map(function (p) {
          return new _territory2.default(p);
        });
        window.cities = places.filter(function (p) {
          return p.type == 'city';
        }).map(function (p) {
          return new _territory2.default(p);
        });
        window.allTerritories = (0, _flatten2.default)([countries, states, cities]);
      }.bind(this)
    });

    $(document).click(function (event) {
      if (!$(event.target).closest('#search-dropdown-hold').length) {
        _this.dropdownMenu.removeClass('show');
      }
    });
  }

  _createClass(SearchView, [{
    key: 'addItem',
    value: function addItem(ele) {
      var _this2 = this;

      ele.classList.add('active');
      $('#search-input').val('');
      setTimeout(function () {
        return _this2.closeDropdown();
      }, 5);

      var t = _territory2.default.findById(ele.getAttribute('data-id'));
      t.fetchPoints();
      window.territoryView.addTerritory(t);
    }
  }, {
    key: 'clickDropdownItem',
    value: function clickDropdownItem(e) {
      this.dropdownMenu.find('a.active').removeClass('active');
      this.addItem(e.currentTarget);
    }
  }, {
    key: 'openDropdown',
    value: function openDropdown() {
      this.dropdownMenu.addClass('show');
    }
  }, {
    key: 'closeDropdown',
    value: function closeDropdown() {
      this.dropdownMenu.removeClass('show');
    }
  }, {
    key: 'onFocus',
    value: function onFocus(e) {
      if (e.currentTarget.value.length) {
        this.openDropdown();
      }
    }
  }, {
    key: 'moveSelection',
    value: function moveSelection(dir) {
      var active = this.dropdownMenu.find('.active')[0];
      var children = this.dropdownMenu.children();

      var index = active ? children.index(active) : -1;

      var ele = children[index + dir];

      if (!ele) {
        ele = dir == -1 ? children.last()[0] : children.first()[0];
      }

      children.removeClass('active');

      if (ele) {
        ele.classList.add('active');
      }
    }
  }, {
    key: 'hitEnter',
    value: function hitEnter() {
      var item = void 0;
      if (item = this.dropdownMenu.find('.active')[0]) {
        this.addItem(item);
      }
    }
  }, {
    key: 'hitEsc',
    value: function hitEsc() {
      this.closeDropdown();
    }
  }, {
    key: 'goUp',
    value: function goUp() {
      this.moveSelection(-1);
    }
  }, {
    key: 'goDown',
    value: function goDown() {
      this.moveSelection(1);
    }
  }, {
    key: 'onKeydown',
    value: function onKeydown(e) {
      if (e.which == 40) {
        this.goDown();
      } else if (e.which == 38) {
        this.goUp();
      } else if (e.which == 13) {
        this.hitEnter();
      } else if (e.which == 27) {
        this.hitEsc();
      }
    }
  }, {
    key: 'onInput',
    value: function onInput(e) {
      var val = e.currentTarget.value;
      var matches = this.findMatches(val);

      if (matches.length) {
        this.dropdownMenu[0].innerHTML = this.renderDropdownHtml(matches);
        this.openDropdown();
      } else {
        this.closeDropdown();
      }
    }
  }, {
    key: 'renderDropdownHtml',
    value: function renderDropdownHtml(matches) {
      var html = [];

      matches.forEach(function (t) {
        html.push('\n        <a class=\'dropdown-item\' data-id=\'' + t.id + '\' href=\'#\'>\n          ' + t.friendlyName() + '\n          <span class="badge badge-' + t.badgeClass() + '">' + t.type + '</span>\n        </a>\n      ');
      });

      return html.join('');
    }
  }, {
    key: 'findMatches',
    value: function findMatches(query) {
      if (query.length > 2) {
        query = new RegExp(query.replace(/\s|\(|\)/, ''), "i");
      } else {
        query = new RegExp('^' + query.replace(/\s|\(|\)/, ''), "i");
      }

      var matches = [];

      ['countries', 'states', 'cities'].some(function (thing) {
        var things = window[thing];

        return things.some(function (t) {
          if (query.test(t.terse)) {
            matches.push(t);
          }

          return matches.length >= 20;
        });
      });

      return matches;
    }
  }]);

  return SearchView;
}();

exports.default = SearchView;
});

require.register("views/territory_view.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _territory = require('../models/territory.js');

var _territory2 = _interopRequireDefault(_territory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import map from '../../node_modules/lodash/map.js';

var TerritoryView = function () {
  function TerritoryView() {
    _classCallCheck(this, TerritoryView);

    this.territoryDiv = $('#territory-hold');
    this.territoryDiv.on('click', 'a.dropdown-item', this.clickTerritory.bind(this));
  }

  _createClass(TerritoryView, [{
    key: 'clickTerritory',
    value: function clickTerritory(e) {
      e.preventDefault();

      var t = $(e.currentTarget);
      var id = t.closest('.dropdown').attr('data-id');
      var territory = _territory2.default.findById(id);

      if (t.hasClass('reset')) {
        window.mapView.resetTerritory(territory);
      } else if (t.hasClass('goto')) {
        window.mapView.gotoTerritory(territory);
      } else if (t.hasClass('remove')) {
        var dropdown = this.territoryDiv.find('div.dropdown[data-id="' + territory.id + '"]');
        dropdown.remove();

        window.mapView.removeTerritory(territory);
      }
    }
  }, {
    key: 'addTerritory',
    value: function addTerritory(t) {
      var html = this.renderTerritory(t);
      this.territoryDiv.append(html);
    }
  }, {
    key: 'renderTerritory',
    value: function renderTerritory(t) {
      return '\n      <div class="dropdown pl-2" data-id=\'' + t.id + '\'>\n        <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown">\n          ' + t.name + '\n        </button>\n        <div class="dropdown-menu">\n          <a class="dropdown-item reset" href="#">Reset</a>\n          <a class="dropdown-item goto" href="#">Go to</a>\n          <div class="dropdown-divider"></div>\n          <a class="dropdown-item remove" href="#">Remove</a>\n        </div>\n      </div>';
    }
  }]);

  return TerritoryView;
}();

exports.default = TerritoryView;
});

require.alias("buffer/index.js", "buffer");
require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map