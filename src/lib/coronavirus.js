import { getBoundsOfCountryByIsoAlpha2Code } from 'osm-countries-bounds';
import { getEmojiFlag } from 'countries-list';

/**
 * trackerLocationToFeature
 * @param {object} location - Coronavirus Tracker location object
 */

export function trackerLocationToFeature(location = {}) {
  const { coordinates = {}, country_code: countryCode } = location;
  const { latitude, longitude } = coordinates;
  const lat = latitude && parseFloat(latitude);
  const lng = longitude && parseFloat(longitude);
  const countryBounds = getBoundsOfCountryByIsoAlpha2Code(countryCode);
  const flag = getEmojiFlag(countryCode);

  return {
    "type": "Feature",
    "properties": {
      ...location,
      countryBounds,
      flag
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

/**
 * trackerFeatureToHtmlMarker
 */

export function trackerFeatureToHtmlMarker({ properties = {} } = {}) {
  const { country, latest = {}, country_population: population, last_updated: lastUpdated, province, flag } = properties
  const { confirmed, deaths, recovered } = latest;

  const hasProvince = typeof province === 'string' && province.length > 0;
  const rate = confirmed / population;

  let confirmedString = `${confirmed}`;

  if ( confirmed > 1000 ) {
    confirmedString = `${confirmedString.slice(0, -3)}k+`
  }

  return `
    <span class="icon-marker">
      <span class="icon-marker-tooltip">
        <h2>${flag} ${country}</h2>
        ${hasProvince ? `<h3>${ province }</h3>` : '' }
        <ul>
          <li><strong>Confirmed:</strong> ${confirmed}</li>
          <li><strong>Deaths:</strong> ${deaths}</li>
          <li><strong>Recovered:</strong> ${recovered}</li>
          <li><strong>Population:</strong> ${population}</li>
          <li><strong>Last Update:</strong> ${lastUpdated}</li>
        </ul>
      </span>
      ${ confirmedString }
    </span>
  `;
}