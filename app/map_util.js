import reject from 'lodash/reject';
import map from 'lodash/map';

var gmapifyPoints = function(points) {
  return map(points, function(point) {
    return new google.maps.LatLng(point[1], point[0]);
  });
};

export const gmapifyPolygons = function(polygons) {
  return map(polygons, function(poly) {
    var c, gon, i, innerCoords, len, outerCoords;
    gon = [];
    outerCoords = gmapifyPoints(purgeLonePoints(poly.outerCoords));
    innerCoords = map(poly.innerCoords, function(coords) {
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

var purgeLonePoints = function(coords) {
  return reject(coords, function(point) {
    return point.length < 2;
  });
};
