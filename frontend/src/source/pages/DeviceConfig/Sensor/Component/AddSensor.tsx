import React, { useEffect, useState } from 'react';
import CustomToast from '@/helpers/CustomToast';
import { GetSensor, UpdateSensor, AddNewSensor } from '@/source/service/DeviceConfigService';
import { GetSensorOutput, GetSensorType, GetUnit } from '@/source/service/DeviceManagementService';
import Select from 'react-select';
import { useNavigate, useParams } from 'react-router-dom';
import { GetLocationDetails } from '@/source/service/DashboardService';

const AddSensor = () => {
    const params = useParams();
    const navigate = useNavigate();

    const { locationID, branchID, facilityID, buildingID, floorID, zoneID, deviceID, sensorID }: any = params;

    const EmptyLableValue: Array<any> = [{
        label: '',
        value: ''
    }];

    const AlarmTypeOptions: Array<any> =[
        {
            label: 'Latch',
            value: 'Latch'
        },
        {
            label: 'UnLatch',
            value: 'UnLatch'
        }
    ];

    const BumpTestOptions = [
        {
            label: 'Required',
            value: '1'
        },
        {
            label: 'Not required',
            value: '0'
        }
    ];

    const pollingIntervalTypeOptions = [
        {
            label: 'Priority',
            value: '1'
        },
        {
            label: 'Non Priority',
            value: '0'
        }
    ];

    const [Title, setTitle] = useState<string>('Sensor');

    const [formData, setFormData] = useState<any>({
        sensorName: '',
        sensorTag: '',
        alarmType: '',
        bumpTest: BumpTestOptions[1],
        deviationForZeroCheck: '',
        deviationForSpanCheck: '',
        sensorOutputType: EmptyLableValue[0],
        defaultValue: '',
        units: EmptyLableValue[0],
        minimumRatedReading: '',
        minimumRatedReadingScale: '',
        maximumRatedReading: '',
        maximumRatedReadingScale: '',
        slaveID: '',
        register: '',
        bitLength: '',
        registerType: EmptyLableValue[0],
        conversionType: EmptyLableValue[0],
        isStel: false,
        stelDuration: '',
        stelLimit: '',
        stelAlertTag: '',
        isTwa: false,
        twaShiftId: '',
        twaDuration: '',
        twaLimit: '',
        twaAlertTag: '',
        twaStartTime: '',
        twaShiftId1: '',
        twaDuration1: '',
        twaLimit1: '',
        twaAlertTag1: '',
        twaStartTime1: '',
        twaShiftId2: '',
        twaDuration2: '',
        twaLimit2: '',
        twaAlertTag2: '',
        twaStartTime2: '',
        isAQI: false,
        criticalAlert: EmptyLableValue[0],
        criticalMin: 0,
        criticalMax: '',
        criticalMinAlert: `Critical Low Alert`,
        criticalMaxAlert: `Critical High Alert`,
        warningAlert: EmptyLableValue[0],
        warningMin: 0,
        warningMax: '',
        warningMinAlert: `Warning Low Alert`,
        warningMaxAlert: `Warning High Alert`,
        outOfRangeAlert: EmptyLableValue[0],
        outOfRangeMin: 0,
        outOfRangeMax: '',
        outOfRangeMinAlert: `Out Of Range Low Alert`,
        outOfRangeMaxAlert: `Out Of Range High Alert`,
        nMin: '',
        nMax: ''
    });
    const [formError, setFormError] = useState<any>({});

    const [BreadCrumb, setBreadCrumb] = useState<Array<any>>([]);
    const [SensorName, setSensorName] = useState<Array<any>>([]);
    const [SensorOutputType, setSensorOutputType] = useState<Array<any>>([]);
    const [Units, setUnits] = useState<Array<any>>([]);
    const AlarmType: Array<any> =[
        {
            label: 'Latch',
            value: 'Latch'
        },
        {
            label: 'UnLatch',
            value: 'UnLatch'
        }
    ];
    const SensorAlertOptions: Array<any> = [
        {
            label: 'High',
            value: 'High'
        },
        {
            label: 'Low',
            value: 'Low'
        },
        {
            label: 'Disable',
            value: 'Disable'
        }
    ];
    const AlertTypesOptions: Array<any> = [
        {
            label: 'High',
            value: 'High'
        },
        {
            label: 'Low',
            value: 'Low'
        },
        {
            label: 'Both',
            value: 'Both'
        }
    ];
    const RegisterType: Array<any> = [
        {
            label: 'Input Coil',
            value: 'Input Coil'
        },
        {
            label: 'Discreate Input',
            value: 'Discreate Input'
        },
        {
            label: 'Holding Register',
            value: 'Holding Register'
        },
        {
            label: 'Input Register',
            value: 'Input Register'
        }
    ];
    const ConversionType: Array<any> = [
        {
            label: 'Hex',
            value: 'Hex'
        },
        {
            label: 'Integer',
            value: 'Integer'
        },
        {
            label: 'Double',
            value: 'Double'
        },
        {
            label: 'Float',
            value: 'Float'
        },
        {
            label: 'ASCII',
            value: 'ASCII'
        }
    ];
    const slotIdOptions: Array<any> = [
        {
            label: 'A0',
            value: 'A0'
        },
        {
            label: 'A1',
            value: 'A1'
        },
        {
            label: 'A2',
            value: 'A2'
        },
        {
            label: 'A3',
            value: 'A3'
        },
        {
            label: 'A4',
            value: 'A4'
        },
        {
            label: 'A5',
            value: 'A5'
        },
        {
            label: 'A6',
            value: 'A6'
        },
        {
            label: 'A7',
            value: 'A7'
        },
        {
            label: 'A8',
            value: 'A8'
        },
        {
            label: 'A9',
            value: 'A9'
        },
        {
            label: 'A10',
            value: 'A10'
        },
        {
            label: 'A11',
            value: 'A11'
        },
        {
            label: 'A12',
            value: 'A12'
        }
    ];

    const HandleClose = () => {
        navigate(`/device-config/${locationID}/${branchID}/${facilityID}/${buildingID}/${floorID}/${zoneID}/${deviceID}`)
    };

    const handleNavigate = () => {
        navigate('/device-config');
    }

    const handleBreadCrumb = (location: any) => {
        let { locationID, branchID, facilityID, buildingID, floorID, zoneID, id } = location;

        let url = '/device-config';
        if(location.deviceName){
            url = `${url}/${locationID}/${branchID}/${facilityID}/${buildingID}/${floorID}/${zoneID}/${id}`;
        }
        if(location.zoneName){
            url = `${url}/${locationID}/${branchID}/${facilityID}/${buildingID}/${floorID}/${id}`;
        }
        if(location.floorName){
            url = `${url}/${locationID}/${branchID}/${facilityID}/${buildingID}/${id}`;
        }
        if(location.buildingName){
            url = `${url}/${locationID}/${branchID}/${facilityID}/${id}`;
        }
        if(location.facilityName){
            url = `${url}/${locationID}/${branchID}/${id}`;
        }
        if(location.branchName){
            url = `${url}/${locationID}/${id}`;
        }
        if(location.locationName){
            url = `${url}/${id}`;
        }
        navigate(url);
    }

    const HandleSensorChange = (e: any) => {
        // console.log(e);
        let { manufacturer, partID, alarmType, bumpInfo, sensorOutput, units, scaleInfo, modBusInfo, isStel, stelInfo, isTwa, twaInfo, isAQI, criticalAlertInfo, warningAlertInfo, outOfRangeAlertInfo, nMin, nMax } = e;

        if(!manufacturer){
            manufacturer = "";
        }

        if(!partID){
            partID = "";
        }

        if(bumpInfo){
            bumpInfo = JSON.parse(bumpInfo);
            if(Object.keys(bumpInfo).length == 0){
                bumpInfo = {
                    deviationForZeroCheck: '',
                    deviationForSpanCheck: ''
                };
            }
        } else {
            bumpInfo = {
                deviationForZeroCheck: '',
                deviationForSpanCheck: ''
            };
        }

        if(units){
            units = Units.find(unit => unit.id == units);
        } else {
            units = EmptyLableValue[0]
        }

        if(scaleInfo){
            scaleInfo = JSON.parse(scaleInfo);
            if(Object.keys(scaleInfo).length == 0){
                scaleInfo = {
                    minR: '',
                    minRS: '',
                    maxR: '',
                    maxRS: ''
                };
            }
        } else {
            scaleInfo = {
                minR: '',
                minRS: '',
                maxR: '',
                maxRS: ''
            };
        }

        if(modBusInfo){
            modBusInfo = JSON.parse(modBusInfo);
            if(Object.keys(modBusInfo).length == 0){
                modBusInfo = {
                    slaveID: '',
                    register: '',
                    bitLength: '',
                    registerType: '',
                    conversionType: ''
                };
            }
        } else {
            modBusInfo = {
                slaveID: '',
                register: '',
                bitLength: '',
                registerType: '',
                conversionType: ''
            };
        }

        if(stelInfo){
            stelInfo = JSON.parse(stelInfo);
            if(Object.keys(stelInfo).length == 0){
                stelInfo = {
                    stelLimit: '',
                    stelDuration: '',
                    stelAlert: ''
                };
            }
        } else {
            stelInfo = {
                stelLimit: '',
                stelDuration: '',
                stelAlert: ''
            };
        }

        if(twaInfo){
            twaInfo = JSON.parse(twaInfo);
            if(Object.keys(twaInfo).length == 0){
                twaInfo = {
                    shift1: {
                        twaShiftId: '',
                        twaDuration: '',
                        twaLimit: '',
                        twaAlertTag: '',
                        twaStartTime: '08:30',
                    },
                    shift2: {
                        twaShiftId: '',
                        twaDuration: '',
                        twaLimit: '',
                        twaAlertTag: '',
                        twaStartTime: '',
                    },
                    shift3: {
                        twaShiftId: '',
                        twaDuration: '',
                        twaLimit: '',
                        twaAlertTag: '',
                        twaStartTime: '',
                    }
                };
            } else if(Object.keys(twaInfo).length == 1){
                twaInfo = {
                    shift1: twaInfo.shift1,
                    shift2: {
                        twaShiftId: '',
                        twaDuration: '',
                        twaLimit: '',
                        twaAlertTag: '',
                        twaStartTime: '',
                    },
                    shift3: {
                        twaShiftId: '',
                        twaDuration: '',
                        twaLimit: '',
                        twaAlertTag: '',
                        twaStartTime: '',
                    }
                };
            } else if(Object.keys(twaInfo).length == 2){
                twaInfo = {
                    shift1: twaInfo.shift1,
                    shift2: twaInfo.shift2,
                    shift3: {
                        twaShiftId: '',
                        twaDuration: '',
                        twaLimit: '',
                        twaAlertTag: '',
                        twaStartTime: '',
                    }
                };
            }
        } else {
            twaInfo = {
                shift1: {
                    twaShiftId: '',
                    twaDuration: '',
                    twaLimit: '',
                    twaAlertTag: '',
                    twaStartTime: '08:30',
                },
                shift2: {
                    twaShiftId: '',
                    twaDuration: '',
                    twaLimit: '',
                    twaAlertTag: '',
                    twaStartTime: '',
                },
                shift3: {
                    twaShiftId: '',
                    twaDuration: '',
                    twaLimit: '',
                    twaAlertTag: '',
                    twaStartTime: '',
                }
            };
        }

        if(criticalAlertInfo){
            criticalAlertInfo = JSON.parse(criticalAlertInfo);
            if(Object.keys(criticalAlertInfo).length == 0){
                criticalAlertInfo = {
                    cMin: 0,
                    cMax: ''
                };
            }
        } else {
            criticalAlertInfo = {
                cMin: 0,
                cMax: ''
            };
        }

        if(warningAlertInfo){
            warningAlertInfo = JSON.parse(warningAlertInfo);
            if(Object.keys(warningAlertInfo).length == 0){
                warningAlertInfo = {
                    wMin: 0,
                    wMax: ''
                };
            }
        } else {
            warningAlertInfo = {
                wMin: 0,
                wMax: ''
            };
        }

        if(outOfRangeAlertInfo){
            outOfRangeAlertInfo = JSON.parse(outOfRangeAlertInfo);
            if(Object.keys(outOfRangeAlertInfo).length == 0){
                outOfRangeAlertInfo = {
                    oMin: 0,
                    oMax: ''
                };
            }
        } else {
            outOfRangeAlertInfo = {
                oMin: 0,
                oMax: ''
            };
        }

        setFormData({
            sensorName: e,
            sensorTag: formData.sensorTag,
            manufacturer: manufacturer,
            partID: partID,
            alarmType: AlarmTypeOptions.find(alarmTypeOption => alarmTypeOption.label == alarmType),
            bumpTest: BumpTestOptions.find(bumpTest => bumpTest.value == e.bumpTest),
            deviationForZeroCheck: bumpInfo.deviationForZeroCheck,
            deviationForSpanCheck: bumpInfo.deviationForSpanCheck,
            sensorOutputType: SensorOutputType.find(outputType => outputType.value == sensorOutput),
            units: units,
            minimumRatedReading: scaleInfo.minR,
            minimumRatedReadingScale: scaleInfo.minRS,
            maximumRatedReading: scaleInfo.maxR,
            maximumRatedReadingScale: scaleInfo.maxRS,
            slaveID: modBusInfo.slaveID,
            register: modBusInfo.register,
            bitLength: modBusInfo.bitLength,
            registerType: RegisterType.find(register => register.value == modBusInfo.registerType),
            conversionType: ConversionType.find(conversion => conversion.value == modBusInfo.conversionType),
            isStel: Boolean(isStel),
            stelDuration: stelInfo.stelDuration,
            stelLimit: stelInfo.stelLimit,
            stelAlertTag: `${e.label} STEL Alert`,
            isTwa: Boolean(isTwa),
            twaShiftId: twaInfo.shift1.twaShiftId,
            twaDuration: twaInfo.shift1.twaDuration,
            twaLimit: twaInfo.shift1.twaLimit,
            twaAlertTag: `${e.label} TWA Alert`,
            twaStartTime: twaInfo.shift1.twaStartTime,
            twaShiftId1: twaInfo.shift2.twaShiftId,
            twaDuration1: twaInfo.shift2.twaDuration,
            twaLimit1: twaInfo.shift2.twaLimit,
            twaAlertTag1: `${e.label} TWA Alert`,
            twaStartTime1: twaInfo.shift2.twaStartTime,
            twaShiftId2: twaInfo.shift3.twaShiftId,
            twaDuration2: twaInfo.shift3.twaDuration,
            twaLimit2: twaInfo.shift3.twaLimit,
            twaAlertTag2: `${e.label} TWA Alert`,
            twaStartTime2: twaInfo.shift3.twaStartTime,
            isAQI: Boolean(isAQI),
            criticalAlert: EmptyLableValue[0],
            criticalMin: criticalAlertInfo.cMin,
            criticalMax: criticalAlertInfo.cMax,
            criticalMinAlert: `${e.label} Critical Low Alert`,
            criticalMaxAlert: `${e.label} Critical High Alert`,
            warningAlert: EmptyLableValue[0],
            warningMin: warningAlertInfo.wMin,
            warningMax: warningAlertInfo.wMax,
            warningMinAlert: `${e.label} Warning Low Alert`,
            warningMaxAlert: `${e.label} Warning High Alert`,
            outOfRangeAlert: EmptyLableValue[0],
            outOfRangeMin: outOfRangeAlertInfo.oMin,
            outOfRangeMax: outOfRangeAlertInfo.oMax,
            outOfRangeMinAlert: `${e.label} Out Of Range Low Alert`,
            outOfRangeMaxAlert: `${e.label} Out Of Range High Alert`,
            sensorAlert: EmptyLableValue[0],
            sensorAlarmLowAlertMessage: 'Low Alarm',
            sensorAlarmHighAlertMessage: 'High Alarm',
            nMin: nMin,
            nMax: nMax
        });
    }

    const handleChange = (e: any, type:string="string") => {
        let { name, value } = e.target;

        if(type == "number"){
            value = value.replace(/[^\d-.]/g, '')
        }

        setFormData((prevData: any) => ({
            ...prevData,
            [name]: value
        }))
    };

    const handleCheckBoxChange = (e: any) => {
        let { name, checked } = e.target;

        if(name == 'isStel'){
            delete formError['stelAlertTag'];
            delete formError['stelDuration'];
            delete formError['stelLimit'];

            delete formError['twaShiftId'];
            delete formError['twaDuration'];
            delete formError['twaLimit'];
            delete formError['twaAlertTag'];

            delete formError['twaShiftId1'];
            delete formError['twaDuration1'];
            delete formError['twaLimit1'];
            delete formError['twaAlertTag1'];

            delete formError['twaShiftId2'];
            delete formError['twaDuration2'];
            delete formError['twaLimit2'];
            delete formError['twaAlertTag2'];

            setFormError(formError);
        }

        setFormData((prevData: any) => ({
            ...prevData,
            [name]: checked,
            ...(name == "isStel" && { 'isTwa': checked })
        }))
    }

    const HandleSelectChange = (e: any, name: string) => {
        if(name == 'sensorType'){
            delete formError['slaveID'];
            delete formError['register'];
            delete formError['length'];
            delete formError['registerType'];
            delete formError['conversionType'];

            delete formError['units'];
            delete formError['maximumRatedReading'];
            delete formError['maximumRatedReadingScale'];
            delete formError['minimumRatedReading'];
            delete formError['minimumRatedReadingScale'];

            delete formError['criticalAlert'];
            delete formError['criticalMin'];
            delete formError['criticalMax'];
            delete formError['criticalHighAlertMessage'];
            delete formError['criticalLowAlertMessage'];

            delete formError['warningAlert'];
            delete formError['warningMin'];
            delete formError['warningMax'];
            delete formError['warningHighAlertMessage'];
            delete formError['warningLowAlertMessage'];

            delete formError['outOfRangeAlert'];
            delete formError['outOfRangeMin'];
            delete formError['outOfRangeMax'];
            delete formError['outOfRangeHighAlertMessage'];
            delete formError['outOfRangeLowAlertMessage'];

            setFormError(formError);
        }

        setFormData((prevData: any) => ({
            ...prevData,
            [name]: e
        }));
    }

    const HandleValid = () => {
        let isValid: boolean = true;
        let error: any = {};

        if(formData.sensorName == "" || formData.sensorName?.label == ""){
            error['sensorName'] = "Sensor Name is required";
            isValid = false;
        }

        if(formData.sensorTag == "" || formData.sensorTag.trim() == ""){
            error['sensorTag'] = "Sensor Tag is required";
            isValid = false;
        }

        if(formData.bumpTest?.value == '1'){
            if(formData.deviationForZeroCheck == "" || formData.deviationForZeroCheck.trim() == ""){
                error['deviationForZeroCheck'] = "Deviation For Zero Check is required";
                isValid = false;
            }

            if(formData.deviationForSpanCheck == "" || formData.deviationForSpanCheck.trim() == ""){
                error['deviationForSpanCheck'] = "Deviation For Span Check is required";
                isValid = false;
            }
        }

        if(!formData.pollingIntervalType || formData.pollingIntervalType == ""){
            error['pollingIntervalType'] = "Polling Interval Type is required";
            isValid = false;
        }

        if(formData.isStel){
            if(formData.stelDuration == null || formData.stelDuration == ''){
                error['stelDuration'] = 'Duration is required';
                isValid = false;
            }

            if(formData.stelLimit == null || formData.stelLimit == ''){
                error['stelLimit'] = 'Limit is required';
                isValid = false;
            }

            if(formData.stelAlertTag == null || formData.stelAlertTag == '' || formData.stelAlertTag.trim() == ''){
                error['stelAlertTag'] = 'Alert Tag is required';
                isValid = false;
            }
        }

        if(formData.isTwa){

            if(formData.twaShiftId || formData.twaShiftId1 || formData.twaShiftId2){
                if((formData.twaShiftId == "" || formData.twaShiftId.trim() == "") && (formData.twaShiftId1 == "" || formData.twaShiftId1.trim() == "" ) && (formData.twaShiftId2 == "" || formData.twaShiftId2.trim() == "")){
                    error['twaShiftId'] = "Shift ID is required";
                    isValid = false;
                } else {
                    if(formData.twaShiftId != ""){
                        if(formData.twaDuration == null || formData.twaDuration == ""){
                            error['twaDuration'] = "Duration is required";
                            isValid = false;
                        }

                        if(formData.twaLimit == null || formData.twaLimit == ""){
                            error['twaLimit'] = "Limit is required";
                            isValid = false;
                        }

                        if(!formData.twaAlertTag || formData.twaAlertTag == "" || formData.twaAlertTag.trim() == ""){
                            error['twaAlertTag'] = "Alert Tag is required";
                            isValid = false;
                        }
                    }

                    if(formData.twaShiftId1 != ""){
                        if(formData.twaDuration1 == null || formData.twaDuration1 == ""){
                            error['twaDuration1'] = "Duration is required";
                            isValid = false;
                        }

                        if(formData.twaLimit1 == null || formData.twaLimit1 == ""){
                            error['twaLimit1'] = "Limit is required";
                            isValid = false;
                        }

                        if(formData.twaAlertTag1 == null || formData.twaAlertTag1 == ""){
                            error['twaAlertTag1'] = "Alert Tag is required";
                            isValid = false;
                        }
                    }

                    if(formData.twaShiftId2 != ""){
                        if(formData.twaDuration2 == null || formData.twaDuration2 == ""){
                            error['twaDuration2'] = "Duration is required";
                            isValid = false;
                        }

                        if(formData.twaLimit2 == null || formData.twaLimit2 == ""){
                            error['twaLimit2'] = "Limit is required";
                            isValid = false;
                        }

                        if(formData.twaAlertTag2 == null || formData.twaAlertTag2 == ""){
                            error['twaAlertTag2'] = "Alert Tag is required";
                            isValid = false;
                        }
                    }
                }
            } else {
                error['twaShiftId'] = "Shift ID is required";
                isValid = false;
            }
        }

        if(formData.sensorOutputType.label == "Digital"){
            if(formData.sensorAlert.label == ""){
                error['sensorAlert'] = "Sensor Alert is required";
                isValid = false;
            } else {
                if(formData.sensorAlert.label == "Low" && (formData.sensorAlarmLowAlertMessage == "" || formData.sensorAlarmLowAlertMessage.trim() == "")){
                    error['sensorAlarmLowAlertMessage'] = "Alert Message is required";
                    isValid = false;
                }

                if(formData.sensorAlert.label == "High" && (formData.sensorAlarmHighAlertMessage == "" || formData.sensorAlarmHighAlertMessage.trim() == "")){
                    error['sensorAlarmHighAlertMessage'] = "Alert Message is required";
                    isValid = false;
                }
            }
        } else {
            if(formData.criticalAlert.label == ""){
                error['criticalAlert'] = "Critical Alert is required";
                isValid = false;
            } else {
                if(formData.criticalAlert.label == "High" || formData.criticalAlert.label == "Both"){
                    if(formData.criticalMax == ""){
                        error['criticalMax'] = "Max Value is required";
                        isValid = false;
                    }

                    if(formData.criticalMaxAlert == ""){
                        error['criticalMaxAlert'] = "High Alert Message is required";
                        isValid = false;
                    }
                }

                if(formData.criticalAlert.label == "Low" || formData.criticalAlert.label == "Both"){
                    if(formData.criticalMin == ""){
                        error['criticalMin'] = "Min Value is required";
                        isValid = false;
                    }

                    if(formData.criticalMinAlert == ""){
                        error['criticalMinAlert'] = "Low Alert Message is required";
                        isValid = false;
                    }
                }
            }

            if(formData.warningAlert.label == ""){
                error['warningAlert'] = "Warning Alert is required";
                isValid = false;
            } else {
                if(formData.warningAlert.label == "High" || formData.warningAlert.label == "Both"){
                    if(formData.warningMax == ""){
                        error['warningMax'] = "Max Value is required";
                        isValid = false;
                    }

                    if(formData.warningMaxAlert == ""){
                        error['warningMaxAlert'] = "High Alert Message is required";
                        isValid = false;
                    }
                }

                if(formData.warningAlert.label == "Low" || formData.warningAlert.label == "Both"){
                    if(formData.warningMin == ""){
                        error['warningMin'] = "Min Value is required";
                        isValid = false;
                    }

                    if(formData.warningMinAlert == ""){
                        error['warningMinAlert'] = "Low Alert Message is required";
                        isValid = false;
                    }
                }
            }

            if(formData.outOfRangeAlert.label == ""){
                error['outOfRangeAlert'] = "Out-of-Range Alert is required";
                isValid = false;
            } else {
                if(formData.outOfRangeAlert.label == "High" || formData.outOfRangeAlert.label == "Both"){
                    if(formData.outOfRangeMax == ""){
                        error['outOfRangeMax'] = "Max Value is required";
                        isValid = false;
                    }

                    if(formData.outOfRangeMaxAlert == ""){
                        error['outOfRangeMaxAlert'] = "High Alert Message is required";
                        isValid = false;
                    }
                }

                if(formData.outOfRangeAlert.label == "Low" || formData.outOfRangeAlert.label == "Both"){
                    if(formData.outOfRangeMin == ""){
                        error['outOfRangeMin'] = "Min Value is required";
                        isValid = false;
                    }

                    if(formData.outOfRangeMinAlert == ""){
                        error['outOfRangeMinAlert'] = "Low Alert Message is required";
                        isValid = false;
                    }
                }
            }

            if(formData.sensorOutputType.sensorOutputType != 'Inbuilt'){
                if(formData.minimumRatedReading == ""){
                    error['minimumRatedReading'] = "Minimum Rated Reading is Required";
                    isValid = false;
                }
                if(formData.minimumRatedReadingScale == ""){
                    error['minimumRatedReadingScale'] = "Scale is Required";
                    isValid = false;
                }
                if(formData.maximumRatedReading == ""){
                    error['maximumRatedReading'] = "Maximum Rated Reading is Required";
                    isValid = false;
                }
                if(formData.maximumRatedReadingScale == ""){
                    error['maximumRatedReadingScale'] = "Scale is Required";
                    isValid = false;
                }

                if(formData.sensorOutputType.sensorOutputType != 'Analog'){
                    if(formData.slaveID == ''){
                        error['slaveID'] = 'Slave ID is required';
                        isValid = false;
                    }

                    if(formData.register == ''){
                        error['register'] = 'Register is required';
                        isValid = false;
                    }

                    if(formData.bitLength == ''){
                        error['bitLength'] = 'Length is required';
                        isValid = false;
                    }

                    if(!formData.registerType || formData.registerType?.label == ''){
                        error['registerType'] = 'Register Type is required';
                        isValid = false;
                    }

                    if(!formData.conversionType || formData.conversionType?.label == ''){
                        error['conversionType'] = 'Conversion Type is required';
                        isValid = false;
                    }
                }
            }
        }

        setFormError(error);

        return isValid;
    }

    const HandleAdd = async () => {
        if(HandleValid()){
            let { sensorName, sensorTag, manufacturer, partID, alarmType, bumpTest, deviationForZeroCheck, deviationForSpanCheck, sensorOutputType, slotID,
                isStel, stelLimit, stelDuration, stelAlertTag, isTwa, twaShiftId, twaLimit, twaDuration, twaStartTime, twaAlertTag, defaultValue,
                twaShiftId1, twaLimit1, twaDuration1, twaStartTime1, twaAlertTag1, twaShiftId2, twaLimit2, twaDuration2, twaStartTime2, nMin, nMax,
                twaAlertTag2, isAQI, sensorAlert, sensorAlarmHighAlertMessage, sensorAlarmLowAlertMessage, criticalAlert, criticalMax,
                criticalMaxAlert, criticalMin, criticalMinAlert, warningAlert, warningMax, warningMaxAlert, warningMin, warningMinAlert,
                outOfRangeAlert, outOfRangeMax, outOfRangeMaxAlert, outOfRangeMin, outOfRangeMinAlert, minimumRatedReading, minimumRatedReadingScale,
                maximumRatedReading, maximumRatedReadingScale, pollingIntervalType, units, slaveID, register, bitLength, registerType, conversionType
            } = formData;

            let bumpInfo: any = null;
            let stelInfo: any = null;
            let twaInfo: any = null;
            let digitalAlertInfo: any = null;
            let criticalAlertInfo: any = null;
            let warningAlertInfo: any = null;
            let outOfRangeAlertInfo: any = null;
            let scaleInfo: any = null;
            let unit: any = null;
            let modBusInfo: any = null;

            const Data: any = {
                locationID: locationID,
                branchID: branchID,
                facilityID: facilityID,
                buildingID: buildingID,
                floorID: floorID,
                zoneID: zoneID,
                deviceID: deviceID,

                sensorName: sensorName.sensorType,
                sensorTag: sensorTag,
                manufacturer: manufacturer,
                partID: partID,
                alarmType: alarmType.label,
                bumpTest: bumpTest.value,
                sensorOutput: sensorOutputType.label,
                isStel: Number(isStel),
                isTwa: Number(isTwa),
                isAQI: Number(isAQI),
                slotID: slotID?.value,
                sensorStatus: 1,
                notificationStatus: 1,
                defaultValue: defaultValue
            };

            if(bumpTest.value == '1'){
                bumpInfo = {
                    deviationForZeroCheck: deviationForZeroCheck,
                    deviationForSpanCheck: deviationForSpanCheck
                }
                bumpInfo = JSON.stringify(bumpInfo);
            }

            if(isStel){
                stelInfo = {};
                stelInfo['stelLimit'] = stelLimit;
                stelInfo['stelDuration'] = stelDuration;
                stelInfo['stelAlert'] = stelAlertTag;

                stelInfo = JSON.stringify(stelInfo);
            };

            if(isTwa){
                twaInfo = {};
                if(twaShiftId){
                    twaInfo['shift1'] = {
                        twaShiftId: twaShiftId,
                        twaLimit: twaLimit,
                        twaDuration: twaDuration,
                        twaStartTime: twaStartTime,
                        twaAlert: twaAlertTag
                    }
                }

                if(twaShiftId1){
                    twaInfo['shift2'] = {
                        twaShiftId: twaShiftId1,
                        twaLimit: twaLimit1,
                        twaDuration: twaDuration1,
                        twaStartTime: twaStartTime1,
                        twaAlert: twaAlertTag1
                    }
                }

                if(twaShiftId2){
                    twaInfo['shift3'] = {
                        twaShiftId: twaShiftId2,
                        twaLimit: twaLimit2,
                        twaDuration: twaDuration2,
                        twaStartTime: twaStartTime2,
                        twaAlert: twaAlertTag2
                    }
                }

                twaInfo = JSON.stringify(twaInfo);
            }

            if(sensorOutputType.sensorOutputType == 'Digital'){
                digitalAlertInfo = {};
                if(sensorAlert.label == "High"){
                    digitalAlertInfo = {
                        dAT: 'High',
                        dHTxt: sensorAlarmHighAlertMessage
                    }
                } else if(sensorAlert.label == "Low"){
                    digitalAlertInfo = {
                        dAT: 'Low',
                        dLTxt: sensorAlarmLowAlertMessage
                    }
                }

                if(sensorAlert.label != "Disable"){
                    digitalAlertInfo = JSON.stringify(digitalAlertInfo);
                }
            } else {
                criticalAlertInfo = {
                    cAT: criticalAlert.label,
                    cMin: criticalMin,
                    cMax: criticalMax,
                    cLTxt: criticalMinAlert,
                    cHTxt: criticalMaxAlert
                };

                warningAlertInfo = {
                    wAT: warningAlert.label,
                    wMin: warningMin,
                    wMax: warningMax,
                    wLTxt: warningMinAlert,
                    wHTxt: warningMaxAlert
                };

                outOfRangeAlertInfo = {
                    oAT: outOfRangeAlert.label,
                    oMin: outOfRangeMin,
                    oMax: outOfRangeMax,
                    oLTxt: outOfRangeMinAlert,
                    oHTxt: outOfRangeMaxAlert
                };

                criticalAlertInfo = JSON.stringify(criticalAlertInfo);
                warningAlertInfo = JSON.stringify(warningAlertInfo);
                outOfRangeAlertInfo = JSON.stringify(outOfRangeAlertInfo);
                unit = units.label;

                if(sensorOutputType.sensorOutputType != 'Inbuilt'){
                    scaleInfo = {
                        minR: minimumRatedReading,
                        minRS: minimumRatedReadingScale,
                        maxR: maximumRatedReading,
                        maxRS: maximumRatedReadingScale
                    };

                    scaleInfo = JSON.stringify(scaleInfo);

                    if(sensorOutputType.label != 'Analog'){
                        modBusInfo = {
                            slaveID: slaveID,
                            register: register,
                            bitLength: bitLength,
                            registerType: registerType.value,
                            conversionType: conversionType.value
                        };

                        modBusInfo = JSON.stringify(modBusInfo);
                    }
                }
            }

            Data['bumpInfo'] = bumpInfo;
            Data['stelInfo'] = stelInfo;
            Data['twaInfo'] = twaInfo;
            Data['digitalAlertInfo'] = digitalAlertInfo;
            Data['criticalAlertInfo'] = criticalAlertInfo;
            Data['warningAlertInfo'] = warningAlertInfo;
            Data['outOfRangeAlertInfo'] = outOfRangeAlertInfo;
            Data['scaleInfo'] = scaleInfo;
            Data['pollingIntervalType'] = pollingIntervalType.value;
            Data['units'] = unit;
            Data['modBusInfo'] = modBusInfo;
            Data['nMin'] = nMin;
            Data['nMax'] = nMax;

            let message: string = "Something went wrong";
            let status: string = "error";

            let response: any;

            if(sensorID){
                response = await UpdateSensor(sensorID, Data);
            } else {
                response = await AddNewSensor(Data);
            }

            if(response?.response?.status == 409){
                message = response.response.data.message;
                status = response.response.data.status;
                setFormError({
                    sensorTag: response.response.data.message
                });
            }

            if(response.data?.status == "success"){
                message = response.data.message;
                status = response.data.status;
                HandleClose();
            }

            CustomToast(message, status);
        }
    };

    const GetFormData = async () => {
        let response = await GetSensorType({
            id: "all"
        });

        let breaduCrumbResponse = await GetLocationDetails(params);

        if(response.data.status == "success"){
            let SensorTypeResponse = await GetSensorOutput({
                id: "all"
            });

            if(SensorTypeResponse.data.status == "success"){
                let Unitresponse = await GetUnit({
                    id: 'all'
                });

                if(Unitresponse.data.status == "success"){
                    let sensors = response.data.data;
                    let sensorOutputTypes = SensorTypeResponse.data.data;
                    let units = Unitresponse.data.data;

                    sensors.map((sensor: any) => {
                        sensor.label = sensor.sensorType,
                        sensor.value = sensor.id
                    });

                    sensorOutputTypes.map((sensorOutputType: any) => {
                        sensorOutputType.label = sensorOutputType.sensorOutputType,
                        sensorOutputType.value = sensorOutputType.id
                    })

                    units.map((unit: any) => {
                        unit.label = unit.unitLabel;
                        unit.value = unit.id;
                    });

                    setSensorName(sensors);
                    setSensorOutputType(sensorOutputTypes)
                    setUnits(units);
                    if(!sensorID){
                        setFormData((prevData: any) => ({
                            ...prevData,
                            ['sensorOutputType']: sensorOutputTypes.find((sensorOutputType: any) => sensorOutputType.label == 'Digital')
                        }));
                    // } else {
                    //     setFormData((prevData: any) => ({
                    //         ...prevData,
                    //         ['sensorName']: sensors.find((sensor: any) => sensor.sensorType == formData.sensorName),
                    //         ['sensorOutputType']: sensorOutputTypes.find((sensorOutputType: any) => sensorOutputType.sensorOutputType == formData.sensorOutputType),
                    //         ['units']: units.find((unit: any) => unit.unitLabel == formData.units)
                    //     }));
                    }
                } else {
                    CustomToast('Unable to fetch units', 'error');
                }
            } else {
                CustomToast('Unable to fetch sensor type', 'error');
            }
        } else {
            CustomToast('Unable to fetch sensor name', 'error');
        }

        if(breaduCrumbResponse.data?.status == "success"){
            setBreadCrumb(breaduCrumbResponse.data.data);
        }
    }

    const GetData = async () => {
        let response = await GetSensor({
            locationID: locationID,
            branchID: branchID,
            facilityID: facilityID,
            buildingID: buildingID,
            floorID: floorID,
            zoneID: zoneID,
            deviceID: deviceID,
            id: sensorID
        });

        if(response.data?.status == "success"){
            let { sensorName, sensorTag, manufacturer, partID, alarmType, bumpTest, bumpInfo, sensorOutput, slotID, pollingIntervalType, units, scaleInfo, nMin,  nMax, modBusInfo, isStel, stelInfo, isTwa, twaInfo, isAQI, criticalAlertInfo, warningAlertInfo, outOfRangeAlertInfo, digitalAlertInfo, defaultValue } = response.data.data;

            if(!manufacturer || manufacturer == null){
                manufacturer = "";
            }

            if(!partID|| partID == null){
                partID = "";
            }

            if(bumpTest){
                bumpTest = BumpTestOptions.find(bumpTestOption => bumpTestOption.value == bumpTest);
            } else {
                bumpTest = BumpTestOptions[1];
            }

            if(bumpInfo){
                bumpInfo = JSON.parse(bumpInfo);
                if(Object.keys(bumpInfo).length == 0){
                    bumpInfo = {
                        deviationForZeroCheck: '',
                        deviationForSpanCheck: ''
                    };
                }
            } else {
                bumpInfo = {
                    deviationForZeroCheck: '',
                    deviationForSpanCheck: ''
                };
            }

            if(scaleInfo){
                scaleInfo = JSON.parse(scaleInfo);
                if(Object.keys(scaleInfo).length == 0){
                    scaleInfo = {
                        minR: '',
                        minRS: '',
                        maxR: '',
                        maxRS: ''
                    };
                }
            } else {
                scaleInfo = {
                    minR: '',
                    minRS: '',
                    maxR: '',
                    maxRS: ''
                };
            }

            if(modBusInfo){
                modBusInfo = JSON.parse(modBusInfo);
                if(Object.keys(modBusInfo).length == 0){
                    modBusInfo = {
                        slaveID: '',
                        register: '',
                        bitLength: '',
                        registerType: '',
                        conversionType: ''
                    };
                }
            } else {
                modBusInfo = {
                    slaveID: '',
                    register: '',
                    bitLength: '',
                    registerType: '',
                    conversionType: ''
                };
            }

            if(stelInfo){
                stelInfo = JSON.parse(stelInfo);
                if(Object.keys(stelInfo).length == 0){
                    stelInfo = {
                        stelLimit: '',
                        stelDuration: '',
                        stelAlert: `${sensorName} STEL Alert`,
                    };
                }
            } else {
                stelInfo = {
                    stelLimit: '',
                    stelDuration: '',
                    stelAlert: `${sensorName} STEL Alert`,
                };
            }

            if(twaInfo){
                twaInfo = JSON.parse(twaInfo);
                if(Object.keys(twaInfo).length == 0){
                    twaInfo = {
                        shift1: {
                            twaShiftId: '',
                            twaDuration: '',
                            twaLimit: '',
                            twaAlert: `${sensorName} TWA Alert`,
                            twaStartTime: '08:30',
                        },
                        shift2: {
                            twaShiftId: '',
                            twaDuration: '',
                            twaLimit: '',
                            twaAlert: `${sensorName} TWA Alert`,
                            twaStartTime: '',
                        },
                        shift3: {
                            twaShiftId: '',
                            twaDuration: '',
                            twaLimit: '',
                            twaAlert: `${sensorName} TWA Alert`,
                            twaStartTime: '',
                        }
                    };
                } else if(Object.keys(twaInfo).length == 1){
                    twaInfo = {
                        shift1: twaInfo.shift1,
                        shift2: {
                            twaShiftId: '',
                            twaDuration: '',
                            twaLimit: '',
                            twaAlert: `${sensorName} TWA Alert`,
                            twaStartTime: '',
                        },
                        shift3: {
                            twaShiftId: '',
                            twaDuration: '',
                            twaLimit: '',
                            twaAlert: `${sensorName} TWA Alert`,
                            twaStartTime: '',
                        }
                    };
                } else if(Object.keys(twaInfo).length == 2){
                    twaInfo = {
                        shift1: twaInfo.shift1,
                        shift2: twaInfo.shift2,
                        shift3: {
                            twaShiftId: '',
                            twaDuration: '',
                            twaLimit: '',
                            twaAlert: `${sensorName} TWA Alert`,
                            twaStartTime: '',
                        }
                    };
                }
            } else {
                twaInfo = {
                    shift1: {
                        twaShiftId: '',
                        twaDuration: '',
                        twaLimit: '',
                        twaAlert: `${sensorName} TWA Alert`,
                        twaStartTime: '08:30',
                    },
                    shift2: {
                        twaShiftId: '',
                        twaDuration: '',
                        twaLimit: '',
                        twaAlert: `${sensorName} TWA Alert`,
                        twaStartTime: '',
                    },
                    shift3: {
                        twaShiftId: '',
                        twaDuration: '',
                        twaLimit: '',
                        twaAlert: `${sensorName} TWA Alert`,
                        twaStartTime: '',
                    }
                };
            }

            if(criticalAlertInfo){
                criticalAlertInfo = JSON.parse(criticalAlertInfo);
                if(Object.keys(criticalAlertInfo).length == 0){
                    criticalAlertInfo = {
                        cAT: EmptyLableValue[0],
                        cMin: 0,
                        cMax: '',
                        cHTxt: `${sensorName} Critical High Alert`,
                        cLTxt: `${sensorName} Critical Low Alert`
                    };
                }
            } else {
                criticalAlertInfo = {
                    cAT: EmptyLableValue[0],
                    cMin: 0,
                    cMax: '',
                    cHTxt: `${sensorName} Critical High Alert`,
                    cLTxt: `${sensorName} Critical Low Alert`
                };
            }

            if(warningAlertInfo){
                warningAlertInfo = JSON.parse(warningAlertInfo);
                if(Object.keys(warningAlertInfo).length == 0){
                    warningAlertInfo = {
                        wAT: EmptyLableValue[0],
                        wMin: 0,
                        wMax: '',
                        wLTxt: `${sensorName} Warning Low Alert`,
                        wHTxt: `${sensorName} Warning High Alert`
                    };
                }
            } else {
                warningAlertInfo = {
                    wAT: EmptyLableValue[0],
                    wMin: 0,
                    wMax: '',
                    wLTxt: `${sensorName} Warning Low Alert`,
                    wHTxt: `${sensorName} Warning High Alert`
                };
            }

            if(outOfRangeAlertInfo){
                outOfRangeAlertInfo = JSON.parse(outOfRangeAlertInfo);
                if(Object.keys(outOfRangeAlertInfo).length == 0){
                    outOfRangeAlertInfo = {
                        oAT: EmptyLableValue[0],
                        oMin: 0,
                        oMax: '',
                        oLTxt : `${sensorName} Out Of Range Low Alert`,
                        oHTxt: `${sensorName} Out Of Range High Alert`
                    };
                }
            } else {
                outOfRangeAlertInfo = {
                    oAT: EmptyLableValue[0],
                    oMin: 0,
                    oMax: '',
                    oLTxt : `${sensorName} Out Of Range Low Alert`,
                    oHTxt: `${sensorName} Out Of Range High Alert`
                };
            }

            if(digitalAlertInfo){
                digitalAlertInfo= JSON.parse(digitalAlertInfo);
                if(Object.keys(digitalAlertInfo).length == 0){
                    digitalAlertInfo = {
                        dAT: EmptyLableValue[0],
                        dHTxt: 'High Alarm',
                        dLTxt: 'Low Alarm'
                    };
                }
            } else {
                digitalAlertInfo = {
                    dAT: EmptyLableValue[0],
                    dHTxt: 'High Alarm',
                    dLTxt: 'Low Alarm'
                };
            }

            setFormData({
                sensorName: {
                    label: sensorName,
                    value: sensorName,
                    sensorType: sensorName
                },
                sensorTag: sensorTag,
                manufacturer: manufacturer,
                partID: partID,
                alarmType: AlarmTypeOptions.find(alarmTypeOption => alarmTypeOption.label == alarmType),
                bumpTest: bumpTest,
                deviationForZeroCheck: bumpInfo.deviationForZeroCheck,
                deviationForSpanCheck: bumpInfo.deviationForSpanCheck,
                sensorOutputType: {
                    label: sensorOutput,
                    value: sensorOutput,
                    sensorOutputType: sensorOutput
                },
                slotID: {
                    label: slotID,
                    value: slotID
                },
                pollingIntervalType: pollingIntervalTypeOptions.filter(pollingIntervalTypeOption => pollingIntervalTypeOption.value == pollingIntervalType),
                defaultValue: defaultValue,
                units: {
                    label: units,
                    value: units
                },
                minimumRatedReading: scaleInfo.minR,
                minimumRatedReadingScale: scaleInfo.minRS,
                maximumRatedReading: scaleInfo.maxR,
                maximumRatedReadingScale: scaleInfo.maxRS,
                slaveID: modBusInfo.slaveID,
                register: modBusInfo.register,
                bitLength: modBusInfo.bitLength,
                registerType: RegisterType.find(register => register.value == modBusInfo.registerType),
                conversionType: ConversionType.find(conversion => conversion.value == modBusInfo.conversionType),
                isStel: Boolean(isStel),
                stelDuration: stelInfo.stelDuration,
                stelLimit: stelInfo.stelLimit,
                stelAlertTag: stelInfo.stelAlert,
                isTwa: Boolean(isTwa),
                twaShiftId: twaInfo.shift1.twaShiftId,
                twaDuration: twaInfo.shift1.twaDuration,
                twaLimit: twaInfo.shift1.twaLimit,
                twaAlertTag: twaInfo.shift1.twaAlert,
                twaStartTime: twaInfo.shift1.twaStartTime,
                twaShiftId1: twaInfo.shift2.twaShiftId,
                twaDuration1: twaInfo.shift2.twaDuration,
                twaLimit1: twaInfo.shift2.twaLimit,
                twaAlertTag1: twaInfo.shift2.twaAlert,
                twaStartTime1: twaInfo.shift2.twaStartTime,
                twaShiftId2: twaInfo.shift3.twaShiftId,
                twaDuration2: twaInfo.shift3.twaDuration,
                twaLimit2: twaInfo.shift3.twaLimit,
                twaAlertTag2: twaInfo.shift3.twaAlert,
                twaStartTime2: twaInfo.shift3.twaStartTime,
                isAQI: Boolean(isAQI),
                criticalAlert: criticalAlertInfo.cAT == "High" ? AlertTypesOptions[0] : criticalAlertInfo.cAT == "Low" ? AlertTypesOptions[1] : criticalAlertInfo.cAT == "Both" ? AlertTypesOptions[2] : criticalAlertInfo.cAT,
                criticalMin: criticalAlertInfo.cMin,
                criticalMax: criticalAlertInfo.cMax,
                criticalMinAlert: criticalAlertInfo.cLTxt,
                criticalMaxAlert: criticalAlertInfo.cHTxt,
                warningAlert: warningAlertInfo.wAT == "High" ? AlertTypesOptions[0] : warningAlertInfo.wAT == "Low" ? AlertTypesOptions[1] : warningAlertInfo.wAT == "Both" ? AlertTypesOptions[2] : warningAlertInfo.wAT,
                warningMin: warningAlertInfo.wMin,
                warningMax: warningAlertInfo.wMax,
                warningMinAlert: warningAlertInfo.wLTxt,
                warningMaxAlert: warningAlertInfo.wHTxt,
                outOfRangeAlert: outOfRangeAlertInfo.oAT == "High" ? AlertTypesOptions[0] : outOfRangeAlertInfo.oAT == "Low" ? AlertTypesOptions[1] : outOfRangeAlertInfo.oAT == "Both" ? AlertTypesOptions[2] : outOfRangeAlertInfo.oAT,
                outOfRangeMin: outOfRangeAlertInfo.oMin,
                outOfRangeMax: outOfRangeAlertInfo.oMax,
                outOfRangeMinAlert: outOfRangeAlertInfo.oLTxt,
                outOfRangeMaxAlert: outOfRangeAlertInfo.oHTxt,
                sensorAlert: digitalAlertInfo.dAT == "High" ? SensorAlertOptions[0] : digitalAlertInfo.dAT == "Low" ? SensorAlertOptions[1] : digitalAlertInfo.dAT == "Disable" ? SensorAlertOptions[2] : digitalAlertInfo.dAT,
                sensorAlarmLowAlertMessage: digitalAlertInfo.dHTxt,
                sensorAlarmHighAlertMessage: digitalAlertInfo.dLTxt,
                nMin: nMin,
                nMax: nMax
            });

        } else {
            CustomToast('Device not found','error');
            HandleClose();
        }
    }

    useEffect(() => {
        GetFormData()
        if(sensorID){
            GetData();
            setTitle('Edit Sensor');
        } else {
            setTitle('Add Sensor');
            setFormData({
                sensorName: '',
                sensorTag: '',
                alarmType: '',
                bumpTest: BumpTestOptions[1],
                deviationForZeroCheck: '',
                deviationForSpanCheck: '',
                sensorOutputType: EmptyLableValue[0],
                slotID: {
                    lable: ''
                },
                pollingIntervalType: '',
                defaultValue: '',
                units: EmptyLableValue[0],
                minimumRatedReading: '',
                minimumRatedReadingScale: '',
                maximumRatedReading: '',
                maximumRatedReadingScale: '',
                slaveID: '',
                register: '',
                bitLength: '',
                registerType: EmptyLableValue[0],
                conversionType: EmptyLableValue[0],
                isStel: false,
                stelDuration: '',
                stelLimit: '',
                stelAlertTag: '',
                isTwa: false,
                twaShiftId: '',
                twaDuration: '',
                twaLimit: '',
                twaAlertTag: `${formData.sensorName.label} TWA Alert`,
                twaStartTime: '08:30',
                twaShiftId1: '',
                twaDuration1: '',
                twaLimit1: '',
                twaAlertTag1: `${formData.sensorName.label} TWA Alert`,
                twaStartTime1: '',
                twaShiftId2: '',
                twaDuration2: '',
                twaLimit2: '',
                twaAlertTag2: `${formData.sensorName.label} TWA Alert`,
                twaStartTime2: '',
                isAQI: false,
                criticalAlert: EmptyLableValue[0],
                criticalMin: 0,
                criticalMax: '',
                criticalMinAlert: `${formData.sensorName.label} Critical Low Alert`,
                criticalMaxAlert: `${formData.sensorName.label} Critical High Alert`,
                warningAlert: EmptyLableValue[0],
                warningMin: 0,
                warningMax: '',
                warningMinAlert: `${formData.sensorName.label} Warning Low Alert`,
                warningMaxAlert: `${formData.sensorName.label} Warning High Alert`,
                outOfRangeAlert: EmptyLableValue[0],
                outOfRangeMin: 0,
                outOfRangeMax: '',
                outOfRangeMinAlert: `${formData.sensorName.label} Out Of Range Low Alert`,
                outOfRangeMaxAlert: `${formData.sensorName.label} Out Of Range High Alert`,
                sensorAlert: EmptyLableValue[0],
                sensorAlarmLowAlertMessage: 'Low Alarm',
                sensorAlarmHighAlertMessage: 'High Alarm',
                nMin: '',
                nMax: ''
            });
        }
        setFormError({});
    }, [params])

    return (
        <div className="h-full">
            <div className="panel h-full !p-3 rounded-xl">
                <div className='flex flex-row justify-between pb-2'>
                    <ul className="flex space-x-2 rtl:space-x-reverse text-lg px-2">
                        <li className="dark:text-white text-black font-bold text-md hover:underline cursor-pointer" onClick={handleNavigate}>
                            <span>Location</span>
                        </li>
                        {BreadCrumb.map((selected, index) => <li key={index} className={`dark:text-white before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-black font-bold text-md hover:underline ${selected.click == false ? 'pointer-events-none' : 'cursor-pointer'}`} onClick={() => handleBreadCrumb(selected)}>
                            <span>{selected.locationName || selected.branchName || selected.facilityName || selected.buildingName || selected.floorName || selected.zoneName || selected.deviceName}</span>
                        </li>)}
                    </ul>
                </div>
                <hr />
                <div className="p-3">
                    <div>
                        <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                            <div>
                                <h5 className="font-semibold text-lg dark:text-white">{Title}</h5>
                            </div>
                        </div>
                        <div>
                            <div className="flex flex-col items-center">
                                <form className="flex flex-col items-center gap-2 w-full">
                                    <div className="flex flex-row w-full gap-4">
                                        <div className='w-full'>
                                            <label htmlFor="sensorName" className="dark:text-white">Sensor Name *</label>
                                            <Select
                                                name="sensorName"
                                                className="w-full select-box dark:text-white"
                                                options={SensorName}
                                                isSearchable={true}
                                                value={formData.sensorName}
                                                onChange={(e) => HandleSensorChange(e)}
                                            />
                                            {formError.sensorName && <div className='text-sm text-danger'>{formError.sensorName}</div>}
                                        </div>
                                        <div className='w-full'>
                                            <label htmlFor="sensorTag" className="dark:text-white">Sensor Tag *</label>
                                            <input
                                                type="text"
                                                className='form-input dark:text-white'
                                                name="sensorTag"
                                                onChange={handleChange}
                                                value={formData.sensorTag}
                                            />
                                            {formError.sensorTag && <div className='text-sm text-danger'>{formError.sensorTag}</div>}
                                        </div>
                                    </div>
                                    {formData.sensorName != '' && <>
                                        <div className="flex flex-row w-full gap-4">
                                            <div className='w-full'>
                                                <label htmlFor="manufacturer" className="dark:text-white">Manufacturer</label>
                                                <input
                                                    type="text"
                                                    className='form-input dark:text-white'
                                                    name="manufacturer"
                                                    onChange={handleChange}
                                                    value={formData.manufacturer}
                                                />
                                                {formError.manufacturer && <div className='text-sm text-danger'>{formError.manufacturer}</div>}
                                            </div>
                                            <div className='w-full'>
                                                <label htmlFor="partID" className="dark:text-white">Part ID</label>
                                                <input
                                                    type="text"
                                                    className='form-input dark:text-white'
                                                    name="partID"
                                                    onChange={handleChange}
                                                    value={formData.partID}
                                                />
                                                {formError.partID && <div className='text-sm text-danger'>{formError.partID}</div>}
                                            </div>
                                        </div>
                                        <div className="flex flex-row w-full gap-4">
                                            <div className='w-full'>
                                                <label htmlFor="alarmType" className="dark:text-white">Alarm Type</label>
                                                <Select
                                                    name="alarmType"
                                                    className="w-full select-box dark:text-white"
                                                    options={AlarmTypeOptions}
                                                    isSearchable={false}
                                                    onChange={(e) => HandleSelectChange(e, 'alarmType')}
                                                    value={formData.alarmType}
                                                />
                                                {formError.alarmType && <div className='text-sm text-danger'>{formError.alarmType}</div>}
                                            </div>
                                            <div className='w-full'>
                                                <label htmlFor="bumpTest" className="dark:text-white">Bump Test</label>
                                                <Select
                                                    name="bumpTest"
                                                    className="w-full select-box dark:text-white"
                                                    options={BumpTestOptions}
                                                    isSearchable={false}
                                                    value={formData.bumpTest}
                                                    onChange={(e) => HandleSelectChange(e, 'bumpTest')}
                                                />
                                                {formError.bumpTest && <div className='text-sm text-danger'>{formError.bumpTest}</div>}
                                            </div>
                                        </div>
                                        {formData.bumpTest.value == '1' && <div className="flex flex-row w-full gap-4">
                                            <div className='w-full'>
                                                <label htmlFor="deviationForZeroCheck" className="dark:text-white">Percentage deviation for Zero Check</label>
                                                {/* <div className="form-input h-9">{formData.deviationForZeroCheck}</div> */}
                                                <input
                                                    type="text"
                                                    className="form-input dark:text-white"
                                                    name="deviationForZeroCheck"
                                                    value={formData.deviationForZeroCheck}
                                                    onChange={(e) => handleChange(e, 'number')}
                                                />
                                                {formError.deviationForZeroCheck && <div className='text-sm text-danger'>{formError.deviationForZeroCheck}</div>}
                                            </div>
                                            <div className='w-full'>
                                                <label htmlFor="deviationForSpanCheck" className="dark:text-white">Percentage deviation for Span Check</label>
                                                {/* <div className="form-input h-9">{formData.deviationForSpanCheck}</div> */}
                                                <input
                                                    type="text"
                                                    className='form-input dark:text-white'
                                                    name="deviationForSpanCheck"
                                                    value={formData.deviationForSpanCheck}
                                                    onChange={(e) => handleChange(e, 'number')}
                                                />
                                                {formError.deviationForSpanCheck && <div className='text-sm text-danger'>{formError.deviationForSpanCheck}</div>}
                                            </div>
                                        </div>}
                                        <div className="flex flex-row w-full gap-4">
                                            <div className='w-full'>
                                                <label htmlFor="sensorOutputType" className="dark:text-white">Sensor Output Type</label>
                                                <Select
                                                    name="sensorOutputType"
                                                    className="w-full select-box dark:text-white"
                                                    options={SensorOutputType}
                                                    isSearchable={false}
                                                    isDisabled={true}
                                                    value={formData.sensorOutputType}
                                                    onChange={(e) => HandleSelectChange(e, 'sensorOutputType')}
                                                />
                                                {formError.sensorOutputType && <div className='text-sm text-danger'>{formError.sensorOutputType}</div>}
                                            </div>
                                            <div className='w-full'>
                                                <label htmlFor="slotID" className="dark:text-white">Slot ID</label>
                                                <Select
                                                    name="slotID"
                                                    className="w-full select-box dark:text-white"
                                                    options={slotIdOptions}
                                                    isSearchable={false}
                                                    value={formData.slotID}
                                                    onChange={(e) => HandleSelectChange(e, 'slotID')}
                                                />
                                                {formError.slotID && <div className='text-sm text-danger'>{formError.slotID}</div>}
                                            </div>
                                        </div>
                                        <div className="flex flex-row w-full gap-4">
                                            <div className="w-full">
                                                <label htmlFor="pollingIntervalType" className="dark:text-white">Polling Interval Type *</label>
                                                <Select
                                                    name="pollingIntervalType"
                                                    className="w-full select-box dark:text-white"
                                                    options={pollingIntervalTypeOptions}
                                                    isSearchable={false}
                                                    value={formData.pollingIntervalType}
                                                    onChange={(e) => HandleSelectChange(e, 'pollingIntervalType')}
                                                />
                                                {formError.pollingIntervalType && <div className='text-sm text-danger'>{formError.pollingIntervalType}</div>}
                                            </div>
                                            <div className="w-full">
                                                <label htmlFor="defaultValue" className="dark:text-white">Default Value</label>
                                                <input
                                                    type="defaultValue"
                                                    className='form-input dark:text-white'
                                                    name="defaultValue"
                                                    onChange={(e) => handleChange(e, 'number')}
                                                    value={formData.defaultValue}
                                                />
                                            </div>
                                            {(formData.sensorOutputType?.label == 'Analog' || formData.sensorOutputType?.label == 'Modbus') && <div className='w-full'>
                                                <label htmlFor="units" className="dark:text-white">Units *</label>
                                                <Select
                                                    name="units"
                                                    className="w-full select-box dark:text-white"
                                                    options={Units}
                                                    isSearchable={false}
                                                    value={formData.units}
                                                    onChange={(e) => HandleSelectChange(e, 'units')}
                                                />
                                                {formError.units && <div className='text-sm text-danger'>{formError.units}</div>}
                                            </div>}
                                        </div>
                                        {formData.sensorOutputType?.label == 'Modbus' && <>
                                            <div className="flex flex-row w-full gap-4">
                                                <div className='w-full'>
                                                    <label htmlFor="slaveID" className="dark:text-white">Slave ID *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="slaveID"
                                                        onChange={(e) => handleChange(e, 'number')}
                                                        value={formData.slaveID}
                                                    />
                                                    {formError.slaveID && <div className='text-sm text-danger'>{formError.slaveID}</div>}
                                                </div>
                                                <div className='w-full'>
                                                    <label htmlFor="register" className="dark:text-white">Register *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="register"
                                                        onChange={(e) => handleChange(e, 'number')}
                                                        value={formData.register}
                                                    />
                                                    {formError.register && <div className='text-sm text-danger'>{formError.register}</div>}
                                                </div>
                                            </div>
                                            <div className="flex flex-row w-full gap-4">
                                                <div className='w-full'>
                                                    <label htmlFor="bitLength" className="dark:text-white">Length *</label>
                                                    <div className='flex flex-row'>
                                                        <div className='w-full'>
                                                            <label className="dark:text-white">
                                                                <input
                                                                    type='radio'
                                                                    className='form-radio'
                                                                    name='bitLength'
                                                                    value='16 Bit'
                                                                    onChange={handleChange}
                                                                    defaultChecked={formData.bitLength == '16 Bit'}
                                                                />
                                                                16 Bit
                                                            </label>
                                                        </div>
                                                        <div className='w-full'>
                                                            <label className="dark:text-white">
                                                                <input
                                                                    type='radio'
                                                                    className='form-radio'
                                                                    name='bitLength'
                                                                    value='32 Bit'
                                                                    onChange={handleChange}
                                                                    defaultChecked={formData.bitLength == '32 Bit'}
                                                                />
                                                                32 Bit
                                                            </label>
                                                        </div>
                                                    </div>
                                                    {formError.bitLength && <div className='text-sm text-danger'>{formError.bitLength}</div>}
                                                </div>
                                                <div className='flex flex-row w-full gap-4'>
                                                    <div className="w-full">
                                                        <label htmlFor="registerType" className="dark:text-white">Register Type *</label>
                                                        <Select
                                                            name="registerType"
                                                            className="w-full select-box dark:text-white"
                                                            options={RegisterType}
                                                            menuPlacement='top'
                                                            value={formData.registerType}
                                                            onChange={(e) => HandleSelectChange(e, 'registerType')}
                                                        />
                                                        {formError.registerType && <div className='text-sm text-danger'>{formError.registerType}</div>}
                                                    </div>
                                                    <div className="w-full">
                                                        <label htmlFor="conversionType" className="dark:text-white">Conversion Type *</label>
                                                        <Select
                                                            name="conversionType"
                                                            className="w-full select-box dark:text-white"
                                                            options={ConversionType}
                                                            menuPlacement='top'
                                                            value={formData.conversionType}
                                                            onChange={(e) => HandleSelectChange(e, 'conversionType')}
                                                        />
                                                        {formError.conversionType && <div className='text-sm text-danger'>{formError.conversionType}</div>}
                                                    </div>
                                                </div>
                                            </div>
                                        </>}
                                        {(formData.sensorOutputType?.label == 'Analog' || formData.sensorOutputType?.label == 'Modbus') && <div className="flex flex-row w-full gap-4">
                                            <div className="flex flex-row w-full gap-4">
                                                <div className='w-full'>
                                                    <label htmlFor="minimumRatedReading" className="dark:text-white">Minimum Rated Reading *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="minimumRatedReading"
                                                        onChange={(e) => handleChange(e, 'number')}
                                                        value={formData.minimumRatedReading}
                                                    />
                                                    {formError.minimumRatedReading && <div className='text-sm text-danger'>{formError.minimumRatedReading}</div>}
                                                </div>
                                                <div className='w-full'>
                                                    <label htmlFor="minimumRatedReadingScale" className="dark:text-white">Scale *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="minimumRatedReadingScale"
                                                        onChange={(e) => handleChange(e, 'number')}
                                                        value={formData.minimumRatedReadingScale}
                                                    />
                                                    {formError.minimumRatedReadingScale && <div className='text-sm text-danger'>{formError.minimumRatedReadingScale}</div>}
                                                </div>
                                            </div>
                                            <div className="flex flex-row w-full gap-4">
                                                <div className='w-full'>
                                                    <label htmlFor="maximumRatedReading" className="dark:text-white">Maximum Rated Reading *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="maximumRatedReading"
                                                        onChange={(e) => handleChange(e, 'number')}
                                                        value={formData.maximumRatedReading}
                                                    />
                                                    {formError.maximumRatedReading && <div className='text-sm text-danger'>{formError.maximumRatedReading}</div>}
                                                </div>
                                                <div className='w-full'>
                                                    <label htmlFor="maximumRatedReadingScale" className="dark:text-white">Scale *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="maximumRatedReadingScale"
                                                        onChange={(e) => handleChange(e, 'number')}
                                                        value={formData.maximumRatedReadingScale}
                                                    />
                                                    {formError.maximumRatedReadingScale && <div className='text-sm text-danger'>{formError.maximumRatedReadingScale}</div>}
                                                </div>
                                            </div>
                                        </div>}
                                        <div className="w-full">
                                            <label className="inline-flex">
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox"
                                                    name="isStel"
                                                    onChange={handleCheckBoxChange}
                                                    checked={formData.isStel}
                                                />
                                                <span className="dark:text-white">STEL & TWA</span>
                                            </label>
                                        </div>
                                        {formData.isStel && <div className="w-full">
                                            <div className="flex flex-row w-full gap-4">
                                                <div className='w-full'>
                                                    <label htmlFor="stelDuration" className="dark:text-white">Duration (In minutes) *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="stelDuration"
                                                        onChange={(e) => handleChange(e, 'number')}
                                                        value={formData.stelDuration}
                                                    />
                                                    {formError.stelDuration && <div className='text-sm text-danger'>{formError.stelDuration}</div>}
                                                </div>
                                                <div className='w-full'>
                                                    <label htmlFor="stelLimit" className="dark:text-white">Limit *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="stelLimit"
                                                        onChange={(e) => handleChange(e, 'number')}
                                                        value={formData.stelLimit}
                                                    />
                                                    {formError.stelLimit && <div className='text-sm text-danger'>{formError.stelLimit}</div>}
                                                </div>
                                                <div className='w-full'>
                                                    <label htmlFor="stelAlertTag" className="dark:text-white">Alert Tag *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="stelAlertTag"
                                                        onChange={handleChange}
                                                        value={formData.stelAlertTag}
                                                    />
                                                    {formError.stelAlertTag && <div className='text-sm text-danger'>{formError.stelAlertTag}</div>}
                                                </div>
                                            </div>
                                            <div className="w-full">
                                                <div className="row">
                                                    <div className="flex flex-row w-full gap-4">
                                                        <div className='w-full'>
                                                            <label htmlFor="twaShiftId" className="dark:text-white">Shift ID *</label>
                                                            <input
                                                                type="text"
                                                                className='form-input dark:text-white'
                                                                name="twaShiftId"
                                                                onChange={handleChange}
                                                                value={formData.twaShiftId}
                                                            />
                                                            {formError.twaShiftId && <div className='text-sm text-danger'>{formError.twaShiftId}</div>}
                                                        </div>
                                                        <div className='w-full'>
                                                            <label htmlFor="twaDuration" className="dark:text-white">Duration (In minutes) *</label>
                                                            <input
                                                                type="text"
                                                                className='form-input dark:text-white'
                                                                name="twaDuration"
                                                                onChange={(e) => handleChange(e, 'number')}
                                                                value={formData.twaDuration}
                                                            />
                                                            {formError.twaDuration && <div className='text-sm text-danger'>{formError.twaDuration}</div>}
                                                        </div>
                                                        <div className='w-full'>
                                                            <label htmlFor="twaLimit" className="dark:text-white">Limit *</label>
                                                            <input
                                                                type="text"
                                                                className='form-input dark:text-white'
                                                                name="twaLimit"
                                                                onChange={(e) => handleChange(e, 'number')}
                                                                value={formData.twaLimit}
                                                            />
                                                            {formError.twaLimit && <div className='text-sm text-danger'>{formError.twaLimit}</div>}
                                                        </div>
                                                        <div className='w-full'>
                                                            <label htmlFor="twaAlertTag" className="dark:text-white">Alert Tag *</label>
                                                            <input
                                                                type="text"
                                                                className='form-input dark:text-white'
                                                                name="twaAlertTag"
                                                                onChange={handleChange}
                                                                value={formData.twaAlertTag}
                                                            />
                                                            {formError.twaAlertTag && <div className='text-sm text-danger'>{formError.twaAlertTag}</div>}
                                                        </div>
                                                        <div className='w-full'>
                                                            <label htmlFor="twaStartTime" className="dark:text-white">Start Time *</label>
                                                            <input
                                                                type="time"
                                                                className='form-input dark:text-white'
                                                                name="twaStartTime"
                                                                onChange={handleChange}
                                                                value={formData.twaStartTime}
                                                            />
                                                            {formError.twaStartTime && <div className='text-sm text-danger'>{formError.twaStartTime}</div>}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-row w-full gap-4">
                                                        <div className='w-full'>
                                                            <label htmlFor="twaShiftId1" className="dark:text-white">Shift ID *</label>
                                                            <input
                                                                type="text"
                                                                className='form-input dark:text-white'
                                                                name="twaShiftId1"
                                                                onChange={handleChange}
                                                                value={formData.twaShiftId1}
                                                            />
                                                            {formError.twaShiftId1 && <div className='text-sm text-danger'>{formError.twaShiftId1}</div>}
                                                        </div>
                                                        <div className='w-full'>
                                                            <label htmlFor="twaDuration1" className="dark:text-white">Duration (In minutes) *</label>
                                                            <input
                                                                type="text"
                                                                className='form-input dark:text-white'
                                                                name="twaDuration1"
                                                                onChange={(e) => handleChange(e, 'number')}
                                                                value={formData.twaDuration1}
                                                            />
                                                            {formError.twaDuration1 && <div className='text-sm text-danger'>{formError.twaDuration1}</div>}
                                                        </div>
                                                        <div className='w-full'>
                                                            <label htmlFor="twaLimit1" className="dark:text-white">Limit *</label>
                                                            <input
                                                                type="text"
                                                                className='form-input dark:text-white'
                                                                name="twaLimit1"
                                                                onChange={(e) => handleChange(e, 'number')}
                                                                value={formData.twaLimit1}
                                                            />
                                                            {formError.twaLimit1 && <div className='text-sm text-danger'>{formError.twaLimit1}</div>}
                                                        </div>
                                                        <div className='w-full'>
                                                            <label htmlFor="twaAlertTag1" className="dark:text-white">Alert Tag *</label>
                                                            <input
                                                                type="text"
                                                                className='form-input dark:text-white'
                                                                name="twaAlertTag1"
                                                                onChange={handleChange}
                                                                value={formData.twaAlertTag1}
                                                            />
                                                            {formError.twaAlertTag1 && <div className='text-sm text-danger'>{formError.twaAlertTag1}</div>}
                                                        </div>
                                                        <div className='w-full'>
                                                            <label htmlFor="twaStartTime1" className="dark:text-white">Start Time *</label>
                                                            <input
                                                                type="time"
                                                                className='form-input dark:text-white'
                                                                name="twaStartTime1"
                                                                onChange={handleChange}
                                                                value={formData.twaStartTime1}
                                                            />
                                                            {formError.twaStartTime1 && <div className='text-sm text-danger'>{formError.twaStartTime1}</div>}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-row w-full gap-4">
                                                        <div className='w-full'>
                                                            <label htmlFor="twaShiftId2" className="dark:text-white">Shift ID *</label>
                                                            <input
                                                                type="text"
                                                                className='form-input dark:text-white'
                                                                name="twaShiftId2"
                                                                onChange={handleChange}
                                                                value={formData.twaShiftId2}
                                                            />
                                                            {formError.twaShiftId2 && <div className='text-sm text-danger'>{formError.twaShiftId2}</div>}
                                                        </div>
                                                        <div className='w-full'>
                                                            <label htmlFor="twaDuration2" className="dark:text-white">Duration (In minutes) *</label>
                                                            <input
                                                                type="text"
                                                                className='form-input dark:text-white'
                                                                name="twaDuration2"
                                                                onChange={(e) => handleChange(e, 'number')}
                                                                value={formData.twaDuration2}
                                                            />
                                                            {formError.twaDuration2 && <div className='text-sm text-danger'>{formError.twaDuration2}</div>}
                                                        </div>
                                                        <div className='w-full'>
                                                            <label htmlFor="twaLimit2" className="dark:text-white">Limit *</label>
                                                            <input
                                                                type="text"
                                                                className='form-input dark:text-white'
                                                                name="twaLimit2"
                                                                onChange={(e) => handleChange(e, 'number')}
                                                                value={formData.twaLimit2}
                                                            />
                                                            {formError.twaLimit2 && <div className='text-sm text-danger'>{formError.twaLimit2}</div>}
                                                        </div>
                                                        <div className='w-full'>
                                                            <label htmlFor="twaAlertTag2" className="dark:text-white">Alert Tag *</label>
                                                            <input
                                                                type="text"
                                                                className='form-input dark:text-white'
                                                                name="twaAlertTag2"
                                                                onChange={handleChange}
                                                                value={formData.twaAlertTag2}
                                                            />
                                                            {formError.twaAlertTag2 && <div className='text-sm text-danger'>{formError.twaAlertTag2}</div>}
                                                        </div>
                                                        <div className='w-full'>
                                                            <label htmlFor="twaStartTime2" className="dark:text-white">Start Time *</label>
                                                            <input
                                                                type="time"
                                                                className='form-input dark:text-white'
                                                                name="twaStartTime2"
                                                                onChange={handleChange}
                                                                value={formData.twaStartTime2}
                                                            />
                                                            {formError.twaStartTime2 && <div className='text-sm text-danger'>{formError.twaStartTime2}</div>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>}
                                        <div className="w-full">
                                            <label className="inline-flex pointer-events-auto dark:text-white">
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox"
                                                    name="isAQI"
                                                    defaultChecked={formData.isAQI}
                                                    onChange={handleCheckBoxChange}
                                                />
                                                <span>AQI</span>
                                            </label>
                                        </div>
                                        {formData.sensorOutputType?.label == 'Digital' ? <div className='flex flex-row w-full gap-2'>
                                            <div className='w-full'>
                                                <label htmlFor='sensorAlert' className="dark:text-white">Sensor Alert:</label>
                                                <Select
                                                    name="sensorAlert"
                                                    className="w-full select-box dark:text-white"
                                                    options={SensorAlertOptions}
                                                    isSearchable={false}
                                                    onChange={(e) => HandleSelectChange(e, 'sensorAlert')}
                                                    value={formData.sensorAlert}
                                                />
                                                {formError.sensorAlert && <div className='text-sm text-danger'>{formError.sensorAlert}</div>}
                                            </div>
                                            <div className='w-full'>
                                                {formData.sensorAlert.label == 'Low' && <>
                                                    <label htmlFor="sensorAlarmLowAlertMessage" className="dark:text-white">Min Value *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="sensorAlarmLowAlertMessage"
                                                        onChange={handleChange}
                                                        value={formData.sensorAlarmLowAlertMessage}
                                                    />
                                                    {formError.sensorAlarmLowAlertMessage && <div className='text-sm text-danger'>{formError.sensorAlarmLowAlertMessage}</div>}
                                                </>}
                                                {formData.sensorAlert.label == 'High' && <>
                                                    <label htmlFor="sensorAlarmHighAlertMessage" className="dark:text-white">Max Value *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="sensorAlarmHighAlertMessage"
                                                        onChange={handleChange}
                                                        value={formData.sensorAlarmHighAlertMessage}
                                                    />
                                                    {formError.sensorAlarmHighAlertMessage && <div className='text-sm text-danger'>{formError.sensorAlarmHighAlertMessage}</div>}
                                                </>}
                                            </div>
                                        </div> : <>
                                            <div className='flex flex-row w-full gap-2'>
                                                <div className='w-full'>
                                                    <label htmlFor='criticalAlert' className="dark:text-white">Critical Alert:</label>
                                                    <Select
                                                        name="criticalAlert"
                                                        className="w-full select-box dark:text-white"
                                                        options={AlertTypesOptions}
                                                        isSearchable={false}
                                                        onChange={(e) => HandleSelectChange(e, 'criticalAlert')}
                                                        value={formData.criticalAlert}
                                                    />
                                                    {formError.criticalAlert && <div className='text-sm text-danger'>{formError.criticalAlert}</div>}
                                                </div>
                                                <div className='flex flex-row w-full gap-2'>
                                                    <div className='w-full'>
                                                        <label htmlFor="criticalMin" className="dark:text-white">Min Value *</label>
                                                        {(formData.criticalAlert.label == 'Low' || formData.criticalAlert.label == 'Both') ? <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="criticalMin"
                                                            onChange={(e) => handleChange(e, 'number')}
                                                            value={formData.criticalMin}
                                                        /> : <div className='form-input h-9'>
                                                            {formData.criticalMin}
                                                        </div>}

                                                        {formError.criticalMin && <div className='text-sm text-danger'>{formError.criticalMin}</div>}
                                                    </div>
                                                    <div className='w-full'>
                                                        <label htmlFor="criticalMax" className="dark:text-white">Max Value *</label>
                                                        {(formData.criticalAlert.label == 'High' || formData.criticalAlert.label == 'Both') ? <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="criticalMax"
                                                            onChange={(e) => handleChange(e, 'number')}
                                                            value={formData.criticalMax}
                                                        /> : <div className='form-input h-9'>
                                                            {formData.criticalMax}
                                                        </div>}
                                                        {formError.criticalMax && <div className='text-sm text-danger'>{formError.criticalMax}</div>}
                                                    </div>
                                                </div>
                                            </div>
                                            {formData.criticalAlert.label != "" && <div className='flex flex-row w-full gap-2'>
                                                {(formData.criticalAlert.label == 'Low' || formData.criticalAlert.label == 'Both') && <div className='w-full'>
                                                    <label htmlFor="criticalMinAlert" className="dark:text-white">Low Alert Message *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="criticalMinAlert"
                                                        onChange={handleChange}
                                                        value={formData.criticalMinAlert}
                                                    />
                                                    {formError.criticalMinAlert && <div className='text-sm text-danger'>{formError.criticalMinAlert}</div>}
                                                </div>}
                                                {(formData.criticalAlert.label == 'High' || formData.criticalAlert.label == 'Both') && <div className='w-full'>
                                                    <label htmlFor="criticalMaxAlert" className="dark:text-white">High Alert Message *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="criticalMaxAlert"
                                                        onChange={handleChange}
                                                        value={formData.criticalMaxAlert}
                                                    />
                                                    {formError.criticalMaxAlert && <div className='text-sm text-danger'>{formError.criticalMaxAlert}</div>}
                                                </div>}
                                            </div>}
                                            <div className='flex flex-row w-full gap-2'>
                                                <div className='w-full'>
                                                    <label htmlFor='warningAlert' className="dark:text-white">Warning Alert:</label>
                                                    <Select
                                                        name="warningAlert"
                                                        className="w-full select-box dark:text-white"
                                                        options={AlertTypesOptions}
                                                        isSearchable={false}
                                                        onChange={(e) => HandleSelectChange(e, 'warningAlert')}
                                                        value={formData.warningAlert}
                                                    />
                                                    {formError.warningAlert && <div className='text-sm text-danger'>{formError.warningAlert}</div>}
                                                </div>
                                                <div className='flex flex-row w-full gap-2'>
                                                    <div className='w-full'>
                                                        <label htmlFor="warningMin" className="dark:text-white">Min Value *</label>
                                                        {(formData.warningAlert.label == 'Low' || formData.warningAlert.label == 'Both') ? <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="warningMin"
                                                            onChange={(e) => handleChange(e, 'number')}
                                                            value={formData.warningMin}
                                                        /> : <div className='form-input h-9'>
                                                            {formData.warningMin}
                                                        </div>}

                                                        {formError.warningMin && <div className='text-sm text-danger'>{formError.warningMin}</div>}
                                                    </div>
                                                    <div className='w-full'>
                                                        <label htmlFor="warningMax" className="dark:text-white">Max Value *</label>
                                                        {(formData.warningAlert.label == 'High' || formData.warningAlert.label == 'Both') ? <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="warningMax"
                                                            onChange={(e) => handleChange(e, 'number')}
                                                            value={formData.warningMax}
                                                        /> : <div className='form-input h-9'>
                                                            {formData.warningMax}
                                                        </div>}
                                                        {formError.warningMax && <div className='text-sm text-danger'>{formError.warningMax}</div>}
                                                    </div>
                                                </div>
                                            </div>
                                            {formData.warningAlert.label != "" && <div className='flex flex-row w-full gap-2'>
                                                {(formData.warningAlert.label == 'Low' || formData.warningAlert.label == 'Both') && <div className='w-full'>
                                                    <label htmlFor="warningMinAlert" className="dark:text-white">Low Alert Message *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="warningMinAlert"
                                                        onChange={handleChange}
                                                        value={formData.warningMinAlert}
                                                    />
                                                    {formError.warningMinAlert && <div className='text-sm text-danger'>{formError.warningMinAlert}</div>}
                                                </div>}
                                                {(formData.warningAlert.label == 'High' || formData.warningAlert.label == 'Both') && <div className='w-full'>
                                                    <label htmlFor="warningMaxAlert" className="dark:text-white">High Alert Message *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="warningMaxAlert"
                                                        onChange={handleChange}
                                                        value={formData.warningMaxAlert}
                                                    />
                                                    {formError.warningMaxAlert && <div className='text-sm text-danger'>{formError.warningMaxAlert}</div>}
                                                </div>}
                                            </div>}
                                            <div className='flex flex-row w-full gap-2'>
                                                <div className='w-full'>
                                                    <label htmlFor='outOfRangeAlert' className="dark:text-white">Out-Of-Range Alert:</label>
                                                    <Select
                                                        name="outOfRangeAlert"
                                                        className="w-full select-box dark:text-white"
                                                        options={AlertTypesOptions}
                                                        isSearchable={false}
                                                        onChange={(e) => HandleSelectChange(e, 'outOfRangeAlert')}
                                                        value={formData.outOfRangeAlert}
                                                    />
                                                    {formError.outOfRangeAlert && <div className='text-sm text-danger'>{formError.outOfRangeAlert}</div>}
                                                </div>
                                                <div className='flex flex-row w-full gap-2'>
                                                    <div className='w-full'>
                                                        <label htmlFor="outOfRangeMin" className="dark:text-white">Min Value *</label>
                                                        {(formData.outOfRangeAlert.label == 'Low' || formData.outOfRangeAlert.label == 'Both') ? <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="outOfRangeMin"
                                                            onChange={(e) => handleChange(e, 'number')}
                                                            value={formData.outOfRangeMin}
                                                        /> : <div className='form-input h-9'>
                                                            {formData.outOfRangeMin}
                                                        </div>}

                                                        {formError.outOfRangeMin && <div className='text-sm text-danger'>{formError.outOfRangeMin}</div>}
                                                    </div>
                                                    <div className='w-full'>
                                                        <label htmlFor="outOfRangeMax" className="dark:text-white">Max Value *</label>
                                                        {(formData.outOfRangeAlert.label == 'High' || formData.outOfRangeAlert.label == 'Both') ? <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="outOfRangeMax"
                                                            onChange={(e) => handleChange(e, 'number')}
                                                            value={formData.outOfRangeMax}
                                                        /> : <div className='form-input h-9'>
                                                            {formData.outOfRangeMax}
                                                        </div>}
                                                        {formError.outOfRangeMax && <div className='text-sm text-danger'>{formError.outOfRangeMax}</div>}
                                                    </div>
                                                </div>
                                            </div>
                                            {formData.outOfRangeAlert.label != "" && <div className='flex flex-row w-full gap-2'>
                                                {(formData.outOfRangeAlert.label == 'Low' || formData.outOfRangeAlert.label == 'Both') && <div className='w-full'>
                                                    <label htmlFor="outOfRangeMinAlert" className="dark:text-white">Low Alert Message *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="outOfRangeMinAlert"
                                                        onChange={handleChange}
                                                        value={formData.outOfRangeMinAlert}
                                                    />
                                                    {formError.outOfRangeMinAlert && <div className='text-sm text-danger'>{formError.outOfRangeMinAlert}</div>}
                                                </div>}
                                                {(formData.outOfRangeAlert.label == 'High' || formData.outOfRangeAlert.label == 'Both') && <div className='w-full'>
                                                    <label htmlFor="outOfRangeMaxAlert" className="dark:text-white">High Alert Message *</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="outOfRangeMaxAlert"
                                                        onChange={handleChange}
                                                        value={formData.outOfRangeMaxAlert}
                                                    />
                                                    {formError.outOfRangeMaxAlert && <div className='text-sm text-danger'>{formError.outOfRangeMaxAlert}</div>}
                                                </div>}
                                            </div>}
                                            <div className='flex flex-row w-full'>
                                                <label htmlFor='normalAlert' className="dark:text-white">Normal Value:</label>
                                            </div>
                                            <div className='flex flex-row w-full gap-2'>
                                                <div className='w-full'>
                                                    <label htmlFor="nMin" className="dark:text-white">Min Value</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="nMin"
                                                        onChange={(e) => handleChange(e, 'number')}
                                                        value={formData.nMin}
                                                    />

                                                    {formError.nMin && <div className='text-sm text-danger'>{formError.nMin}</div>}
                                                </div>
                                                <div className='w-full'>
                                                    <label htmlFor="nMax" className="dark:text-white">Max Value</label>
                                                    <input
                                                        type="text"
                                                        className='form-input dark:text-white'
                                                        name="nMax"
                                                        onChange={(e) => handleChange(e, 'number')}
                                                        value={formData.nMax}
                                                    />

                                                    {formError.nMax && <div className='text-sm text-danger'>{formError.nMax}</div>}
                                                </div>
                                            </div>
                                        </>}
                                    </>}
                                </form>
                            </div>
                            <div className="mt-8 flex items-center justify-end">
                                <button type="button" className="btn btn-primary" onClick={HandleAdd}>
                                    {sensorID ? 'Update' : 'Add'}
                                </button>
                                <button type="button" className="btn btn-outline-danger ltr:ml-4 rtl:mr-4" onClick={HandleClose}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSensor;
