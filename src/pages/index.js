import React, { useRef, useEffect } from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';
import { Marker } from 'react-leaflet';

import { promiseToFlyTo, getCurrentLocation } from 'lib/map';
import { useCoronavirusTracker } from 'hooks';

import Layout from 'components/Layout';
import Container from 'components/Container';
import Map from 'components/Map';

const LOCATION = {
  lat: 0,
  lng: 0
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 1;

const IndexPage = () => {
  const { data = {} } = useCoronavirusTracker({
    api: 'locations'
  });

  console.log('data', data);

  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */

  async function mapEffect({ leafletElement: map } = {}) {
    if ( !map ) return;

    map.eachLayer((layer = {}) => {
      const { options = {} } = layer;
      const { name } = options;
      if ( name && name === 'OpenStreetMap') return;
      map.removeLayer(layer);
    });

    const { locations = [] } = data || {};

    if ( locations.length === 0 ) return;

    const locationsGeoJson = {
      "type": "FeatureCollection",
      "features": locations.map((location = {}) => {
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
      })
    }

    const locationsGeoJsonLayers = new L.geoJson(locationsGeoJson);
    const bounds = locationsGeoJsonLayers.getBounds();

    locationsGeoJsonLayers.addTo(map);

    map.fitBounds(bounds);
  }

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'OpenStreetMap',
    zoom: DEFAULT_ZOOM,
    mapEffect
  };

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>

      <Map {...mapSettings} />

      <Container type="content" className="text-center home-start">
        <h2>Still Getting Started?</h2>
        <p>Run the following in your terminal!</p>
        <pre>
          <code>gatsby new [directory] https://github.com/colbyfayock/gatsby-starter-leaflet</code>
        </pre>
        <p className="note">Note: Gatsby CLI required globally for the above command</p>
      </Container>
    </Layout>
  );
};

export default IndexPage;
