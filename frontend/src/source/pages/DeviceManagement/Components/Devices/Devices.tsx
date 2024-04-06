import React, { Fragment, useEffect, useState } from "react";
import { Transition, Dialog } from '@headlessui/react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { GetAllDevices, MoveDeviceToAnotherZone } from "@/source/service/DeviceManagementService";
import { GetAllZones, CopyDevice } from "@/source/service/DeviceConfigService";
import CustomToast from "@/helpers/CustomToast";
import Dropdown from "@/components/Dropdown";
import { DownArrowIcon, MoveIcon, CopyIcon } from "@/source/helpers/Icons";
import IconX from "@/components/Icon/IconX";
import Select from 'react-select';
import { ModalSelectBoxDropdown } from "@/source/helpers/HelperFunctions";
import Swal from "sweetalert2";

const Devices = () => {

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

    const [moveDeviceModal, setMoveDeviceModal] = useState<boolean>(false);
    const [selectedZone, setSelectedZone] = useState<any>({});
    const [currentDevice, setCurrentDevice] = useState<any>({});
    const [error, setError] = useState<any>({});
    const [reload, setReload] = useState<boolean>(false);

    const GetData = async () => {
        let response = await GetAllDevices();

        if(response.data?.status == "success"){
            setRowData(sortBy(response.data.data, 'id'));
            setInitialRecords(sortBy(response.data.data, 'id'));
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
            response.map((zone: any) => {
                zone.label = zone.zoneName;
                zone.value = zone.id;
            })
            setZones(response);
            GetData();
        } else {
            CustomToast('Unable to fetch zone', 'error');
        }
    }

    const HandleFilterByZone = (zone: any) => {
        setCurrentZone(zone);
    }

    const handleValidate = () => {
        let isValid = true;
        let currentError: any = {};
        if(Object.keys(selectedZone).length == 0){
            currentError['zone'] = 'Zone is required';
            isValid = false;
        }

        setError(currentError);

        return isValid;
    }

    const copyDevice = async (id: number) => {
        let message: string = 'Unable to copy device';
        let status: string = 'error';
        let response = await CopyDevice(id);

        if(response?.data?.status == "success"){
            message = response.data.message;
            status = response.data.status;
            setReload(true);
        }

        CustomToast(message, status);
    }

    const handleCopy = (id: number) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure, you want to copy this device?',
            text: "",
            showCancelButton: true,
            confirmButtonText: 'Copy',
            padding: '2em',
            customClass: 'sweet-alerts',
        }).then((result:any) => {
            if (result.value) {
                copyDevice(id);
            }
        });
    }

    const handleMove = (device: any) =>{
        setCurrentDevice(device);
        setError({});
        setMoveDeviceModal(true);
    }

    const handleMoveDevice = async () => {
        if(handleValidate()){
            let data = {
                zoneID: selectedZone.id,
                id: currentDevice.id
            }

            let message: string = "Something went wrong, Unable to move device";
            let status: string = "error";

            let response = await MoveDeviceToAnotherZone(data);

            if(response.data?.status == "success"){
                message = `Device moved to <b>${selectedZone.label}</b> successfully`;
                status = "success";
                setCurrentDevice({});
                setSelectedZone({});
                setError({});
                setReload(true);
                setMoveDeviceModal(false);
            }

            CustomToast(message, status);
        }
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
            records = rowData.filter(row => row.zoneID == CurrentZone.zoneID);
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
                    item.deviceName.toLowerCase().includes(search.toLowerCase()) ||
                    item.deviceTag.toLowerCase().includes(search.toLowerCase()) ||
                    item.deviceCategory.toLowerCase().includes(search.toLowerCase()) ||
                    item.deviceMode.toLowerCase().includes(search.toLowerCase())
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
                <h5 className="font-semibold text-lg dark:text-white">ALL DEVICES</h5>
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
                            accessor: 'deviceName',
                            title: 'Device Name',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            sortable: true
                        },
                        {
                            accessor: 'deviceTag',
                            title: 'Device Tag',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            sortable: true
                        },
                        {
                            accessor: 'deviceCategory',
                            title: 'Device Category',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            sortable: true
                        },
                        {
                            accessor: 'deviceMode',
                            title: 'Device Mode',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            sortable: true
                        },
                        {
                            accessor: 'id',
                            title: 'Actions',
                            titleClassName: 'dark-datatable-title-color',
                            cellsClassName: 'dark:text-white',
                            render: (rowData) => <div className='flex gap-1'>
                                <button type="button" className={`p-1 btn-sm status-btn text-sm`} onClick={() => handleCopy(rowData.id)}>
                                    <CopyIcon />
                                </button>
                                <button type="button" className={`p-1 btn-sm status-btn text-sm`} onClick={() => handleMove(rowData)}>
                                    <MoveIcon />
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
                    paginationText={({ from, to, totalRecords }) => <div className="dark:text-white">{`Showing  ${from} to ${to} of ${totalRecords} entries`}</div>}
                />
            </div>

            <Transition appear show={moveDeviceModal} as={Fragment}>
                <Dialog as="div" open={moveDeviceModal} onClose={() => setMoveDeviceModal(false)}>
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
                                        <h5 className="text-lg font-bold dark:text-white">Move {currentDevice.sensorTag} Sensor</h5>
                                        <button type="button" className="text-white-dark hover:text-dark dark:text-white" onClick={() => setMoveDeviceModal(false)}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex flex-col items-center">
                                            <form className="flex flex-col items-center gap-4 w-full">
                                                <div className="w-full flex flex-col gap-4">
                                                    <label htmlFor="device" className="dark:text-white">Select zone to move {currentDevice.deviceName} device</label>
                                                    <Select
                                                        name="units"
                                                        className="w-full select-box dark:text-white"
                                                        options={Zones.filter(zone => zone.id != currentDevice.zoneID && zone.id != "all")}
                                                        menuPortalTarget={document.body}
                                                        styles={ModalSelectBoxDropdown}
                                                        isClearable
                                                        onChange={(e) => setSelectedZone(e)}
                                                    />
                                                    {error.zone && <div className='text-sm text-danger'>{error.zone}</div>}
                                                </div>
                                                <div className="mt-8 flex items-end justify-end w-full">
                                                    <button type="button" className="btn btn-primary" onClick={handleMoveDevice}>
                                                        Move
                                                    </button>
                                                    <button type="button" className="btn btn-outline-danger ltr:ml-4 rtl:mr-4" onClick={() => setMoveDeviceModal(false)}>
                                                        Close
                                                    </button>
                                                </div>
                                            </form>
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

export default Devices;
