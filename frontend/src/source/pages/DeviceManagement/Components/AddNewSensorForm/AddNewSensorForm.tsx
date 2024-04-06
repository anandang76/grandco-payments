import React, { Fragment, useEffect, useState } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import Select from 'react-select';
import { AddSensorType, GetSensorType, GetSensorOutput, GetUnit, UpdateSensorType } from '@/source/service/DeviceManagementService';
import CustomToast from '@/helpers/CustomToast';

const AddNewSensorForm = ({ openModal, closeModal, DefaultData, OnSuccess }: any) => {
    const currentDate = new Date();

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

    const [modal2, setModal2] = useState(false);
    const [Title, setTitle] = useState('New Sensor');

    const [formData, setFormData] = useState<any>({
        sensorOutputType: {
            label: 'Digital',
            value: 'Digital'
        },
        sensorType: '',
        manufacturer: '',
        partID: '',
        alarmType: AlarmTypeOptions[0],
        bumpTest: BumpTestOptions[1],
        deviationForZeroCheck: '',
        deviationForSpanCheck: '',
        slaveID: '',
        register: '',
        BitLength: '',
        registerType: {
            label: '',
            value: ''
        },
        conversionType: {
            label: '',
            value: ''
        },
    });
    const [formError, setFormError] = useState<any>({});

    const [Categories, setCategories] = useState<Array<any>>([]);
    const [Units, setUnits] = useState<Array<any>>([]);
    const [showAlertsForm, setShowAlertsForm] = useState<boolean>(false);

    const HandleClose = () => {
        closeModal(false);
        setModal2(false);
    };

    const GetFormData = async () => {
        let SensorTypeResponse = await GetSensorOutput({
            id: "all"
        });

        let Unitresponse = await GetUnit({
            id: 'all'
        });

        if(SensorTypeResponse.data?.status == "success"){
            SensorTypeResponse = SensorTypeResponse.data.data;
            SensorTypeResponse.map((category: any) => {
                category.label = category.sensorOutputType;
                category.value = category.id;
            });

            setCategories(SensorTypeResponse);
            if(!DefaultData.edit){
                setFormData((prevData: any) => ({
                    ...prevData,
                    sensorOutputType: SensorTypeResponse.find((sensorType: any) => sensorType.label == 'Analog')
                }))
            }
        } else {
            CustomToast('Unable to fetch sensor type', 'error');
        }

        if(Unitresponse.data?.status == "success"){
            Unitresponse = Unitresponse.data.data;
            Unitresponse.map((category: any) => {
                category.label = category.unitLabel;
                category.value = category.id;
            });

            setUnits(Unitresponse);
        } else {
            CustomToast('Unable to fetch units', 'error');
        }
    }

    const HandleValidate = () => {
        let isValid = true;
        let error: any = {};

        if(formData.sensorType == ''){
            error['sensorType'] = 'Sensor Name is required';
            isValid = false;
        }

        // if(formData.manufacturer == ''){
        //     error['manufacturer'] = 'Manufacturer is required';
        //     isValid = false;
        // }

        // if(formData.partID == ''){
        //     error['partID'] = 'Part ID is required';
        //     isValid = false;
        // }

        if(formData.bumpTest?.value == "1"){
            if(formData.deviationForZeroCheck == ""){
                error["deviationForZeroCheck"] = "Zero check is required";
                isValid = false;
            }

            if(formData.deviationForSpanCheck == ""){
                error["deviationForSpanCheck"] = "Span check is required";
                isValid = false;
            }
        }

        if(formData.sensorOutputType.label != 'Digital'){
            if(formData.units.label == ''){
                error['units'] = 'Units is required';
                isValid = false;
            }

            // if(formData.sensorOutputType.label != 'Inbuilt'){
            //     if(formData.minimumRatedReading == ''){
            //         error['minimumRatedReading'] = 'Minimum Rated Reading is required';
            //         isValid = false;
            //     }

            //     if(formData.minimumRatedReadingScale == ''){
            //         error['minimumRatedReadingScale'] = 'Scale is required';
            //         isValid = false;
            //     }

            //     if(formData.maximumRatedReading == ''){
            //         error['maximumRatedReading'] = 'Maximum Rated Reading is required';
            //         isValid = false;
            //     }

            //     if(formData.maximumRatedReadingScale == ''){
            //         error['maximumRatedReadingScale'] = 'Scale is required';
            //         isValid = false;
            //     }
            // }

            if(formData.sensorOutputType.label == 'Modbus'){
                // if(formData.register == ''){
                //     error['register'] = 'Register is required';
                //     isValid = false;
                // }

                // if(formData.bitLength == ''){
                //     error['bitLength'] = 'Length is required';
                //     isValid = false;
                // }

                // if(formData.registerType.label == ''){
                //     error['registerType'] = 'Register Type is required';
                //     isValid = false;
                // }

                // if(formData.conversionType.label == ''){
                //     error['conversionType'] = 'Conversion Type is required';
                //     isValid = false;
                // }
            }
        }

        if(showAlertsForm){
            if(formData.isStel){
                if(formData.stelDuration == ''){
                    error['stelDuration'] = 'Duration is required';
                    isValid = false;
                }

                if(formData.stelLimit == ''){
                    error['stelLimit'] = 'Limit is required';
                    isValid = false;
                }
            }

            if(formData.isTwa){
                if((formData.twaShiftId == "" || formData.twaShiftId.trim() == "") && (formData.twaShiftId1 == "" || formData.twaShiftId1.trim() == "" ) && (formData.twaShiftId2 == "" || formData.twaShiftId2.trim() == "")){
                    error['twaShiftId'] = "Shift ID is required";
                    isValid = false;
                } else {
                    if(formData.twaShiftId != ""){
                        if(formData.twaDuration == ""){
                            error['twaDuration'] = "Duration is required";
                            isValid = false;
                        }

                        if(formData.twaLimit == ""){
                            error['twaLimit'] = "Limit is required";
                            isValid = false;
                        }
                    }

                    if(formData.twaShiftId1 != ""){
                        if(formData.twaDuration1 == ""){
                            error['twaDuration1'] = "Duration is required";
                            isValid = false;
                        }

                        if(formData.twaLimit1 == ""){
                            error['twaLimit1'] = "Limit is required";
                            isValid = false;
                        }
                    }

                    if(formData.twaShiftId2 != ""){
                        if(formData.twaDuration2 == ""){
                            error['twaDuration2'] = "Duration is required";
                            isValid = false;
                        }

                        if(formData.twaLimit2 == ""){
                            error['twaLimit2'] = "Limit is required";
                            isValid = false;
                        }
                    }
                }
            }

            if(formData.criticalMin.toString() == ''){
                error['criticalMin'] = 'Min Value is required';
                isValid = false;
            }

            if(formData.criticalMax.toString() == ''){
                error['criticalMax'] = 'Max Value is required';
                isValid = false;
            }

            if(formData.warningMin.toString() == ''){
                error['warningMin'] = 'Min Value is required';
                isValid = false;
            }

            if(formData.warningMax.toString() == ''){
                error['warningMax'] = 'Max Value is required';
                isValid = false;
            }

            if(formData.outOfRangeMin.toString() == ''){
                error['outOfRangeMin'] = 'Min Value is required';
                isValid = false;
            }

            if(formData.outOfRangeMax.toString() == ''){
                error['outOfRangeMax'] = 'Max Value is required';
                isValid = false;
            }
        }

        setFormError(error);
        return isValid;
    }

    const HandleAdd = async () => {
        if(HandleValidate()){
            const {
                sensorOutputType, sensorType, manufacturer, partID, alarmType, bumpTest,
                deviationForZeroCheck, deviationForSpanCheck, units, criticalMin, criticalMax,
                warningMin, warningMax, outOfRangeMin, outOfRangeMax, isStel, isTwa, isAQI, stelLimit,
                stelDuration, twaShiftId, twaLimit, twaDuration, twaStartTime, nMin, nMax,
                twaShiftId1, twaLimit1, twaDuration1, twaStartTime1, twaShiftId2, twaLimit2,
                twaDuration2, twaStartTime2, minimumRatedReading, minimumRatedReadingScale,
                maximumRatedReading, maximumRatedReadingScale, slaveID, register, bitLength, registerType, conversionType
            } = formData;

            const bumpInfo = {
                deviationForZeroCheck: deviationForZeroCheck,
                deviationForSpanCheck: deviationForSpanCheck
            };

            const addData: any = {
                sensorOutput: sensorOutputType.value,
                sensorType: sensorType,
                manufacturer: manufacturer,
                partID: partID,
                alarmType: alarmType.value,
                bumpTest: bumpTest.value,
                bumpInfo: JSON.stringify(bumpInfo)
            };

            if(sensorOutputType.label != 'Digital'){

                const criticalAlertInfo = {
                    cMin: criticalMin,
                    cMax: criticalMax
                };

                const warningAlertInfo = {
                    wMin: warningMin,
                    wMax: warningMax
                };

                const outOfRangeAlertInfo = {
                    oMin: outOfRangeMin,
                    oMax: outOfRangeMax
                };

                const stelInfo: any = {};

                if(isStel){
                    stelInfo['stelLimit'] = stelLimit;
                    stelInfo['stelDuration'] = stelDuration;
                };

                const twaInfo: any = {};

                if(isTwa){
                    if(twaShiftId){
                        twaInfo['shift1'] = {
                            twaShiftId: twaShiftId,
                            twaLimit: twaLimit,
                            twaDuration: twaDuration,
                            twaStartTime: twaStartTime
                        }
                    }

                    if(twaShiftId1){
                        twaInfo['shift2'] = {
                            twaShiftId: twaShiftId1,
                            twaLimit: twaLimit1,
                            twaDuration: twaDuration1,
                            twaStartTime: twaStartTime1
                        }
                    }

                    if(twaShiftId2){
                        twaInfo['shift3'] = {
                            twaShiftId: twaShiftId2,
                            twaLimit: twaLimit2,
                            twaDuration: twaDuration2,
                            twaStartTime: twaStartTime2
                        }
                    }
                }

                addData['units'] = units.value;
                addData['criticalAlertInfo'] = JSON.stringify(criticalAlertInfo);
                addData['warningAlertInfo'] = JSON.stringify(warningAlertInfo);
                addData['outOfRangeAlertInfo'] = JSON.stringify(outOfRangeAlertInfo);
                addData['isStel'] = Number(isStel);
                addData['isTwa'] = Number(isTwa);
                addData['isAQI'] = Number(isAQI);
                addData['stelInfo'] = JSON.stringify(stelInfo);
                addData['twaInfo'] = JSON.stringify(twaInfo);
                addData['nMin'] = nMin;
                addData['nMax'] = nMax;

                if(sensorOutputType.label != 'Inbuilt'){
                    const scaleInfo = {
                        minR: minimumRatedReading,
                        minRS: minimumRatedReadingScale,
                        maxR: maximumRatedReading,
                        maxRS: maximumRatedReadingScale
                    };

                    addData['scaleInfo'] = JSON.stringify(scaleInfo);

                    if(sensorOutputType.label != 'Analog'){
                        const modBusInfo = {
                            slaveID: slaveID,
                            register: register,
                            bitLength: bitLength,
                            registerType: registerType?.value,
                            conversionType: conversionType?.value
                        };

                        addData['modBusInfo'] = JSON.stringify(modBusInfo);
                    }
                }
            }

            let message: string = "Something went wrong, unable to add";
            let status: string = "error";

            let response: any;

            if(DefaultData.edit){
                message = "Something went wrong, unable to update";
                addData['id'] = DefaultData.id;
                response = await UpdateSensorType(addData);
            } else {
                response = await AddSensorType(addData);
            }

            if(response.data?.status == "success"){
                message = response.data.message;
                status = response.data.status;
                OnSuccess(true);
            }

            CustomToast(message, status);
            HandleClose();
        }
    };

    const setEmptyData = (prevData: any, name: string, value: any) => {
        return {
            ...prevData,
            [name]: value
        }
    };

    const handleChange = (e: any, type:string="string") => {
        let { name, value } = e.target;

        if(type == "number"){
            value = value.replace(/[^\d-]/g, '')
        }

        setFormData((prevData: any) => ({
            ...prevData,
            [name]: value
        }))
    };

    const handleCheckBoxChange = (e: any) => {
        let { name, checked } = e.target;

        if(name == 'isStel'){
            delete formError['stelDuration'];
            delete formError['stelLimit'];

            setFormError(formError);
        }

        if(name == 'isTwa'){
            delete formError['twaShiftId'];
            delete formError['twaDuration'];
            delete formError['twaLimit'];

            delete formError['twaShiftId1'];
            delete formError['twaDuration1'];
            delete formError['twaLimit1'];

            delete formError['twaShiftId2'];
            delete formError['twaDuration2'];
            delete formError['twaLimit2'];

            setFormError(formError);
        }

        setFormData((prevData: any) => ({
            ...prevData,
            [name]: checked,
            ...(name == "isStel" && { 'isTwa': checked })
        }))
    }

    const HandleSelectChange = (e: any, name: string) => {
        setFormData((prevData: any) => ({
            ...prevData,
            [name]: e
        }));
    }

    const HandleNext = () => {
        if(HandleValidate()){
            setShowAlertsForm(true);
        }
    }

    const HandleBack = () => {
        setShowAlertsForm(false);
    }

    const GetData = async () => {
        let response = await GetSensorType({
            id: DefaultData.id
        });

        if(response.data.status == "success"){
            response = response.data.data;

            let {
                alarmType, bumpTest, bumpInfo, criticalAlertInfo, isAQI, isStel, isTwa, manufacturer, modBusInfo, nMin, nMax,
                outOfRangeAlertInfo, partID, scaleInfo, sensorType, sensorOutput, stelInfo, twaInfo, units, warningAlertInfo,
            } = response;

            // if(Categories.length > 0 && Units.length > 0){
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
                            stelDuration: ''
                        };
                    }
                } else {
                    stelInfo = {
                        stelLimit: '',
                        stelDuration: ''
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
                                twaStartTime: `${currentDate.getHours()}:${currentDate.getMinutes() > 9 ? currentDate.getMinutes() : `0${currentDate.getMinutes()}`}`,
                            },
                            shift2: {
                                twaShiftId: '',
                                twaDuration: '',
                                twaLimit: '',
                                twaStartTime: `${currentDate.getHours()}:${currentDate.getMinutes() > 9 ? currentDate.getMinutes() : `0${currentDate.getMinutes()}`}`,
                            },
                            shift3: {
                                twaShiftId: '',
                                twaDuration: '',
                                twaLimit: '',
                                twaStartTime: `${currentDate.getHours()}:${currentDate.getMinutes() > 9 ? currentDate.getMinutes() : `0${currentDate.getMinutes()}`}`,
                            }
                        };
                    } else if(Object.keys(twaInfo).length == 1){
                        twaInfo = {
                            shift1: twaInfo.shift1,
                            shift2: {
                                twaShiftId: '',
                                twaDuration: '',
                                twaLimit: '',
                                twaStartTime: `${currentDate.getHours()}:${currentDate.getMinutes() > 9 ? currentDate.getMinutes() : `0${currentDate.getMinutes()}`}`,
                            },
                            shift3: {
                                twaShiftId: '',
                                twaDuration: '',
                                twaLimit: '',
                                twaStartTime: `${currentDate.getHours()}:${currentDate.getMinutes() > 9 ? currentDate.getMinutes() : `0${currentDate.getMinutes()}`}`,
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
                                twaStartTime: `${currentDate.getHours()}:${currentDate.getMinutes() > 9 ? currentDate.getMinutes() : `0${currentDate.getMinutes()}`}`,
                            }
                        };
                    }
                } else {
                    twaInfo = {
                        shift1: {
                            twaShiftId: '',
                            twaDuration: '',
                            twaLimit: '',
                            twaStartTime: `${currentDate.getHours()}:${currentDate.getMinutes() > 9 ? currentDate.getMinutes() : `0${currentDate.getMinutes()}`}`,
                        },
                        shift2: {
                            twaShiftId: '',
                            twaDuration: '',
                            twaLimit: '',
                            twaStartTime: `${currentDate.getHours()}:${currentDate.getMinutes() > 9 ? currentDate.getMinutes() : `0${currentDate.getMinutes()}`}`,
                        },
                        shift3: {
                            twaShiftId: '',
                            twaDuration: '',
                            twaLimit: '',
                            twaStartTime: `${currentDate.getHours()}:${currentDate.getMinutes() > 9 ? currentDate.getMinutes() : `0${currentDate.getMinutes()}`}`,
                        }
                    };
                }

                if(criticalAlertInfo){
                    criticalAlertInfo = JSON.parse(criticalAlertInfo);
                    if(Object.keys(criticalAlertInfo).length == 0){
                        criticalAlertInfo = {
                            cMin: '',
                            cMax: ''
                        };
                    }
                } else {
                    criticalAlertInfo = {
                        cMin: '',
                        cMax: ''
                    };
                }

                if(warningAlertInfo){
                    warningAlertInfo = JSON.parse(warningAlertInfo);
                    if(Object.keys(warningAlertInfo).length == 0){
                        warningAlertInfo = {
                            wMin: '',
                            wMax: ''
                        };
                    }
                } else {
                    warningAlertInfo = {
                        wMin: '',
                        wMax: ''
                    };
                }

                if(outOfRangeAlertInfo){
                    outOfRangeAlertInfo = JSON.parse(outOfRangeAlertInfo);
                    if(Object.keys(outOfRangeAlertInfo).length == 0){
                        outOfRangeAlertInfo = {
                            oMin: '',
                            oMax: ''
                        };
                    }
                } else {
                    outOfRangeAlertInfo = {
                        oMin: '',
                        oMax: ''
                    };
                }

                setFormData({
                    sensorOutputType: sensorOutput,
                    sensorType: sensorType,
                    manufacturer: manufacturer,
                    partID: partID,
                    alarmType: AlarmTypeOptions.find(alarm => alarm.value == alarmType),
                    bumpTest: BumpTestOptions.find(bump => bump.value == bumpTest),
                    deviationForZeroCheck: bumpInfo.deviationForZeroCheck,
                    deviationForSpanCheck: bumpInfo.deviationForSpanCheck,
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
                    isTwa: Boolean(isTwa),
                    twaShiftId: twaInfo.shift1.twaShiftId,
                    twaDuration: twaInfo.shift1.twaDuration,
                    twaLimit: twaInfo.shift1.twaLimit,
                    twaStartTime: twaInfo.shift1.twaStartTime,
                    twaShiftId1: twaInfo.shift2.twaShiftId,
                    twaDuration1: twaInfo.shift2.twaDuration,
                    twaLimit1: twaInfo.shift2.twaLimit,
                    twaStartTime1: twaInfo.shift2.twaStartTime,
                    twaShiftId2: twaInfo.shift3.twaShiftId,
                    twaDuration2: twaInfo.shift3.twaDuration,
                    twaLimit2: twaInfo.shift3.twaLimit,
                    twaStartTime2: twaInfo.shift3.twaStartTime,
                    isAQI: Boolean(isAQI),
                    criticalMin: criticalAlertInfo.cMin,
                    criticalMax: criticalAlertInfo.cMax,
                    warningMin: warningAlertInfo.wMin,
                    warningMax: warningAlertInfo.wMax,
                    outOfRangeMin: outOfRangeAlertInfo.oMin,
                    outOfRangeMax: outOfRangeAlertInfo.oMax,
                    nMin: nMin,
                    nMax: nMax
                });
            // }
        } else {
            CustomToast('Unable to find sensor type', 'error');
        }
    };

    useEffect(() => {
        if(openModal){
            GetFormData();
            if(DefaultData.edit){
                setTitle(`Edit Sensor Type`);
                GetData();
            } else {
                setFormData({
                    sensorOutputType: {
                        label: 'Analog',
                        value: 'Analog'
                    },
                    sensorType: '',
                    manufacturer: '',
                    partID: '',
                    alarmType: AlarmTypeOptions[0],
                    bumpTest: BumpTestOptions[1],
                    deviationForZeroCheck: '',
                    deviationForSpanCheck: '',
                    units: {
                        label: '',
                        value: ''
                    },
                    minimumRatedReading: '',
                    minimumRatedReadingScale: '',
                    maximumRatedReading: '',
                    maximumRatedReadingScale: '',
                    slaveID: '',
                    register: '',
                    bitLength: '',
                    registerType: {
                        label: '',
                        value: ''
                    },
                    conversionType: {
                        label: '',
                        value: ''
                    },
                    isStel: false,
                    stelDuration: '',
                    stelLimit: '',
                    isTwa: false,
                    twaShiftId: '',
                    twaDuration: '',
                    twaLimit: '',
                    twaStartTime: '08:30',
                    twaShiftId1: '',
                    twaDuration1: '',
                    twaLimit1: '',
                    twaStartTime1: '',
                    twaShiftId2: '',
                    twaDuration2: '',
                    twaLimit2: '',
                    twaStartTime2: '',
                    isAQI: false,
                    criticalMin: 0,
                    criticalMax: '',
                    warningMin: 0,
                    warningMax: '',
                    outOfRangeMin: 0,
                    outOfRangeMax: '',
                });
                setTitle(`Add Sensor Type`);
            }
            setFormError({});
            setShowAlertsForm(false);
            setModal2(openModal);
        }
    }, [openModal])

    return (
        <Transition appear show={modal2} as={Fragment}>
            <Dialog as="div" open={modal2} onClose={HandleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0" />
                </Transition.Child>
                <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                    <div className="flex min-h-screen items-center justify-center px-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel as="div" className="panel my-8 w-full max-w-[90%] overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <h5 className="text-lg font-bold dark:text-white">{Title}</h5>
                                    <button type="button" className="text-white-dark hover:text-dark dark:text-white" onClick={HandleClose}>
                                        <IconX />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <div className="flex flex-col items-center">
                                        <form className="flex flex-col items-center gap-2 w-full">
                                            {!showAlertsForm && <>
                                                <div className="flex flex-row w-full gap-4">
                                                    <div className='w-full'>
                                                        <label htmlFor="sensorOutputType" className='dark:text-white'>Sensor Output Type *</label>
                                                        <Select
                                                            name="sensorOutputType"
                                                            className="w-full select-box dark:text-white"
                                                            options={Categories}
                                                            isSearchable={false}
                                                            value={formData.sensorOutputType}
                                                            onChange={(e) => HandleSelectChange(e, 'sensorOutputType')}
                                                        />
                                                        {formError.sensorOutputType && <div className='text-sm text-danger'>{formError.sensorOutputType}</div>}
                                                    </div>
                                                    <div className='w-full'>
                                                        <label htmlFor="sensorType" className='dark:text-white'>Sensor Type *</label>
                                                        <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="sensorType"
                                                            onChange={handleChange}
                                                            value={formData.sensorType}
                                                        />
                                                        {formError.sensorType && <div className='text-sm text-danger'>{formError.sensorType}</div>}
                                                    </div>
                                                </div>
                                                <div className="flex flex-row w-full gap-4">
                                                    <div className='w-full'>
                                                        <label htmlFor="manufacturer" className='dark:text-white'>Manufacturer</label>
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
                                                        <label htmlFor="partID" className='dark:text-white'>Part ID</label>
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
                                                        <label htmlFor="alarmType" className='dark:text-white'>Alarm Type</label>
                                                        <Select
                                                            name="alarmType"
                                                            className="w-full select-box dark:text-white"
                                                            options={AlarmTypeOptions}
                                                            isSearchable={false}
                                                            menuPlacement='top'
                                                            onChange={(e) => HandleSelectChange(e, 'alarmType')}
                                                            value={formData.alarmType}
                                                        />
                                                        {formError.alarmType && <div className='text-sm text-danger'>{formError.alarmType}</div>}
                                                    </div>
                                                    <div className='w-full'>
                                                        <label htmlFor="bumpTest" className='dark:text-white'>Bump Test</label>
                                                        <Select
                                                            name="bumpTest"
                                                            className="w-full select-box dark:text-white"
                                                            options={BumpTestOptions}
                                                            isSearchable={false}
                                                            menuPlacement='top'
                                                            value={formData.bumpTest}
                                                            onChange={(e) => HandleSelectChange(e, 'bumpTest')}
                                                        />
                                                        {formError.bumpTest && <div className='text-sm text-danger'>{formError.bumpTest}</div>}
                                                    </div>
                                                </div>
                                                {formData.bumpTest != '' && formData.bumpTest.value == '1' && <div className="flex flex-row w-full gap-4">
                                                    <div className='w-full'>
                                                        <label htmlFor="deviationForZeroCheck" className='dark:text-white'>Percentage deviation for Zero Check *</label>
                                                        <input
                                                            type="text"
                                                            className="form-input dark:text-white"
                                                            name="deviationForZeroCheck"
                                                            value={formData.deviationForZeroCheck}
                                                            onChange={handleChange}
                                                        />
                                                        {formError.deviationForZeroCheck && <div className='text-sm text-danger'>{formError.deviationForZeroCheck}</div>}
                                                    </div>
                                                    <div className='w-full'>
                                                        <label htmlFor="deviationForSpanCheck" className='dark:text-white'>Percentage deviation for Span Check *</label>
                                                        <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="deviationForSpanCheck"
                                                            value={formData.deviationForSpanCheck}
                                                            onChange={handleChange}
                                                        />
                                                        {formError.deviationForSpanCheck && <div className='text-sm text-danger'>{formError.deviationForSpanCheck}</div>}
                                                    </div>
                                                </div>}
                                                {formData.sensorOutputType.label == 'Modbus' && <>
                                                    <div className="flex flex-row w-full gap-4">
                                                        <div className='w-full'>
                                                            <label htmlFor="slaveID" className='dark:text-white'>Slave ID</label>
                                                            <div className="form-input h-9 dark:text-white"></div>
                                                            {/* <input
                                                                type="text"
                                                                className='form-input'
                                                                name="slaveID"
                                                                onChange={(e) => handleChange(e, 'number')}
                                                                value={formData.slaveID}
                                                            /> */}
                                                            {formError.slaveID && <div className='text-sm text-danger'>{formError.slaveID}</div>}
                                                        </div>
                                                        <div className='w-full'>
                                                            <label htmlFor="register" className='dark:text-white'>Register</label>
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
                                                            <label htmlFor="bitLength" className='dark:text-white'>Length</label>
                                                            <div className='flex flex-row'>
                                                                <div className='w-full dark:text-white'>
                                                                    <label>
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
                                                                <div className='w-full dark:text-white'>
                                                                    <label>
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
                                                                <label htmlFor="registerType" className='dark:text-white'>Register Type</label>
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
                                                                <label htmlFor="conversionType" className='dark:text-white'>Conversion Type</label>
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
                                                {(formData.sensorOutputType.label == 'Inbuilt' || formData.sensorOutputType.label == 'Analog' || formData.sensorOutputType.label == 'Modbus') && <div className='w-full'>
                                                    <label htmlFor="units" className='dark:text-white'>Units *</label>
                                                    <Select
                                                        name="units"
                                                        className="w-full select-box dark:text-white"
                                                        options={Units}
                                                        isSearchable={false}
                                                        menuPlacement='top'
                                                        value={formData.units}
                                                        onChange={(e) => HandleSelectChange(e, 'units')}
                                                    />
                                                    {formError.units && <div className='text-sm text-danger'>{formError.units}</div>}
                                                </div>}
                                                {(formData.sensorOutputType.label == 'Analog' || formData.sensorOutputType.label == 'Modbus') && <div className="flex flex-row w-full gap-4">
                                                    <div className="flex flex-row w-full gap-4">
                                                        <div className='w-full'>
                                                            <label htmlFor="minimumRatedReading" className='dark:text-white'>Minimum Rated Reading</label>
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
                                                            <label htmlFor="minimumRatedReadingScale" className='dark:text-white'>Scale</label>
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
                                                            <label htmlFor="maximumRatedReading" className='dark:text-white'>Maximum Rated Reading</label>
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
                                                            <label htmlFor="maximumRatedReadingScale" className='dark:text-white'>Scale</label>
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
                                            </>}
                                            {showAlertsForm && <>
                                                <div className="w-full">
                                                    <label className="inline-flex">
                                                        <input
                                                            type="checkbox"
                                                            className="form-checkbox"
                                                            name="isStel"
                                                            onChange={handleCheckBoxChange}
                                                            checked={formData.isStel}
                                                        />
                                                        <span className='dark:text-white'>STEL & TWA</span>
                                                    </label>
                                                </div>
                                                {formData.isStel && <div className="w-full">
                                                    <div className="flex flex-row w-full gap-4">
                                                        <div className='w-full'>
                                                            <label htmlFor="stelDuration" className='dark:text-white'>Duration (In minutes) *</label>
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
                                                            <label htmlFor="stelLimit" className='dark:text-white'>Limit *</label>
                                                            <input
                                                                type="text"
                                                                className='form-input dark:text-white'
                                                                name="stelLimit"
                                                                onChange={(e) => handleChange(e, 'number')}
                                                                value={formData.stelLimit}
                                                            />
                                                            {formError.stelLimit && <div className='text-sm text-danger'>{formError.stelLimit}</div>}
                                                        </div>
                                                    </div>
                                                </div>}
                                                {/* <div className="w-full">
                                                    <label className="inline-flex pointer-events-auto">
                                                        <input
                                                            type="checkbox"
                                                            className="form-checkbox"
                                                            name="isTwa"
                                                            onChange={handleCheckBoxChange}
                                                            checked={formData.isTwa}
                                                        />
                                                        <span>TWA</span>
                                                    </label>
                                                </div> */}
                                                {formData.isTwa &&<div className="w-full">
                                                    <div className="row">
                                                        <div className="flex flex-row w-full gap-4">
                                                            <div className='w-full'>
                                                                <label htmlFor="twaShiftId" className='dark:text-white'>Shift ID *</label>
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
                                                                <label htmlFor="twaDuration" className='dark:text-white'>Duration (In minutes) *</label>
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
                                                                <label htmlFor="twaLimit" className='dark:text-white'>Limit *</label>
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
                                                                <label htmlFor="twaStartTime" className='dark:text-white'>Start Time *</label>
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
                                                                <label htmlFor="twaShiftId1" className='dark:text-white'>Shift ID *</label>
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
                                                                <label htmlFor="twaDuration1" className='dark:text-white'>Duration (In minutes) *</label>
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
                                                                <label htmlFor="twaLimit1" className='dark:text-white'>Limit *</label>
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
                                                                <label htmlFor="twaStartTime1" className='dark:text-white'>Start Time *</label>
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
                                                                <label htmlFor="twaShiftId2" className='dark:text-white'>Shift ID *</label>
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
                                                                <label htmlFor="twaDuration2" className='dark:text-white'>Duration (In minutes) *</label>
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
                                                                <label htmlFor="twaLimit2" className='dark:text-white'>Limit *</label>
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
                                                                <label htmlFor="twaStartTime2" className='dark:text-white'>Start Time *</label>
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
                                                </div>}
                                                <div className="w-full">
                                                    <label className="inline-flex pointer-events-auto">
                                                        <input
                                                            type="checkbox"
                                                            className="form-checkbox"
                                                            name="isAQI"
                                                            onChange={handleCheckBoxChange}
                                                        />
                                                        <span className='dark:text-white'>AQI</span>
                                                    </label>
                                                </div>
                                                <div className="w-full">
                                                    <label className="m-0">Critical Alert:</label>
                                                </div>
                                                <div className='flex flex-row w-full gap-2'>
                                                    <div className='w-full'>
                                                        <label htmlFor="criticalMin" className='dark:text-white'>Min Value *</label>
                                                        <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="criticalMin"
                                                            onChange={(e) => handleChange(e, 'number')}
                                                            value={formData.criticalMin}
                                                        />
                                                        {formError.criticalMin && <div className='text-sm text-danger'>{formError.criticalMin}</div>}
                                                    </div>
                                                    <div className='w-full'>
                                                        <label htmlFor="criticalMax" className='dark:text-white'>Max Value *</label>
                                                        <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="criticalMax"
                                                            onChange={(e) => handleChange(e, 'number')}
                                                            value={formData.criticalMax}
                                                        />
                                                        {formError.criticalMax && <div className='text-sm text-danger'>{formError.criticalMax}</div>}
                                                    </div>
                                                </div>
                                                <div className="w-full">
                                                    <label className="m-0 dark:text-white">Warning Alert:</label>
                                                </div>
                                                <div className='flex flex-row w-full gap-2'>
                                                    <div className='w-full'>
                                                        <label htmlFor="warningMin" className='dark:text-white'>Min Value *</label>
                                                        <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="warningMin"
                                                            onChange={(e) => handleChange(e, 'number')}
                                                            value={formData.warningMin}
                                                        />
                                                        {formError.warningMin && <div className='text-sm text-danger'>{formError.warningMin}</div>}
                                                    </div>
                                                    <div className='w-full'>
                                                        <label htmlFor="warningMax" className='dark:text-white'>Max Value *</label>
                                                        <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="warningMax"
                                                            onChange={(e) => handleChange(e, 'number')}
                                                            value={formData.warningMax}
                                                        />
                                                        {formError.warningMax && <div className='text-sm text-danger'>{formError.warningMax}</div>}
                                                    </div>
                                                </div>
                                                <div className="w-full">
                                                    <label className="m-0 dark:text-white">Out-of-Range Alert:</label>
                                                </div>
                                                <div className='flex flex-row w-full gap-2'>
                                                    <div className='w-full'>
                                                        <label htmlFor="outOfRangeMin" className='dark:text-white'>Min Value *</label>
                                                        <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="outOfRangeMin"
                                                            onChange={(e) => handleChange(e, 'number')}
                                                            value={formData.outOfRangeMin}
                                                        />
                                                        {formError.outOfRangeMin && <div className='text-sm text-danger'>{formError.outOfRangeMin}</div>}
                                                    </div>
                                                    <div className='w-full'>
                                                        <label htmlFor="outOfRangeMax" className='dark:text-white'>Max Value *</label>
                                                        <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="outOfRangeMax"
                                                            onChange={(e) => handleChange(e, 'number')}
                                                            value={formData.outOfRangeMax}
                                                        />
                                                        {formError.outOfRangeMax && <div className='text-sm text-danger'>{formError.outOfRangeMax}</div>}
                                                    </div>
                                                </div>
                                                <div className="w-full">
                                                    <label className="m-0 dark:text-white">Normal Value:</label>
                                                </div>
                                                <div className='flex flex-row w-full gap-2'>
                                                    <div className='w-full'>
                                                        <label htmlFor="nMin" className='dark:text-white'>Min Value</label>
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
                                                        <label htmlFor="nMax" className='dark:text-white'>Max Value</label>
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
                                        </form>
                                        <div className="mt-8 flex w-full justify-end">
                                            {showAlertsForm && <>
                                                <button type="button" className="btn btn-primary" onClick={HandleBack}>
                                                    Back
                                                </button>

                                                <button type="button" className="btn btn-primary ltr:ml-4" onClick={HandleAdd}>
                                                    {DefaultData.edit ? 'Update' : 'Add'}
                                                </button>
                                            </>}

                                            {formData.sensorOutputType.label == 'Digital' && <button type="button" className="btn btn-primary" onClick={HandleAdd}>
                                                {DefaultData.edit ? 'Update' : 'Add'}
                                            </button>}

                                            {(formData.sensorOutputType.label != 'Digital' && (formData.sensorOutputType.label == 'Modbus' || formData.sensorOutputType.label == 'Inbuilt' || formData.sensorOutputType.label == 'Analog') && !showAlertsForm) && <button type="button" className="btn btn-primary ltr:ml-4" onClick={HandleNext}>
                                                Next
                                            </button>}

                                            <button type="button" className="btn btn-outline-danger ltr:ml-4" onClick={HandleClose}>
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default AddNewSensorForm;
