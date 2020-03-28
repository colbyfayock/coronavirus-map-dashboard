import L from 'leaflet';

/**
 * geoJsonToMarkers
 */

export function geoJsonToMarkers(geoJson, options) {
  return new L.GeoJSON(geoJson, {
    pointToLayer: pointToLayerMarkerCreator(options)
  });
}

/**
 * clearMapLayers
 */

export function pointToLayerMarkerCreator({ featureToHtml } = {}) {
  return function(feature = {}, latlng) {
    let html = `<span class="icon-marker"></span>`;

    if ( typeof featureToHtml === 'function' ) {
      html = featureToHtml(feature);
    }

    return L.marker( latlng, {
      icon: L.divIcon({
        className: 'icon',
        html
      }),
      riseOnHover: true
    })
  }

}

/**
 * clearMapLayers
 */

export function clearMapLayers({ map, excludeByName = [] }) {
  if ( !map || typeof map.eachLayer !== 'function' ) return;
  const layersRemoved = [];

  map.eachLayer((layer = {}) => {
    const { options = {} } = layer;
    const { name } = options;

    if ( name && excludeByName.includes(name)) return;

    layersRemoved.push(layer);

    map.removeLayer(layer);
  });

  return layersRemoved;
}

/**
 * promiseToFlyTo
 * @description
 */

export function promiseToFlyTo( map, { zoom, center }) {
  return new Promise(( resolve, reject ) => {
    const baseError = 'Failed to fly to area';

    if ( !map.flyTo ) {
      reject( `${baseError}: no flyTo method on map` );
    }

    if ( typeof zoom !== 'number' ) {
      reject( `${baseError}: zoom invalid number ${zoom}` );
    }

    const mapCenter = center || map.getCenter();
    const mapZoom = zoom || map.getZoom();

    map.flyTo( mapCenter, mapZoom, {
      duration: 2
    });

    map.once( 'moveend', () => {
      resolve();
    });
  });
}

/**
 * getCurrentLocation
 * @description
 */

export function getCurrentLocation() {
  return new Promise(( resolve, reject ) => {
    navigator.geolocation.getCurrentPosition(
      ( pos ) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      ( err ) => reject( err )
    );
  });
}
