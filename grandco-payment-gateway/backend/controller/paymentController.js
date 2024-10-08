const path = require('path');
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const https = require("https");
const { logger } = require("../utils/logger");
// var config = require("../../config/config")();
var config = require(path.join(__dirname, './../../config/config'))();

const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});
instance.defaults.headers.common['Customer-ID'] = config.CUSTOMER_ID;
console.log("Customer ID: "+ config.CUSTOMER_ID);

const BASE_URL = "https://localhost:9790/rest/command";
const SERVER_URL = config.SERVER_URL;
const CUSTOMER_ID = config.CUSTOMER_ID;
// const SERVER_URL = "http://localhost/projects/grandco-payments/backend/public/api";
var accessToken = null;


function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

exports.openPaymentGateway = async (req, res, next) => {
  logger.info(`Open Payment Gateway Request Initated`);
  const deviceID = req.body.deviceID;
  logger.info(`deviceID : ${deviceID}`);
  const openPaymentGatewayData = {
    method: "openPaymentGateway",
    requestId: uuidv4(),
    targetType: "paymentGatewayConverge",
    version: "1.0",
    parameters: {
      app: config.APP,
      email: config.EMAIL,
      merchantId: config.MERCHANTID,
      pin: config.PIN,
      userId: config.USERID,
      handleDigitalSignature: config.HANDLEDIGITALSIGNATURE,
      paymentGatewayEnvironment: config.PAYMENTGATEWAYENVIRONMENT,
      vendorId: config.VENDORID,
      vendorAppName: config.VENDORAPPNAME,
      vendorAppVersion: config.VENDORAPPVERSION,
      bmsUsername: config.BMSUSERNAME,
      bmsPassword: config.BMSPASSWORD,
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
  instance
    .post(BASE_URL, openPaymentGatewayData)
    .then(async function (response) {
      // logger.info("&&&&&&&&&&&&&&&&&&&")
      // console.log(response);
      // logger.info("&&&&&&&&&&&&&&&&&&&")
      
      var getDeviceTokenResponse = await getDeviceToken({deviceID: deviceID});

      logger.info(`Open Payment Gateway Request success`);
      res.status(200).json({ success: true, data: response?.data?.data, token: getDeviceTokenResponse });
    })
    .catch(function (error) {
      logger.error(`Open Payment Gateway Request failed: ${error?.message}`);
      res.status(200).json({ success: false, data: error?.message });
    });
};

exports.startPaymentTransaction = async (req, res, next) => {
  const paymentGatewayId = req.body.paymentId;
  const amount = parseInt((req.body.amount * 100).toFixed());
  const cardType = req.body.cardType;
  const isManualEntry = req.body.isManualEntry;
  const cardReaderInfo = req.body.cardReaderInfo;
  const payementParameters = {
    paymentGatewayId,
    transactionType: "SALE",
    baseTransactionAmount: {
      value: amount,
      currencyCode: "CAD",
    },
    tenderType: "CARD",
    cardType: cardType || null,
    cardEntryTypes: isManualEntry ? ["MANUALLY_ENTERED"] : undefined,
    isTaxInclusive: false,
    partialApprovalAllowed: true,
    taxAmounts: [
      {
        value: 0,
        currencyCode: "CAD",
      },
    ],
    discountAmounts: null,
  };
  const startPaymentTransactionData = {
    method: "startPaymentTransaction",
    requestId: uuidv4(),
    targetType: "paymentGatewayConverge",
    version: "1.0",
    parameters: payementParameters,
  };
  if (!paymentGatewayId) {
    res
      .status(400)
      .json({ success: false, data: "Payment Id is missing in the request" });
    return;
  }

  instance
    .post(BASE_URL, startPaymentTransactionData)
    .then(async function (response) {
      logger.info(`Start Payment Transaction Request success`);
      const chanId = response?.data?.data?.paymentGatewayCommand?.chanId;
      var transactionsData = {};
      transactionsData.paymentInfo = {...payementParameters };
      transactionsData.cardReaderInfo = { ...cardReaderInfo,};
      transactionsData.chanId = chanId;
      var addTransaction = {};
      if (isManualEntry) {
        const getPaymentTransactionStatusResponse = await getPaymentTransactionDetails({ paymentGatewayId, chanId });
        const continuePaymentResponse = await continuePaymentTransaction(
          paymentGatewayId,
          chanId
        );
        logger.info(`Start Payment Transaction Request to server...`);
        addTransaction = await addTransactionDetails(transactionsData);
        res.status(200).json({ success: true, data: response?.data?.data, addTransaction: addTransaction.data });
      } else {
        logger.info(`Start Payment Transaction Request to server...`);
        addTransaction = await addTransactionDetails(transactionsData);
        res.status(200).json({ success: true, data: response?.data?.data, addTransaction: addTransaction.data });
      }
    })
    .catch(function (error) {
      logger.error(`Start Payment Gateway Request failed: ${error?.message}`);
      res.status(200).json({ success: false, data: error?.message });
    });
};

const continuePaymentTransaction = async (paymentId, chanId) => {
  logger.info(`Continue Payment Transaction Request Initated`);
  const continuePaymentTransactionData = {
    method: "continuePaymentTransaction",
    requestId: uuidv4(),
    targetType: "paymentGatewayConverge",
    version: "1.0",
    parameters: {
      paymentGatewayId: paymentId,
      chanId: chanId,
      CardPresent: false,
    },
  };

  instance
    .post(BASE_URL, continuePaymentTransactionData)
    .then(function (response) {
      logger.info(`Continue Payment Transaction Request success`);
      return { success: true, data: response?.data?.data };
    })
    .catch(function (error) {
      logger.error(
        `Continue Payment Transaction Request failed: ${error?.message}`
      );
      return { success: false, data: error?.message };
    });
};

exports.getPaymentTransactionStatus = async (req, res, next) => {
  logger.info(`Get Payment Transaction Status Request Initated`);
  const getPaymentTransactionStatusData = {
    method: "getPaymentTransactionStatus",
    requestId: uuidv4(),
    targetType: "paymentGatewayConverge",
    version: "1.0",
    parameters: req.body,
  };

  instance
    .post(BASE_URL, getPaymentTransactionStatusData)
    .then(async function (response) {
      var chanId = req?.body?.chanId;
      var transactionsData = {};
      transactionsData = response?.data?.data;
      // transactionsData.cardReaderInfo = { ...cardReaderInfo,};
      // transactionsData.chanId = chanId;
      console.log(response?.data?.data);

      var updateTransaction = await updateTransactionDetails(transactionsData, chanId);
      console.log(transactionsData);
      console.log("-=============");
      logger.info(`Get Payment Transaction Status Request success`);
      res.status(200).json({ success: true, data: response?.data?.data, updateTransaction: updateTransaction?.data });
    })
    .catch(function (error) {
      logger.error(
        `Get Payment Transaction Status Request failed: ${error?.message}`
      );
      res.status(200).json({ success: false, data: error?.message });
    });
};

const getPaymentTransactionDetails = async (parameters) => {
  const getPaymentTransactionStatusData = {
    method: "getPaymentTransactionStatus",
    requestId: uuidv4(),
    targetType: "paymentGatewayConverge",
    version: "1.0",
    parameters,
  };
  const response = await instance.post(
    BASE_URL,
    getPaymentTransactionStatusData
  );
  return response;
};

exports.cancelPaymentTransaction = async (req, res, next) => {
  logger.info(`Get Cancel Payment Transaction Request Initated`);
  const getCancelPaymentTransactionData = {
    method: "cancelPaymentTransaction",
    requestId: uuidv4(),
    targetType: "paymentGatewayConverge",
    version: "1.0",
    parameters: req.body,
  };

  instance
    .post(BASE_URL, getCancelPaymentTransactionData)
    .then(function (response) {
      logger.info(`Get Cancel Payment Transaction Request success`);
      res.status(200).json({ success: true, data: response?.data?.data });
    })
    .catch(function (error) {
      logger.error(
        `Get Cancel Payment Transaction Request failed: ${error?.message}`
      );
      res.status(200).json({ success: false, data: error?.message });
    });
};

exports.printReceipt = async (req, res, next) => {
  logger.info(`Get Print Receipt Request Initated`);
  const getPrintReceiptData = {
    method: "printReceipt",
    requestId: uuidv4(),
    targetType: "paymentGatewayConverge",
    version: "1.0",
    parameters: {
      receiptTerms: {
        CARD: "CreditCard",
        START: "Start",
        EXPIRY: "Expire",
        SALE: "Sale",
        REFUND: "Refundent",
        CASH: "Cashless",
        CHECK: "Checkered",
        GRATUITY: "Tipsy",
        TOTAL: "Totality",
        SUBTOTAL: "not the whole amount",
        DISCOUNT: "Discounted",
        TAX: "Taxi",
      },
      transactionId: null,
      localeLanguage: "en",
      localeCountry: "CA",
      utcDate: null,
      paymentGatewayId: req.body.paymentGatewayId,
      accountInfo: {
        name: "Grandco Inc",
        currencyCode: "CAD",
        businessEmail: "james@grandco.ca",
        address1: "7300 CHAPMAN HWY",
        city: "KNOXVILLE",
        stateProvince: "TN",
        postalCode: "37920",
        isGratuitySupported: false,
        marketSegment: "RETAIL",
      },
      currencyFormatPattern: "###,###.## USD",
      receiptRequestor: "CUSTOMER",
      languageInformation: {
        languageCode: "EN",
        countryCode: "CA",
      },
    },
  };

  instance
    .post(BASE_URL, getPrintReceiptData)
    .then(function (response) {
      logger.info(`Get Print Receipt Request success`);
      res.status(200).json({ success: true, data: response?.data?.data });
    })
    .catch(function (error) {
      logger.error(`Get Print Receipt Request failed: ${error?.message}`);
      res.status(200).json({ success: false, data: error?.message });
    });
};

exports.linkedRefund = async (req, res, next) => {
  logger.info(`Get Linked Refund Request Initated`);
  const refundAmount = parseInt((req.body.refundAmount * 100).toFixed());
  const getLinkedRefundData = {
    method: "linkedRefund",
    requestId: uuidv4(),
    targetType: "paymentGatewayConverge",
    version: "1.0",
    parameters: {
      baseTransactionAmount: {
        value: refundAmount,
        currencyCode: "CAD",
      },
      paymentGatewayId: req.body.paymentGatewayId,
      originalTransId: req.body.transId,
      tenderType: "CARD",
      cardType: "CREDIT",
    },
  };

  instance
    .post(BASE_URL, getLinkedRefundData)
    .then(function (response) {
      logger.info(`Get Linked Refund Request success`);
      res.status(200).json({ success: true, data: response?.data?.data });
    })
    .catch(function (error) {
      logger.error(`Get Linked Refund Request failed: ${error?.message}`);
      res.status(200).json({ success: false, data: error?.message });
    });
};

exports.getApiInfo = async (req, res, next) => {
  logger.info(`Get Linked getApiInfo Request Initiated`);
  try {
    const response = await exports.apiInfo();
    logger.info(`Get Linked getApiInfo Request success`);
    res.status(200).json({ success: true, data: response?.data });
  } catch (error) {
    logger.error(`Get Linked getApiInfo Request failed: ${error?.message}`);
    res.status(200).json({ success: false, data: error?.message });
  }
};

exports.apiInfo = async () => {
  logger.info(`Get Linked getApiInfo Request Initiated`);
  const cardReaderInfo = {
    method: "getApiInfo",
    requestId: uuidv4(),
    targetType: "api",
    version: "1.0",
    parameters: {
      "logLevel" : "DEBUG"
    },
  };
  try {
    const response = await instance.post(BASE_URL, cardReaderInfo);
    logger.info(`Get Linked getApiInfo Request success`);
    return { success: true, data: response?.data?.data };
  } catch (error) {
    logger.error(`Get Linked getApiInfo Request failed: ${error?.message}`);
    throw error;
  }
};


const setAccessToken = (token) => {
  accessToken = token;
};

const getAccessToken = () => {
  return accessToken;
};

const getDeviceToken = async (parameters) => {
  try {
    // const cachedToken = getCachedToken();
    // if (cachedToken) {
    //   return cachedToken;
    // }
    logger.info(`Start get device token from server...`);
    const tokenURL = `${SERVER_URL}/auth/login`;
    logger.info(`TokenURL : ${tokenURL}`);
    const authData = parameters;
    logger.info(`Auth Data ${authData}`);
    const response = await instance.post(tokenURL, authData);
    const token = response?.data?.access_token;
    logger.info(`End get device token from server...`);
    setAccessToken(token);
    return response?.data;
  } catch (error) {
    logger.error(`Failed to get device token: ${error.message}`);
    throw error;
  }
};


const addTransactionDetails = async (parameters) => {
  logger.info(`Start Add Transaction To server...`);
  const transactionURL = `${SERVER_URL}/sale/add`;
  logger.info(`addTransactionURL : ${transactionURL}`);
  const transactionData = parameters;
  logger.info(transactionData);
  console.log(transactionData);
  console.log("=============");
  const response = await instance.post(
    transactionURL,
    transactionData,
    {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    }
  );
  logger.info(`=== add done ===`);
  logger.info(`${response}`);
  logger.info(`End Add Transaction To server...`);
  return response;
};

const updateTransactionDetails = async (parameters, chanId) => {
  var transactionData = {}
  transactionData.paymentInfo = parameters?.paymentGatewayCommand?.paymentTransactionData;
  logger.info(`Start Update Transaction To server...`);
  const transactionURL = `${SERVER_URL}/sale/update/${chanId}`;
  logger.info(`UpdateTransactionURL : ${transactionURL}`);
  logger.info(transactionData);
  console.log(transactionData);
  const response = await instance.post(
    transactionURL,
    transactionData,
    {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    }
  );
  logger.info(`=== update done ===`);
  logger.info(`${response}`);
  logger.info(`End Update Transaction To server...`);
  return response;
};