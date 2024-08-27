import axios from "axios";
import { v4 as uuidv4 } from "uuid";
const uniqueId = uuidv4();

const BASE_URL = "https://localhost:9790/rest/command";

const openPaymentGatewayData = {
  method: "openPaymentGateway",
  requestId: uniqueId,
  targetType: "paymentGatewayConverge",
  version: "1.0",
  parameters: {
    app: "VMM",
    email: "james@grandco.ca",
    merchantId: "0029444",
    pin: "JTY770VXX0B3Y8VDID0DYNLAKO61IQGZFTR8H8W4LUXBEI6B7L4KFAE4H48PRBXD",
    userId: "apiuser642801",
    handleDigitalSignature: true,
    paymentGatewayEnvironment: "DEMO",
    vendorId: "sc900389",
    vendorAppName: "Grandco Inc",
    vendorAppVersion: "1.0",
    bmsUsername: "tJovqWdIQgyLJoiIAgvJNw",
    bmsPassword: "Ty5g09Sz0qR_1XzAoivmUKFTo_9fzBZMcAUqk63Ip_E",
    overrideDefaultTerminalLanguage: {
      languageInformation: {
        languageCode: "UNSET",
        countryCode: "UNSET",
      },
    },
    overrideDebitNetworkPreferences: {
      visa: "NO_PREFERENCE",
      mastercard: "US_COMMON_DEBIT",
      discover: "GLOBAL_NETWORK",
    },
  },
};

const apiService = {
  openPaymentGateway: async () => {
    const response = await axios.post(
      `${BASE_URL}`,
      `${openPaymentGatewayData}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  },
  startPaymentTransaction: async () => {
    const response = await axios.post(
      `${BASE_URL}`,
      `${openPaymentGatewayData}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  },
};

export default apiService;
