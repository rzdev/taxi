import axios from 'axios';
import {BASE_URL} from './constants';

export const API = () => {
  const cancelSource = axios.CancelToken.source();
  const request = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: {
      accept: 'application/json',
    },
    cancelToken: cancelSource.token,
  });

  return {request, cancelSource};
};
  