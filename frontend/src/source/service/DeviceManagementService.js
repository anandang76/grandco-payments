import { Client, ErrorFunction } from './Client.js';
import themeConfig from '../../theme.config.tsx';

const CategoriesURL = `${themeConfig.apiURL}deviceManagement/categories/`;
const UnitsURL = `${themeConfig.apiURL}deviceManagement/units/`;
const SensorOutputURL = `${themeConfig.apiURL}deviceManagement/sensorOutput/`;
const AQIUrl = `${themeConfig.apiURL}deviceManagement/aqi/`;
const DeviceURL = `${themeConfig.apiURL}deviceConfig/device/`;
const SensorURL = `${themeConfig.apiURL}deviceConfig/sensor/`;
const SensorTypeURL = `${themeConfig.apiURL}deviceManagement/sensorType/`;
const CommunicationConfigURL = `${themeConfig.apiURL}deviceManagement/communicationConfig/`;

export const GetCategories = async () => {
    try {
        return await Client.post(CategoriesURL.slice(0, -1));
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const AddCategory = async (data) => {
    try {
        return await Client.post(`${CategoriesURL}add`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetCategory = async (data) => {
    try {
        return await Client.post(`${CategoriesURL}${data.categoryID}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const EditCategory = async (data) => {
    try {
        return await Client.post(`${CategoriesURL}edit`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const DeleteCategory = async (data) => {
    try {
        return await Client.post(`${CategoriesURL}delete`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetUnit = async (data) => {
    try {
        return await Client.post(`${UnitsURL}get/${data.id}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const AddUnit = async (data) => {
    try {
        return await Client.post(`${UnitsURL}add`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const UpdateUnit = async (data) => {
    try {
        return await Client.post(`${UnitsURL}edit/${data.id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const DeleteUnit = async (data) => {
    try {
        return await Client.post(`${UnitsURL}delete/${data.id}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetSensorOutput = async (data) => {
    try {
        return await Client.post(`${SensorOutputURL}get/${data.id}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const AddSensorOutput = async (data) => {
    try {
        return await Client.post(`${SensorOutputURL}add`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const UpdateSensorOutput = async (data) => {
    try {
        return await Client.post(`${SensorOutputURL}edit/${data.id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const DeleteSensorOutput = async (data) => {
    try {
        return await Client.post(`${SensorOutputURL}delete/${data.id}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetAQI = async (data) => {
    try {
        return await Client.post(`${AQIUrl}get/${data.id}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const AddAQI = async (data) => {
    try {
        return await Client.post(`${AQIUrl}add`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const UpdateAQI = async (data) => {
    try {
        return await Client.post(`${AQIUrl}edit/${data.id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const DeleteAQI = async (data) => {
    try {
        return await Client.post(`${AQIUrl}delete/${data.id}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetAllDevices = async () => {
    try {
        return await Client.post(`${DeviceURL}all`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const MoveDeviceToAnotherZone = async (data) => {
    try {
        return await Client.post(`${DeviceURL}move/${data.id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetAllSensors = async () => {
    try {
        return await Client.post(`${SensorURL}all`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const MoveSensorToAnotherDevice = async (data) => {
    try {
        return await Client.post(`${SensorURL}move/${data.id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetSensorType = async (data) => {
    try {
        return await Client.post(`${SensorTypeURL}get/${data.id}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const AddSensorType = async (data) => {
    try {
        return await Client.post(`${SensorTypeURL}add`, data)
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const UpdateSensorType = async (data) => {
    try {
        return await Client.post(`${SensorTypeURL}edit/${data.id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const DeleteSensorType = async (data) => {
    try {
        return await Client.post(`${SensorTypeURL}delete/${data.id}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetCommunicationConfig = async (data) => {
    try {
        return await Client.post(`${CommunicationConfigURL}get/${data.id}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const AddCommunicationConfig = async (data) => {
    try {
        return await Client.post(`${CommunicationConfigURL}add`, data)
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const UpdateCommunicationConfig = async (data) => {
    try {
        return await Client.post(`${CommunicationConfigURL}edit/${data.id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const DeleteCommunicationConfig = async (data) => {
    try {
        return await Client.post(`${CommunicationConfigURL}delete/${data.id}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}
