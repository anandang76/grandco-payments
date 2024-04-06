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
import { GetCalibrationReport, addCalibrationReport } from '@/source/service/ReportsService';

const CalibrationForm = ({ openModal, setOpenModal, defaultData, enableDevice }: any) => {
    const StoredUser = localStorage.getItem('userDetails');

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [5, 10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState<Array<any>>([]);
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'deviceName', direction: 'asc' });

    const [modal, setModal] = useState<boolean>(false);
    const [formData, setFormData] = useState<any>({});
    const [formError, setFormError] = useState<any>({});

    const Today = new Date();
    const resultOptions: Array<any> = [
        {
            label: 'Pass',
            value: 'PASS'
        },
        {
            label: 'Fail',
            value: 'FAIL'
        }
    ];

    const [sensorOptions, setSensorOptions] = useState<Array<any>>([]);


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

    const HandleValid = () => {
        let isValid: boolean = true;
        let error: any = {};

        if(formData.sensor.value == ""){
            error['sensor'] = "Sensor is required";
            isValid = false;
        }

        if(formData.result.value == ""){
            error['result'] = "Test Result is required";
            isValid = false;
        }

        if(formData.nextCalibrationDueDate == ""){
            error['nextCalibrationDueDate'] = "Next Calibration Date is required";
            isValid = false;
        }

        setFormError(error);

        return isValid;
    }

    const handleChange = (e: any) => {
        let { name, value } = e;

        if(name == "sensor"){
            getCalibrationReportsData(value.id);
            setFormData((prevData: any) => ({
                ...prevData,
                [name]: value,
                ['name']: value.sensorName,
                ['partID']: value.partID
            }))
        } else {
            setFormData((prevData: any) => ({
                ...prevData,
                [name]: value
            }));
        }
    }

    const getCalibrationReportsData = async (sensorID: any) => {
        let response = await GetCalibrationReport({
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

    const handleAdd = async () => {
        if(HandleValid()){
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
                // name: formData.name,
                userEmail: user.email,
                calibratedDate: moment(formData.calibratedDate).format('YYYY-MM-DD HH:mm:ss'),
                result: formData.result.value,
                nextCalibrationDueDate: moment(formData.nextCalibrationDueDate).format('YYYY-MM-DD HH:mm:ss'),
                calibrationDueDate: (formData.calibrationDueDate == "dd/mm/yyyy" || formData.calibrationDueDate == "") ? "" : moment(formData.calibrationDueDate, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')
            };

            let message: string = "Unable to add calibration report";
            let status: string = "error";

            let response = await addCalibrationReport(data);

            if(response.data?.status == "success"){
                message = response.data.message;
                status = response.data.status;
                setFormData({
                    sensor: {
                        label: '',
                        value: ''
                    },
                    name: '',
                    partID: '',
                    result: {
                        label: '',
                        value: ''
                    },
                    calibrationDueDate: 'dd/mm/yyyy',
                    calibratedDate: Today,
                    nextCalibrationDueDate: '',
                });
                setInitialRecords([]);
                setRecordsData([]);
                // onSuccess(true);
                // handleClose();
            }

            CustomToast(message, status);
        }
    }

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
                name: '',
                partID: '',
                result: {
                    label: '',
                    value: ''
                },
                calibrationDueDate: 'dd/mm/yyyy',
                calibratedDate: Today,
                nextCalibrationDueDate: '',
            };
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
                                    <h5 className="text-lg font-bold dark:text-white">Calibration</h5>
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
                                                            name: 'sensor',
                                                            value: e
                                                        })}
                                                    />
                                                    {formError.sensor && <div className='text-sm text-danger'>{formError.sensor}</div>}
                                                </div>
                                            </div>
                                            {/* <div className='flex flex-row w-full gap-2'>
                                                <div className='w-full'>
                                                    <label htmlFor="name">Name</label>
                                                    <div className='form-input h-9'>{formData.name}</div>
                                                    {formError.name && <div className='text-sm text-danger'>{formError.name}</div>}
                                                </div>
                                                <div className='w-full'>
                                                    <label htmlFor="partID">Part ID</label>
                                                    <div className='form-input h-9'>{formData.partID}</div>
                                                    {formError.partID && <div className='text-sm text-danger'>{formError.partID}</div>}
                                                </div>
                                            </div> */}
                                            <div className='flex flex-row w-full gap-2'>
                                                <div className="w-full">
                                                    <label htmlFor="result" className='dark:text-white'>Test Result</label>
                                                    <Select
                                                        name="result"
                                                        className="w-full select-box dark:text-white"
                                                        options={resultOptions}
                                                        value={formData.result}
                                                        onChange={(e) => handleChange({
                                                            name: 'result',
                                                            value: e
                                                        })}
                                                    />
                                                    {formError.result && <div className='text-sm text-danger'>{formError.result}</div>}
                                                </div>
                                                <div className='w-full'>
                                                    <label htmlFor="calibrationDueDate" className='dark:text-white'>Calibration Due Date</label>
                                                    <div className='relative'>
                                                        <div className='form-input h-9 dark:text-white'>{formData.calibrationDueDate}</div>
                                                        <IconCalendar className='absolute right-2 top-2 pointer-events-none dark:text-white' />
                                                    </div>
                                                    {formError.calibrationDueDate && <div className='text-sm text-danger'>{formError.calibrationDueDate}</div>}
                                                </div>
                                            </div>
                                            <div className='flex flex-row w-full gap-2'>
                                                <div className="w-full">
                                                    <label htmlFor="calibratedDate" className='dark:text-white'>Calibrated Date *</label>
                                                    <div className='relative'>
                                                        <Flatpickr
                                                            placeholder='dd/mm/yyyy'
                                                            value={formData.calibratedDate}
                                                            options={{
                                                                minDate: moment(Today).format('DD-MM-YYYY'),
                                                                dateFormat: 'd/m/Y',
                                                            }}
                                                            className="form-input dark:text-white"
                                                            onChange={(date: any) => {
                                                                handleChange({
                                                                    name: 'calibratedDate',
                                                                    value: date[0]
                                                                })
                                                            }}
                                                        />
                                                        <IconCalendar className='absolute right-2 top-2 pointer-events-none dark:text-white' />
                                                    </div>
                                                    {formError.calibratedDate && <div className='text-sm text-danger'>{formError.calibratedDate}</div>}
                                                </div>
                                                <div className='w-full'>
                                                    <label htmlFor="nextCalibrationDueDate" className='dark:text-white'>Next Calibration Date *</label>
                                                    <div className='relative'>
                                                        <Flatpickr
                                                            placeholder='dd/mm/yyyy'
                                                            value={formData.nextCalibrationDueDate}
                                                            options={{
                                                                minDate: moment(Today).format('DD-MM-YYYY'),
                                                                dateFormat: 'd/m/Y',
                                                            }}
                                                            className="form-input dark:text-white"
                                                            onChange={(date: any) => {
                                                                handleChange({
                                                                    name: 'nextCalibrationDueDate',
                                                                    value: date[0]
                                                                })
                                                            }}
                                                        />
                                                        <IconCalendar className='absolute right-2 top-2 pointer-events-none dark:text-white' />
                                                    </div>
                                                    {formError.nextCalibrationDueDate && <div className='text-sm text-danger'>{formError.nextCalibrationDueDate}</div>}
                                                </div>
                                            </div>
                                            <div className='flex flex-row justify-end w-full gap-2'>
                                                <button type="button" className="btn btn-primary" onClick={handleAdd}>
                                                    Submit
                                                </button>
                                                <button type="button" className="btn btn-outline-danger ltr:ml-4 rtl:mr-4" onClick={handleClose}>
                                                    Close
                                                </button>
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
                                                        title: 'Date',
                                                        render: ({collectedDate}) => moment(collectedDate).format("DD-MM-YYYY"),
                                                        sortable: true
                                                    },
                                                    // {
                                                    //     accessor: 'name',
                                                    //     titleClassName: 'title-center !px-1',
                                                    //     cellsClassName: '!text-center !px-1',
                                                    //     title: 'Name',
                                                    //     sortable: true
                                                    // },
                                                    // {
                                                    //     accessor: 'partID',
                                                    //     titleClassName: 'title-center !px-1',
                                                    //     cellsClassName: '!text-center !px-1',
                                                    //     title: 'Part ID',
                                                    //     sortable: true
                                                    // },
                                                    {
                                                        accessor: 'result',
                                                        titleClassName: 'title-center !px-1 dark-datatable-title-color',
                                                        cellsClassName: '!text-center !px-1 dark:text-white',
                                                        title: 'Test Results',
                                                        sortable: true
                                                    },
                                                    {
                                                        accessor: 'calibrationDueDate',
                                                        titleClassName: 'title-center !px-1 dark-datatable-title-color',
                                                        cellsClassName: '!text-center !px-1 dark:text-white',
                                                        title: 'Calibration Due Date',
                                                        render: ({calibrationDueDate}) => calibrationDueDate ? moment(calibrationDueDate).format("DD-MM-YYYY") : "",
                                                        sortable: true
                                                    },
                                                    {
                                                        accessor: 'calibratedDate',
                                                        titleClassName: 'title-center !px-1 dark-datatable-title-color',
                                                        cellsClassName: '!text-center !px-1 dark:text-white',
                                                        title: 'Calibration Date',
                                                        render: ({calibratedDate}) => moment(calibratedDate).format("DD-MM-YYYY"),
                                                        sortable: true
                                                    },
                                                    {
                                                        accessor: 'nextCalibrationDueDate',
                                                        titleClassName: 'title-center !px-1 dark-datatable-title-color',
                                                        cellsClassName: '!text-center !px-1 dark:text-white',
                                                        title: 'Next Calibration Date',
                                                        render: ({nextCalibrationDueDate}) => moment(nextCalibrationDueDate).format("DD-MM-YYYY"),
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

export default CalibrationForm;
