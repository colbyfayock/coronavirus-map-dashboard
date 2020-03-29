import { getBoundsOfCountryByIsoAlpha2Code } from 'osm-countries-bounds';
import { getEmojiFlag } from 'countries-list';

/**
 * trackerLocationToFeature
 * @param {object} location - Coronavirus Tracker location object
 */

export function trackerLocationToFeature(location = {}) {

  const { countryInfo = {} } = location;
  const { lat, long: lng, iso2 } = countryInfo;

  const countryCode = iso2;

  let countryBounds;
  let flag;

  if ( typeof countryCode === 'string' ) {
    countryBounds = getBoundsOfCountryByIsoAlpha2Code(countryCode);
    flag = getEmojiFlag(countryCode);
  }

  return {
    "type": "Feature",
    "properties": {
      ...location,
      countryCode,
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
  const {
    country,
    updated,
    flag,
    cases,
    deaths,
    recovered
  } = properties

  let casesString = `${cases}`;

  if ( cases > 1000 ) {
    casesString = `${casesString.slice(0, -3)}k+`
  }

  return `
    <span class="icon-marker">
      <span class="icon-marker-tooltip">
        <h2>${flag} ${country}</h2>
        <ul>
          <li><strong>Confirmed:</strong> ${cases}</li>
          <li><strong>Deaths:</strong> ${deaths}</li>
          <li><strong>Recovered:</strong> ${recovered}</li>
          <li><strong>Last Update:</strong> ${updated}</li>
        </ul>
      </span>
      ${ casesString }
    </span>
  `;
}