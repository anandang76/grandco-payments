import { Client, ErrorFunction } from './Client.js'
import themeConfig from '../../theme.config.tsx';

let URL = `${themeConfig.apiURL}reports/`;
let calibrationReportURL = `${URL}calibrationReport/`;
let bumpTestReportURL = `${URL}bumpTestReport/`;
let limitEditLogsReportURL = `${URL}limitEditLogsReport/`;
let ReportsURL = themeConfig.reportsURL;
let eventLogsReportURL = `${URL}eventLogReport/`;

export const GetAQIReport = async (data) => {
    try {
        return await Client.post(`${URL}aqiReport`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const DownloadAQIReport = async (data) => {
    try {
        window.open(
            `${ReportsURL}getAqiReport.php?zoneID=${data.zoneID}&fromDateIn=${data.fromDate}&toDateIn=${data.toDate}&userEmail=${data.email}`,
            '_blank'
        );
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const SendAQIReport = async (data) => {
    try {
        return await Client.get(`${ReportsURL}getAqiReport.php?zoneID=${data.zoneID}&fromDateIn=${data.fromDate}&toDateIn=${data.toDate}&userEmail=${data.email}&sendEmail=YES`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetSensorReport = async (data) => {
    try {
        return await Client.post(`${URL}sensorReport`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const DownloadSensorReport = async (data) => {
    try {
        let url = `${ReportsURL}getSensorReport.php?deviceID=${data.deviceID}&fromDateIn=${data.fromDate}&toDateIn=${data.toDate}&userEmail=${data.email}`;
        if(data.locationID){
            url = `${url}&locationID=${data.locationID}`;
            if(data.branchID){
                url = `${url}&branchID=${data.branchID}`;
                if(data.facilityID){
                    url = `${url}&facilityID=${data.facilityID}`;
                    if(data.buildingID){
                        url = `${url}&buildingID=${data.buildingID}`;
                        if(data.floorID){
                            url = `${url}&floorID=${data.floorID}`;
                            if(data.zoneID){
                                url = `${url}&zoneID=${data.zoneID}`;
                            }
                        }
                    }
                }
            }
        }
        window.open(url, '_blank');
    }  catch (error) {
        return ErrorFunction(error);
    }
}

export const SendSensorReport = async (data) => {
    try {
        let url = `${ReportsURL}getSensorReport.php?deviceID=${data.deviceID}&fromDateIn=${data.fromDate}&toDateIn=${data.toDate}&userEmail=${data.email}&sendEmail=YES`;
        if(data.locationID){
            url = `${url}&locationID=${data.locationID}`;
            if(data.branchID){
                url = `${url}&branchID=${data.branchID}`;
                if(data.facilityID){
                    url = `${url}&facilityID=${data.facilityID}`;
                    if(data.buildingID){
                        url = `${url}&buildingID=${data.buildingID}`;
                        if(data.floorID){
                            url = `${url}&floorID=${data.floorID}`;
                            if(data.zoneID){
                                url = `${url}&zoneID=${data.zoneID}`;
                            }
                        }
                    }
                }
            }
        }
        return await Client.get(url);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetAlarmReport = async (data) => {
    try {
        return await Client.post(`${URL}alarmReport`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const DownloadAlarmReport = async (data) => {
    try {
        let url = `${ReportsURL}getAlarmsReport.php?fromDateIn=${data.fromDate}&toDateIn=${data.toDate}&userEmail=${data.email}`;
        // Check for all locations
        if(data.locationID){
            url = `${url}&locationID=${data.locationID}`;
            if(data.branchID){
                url = `${url}&branchID=${data.branchID}`;
                if(data.facilityID){
                    url = `${url}&facilityID=${data.facilityID}`;
                    if(data.buildingID){
                        url = `${url}&buildingID=${data.buildingID}`;
                        if(data.floorID){
                            url = `${url}&floorID=${data.floorID}`;
                            if(data.zoneID){
                                url = `${url}&zoneID=${data.zoneID}`;
                            }
                        }
                    }
                }
            }
        }

        // Check for deviceID
        if(data.deviceID){
            url = `${url}&deviceID=${data.deviceID}`;
        }
        window.open(url, '_blank');
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const SendAlarmReport = async (data) => {
    try {
        let url = `${ReportsURL}getAlarmsReport.php?fromDateIn=${data.fromDate}&toDateIn=${data.toDate}&userEmail=${data.email}&sendEmail=YES`;

        // Check for all locations
        if(data.locationID){
            url = `${url}&locationID=${data.locationID}`;
            if(data.branchID){
                url = `${url}&branchID=${data.branchID}`;
                if(data.facilityID){
                    url = `${url}&facilityID=${data.facilityID}`;
                    if(data.buildingID){
                        url = `${url}&buildingID=${data.buildingID}`;
                        if(data.floorID){
                            url = `${url}&floorID=${data.floorID}`;
                            if(data.zoneID){
                                url = `${url}&zoneID=${data.zoneID}`;
                            }
                        }
                    }
                }
            }
        }

        // Check for deviceID
        if(data.deviceID){
            url = `${url}&deviceID=${data.deviceID}`;
        }

        return await Client.get(url);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetBumpTestReport = async (data) => {
    try {
        return await Client.post(`${bumpTestReportURL}get`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const startBumpTestReport = async (data) => {
    try {
        return await Client.post(`${ReportsURL}doBumpTest.php?action=START&deviceID=${data.deviceID}&sensorID=${data.sensorID}&duration=${data.duration}&testType=${data.testType}&gasPercentage=${data.gasPercentage}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const runBumpTest = async (data) => {
    try {
        return await Client.post(`${ReportsURL}doBumpTest.php?action=RUN&deviceID=${data.deviceID}&sensorID=${data.sensorID}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const stopBumpTest = async (data) => {
    try {
        return await Client.post(`${ReportsURL}doBumpTest.php?action=STOP&deviceID=${data.deviceID}&sensorID=${data.sensorID}&userEmail=${data.email}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const addBumpTestReport = async (data) => {
    try {
        return await Client.post(`${bumpTestReportURL}add`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const DownloadBumpTestReport = async (data) => {
    try {
        let url = `${ReportsURL}getBumpTestReport.php?fromDateIn=${data.fromDate}&toDateIn=${data.toDate}&userEmail=${data.email}`;

        // Check for all locations
        if(data.locationID){
            url = `${url}&locationID=${data.locationID}`;
            if(data.branchID){
                url = `${url}&branchID=${data.branchID}`;
                if(data.facilityID){
                    url = `${url}&facilityID=${data.facilityID}`;
                    if(data.buildingID){
                        url = `${url}&buildingID=${data.buildingID}`;
                        if(data.floorID){
                            url = `${url}&floorID=${data.floorID}`;
                            if(data.zoneID){
                                url = `${url}&zoneID=${data.zoneID}`;
                            }
                        }
                    }
                }
            }
        }

        // Check for deviceID
        if(data.deviceID){
            url = `${url}&deviceID=${data.deviceID}`;
        }

        window.open(url, '_blank');
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const SendBumpTestReport = async (data) => {
    try {
        let url = `${ReportsURL}getBumpTestReport.php?fromDateIn=${data.fromDate}&toDateIn=${data.toDate}&userEmail=${data.email}&sendEmail=YES`;

        // Check for all locations
        if(data.locationID){
            url = `${url}&locationID=${data.locationID}`;
            if(data.branchID){
                url = `${url}&branchID=${data.branchID}`;
                if(data.facilityID){
                    url = `${url}&facilityID=${data.facilityID}`;
                    if(data.buildingID){
                        url = `${url}&buildingID=${data.buildingID}`;
                        if(data.floorID){
                            url = `${url}&floorID=${data.floorID}`;
                            if(data.zoneID){
                                url = `${url}&zoneID=${data.zoneID}`;
                            }
                        }
                    }
                }
            }
        }

        // Check for deviceID
        if(data.deviceID){
            url = `${url}&deviceID=${data.deviceID}`;
        }

        return await Client.get(url);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetCalibrationReport = async (data) => {
    try {
        return await Client.post(`${calibrationReportURL}get`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const addCalibrationReport = async (data) => {
    try {
        return await Client.post(`${calibrationReportURL}add`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const DownloadCalibrationReport = async (data) => {
    try {
        let url = `${ReportsURL}getCalibrationReport.php?fromDateIn=${data.fromDate}&toDateIn=${data.toDate}&userEmail=${data.email}`;

        // Check for all locations
        if(data.locationID){
            url = `${url}&locationID=${data.locationID}`;
            if(data.branchID){
                url = `${url}&branchID=${data.branchID}`;
                if(data.facilityID){
                    url = `${url}&facilityID=${data.facilityID}`;
                    if(data.buildingID){
                        url = `${url}&buildingID=${data.buildingID}`;
                        if(data.floorID){
                            url = `${url}&floorID=${data.floorID}`;
                            if(data.zoneID){
                                url = `${url}&zoneID=${data.zoneID}`;
                            }
                        }
                    }
                }
            }
        }

        // Check for deviceID
        if(data.deviceID){
            url = `${url}&deviceID=${data.deviceID}`;
        }

        window.open(url, '_blank');
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const SendCalibrationReport = async (data) => {
    try {
        let url = `${ReportsURL}getCalibrationReport.php?fromDateIn=${data.fromDate}&toDateIn=${data.toDate}&userEmail=${data.email}&sendEmail=YES`;

        // Check for all locations
        if(data.locationID){
            url = `${url}&locationID=${data.locationID}`;
            if(data.branchID){
                url = `${url}&branchID=${data.branchID}`;
                if(data.facilityID){
                    url = `${url}&facilityID=${data.facilityID}`;
                    if(data.buildingID){
                        url = `${url}&buildingID=${data.buildingID}`;
                        if(data.floorID){
                            url = `${url}&floorID=${data.floorID}`;
                            if(data.zoneID){
                                url = `${url}&zoneID=${data.zoneID}`;
                            }
                        }
                    }
                }
            }
        }

        // Check for deviceID
        if(data.deviceID){
            url = `${url}&deviceID=${data.deviceID}`;
        }

        return await Client.get(url);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetUserLogReport = async (data) => {
    try {
        return await Client.post(`${URL}userLogReport`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const DownloadUserLogReport = async (data) => {
    try {
        let url = `${ReportsURL}getUserLogReport.php?fromDateIn=${data.fromDate}&toDateIn=${data.toDate}&userEmail=${data.email}`;

        if(data.userID){
            url = `${ReportsURL}getUserLogReport.php?fromDateIn=${data.fromDate}&toDateIn=${data.toDate}&userID=${data.userID}&userEmail=${data.email}`;
        }
        window.open(url, '_blank');
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const SendUserLogReport = async (data) => {
    try {
        let url = `${ReportsURL}getUserLogReport.php?fromDateIn=${data.fromDate}&toDateIn=${data.toDate}&userEmail=${data.email}&sendEmail=YES`;

        if(data.userID){
            url = `${ReportsURL}getUserLogReport.php?fromDateIn=${data.fromDate}&toDateIn=${data.toDate}&userID=${data.userID}&userEmail=${data.email}&sendEmail=YES`;
        }
        return await Client.get(url);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetServerUtilization = async (data) => {
    try {
        return await Client.post(`${URL}serverUtilizationReport`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const DownloadServerUtilization = async (data) => {
    try {
        window.open(
            `${ReportsURL}getServerUtilizationReport.php?fromDateIn=${data.fromDate}&toDateIn=${data.toDate}&userEmail=${data.email}`,
            '_blank'
        );
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const SendServerUtilization = async (data) => {
    try {
        return await Client.get(`${ReportsURL}getServerUtilizationReport.php?fromDateIn=${data.fromDate}&toDateIn=${data.toDate}&userEmail=${data.email}&sendEmail=YES`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetApplicationVersionReport = async () => {
    try {
        return await Client.post(`${URL}applicationVersionReport`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const DownloadApplicationVersionReport = async (data) => {
    try {
        window.open(
            `${ReportsURL}getApplicationVersionReport.php?userEmail=${data.email}`,
            '_blank'
        );
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const SendApplicationVersionReport = async (data) => {
    try {
        return await Client.get(`${ReportsURL}getApplicationVersionReport.php?userEmail=${data.email}&sendEmail=YES`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetFirmwareVersionReport = async (data) => {
    try {
        return await Client.post(`${URL}firmwareVersionReport`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const DownloadFirmwareVersionReport = async (data) => {
    try {
        let url = `${ReportsURL}getFirmwareVersionReport.php?userEmail=${data.email}`;
        // Check for all locations
        if(data.locationID){
            url = `${url}&locationID=${data.locationID}`;
            if(data.branchID){
                url = `${url}&branchID=${data.branchID}`;
                if(data.facilityID){
                    url = `${url}&facilityID=${data.facilityID}`;
                    if(data.buildingID){
                        url = `${url}&buildingID=${data.buildingID}`;
                        if(data.floorID){
                            url = `${url}&floorID=${data.floorID}`;
                            if(data.zoneID){
                                url = `${url}&zoneID=${data.zoneID}`;
                            }
                        }
                    }
                }
            }
        }

        // Check for deviceID
        if(data.deviceID){
            url = `${url}&deviceID=${data.deviceID}`;
        }

        window.open(url, '_blank');
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const SendFirmwareVersionReport = async (data) => {
    try {
        let url = `${ReportsURL}getFirmwareVersionReport.php?userEmail=${data.email}&sendEmail=YES`;

        // Check for all locations
        if(data.locationID){
            url = `${url}&locationID=${data.locationID}`;
            if(data.branchID){
                url = `${url}&branchID=${data.branchID}`;
                if(data.facilityID){
                    url = `${url}&facilityID=${data.facilityID}`;
                    if(data.buildingID){
                        url = `${url}&buildingID=${data.buildingID}`;
                        if(data.floorID){
                            url = `${url}&floorID=${data.floorID}`;
                            if(data.zoneID){
                                url = `${url}&zoneID=${data.zoneID}`;
                            }
                        }
                    }
                }
            }
        }

        // Check for deviceID
        if(data.deviceID){
            url = `${url}&deviceID=${data.deviceID}`;
        }

        return await Client.get(url);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetLimitEditLogReport = async (data) => {
    try {
        return await Client.post(`${limitEditLogsReportURL}${data.deviceID}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const DownloadLimitEditLogReport = async (data) => {
    try {
        let url = `${ReportsURL}getLimitEditLogReport.php?fromDateIn=${data.fromDate}&toDateIn=${data.toDate}&userEmail=${data.email}`;

        // Check for all locations
        if(data.locationID){
            url = `${url}&locationID=${data.locationID}`;
            if(data.branchID){
                url = `${url}&branchID=${data.branchID}`;
                if(data.facilityID){
                    url = `${url}&facilityID=${data.facilityID}`;
                    if(data.buildingID){
                        url = `${url}&buildingID=${data.buildingID}`;
                        if(data.floorID){
                            url = `${url}&floorID=${data.floorID}`;
                            if(data.zoneID){
                                url = `${url}&zoneID=${data.zoneID}`;
                            }
                        }
                    }
                }
            }
        }

        // Check for deviceID
        if(data.deviceID){
            url = `${url}&deviceID=${data.deviceID}`;
        }

        window.open(url, '_blank');
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const SendLimitEditLogReport = async (data) => {
    try {
        let url = `${ReportsURL}getLimitEditLogReport.php?fromDateIn=${data.fromDate}&toDateIn=${data.toDate}&userEmail=${data.email}&sendEmail=YES`;

        // Check for all locations
        if(data.locationID){
            url = `${url}&locationID=${data.locationID}`;
            if(data.branchID){
                url = `${url}&branchID=${data.branchID}`;
                if(data.facilityID){
                    url = `${url}&facilityID=${data.facilityID}`;
                    if(data.buildingID){
                        url = `${url}&buildingID=${data.buildingID}`;
                        if(data.floorID){
                            url = `${url}&floorID=${data.floorID}`;
                            if(data.zoneID){
                                url = `${url}&zoneID=${data.zoneID}`;
                            }
                        }
                    }
                }
            }
        }

        // Check for deviceID
        if(data.deviceID){
            url = `${url}&deviceID=${data.deviceID}`;
        }

        return await Client.get(url);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetEventLogReport = async (data) => {
    try {
        return await Client.post(`${eventLogsReportURL.slice(0, -1)}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const DownloadEventLogReport = async (data) => {
    try {
        let url = `${ReportsURL}getEventLogReport.php?fromDateIn=${data.fromDate}&toDateIn=${data.toDate}&userEmail=${data.email}`;
        if(data.eventName){
            url = `${ReportsURL}getEventLogReport.php?eventName=${data.eventName}&fromDateIn=${data.fromDate}&toDateIn=${data.toDate}&userEmail=${data.email}`;
        }
        window.open(
            url,
            '_blank'
        );
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const SendEventLogReport = async (data) => {
    try {
        let url = `${ReportsURL}getEventLogReport.php?fromDateIn=${data.fromDate}&toDateIn=${data.toDate}&userEmail=${data.email}&sendEmail=YES`;
        if(data.eventName){
            url = `${ReportsURL}getEventLogReport.php?eventName=${data.eventName}&fromDateIn=${data.fromDate}&toDateIn=${data.toDate}&userEmail=${data.email}&sendEmail=YES`;
        }
        return await Client.get(url);
    } catch (error) {
        return ErrorFunction(error);
    }
}
