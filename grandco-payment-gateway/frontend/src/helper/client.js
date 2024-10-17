// apiHelper.js
import axios from 'axios';
import config from './../config'; // Import the config file

// Reusable function for making API calls
export const apiCall = (endpoint, method = 'get', data = null) => {
  const url = `${config.baseURL}${endpoint}`;

  return axios({
    method,
    url,
    data,
  });
};
