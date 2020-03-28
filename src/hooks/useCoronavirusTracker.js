import { useEffect, useState } from 'react';
import axios from 'axios';

const API_HOST = 'https://coronavirus-tracker-api.herokuapp.com/v2';

const ENDPOINTS = [
  {
    id: 'default',
    path: '/',
    isDefault: true
  },
  {
    id: 'locations',
    path: '/locations'
  }
]

const defaultState = {
  data: null,
  state: 'ready'
}

const useCoronavirusTracker = ({ api = 'default' }) => {

  const [tracker = {}, updateTracker] = useState(defaultState)

  async function fetchTracker() {
    let route = ENDPOINTS.find(({ id } = {}) => id === api);

    if ( !route ) {
      route = ENDPOINTS.find(({ isDefault } = {}) => !!isDefault);
    }

    let response;

    try {
      updateTracker((prev) => {
        return {
          ...prev,
          state: 'loading'
        }
      });
      response = await axios.get(`${API_HOST}${route.path}`);
    } catch(e) {
      updateTracker((prev) => {
        return {
          ...prev,
          state: 'error',
          error: e
        }
      });
      return;
    }

    const { data } = response;

    updateTracker((prev) => {
      return {
        ...prev,
        state: 'ready',
        data
      }
    });

  }

  useEffect(() => {
    fetchTracker()
  }, [api])

  return {
    fetchTracker,
    ...tracker
  }
};

export default useCoronavirusTracker;
