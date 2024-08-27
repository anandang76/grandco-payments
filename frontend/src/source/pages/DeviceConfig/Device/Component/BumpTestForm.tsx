import React, { Fragment, useEffect, useState } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import Select from 'react-select';
import CustomToast from '@/helpers/CustomToast';
import sortBy from 'lodash/sortBy';
import { GetSensor } from '@/source/service/DeviceConfigService';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment';
import IconCalendar from '@/components/Icon/IconCalendar';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { GetBumpTestReport, addBumpTestReport, startBumpTestReport, runBumpTest, stopBumpTest } from '@/source/service/ReportsService';
// import { GetBumpTestReport, addBumpTestReport, stopBumpTest } from '@/source/service/ReportsService';

const BumpTestForm = ({ openModal, setOpenModal, defaultData, enableDevice }: any) => {
    const StoredUser = localStorage.getItem('userDetails');
    const Today = new Date();
    const resultOptions: Array<any> = [
        {
            label: 'N/A',
            value: 'NA'
        },
        {
            label: 'Pass',
            value: 'PASS'
        },
        {
            label: 'Fail',
            value: 'FAIL'
        }
    ];
    const durationOptions: Array<any> = [
        {
            label: 60,
            value: 60
        },
        {
            label: 90,
            value: 90
        },
        {
            label: 120,
            value: 120
        },
        {
            label: 150,
            value: 150
        },
        {
            label: 180,
            value: 180
        },
        {
            label: 210,
            value: 210
        },
        {
            label: 240,
            value: 240
        },
        {
            label: 270,
            value: 270
        },
        {
            label: 300,
            value: 300
        }
    ];

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [5, 10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState<Array<any>>([]);
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'deviceName', direction: 'asc' });

    const [modal, setModal] = useState<boolean>(false);
    const [formData, setFormData] = useState<any>({
        sensor: {
            label: '',
            value: ''
        },
        nextDueDate: 'dd/mm/yyyy',
        bumpTestCheck: 'ZeroCheck',
        percentageConcentrationOfGas:'',
        duration: {
            label: '',
            value: ''
        },
        displayValue: '',
        percentageDeviation: '',
        result: resultOptions[0],
        setNextDueDate: ''
    });
    const [formError, setFormError] = useState<any>({});

    const [sensorOptions, setSensorOptions] = useState<Array<any>>([]);
    const [startBumpTest, setStartBumpTest] = useState<boolean>(false);
    const [showBumpTestLoader, setShowBumpTestLoader] = useState<boolean>(false);

    const [count, setCount] = useState(0);

    const handleClose = () => {
        enableDevice({
            id: defaultData.deviceID
        }, 'enabled');
        setModal(false);
        setOpenModal(false);
    }

    const getData = async () => {
        let response = await GetSensor({
            id: 'all',
            locationID: defaultData.locationID,
            branchID: defaultData.branchID,
            facilityID: defaultData.facilityID,
            buildingID: defaultData.buildingID,
            floorID: defaultData.floorID,
            zoneID: defaultData.zoneID,
            deviceID: defaultData.deviceID
        });

        if(response.data?.status == "success"){
            response = response.data.data.data;

            response.map((res: any) => {
                res.label = res.sensorName +' - '+res.sensorTag;
                res.value = res.id;
            })

            setSensorOptions(sortBy(response, 'id'))
        } else {
            CustomToast('Unable to calibration', 'error');
        }
    }

    const HandleValid = (isStart: boolean) => {
        let isValid: boolean = true;
        let error: any = {};

        if(formData.sensor.value == ""){
            error['sensor'] = "Sensor is required";
            isValid = false;
        }

        if(formData.duration.value == ""){
            error['duration'] = "Duration is required";
            isValid = false;
        }

        if(formData.bumpTestCheck == "SpanCheck" && formData.percentageConcentrationOfGas == ""){
            error['percentageConcentrationOfGas'] = "Percentage Concentration Of Gas is required";
            isValid = false;
        }

        if(!isStart){
            if(formData.setNextDueDate == ""){
                error['setNextDueDate'] = "Set Next Due Date is required";
                isValid = false;
            }
        }

        setFormError(error);

        return isValid;
    }

    const handleChange = (e: any) => {
        let { name, value } = e.target;

        if(name == "sensor"){
            getBumpTestReportsData(value.id);

            setFormData((prevData: any) => ({
                ...prevData,
                [name]: value,
                ['percentageConcentrationOfGas']: '0',
                ['bumpTestCheck']: 'ZeroCheck'
            }))
        } else {
            setFormData((prevData: any) => ({
                ...prevData,
                [name]: value
            }));
        }
    }

    const handleStopBumpTest = async () => {
        let user = StoredUser != null ? JSON.parse(StoredUser) : {
            email: ''
        };

        if(HandleValid(true)){
            let message: string = "Unable to stop Bump Test";
            let status: string = "error";
            let response = await stopBumpTest({
                deviceID: formData.sensor.deviceID,
                sensorID: formData.sensor.id,
                email: user.email
            });

            if(response?.data?.status == "success"){
                message = "Bump test completed";
                status = response.data.status;
                setFormData((prevData: any) => ({
                    ...prevData,
                    ['result']: resultOptions.find(result => result.value == response?.data?.data.dataInfo.testResult),
                    ['resultInfo']: response?.data?.data.dataInfo.bumpTestInfo
                }));
            } else if(response?.response){
                message = response.response.data.msg;
                status = response.response.data.status;
            }

            CustomToast(message, status);
        }
    }

    const handleStart = async () => {
        if(HandleValid(true)){
            let message: string = "Unable to start Bump Test";
            let status: string = "error";
            let response = await startBumpTestReport({
                deviceID: formData.sensor.deviceID,
                sensorID: formData.sensor.id,
                duration: formData.duration.value,
                testType: formData.bumpTestCheck,
                gasPercentage: formData.percentageConcentrationOfGas
            });

            if(response?.data?.status == "success"){
                setStartBumpTest(true);
                setShowBumpTestLoader(true);
                setFormData((prevData: any) => ({
                    ...prevData,
                    ['bumpTestID']: response.data.bumpTestID
                }));
                message = response.data.msg;
                status = response.data.status;
            } else if(response?.response){
                message = response.response.data.msg;
                status = response.response.data.status;
            }

            CustomToast(message, status);
        }
    }

    const handleAdd = async () => {
        if(HandleValid(false)){
            let user = StoredUser != null ? JSON.parse(StoredUser) : {
                email: ''
            };

            let data = {
                locationID: defaultData.locationID,
                branchID: defaultData.branchID,
                facilityID: defaultData.facilityID,
                buildingID: defaultData.buildingID,
                floorID: defaultData.floorID,
                zoneID: defaultData.zoneID,
                deviceID: defaultData.deviceID,
                sensorID: formData.sensor.id,
                bumpTestID: formData.bumpTestID,
                testType: formData.bumpTestCheck,
                deviation: formData.percentageDeviation,
                result: formData.result.value,
                // resultInfo: formData.result.value,
                email: user.email
            };

            let message: string = "Unable to add bump test report";
            let status: string = "error";

            let response = await addBumpTestReport(data);

            if(response.data?.status == "success"){
                message = response.data.message;
                status = response.data.status;
                setFormData({
                    sensor: {
                        label: '',
                        value: ''
                    },
                    nextDueDate: 'dd/mm/yyyy',
                    bumpTestCheck: 'ZeroCheck',
                    percentageConcentrationOfGas:'',
                    duration: {
                        label: '',
                        value: ''
                    },
                    displayValue: '',
                    percentageDeviation: '',
                    result: resultOptions[0],
                    setNextDueDate: ''
                });
                setInitialRecords([]);
                setRecordsData([]);
            }

            CustomToast(message, status);
        }
    }

    const handleRunBumpTest = async () => {
        let response = await runBumpTest({
            deviceID: formData.sensor.deviceID,
            sensorID: formData.sensor.id,
        });

        let standardDeviation = 0;
        let percentageStandardDeviation = 0;

        if(response?.data?.status == "success" || response?.data?.status == "ignoreData"){
            standardDeviation = response.data.dataInfo.standardDeviation;
            percentageStandardDeviation = response.data.dataInfo.percentageStandardDeviation;

            setFormData((prevData: any) => ({
                ...prevData,
                ['displayValue']: Number(standardDeviation)?.toFixed(3),
                ['percentageDeviation']: Number(percentageStandardDeviation)?.toFixed(3)
            }));
        }
    }

    const getBumpTestReportsData = async (sensorID: any) => {
        let response = await GetBumpTestReport({
            sensorID: sensorID
        });

        if(response?.data?.status == "success"){
            setInitialRecords(response.data.data);
            setRecordsData(response.data.data);
            setFormData((prevData: any) => ({
                ...prevData,
                ['calibrationDueDate']: response.data.data[0]?.nextCalibrationDueDate ? moment(response.data.data[0].nextCalibrationDueDate).format("DD/MM/YYYY") : ''
            }))
        }
    }

    const Loader = () => {
        return <span className="animate-spin border-[3px] border-transparent border-l-primary rounded-full w-6 h-6 inline-block align-middle m-auto"></span>
    };

    useEffect(() => {
        let intervalId: any;

        if (startBumpTest) {
            intervalId = setInterval(() => {
                if(count > 15){
                    setShowBumpTestLoader(false);
                }
                if (count <= formData.duration.value) {
                    setCount(count + 1);
                    handleRunBumpTest();
                } else {
                    handleStopBumpTest();
                    setStartBumpTest(false);
                    setCount(0);
                }
            }, 1000);
        } else {
            clearInterval(intervalId);
        }

        return () => clearInterval(intervalId);
    }, [startBumpTest, count]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);

    useEffect(() => {
        if(openModal){
            getData();

            let data: any = {
                sensor: {
                    label: '',
                    value: ''
                },
                nextDueDate: 'dd/mm/yyyy',
                bumpTestCheck: 'ZeroCheck',
                percentageConcentrationOfGas:'',
                duration: {
                    label: '',
                    value: ''
                },
                displayValue: '',
                percentageDeviation: '',
                result: resultOptions[0],
                setNextDueDate: ''
            };
            setCount(0);
            setFormData(data);
            setFormError({});
            setModal(openModal);
            setInitialRecords([]);
            setRecordsData([]);
        }
    }, [openModal])

    return (
        <Transition appear show={modal} as={Fragment}>
            <Dialog as="div" open={modal} onClose={() => {return}}>
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
                            <Dialog.Panel as="div" className="panel my-8 w-full max-w-5xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <h5 className="text-lg font-bold dark:text-white">Bump Test</h5>
                                    <button type="button" className="text-white-dark hover:text-dark dark:text-white" onClick={handleClose}>
                                        <IconX />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <div className="flex flex-col items-center">
                                        <form className="flex flex-col items-center gap-4 w-full">
                                            <div className='flex flex-row w-full gap-2'>
                                                <div className="w-full">
                                                    <label htmlFor="sensor" className='dark:text-white'>Sensor *</label>
                                                    <Select
                                                        name="sensor"
                                                        className="w-full select-box dark:text-white"
                                                        options={sensorOptions}
                                                        value={formData.sensor}
                                                        onChange={(e) => handleChange({
                                                            target: {
                                                                name: 'sensor',
                                                                value: e
                                                            }
                                                        })}
                                                    />
                                                    {formError.sensor && <div className='text-sm text-danger'>{formError.sensor}</div>}
                                                </div>
                                            </div>
                                            <div className='flex flex-row w-full gap-2'>
                                                <div className='w-full'>
                                                    <label htmlFor="nextDueDate" className='dark:text-white'>Next Due Date</label>
                                                    <div className='form-input h-9 dark:text-white'>{formData.nextDueDate}</div>
                                                    {formError.nextDueDate && <div className='text-sm text-danger'>{formError.nextDueDate}</div>}
                                                </div>
                                                <div className='w-full'>
                                                    <label htmlFor="bumpTestCheck" className='dark:text-white'>Bump Test Check</label>
                                                    <div className='flex flex-row mt-3'>
                                                        <div className='w-full'>
                                                            <label className='dark:text-white'>
                                                                <input
                                                                    type='radio'
                                                                    className='form-radio'
                                                                    name='check'
                                                                    value='ZeroCheck'
                                                                    onChange={(e) => handleChange({
                                                                        target: {
                                                                            name: 'bumpTestCheck',
                                                                            value: 'ZeroCheck'
                                                                        }
                                                                    })}
                                                                    defaultChecked={true}
                                                                />
                                                                Zero Check *
                                                            </label>
                                                        </div>
                                                        <div className='w-full'>
                                                            <label className='dark:text-white'>
                                                                <input
                                                                    type='radio'
                                                                    className='form-radio'
                                                                    name='check'
                                                                    value='SpanCheck'
                                                                    onChange={(e) => handleChange({
                                                                        target: {
                                                                            name: 'bumpTestCheck',
                                                                            value: 'SpanCheck'
                                                                        }
                                                                    })}
                                                                />
                                                                Span Check *
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='flex flex-row w-full gap-2'>
                                                <div className="w-full">
                                                    <label htmlFor="percentageConcentrationOfGas" className='dark:text-white'>Percentage Concentration Of Gas *</label>
                                                    {formData.bumpTestCheck == "ZeroCheck" ? <div className="form-input h-9 dark:text-white">
                                                        {formData.percentageConcentrationOfGas}
                                                    </div> : <input
                                                        type='text'
                                                        className='form-input'
                                                        name='percentageConcentrationOfGas dark:text-white'
                                                        value={formData.percentageConcentrationOfGas}
                                                        onChange={handleChange}
                                                    />}
                                                    {formError.percentageConcentrationOfGas && <div className='text-sm text-danger'>{formError.percentageConcentrationOfGas}</div>}
                                                </div>
                                                <div className='w-full'>
                                                    <label htmlFor="duration" className='dark:text-white'>Duration (sec)</label>
                                                    <Select
                                                        name="duration"
                                                        className="w-full select-box dark:text-white"
                                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                        menuPortalTarget={document.body}
                                                        options={durationOptions}
                                                        value={formData.duration}
                                                        onChange={(e) => handleChange({
                                                            target: {
                                                                name: 'duration',
                                                                value: e
                                                            }
                                                        })}
                                                    />
                                                    {formError.duration && <div className='text-sm text-danger'>{formError.duration}</div>}
                                                </div>
                                            </div>
                                            <div className='flex flex-row w-full gap-2'>
                                                <div className="w-full flex flex-row gap-2 mt-7">
                                                    {formData.sensor.value == "" ? <div className="btn btn-primary cursor-not-allowed">
                                                        START
                                                    </div> : <button type="button" className="btn btn-primary" onClick={handleStart}>
                                                        START
                                                    </button>}
                                                    <div className='flex flex-row justify-evenly w-full items-center'>
                                                        <div className='dark:text-white'>
                                                            Display Value: {showBumpTestLoader ? <Loader /> : <b>{formData.displayValue}</b>}
                                                        </div>
                                                        <div className='dark:text-white'>
                                                            Percentage Deviation: {showBumpTestLoader ? <Loader /> : <b>{formData.percentageDeviation}</b>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='w-full'>
                                                    <label htmlFor="result" className='dark:text-white'>Result</label>
                                                    <Select
                                                        name="result"
                                                        className="w-full select-box"
                                                        options={resultOptions}
                                                        value={formData.result}
                                                        isDisabled={true}
                                                    />
                                                </div>
                                            </div>
                                            <div className='flex flex-row w-full gap-2'>
                                                <div className="w-full">
                                                    <label htmlFor="setNextDueDate" className='dark:text-white'>Set Next Due Date *</label>
                                                    <div className='relative'>
                                                        <Flatpickr
                                                            placeholder='dd/mm/yyyy'
                                                            value={formData.setNextDueDate}
                                                            options={{
                                                                minDate: moment(Today).format('DD-MM-YYYY'),
                                                                dateFormat: 'd/m/Y',
                                                            }}
                                                            className="form-input dark:text-white"
                                                            onChange={(date: any) => {
                                                                handleChange({
                                                                    target: {
                                                                        name: 'setNextDueDate',
                                                                        value: date[0]
                                                                    }
                                                                })
                                                            }}
                                                        />
                                                        <IconCalendar className='absolute right-2 top-2 pointer-events-none dark:text-white' />
                                                    </div>
                                                    {formError.setNextDueDate && <div className='text-sm text-danger'>{formError.setNextDueDate}</div>}
                                                </div>
                                                <div className='flex flex-row justify-end w-full gap-2 mt-7 items-end'>
                                                    <button type="button" className="btn btn-primary" onClick={handleAdd}>
                                                        Submit
                                                    </button>
                                                    <button type="button" className="btn btn-outline-danger ltr:ml-4 rtl:mr-4" onClick={handleClose}>
                                                        Close
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="pt-5">
                                        <div className="datatables">
                                            <DataTable
                                                highlightOnHover
                                                className='whitespace-nowrap table-hover'
                                                records={recordsData}
                                                columns={[
                                                    {
                                                        accessor: 'collectedDate',
                                                        titleClassName: 'title-center !px-1 dark-datatable-title-color',
                                                        cellsClassName: '!text-center !px-1 dark:text-white',
                                                        title: 'Bump Test Date',
                                                        render: ({collectedDate}) => moment(collectedDate).format("DD-MM-YYYY"),
                                                        sortable: true
                                                    },
                                                    {
                                                        accessor: 'testType',
                                                        titleClassName: 'title-center !px-1 dark-datatable-title-color',
                                                        cellsClassName: '!text-center !px-1 dark:text-white',
                                                        title: 'Test Type',
                                                        sortable: true
                                                    },
                                                    {
                                                        accessor: 'deviation',
                                                        titleClassName: 'title-center !px-1 dark-datatable-title-color',
                                                        cellsClassName: '!text-center !px-1 dark:text-white',
                                                        title: 'Deviation',
                                                        sortable: true
                                                    },
                                                    {
                                                        accessor: 'result',
                                                        titleClassName: 'title-center !px-1 dark-datatable-title-color',
                                                        cellsClassName: '!text-center !px-1 dark:text-white',
                                                        title: 'Result',
                                                        sortable: true
                                                    }
                                                ]}
                                                totalRecords={initialRecords.length}
                                                recordsPerPage={pageSize}
                                                page={page}
                                                onPageChange={(p) => setPage(p)}
                                                recordsPerPageOptions={PAGE_SIZES}
                                                onRecordsPerPageChange={setPageSize}
                                                sortStatus={sortStatus}
                                                onSortStatusChange={setSortStatus}
                                                minHeight={200}
                                                paginationText={({ from, to, totalRecords }) => <div className='dark:text-white'>{`Showing  ${from} to ${to} of ${totalRecords} entries`}</div>}
                                            />
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

export default BumpTestForm;
