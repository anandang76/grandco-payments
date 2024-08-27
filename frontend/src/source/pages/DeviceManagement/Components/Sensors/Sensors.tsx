import React, { Fragment, useEffect, useState } from "react";
import { Transition, Dialog } from '@headlessui/react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { GetAllDevices, GetAllSensors, MoveSensorToAnotherDevice } from "@/source/service/DeviceManagementService";
import CustomToast from "@/helpers/CustomToast";
import { DownArrowIcon, MoveIcon, CopyIcon } from "@/source/helpers/Icons";
import Dropdown from "@/components/Dropdown";
import { GetAllZones, CopySensor } from "@/source/service/DeviceConfigService";
import IconX from "@/components/Icon/IconX";
import Select from 'react-select';
import { ModalSelectBoxDropdown } from "@/source/helpers/HelperFunctions";
import Swal from "sweetalert2";

const Sensors = () => {

    const [Devices, setDevices] = useState<Array<any>>([]);
    const [Zones, setZones] = useState<Array<any>>([]);
    const [rowData, setRowData]= useState<Array<any>>([]);

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'id'));
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'asc' });
    const [CurrentZone, setCurrentZone] = useState<any>({
        zoneName: 'All',
        id: 'all'
    });

    const [moveSensorModal, setMoveSensorModal] = useState<boolean>(false);
    const [currentSensor, setCurrentSensor] = useState<any>({});
    const [currentDevice, setCurrentDevice] = useState<any>({});
    const [error, setError] = useState<any>({});
    const [reload, setReload] = useState<boolean>(false);

    const GetData = async () => {
        let response = await GetAllSensors();

        if(response.data?.status == "success"){
            setRowData(sortBy(response.data.data, 'id'));
            setInitialRecords(sortBy(response.data.data, 'id'));
        } else {
            CustomToast('Unable to fetch sensors', 'error');
        }
    }

    const GetDevices = async () => {
        let response = await GetAllDevices();

        if(response.data?.status == "success"){
            response = response.data.data;
            response.map((device: any) => {
                device.label = device.deviceName,
                device.value = device.id
            })
            setDevices(response);
            GetData();
        } else {
            CustomToast('Unable to fetch devices', 'error');
        }

    }

    const GetZones = async () => {
        let response: any = await GetAllZones();

        if(response.data?.status == "success"){
            response = response.data.data;
            response.unshift({
                zoneName: 'All',
                id: 'all'
            });
            setZones(response);
            GetDevices();
        } else {
            CustomToast('Unable to fetch zone', 'error');
        }
    }

    const HandleFilterByZone = (zone: any) => {
        setCurrentZone(zone);
    }

    const handleMove = (sensor: any) =>{
        setCurrentSensor(sensor);
        setCurrentDevice({});
        setError({});
        setMoveSensorModal(true);
    }

    const handleValidate = () => {
        let isValid = true;
        let currentError: any = {};
        if(Object.keys(currentDevice).length == 0){
            currentError['device'] = 'Device is required';
            isValid = false;
        }

        setError(currentError);

        return isValid;
    }

    const handleMoveSensor = async () => {
        if(handleValidate()){
            let data = {
                id: currentSensor.id,
                deviceID: currentDevice.id
            }

            let message: string = "Something went wrong, Unable to move sensor";
            let status: string = "error";

            let response = await MoveSensorToAnotherDevice(data);

            if(response.data?.status == "success"){
                message = `Sensor moved to <b>${currentDevice.deviceName}</b> device successfully`;
                status = "success";
                setCurrentSensor({});
                setCurrentDevice({});
                setError({});
                setReload(true);
                setMoveSensorModal(false);
            }

            CustomToast(message, status);
        }
    }

    const copySensor = async (id: number) => {
        let message: string = 'Unable to copy device';
        let status: string = 'error';
        let response = await CopySensor(id);

        if(response?.data?.status == "success"){
            message = response.data.message;
            status = response.data.status;
            setReload(true);
        }

        CustomToast(message, status);
    }

    const handleCopy = async (id: number) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure, you want to copy this sensor?',
            text: "",
            showCancelButton: true,
            confirmButtonText: 'Copy',
            padding: '2em',
            customClass: 'sweet-alerts',
        }).then((result:any) => {
            if (result.value) {
                copySensor(id);
            }
        });
    }

    useEffect(() => {
        if(reload){
            setReload(false);
            GetZones();
        }
    }, [reload])

    useEffect(() => {
        let records = rowData;

        if(CurrentZone.id != "all"){
            records = rowData.filter(row => row.zoneID == CurrentZone.id);
        }

        setInitialRecords(sortBy(records,'id'));
    }, [CurrentZone])

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        setInitialRecords(() => {
            return rowData.filter((item) => {
                return (
                    item.sensorName.toLowerCase().includes(search.toLowerCase()) ||
                    item.sensorTag.toLowerCase().includes(search.toLowerCase()) ||
                    item.sensorOutput.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
    }, [search]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);

    useEffect(() => {
        GetZones();
    }, [])

    return (
        <div>
            <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                <h5 className="font-semibold text-lg dark:text-white">ALL SENSORS</h5>
                <div className="ltr:ml-auto rtl:mr-auto flex gap-2">
                    <input type="text" className="form-input w-auto dark:text-white" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    <div className="dropdown">
                        <Dropdown
                            btnClassName="btn btn-primary dropdown-toggle dark:text-white"
                            button={
                                <>
                                    {CurrentZone.zoneName}
                                    <span>
                                        <DownArrowIcon fill="none" />
                                    </span>
                                </>
                            }
                        >
                            <ul className="!min-w-[200px] overflow-auto h-72">
                                {Zones.map((zone, index) => <li key={index}>
                                    <button onClick={() => HandleFilterByZone(zone)} type="button" className="dark:text-white">{zone?.zoneName}</button>
                                </li>)}
                            </ul>
                        </Dropdown>
                    </div>
                </div>
            </div>
            <div className="datatables">
                <DataTable
                    highlightOnHover
                    className='whitespace-nowrap table-hover'
                    records={recordsData}
                    columns={[
                        {
                            accessor: 'zoneID',
                            title: 'Zone Name',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            render: ({ zoneID }) => Zones.find((zone) => zone.id === zoneID)?.zoneName || "",
                            sortable: true
                        },
                        {
                            accessor: 'deviceID',
                            title: 'Device Name',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            render: ({ deviceID }) => Devices.find((device) => device.id === deviceID)?.deviceName || "",
                            sortable: true
                        },
                        {
                            accessor: 'sensorName',
                            title: 'Sensor Name',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            sortable: true
                        },
                        {
                            accessor: 'sensorTag',
                            title: 'Sensor Tag',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            sortable: true
                        },
                        {
                            accessor: 'sensorOutput',
                            title: 'Sensor Type',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            sortable: true
                        },
                        {
                            accessor: 'id',
                            title: 'Action',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            render: (rowData) => <div className='flex gap-1'>
                                <button type="button" className={`p-1 btn-sm status-btn text-sm`} onClick={() => handleMove(rowData)}>
                                    <MoveIcon />
                                </button>
                                <button type="button" className={`p-1 btn-sm status-btn text-sm`} onClick={() => handleCopy(rowData.id)}>
                                    <CopyIcon />
                                </button>
                            </div>,
                            sortable: false
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
                    paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                />
            </div>

            <Transition appear show={moveSensorModal} as={Fragment}>
                <Dialog as="div" open={moveSensorModal} onClose={() => setMoveSensorModal(false)}>
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
                                <Dialog.Panel as="div" className="panel my-8 w-full max-w-md overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <h5 className="text-lg font-bold dark:text-white">Move {currentSensor.sensorTag} Sensor</h5>
                                        <button type="button" className="text-white-dark hover:text-dark dark:text-white" onClick={() => setMoveSensorModal(false)}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex flex-col items-center">
                                            <form className="flex flex-col items-center gap-4 w-full">
                                                <div className="w-full flex flex-col gap-4">
                                                    <label htmlFor="device" className="dark:text-white">Select device to move {currentSensor.sensorTag} sensor</label>
                                                    <Select
                                                        name="units"
                                                        className="w-full select-box dark:text-white"
                                                        options={Devices.filter(device => device.id != currentSensor.deviceID)}
                                                        menuPortalTarget={document.body}
                                                        styles={ModalSelectBoxDropdown}
                                                        isClearable
                                                        onChange={(e) => setCurrentDevice(e)}
                                                    />
                                                    {error.device && <div className='text-sm text-danger'>{error.device}</div>}
                                                </div>
                                            </form>
                                        </div>
                                        <div className="mt-8 flex items-center justify-end">
                                            <button type="button" className="btn btn-primary" onClick={handleMoveSensor}>
                                                Move
                                            </button>
                                            <button type="button" className="btn btn-outline-danger ltr:ml-4 rtl:mr-4" onClick={() => setMoveSensorModal(false)}>
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Sensors;
