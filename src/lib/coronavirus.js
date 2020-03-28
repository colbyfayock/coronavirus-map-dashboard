/**
 * trackerLocationToFeature
 * @param {object} location - Coronavirus Tracker location object
 */

export function trackerLocationToFeature(location = {}) {
  const { coordinates = {} } = location;
  const { latitude, longitude } = coordinates;
  const lat = latitude && parseFloat(latitude);
  const lng = longitude && parseFloat(longitude);
  return {
    "type": "Feature",
    "properties": {
      ...location
    },
    "geometry": {
      "type": "Point",
      "coordinates": [ lng, lat ]
    }
  }
}

/**
 * trackerLocationsToGeoJson
 * @param {array} locations - Coronavirus Tracker location objects array
 */

export function trackerLocationsToGeoJson(locations = []) {
  if ( locations.length === 0 ) return;

  return {
    "type": "FeatureCollection",
    "features": locations.map((location = {}) => trackerLocationToFeature(location))
  }
}