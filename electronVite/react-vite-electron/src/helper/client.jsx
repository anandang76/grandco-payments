// apiHelper.js
import axios from 'axios';
// import config from './../'; // Import the config file
import themeConfig from './../theme.config';

// Reusable function for making API calls
export const apiCall = (endpoint, method = 'get', data = null) => {
  const url = `${themeConfig.baseURL}${endpoint}`;

  return axios({
    method,
    url,
    data,
  });
};
