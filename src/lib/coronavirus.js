import { getBoundsOfCountryByIsoAlpha2Code } from 'osm-countries-bounds';
import { getEmojiFlag } from 'countries-list';

import { commafy, friendlyDate } from 'lib/util';

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

  let stats = [
    {
      label: 'Confirmed',
      value: cases,
      type: 'number'
    },
    {
      label: 'Deaths',
      value: deaths,
      type: 'number'
    },
    {
      label: 'Recovered',
      value: recovered,
      type: 'number'
    },
    {
      label: 'Last Update',
      value: updated,
      type: 'date'
    }
  ];

  stats = stats.map(stat => {
    let value = stat?.value;

    if ( !value ) return stat;

    let newValue = value;

    if ( stat?.type === 'number' ) {
      newValue = commafy(value);
    if ( value > 999999 ) {
        newValue = `${newValue.slice(0, -8)}m+`
    } else if ( value > 999 ) {
        newValue = `${newValue.slice(0, -4)}k+`
      }
    } else if ( stat?.type === 'date' ) {
      newValue = friendlyDate(newValue);
    }

    return {
      ...stat,
      value: newValue
    }
  })

  let statsString = '';

  stats.forEach(({label, value}) => {
    statsString = `
      ${statsString}
      <li><strong>${label}:</strong> ${value}</li>
    `
  });

  const casesString = stats.find(({label}) => label === 'Confirmed')?.value;

  return `
    <span class="icon-marker">
      <span class="icon-marker-tooltip">
        <h2>${flag} ${country}</h2>
        <ul>${statsString}</ul>
      </span>
      ${ casesString }
    </span>
  `;
}

