import { Client } from './Client.js'
import { v4 as uuidv4 } from 'uuid';
import themeConfig from '../theme.config';


const getDeviceToken = async (parameters) => {
    try {
      console.info(`Start get device token from server...`);
      const tokenURL = `${themeConfig.SERVER_URL}/auth/login`; // Using themeConfig for SERVER_URL
      console.info(`TokenURL: ${tokenURL}`);
      const authData = parameters;
      console.info(`Auth Data: ${JSON.stringify(authData)}`);
      // Make the POST request using Client instead of instance
      const response = await Client.post(tokenURL, authData);
      const token = response?.data?.access_token;
      console.info(`End get device token from server...`);
      // Save the token using the setAccessToken function
      return response?.data?.token;
    } catch (error) {
      console.error(`Failed to get device token: ${error.message}`);
      throw error;
    }
};

export const openPaymentGateway = async (deviceID) => {
    try {
      console.info(`Open Payment Gateway Request Initiated`);
  
      const openPaymentGatewayData = {
        method: "openPaymentGateway",
        requestId: uuidv4(), // Generates a unique ID
        targetType: "paymentGatewayConverge",
        version: "1.0",
        parameters: {
          app: themeConfig.APP,
          email: themeConfig.EMAIL,
          merchantId: themeConfig.MERCHANTID,
          pin: themeConfig.PIN,
          userId: themeConfig.USERID,
          handleDigitalSignature: themeConfig.HANDLEDIGITALSIGNATURE,
          paymentGatewayEnvironment: themeConfig.PAYMENTGATEWAYENVIRONMENT,
          vendorId: themeConfig.VENDORID,
          vendorAppName: themeConfig.VENDORAPPNAME,
          vendorAppVersion: themeConfig.VENDORAPPVERSION,
          bmsUsername: themeConfig.BMSUSERNAME,
          bmsPassword: themeConfig.BMSPASSWORD,
          overrideDefaultTerminalLanguage: {
            languageInformation: {
              languageCode: "EN",
              countryCode: "CA",
            },
          },
          overrideDebitNetworkPreferences: {
            visa: "NO_PREFERENCE",
            mastercard: "NO_PREFERENCE",
            discover: "NO_PREFERENCE",
          },
        },
      };
  
      // Make the POST request using the Client instance
      const response = await Client.post(themeConfig.commerceSDKURL, openPaymentGatewayData);
      console.info(`deviceID: ${deviceID}`);
  
      // Get the device token asynchronously
      const getDeviceTokenResponse = await getDeviceToken({ deviceID });
      console.info(`Open Payment Gateway Request success`);
      
      // Return the success response with data and token
      return {
        success: true,
        data: response?.data?.data,
        token: getDeviceTokenResponse,
      };
    } catch (error) {
      // Handle errors and log them
    //   console.error(`Open Payment Gateway Request failed: ${error?.message}`);
      return {
        success: false,
        data: error?.message,
      };
    }
};


