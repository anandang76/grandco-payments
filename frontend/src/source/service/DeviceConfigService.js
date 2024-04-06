import { Client, ErrorFunction } from './Client.js';
import themeConfig from '../../theme.config.tsx';

const LocationURL = `${themeConfig.apiURL}deviceConfig/location/`;
const BranchURL = `${themeConfig.apiURL}deviceConfig/branch/`;
const FacilityURL = `${themeConfig.apiURL}deviceConfig/facility/`;
const BuildingURL = `${themeConfig.apiURL}deviceConfig/building/`;
const FloorURL = `${themeConfig.apiURL}deviceConfig/floor/`;
const ZoneURL = `${themeConfig.apiURL}deviceConfig/zone/`;
const DeviceURL = `${themeConfig.apiURL}deviceConfig/device/`;
const EventLogURL = `${DeviceURL}eventLog/`;
const SensorURL = `${themeConfig.apiURL}deviceConfig/sensor/`;
const bumpTestURL = `${themeConfig.apiURL}deviceConfig/bumpTest/`;
const removeImageURL = `${themeConfig.apiURL}deviceConfig/deleteImage/`;

export const GetLocation = async (data) => {
    try {
        return await Client.post(`${LocationURL}get/${data.id}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const AddNewLocation = async (data) => {
    try {
        return await Client.post(`${LocationURL}add`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const UpdateLocation = async (id, data) => {
    try {
        return await Client.post(`${LocationURL}edit/${id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const DeleteLocation = async (data) => {
    try {
        return await Client.post(`${LocationURL}delete/${data.id}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetBranch = async (data) => {
    try {
        return await Client.post(`${BranchURL}get/${data.id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const AddNewBranch = async (data) => {
    try {
        return await Client.post(`${BranchURL}add`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const UpdateBranch = async (id, data) => {
    try {
        return await Client.post(`${BranchURL}edit/${id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const DeleteBranch = async (data) => {
    try {
        return await Client.post(`${BranchURL}delete/${data.id}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetFacility = async (data) => {
    try {
        return await Client.post(`${FacilityURL}get/${data.id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const AddNewFacility = async (data) => {
    try {
        return await Client.post(`${FacilityURL}add`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const UpdateFacility = async (id, data) => {
    try {
        return await Client.post(`${FacilityURL}edit/${id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const DeleteFacility = async (data) => {
    try {
        return await Client.post(`${FacilityURL}delete/${data.id}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetBuilding = async (data) => {
    try {
        return await Client.post(`${BuildingURL}get/${data.id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const AddNewBuilding = async (data) => {
    try {
        return await Client.post(`${BuildingURL}add`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const UpdateBuilding = async (id, data) => {
    try {
        return await Client.post(`${BuildingURL}edit/${id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const DeleteBuilding = async (data) => {
    try {
        return await Client.post(`${BuildingURL}delete/${data.id}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetFloor = async (data) => {
    try {
        return await Client.post(`${FloorURL}get/${data.id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const AddNewFloor = async (data) => {
    try {
        return await Client.post(`${FloorURL}add`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const UpdateFloor = async (id, data) => {
    try {
        return await Client.post(`${FloorURL}edit/${id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const DeleteFloor = async (data) => {
    try {
        return await Client.post(`${FloorURL}delete/${data.id}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetAllZones = async () => {
    try {
        return await Client.post(`${ZoneURL}all`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetZone = async (data) => {
    try {
        return await Client.post(`${ZoneURL}get/${data.id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const AddNewZone = async (data) => {
    try {
        return await Client.post(`${ZoneURL}add`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const UpdateZone = async (id, data) => {
    try {
        return await Client.post(`${ZoneURL}edit/${id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const DeleteZone = async (data) => {
    try {
        return await Client.post(`${ZoneURL}delete/${data.id}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetDevice = async (data) => {
    try {
        return await Client.post(`${DeviceURL}get/${data.id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const AddNewDevice = async (data) => {
    try {
        return await Client.post(`${DeviceURL}add`, data)
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const UpdateDevice = async (id, data) => {
    try {
        return await Client.post(`${DeviceURL}edit/${id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const updateBinFile = async (id, data) => {
    try {
        return await Client.post(`${DeviceURL}binFile/${id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const ChangeDeviceMode = async (id, data) => {
    try {
        return await Client.post(`${DeviceURL}changeMode/${id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const getDeviceDebugData = async (data) => {
    try {
        return await Client.post(`${DeviceURL}debug`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const getEventLogData = async (data) => {
    try {
        return await Client.post(`${EventLogURL}get`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const deleteEventLogData = async (data) => {
    try {
        return await Client.post(`${EventLogURL}delete/${data.id}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const DeleteDevice = async (data) => {
    try {
        return await Client.post(`${DeviceURL}delete/${data.id}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const CopyDevice = async (id) => {
    try {
        return await Client.post(`${DeviceURL}copy/${id}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const AddDeviceCommuConfig = async (id, data) => {
    try {
        return await Client.post(`${DeviceURL}commun/${id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetSensor = async (data) => {
    try {
        return await Client.post(`${SensorURL}get/${data.id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const AddNewSensor = async (data) => {
    try {
        return await Client.post(`${SensorURL}add`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const UpdateSensor = async (id, data) => {
    try {
        return await Client.post(`${SensorURL}edit/${id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const UpdateSensorSettings = async (id, data) => {
    try {
        return await Client.post(`${SensorURL}settings/${id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const CopySensor = async (id) => {
    try {
        return await Client.post(`${SensorURL}copy/${id}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const DeleteSensor = async (data) => {
    try {
        return await Client.post(`${SensorURL}delete/${data.id}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const startBumpTestReport = async (data) => {
    try {
        return await Client.post(`${bumpTestURL}start`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const runBumpTest = async (data) => {
    try {
        return await Client.post(`${bumpTestURL}run`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const removeImage = async (table, id) => {
    try {
        return await Client.post(`${removeImageURL}${table}/${id}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}
