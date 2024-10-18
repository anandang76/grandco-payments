import axios from 'axios';
import themeConfig from '../theme.config'; 


var access_token = localStorage.getItem('user');
const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const Client = axios.create({
  headers: {
    "Content-Type": "multipart/form-data",
    "Accept": "application/json",
    "TimeZone" : browserTimeZone,
    "Authorization": `Bearer ${access_token}`,
    "Customer-ID" : themeConfig.CUSTOMER_ID
  },
});



