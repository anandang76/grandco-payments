import { Client, ErrorFunction } from './Client.js';
import themeConfig from '../../theme.config.tsx';

const URL = `${themeConfig.apiURL}info/`;
const pageURL = `${themeConfig.apiURL}page/`;
const AlertURL = `${URL}alerts/`;

export const GetDashboard = async () => {
    try {
        return await Client.post(`${URL}getInfo`);
    } catch (error) {
        return ErrorFunction(error);
    }
};

export const GetAlerts = async () => {
    try {
        return await Client.post(`${URL}alerts`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetUpdateAlerts = async () => {
    try {
        return await Client.post(`${pageURL}dashboard`);
    } catch (error) {
        console.error(error);
        return ErrorFunction(error);
    }
}

export const GetDevice = async (data) => {
    try {
        return await Client.post(`${pageURL}device`, data)
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetSensor = async (data) => {
    try {
        return await Client.post(`${pageURL}sensor`, data)
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetGraph = async (data) => {
    try {
        return await Client.post(`${pageURL}sensorGraph`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetAlertStatus = async (data) => {
    try {
        return await Client.post(`${AlertURL}currentStatus`, data);
        // return Client.post(`${URL}alertCurrentStatus`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const ClearLatchAlert = async (data) => {
    try {
        return await Client.post(`${AlertURL}userClear`, data);
        // return Client.post(`${URL}alertUserClear`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetLocationDetails = async (data) => {
    try {
        return await Client.post(`${themeConfig.apiURL}getLocationDetails`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const getAQIGraph = async (data) => {
    try {
        return await Client.post(`${pageURL}aqiGraph`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const setLocalStorageData = async () => {
    try {
        let response = await GetDashboard();

        if(response?.data?.status == "success"){
            let { location, branch, facility, building, floor, zone, devices, sensors } = response?.data?.data;

            localStorage.setItem('location', JSON.stringify(location));
            localStorage.setItem('branch', JSON.stringify(branch));
            localStorage.setItem('facility', JSON.stringify(facility));
            localStorage.setItem('building', JSON.stringify(building));
            localStorage.setItem('floor', JSON.stringify(floor));
            localStorage.setItem('zone', JSON.stringify(zone));
            localStorage.setItem('devices', JSON.stringify(devices));
            localStorage.setItem('sensors', JSON.stringify(sensors));
        }
    } catch (error) {
        return ErrorFunction(error);
    }
}
