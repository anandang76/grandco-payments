import React, { useState, useEffect } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { DeleteIcon, EditIcon } from '@/source/helpers/Icons';
import { DeleteFacility, GetFacility } from '@/source/service/DeviceConfigService';
import IconPlus from '@/components/Icon/IconPlus';
import Map from '../../Dashboard/Component/Map/Map';
import themeConfig from '@/theme.config';
import AddFacility from './Component/AddFacility';
import Swal from "sweetalert2";
import CustomToast from '@/helpers/CustomToast';
import { useNavigate, useParams } from 'react-router-dom';
import { IRootState } from '@/store';

const Facility = () => {
    const ApiURL = themeConfig.apiURL;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const { locationID, branchID } = params;

    useEffect(() => {
        dispatch(setPageTitle('Device config - Facility'));
    });

    const storedUserDetails = useSelector((state: IRootState) => state.themeConfig).userDetails;
    const userDetails: any = storedUserDetails != null ? JSON.parse(storedUserDetails) : {};

    const [loading, setLoading] = useState<boolean>(false);

    const [MapDetails, setMapDetails] = useState<Array<any>>([]);
    const [Image, setImage] = useState<any>({});

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [5, 10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState<Array<any>>([]);
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'facilityName', direction: 'asc' });
    const [BreadCrumb, setBreadCrumb] = useState<Array<any>>([]);

    const [FacilityForm, setFacilityForm] = useState<boolean>(false);
    const [FacilityData, setFacilityData] = useState<any>({
        edit: false
    });
    const [OnSuccess, setOnSuccess] = useState<boolean>(false);

    const HandleNavigate = () => {
        navigate('/device-config')
    }

    const HandleBreadCrumb = (location: any) => {
        let { id } = location;
        let url = '/device-config';
        if(location.branchName){
            return;
        }
        if(location.locationName){
            url = `${url}/${id}`;
        }

        navigate(url);
    }

    const HandleFacility = (facility: any) => {
        let { locationID, branchID, id } = facility;
        navigate(`/device-config/${locationID}/${branchID}/${id}`);
    }

    const GetData = async () => {
        setLoading(true);
        let response = await GetFacility({
            id: 'all',
            locationID: locationID,
            branchID: branchID
        });

        if(response.data?.status == "success"){
            response = response.data;
            setBreadCrumb(response.data.locationDetails);
            setInitialRecords(sortBy(response.data.data, 'facilityName'));
            let coordinates = response.data.locationDetails[response.data.locationDetails.length -1];
            let Image = response.data.locationDetails[response.data.locationDetails.length -1];
            let showImage = false;
            if(Image.image && Image.image != null && Image.image != ""){
                showImage = true;
            }

            coordinates && setMapDetails([coordinates]);
            setImage({
                showImage: showImage,
                image: [Image]
            });
        } else {
            CustomToast('Unable to fetch facility', 'error');
        }

        setLoading(false);
    }

    const HandleAdd = () => {
        setOnSuccess(false);
        setFacilityData({
            edit: false,
            locationID: locationID,
            branchID: branchID
        })
        setFacilityForm(true);
    }

    const HandleEdit = (id: number) => {
        setOnSuccess(false);
        setFacilityData({
            edit: true,
            locationID: locationID,
            branchID: branchID,
            id: id
        })
        setFacilityForm(true);
    }

    const Delete = async (id: number) => {
        let message: string = 'Unable to delete facility';
        let status: string = 'error';

        let response = await DeleteFacility({
            id: id
        });

        if(response?.data?.status == "success"){
            message = response.data.message;
            status = response.data.status;
            setOnSuccess(true);
        }

        CustomToast(message, status);
    }

    const HandleDelete = (id: number) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure, you want to delete this facility?',
            text: "You won't be able to revert this!",
            showCancelButton: true,
            confirmButtonText: 'Delete',
            padding: '2em',
            customClass: 'sweet-alerts',
        }).then((result:any) => {
            if (result.value) {
                Delete(id);
            }
        });
    }

    useEffect(() => {
        if(OnSuccess){
            setOnSuccess(false);
            GetData();
        }
    }, [OnSuccess])

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
        GetData()
    }, [params])

    return (
        <div className='grid xl:grid-cols-3 md:grid-cols-2 gap-6 mb-6'>
            <div className="panel h-full xl:col-span-2 !p-3 rounded-xl">
                <div className='flex flex-row justify-between pb-2'>
                    <ul className="flex space-x-2 rtl:space-x-reverse text-lg px-2">
                        <li className="dark:text-white text-black font-bold text-md hover:underline cursor-pointer" onClick={HandleNavigate}>
                            <span>Location</span>
                        </li>
                        {BreadCrumb.map((selected, index) => <li key={index} className={`dark:text-white before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-black font-bold text-md hover:underline ${selected.click == false ? 'pointer-events-none' : 'cursor-pointer'}`} onClick={() => HandleBreadCrumb(selected)}>
                            <span>{selected.locationName || selected.branchName || selected.facilityName || selected.buildingName || selected.floorName}</span>
                        </li>)}
                    </ul>
                    {userDetails?.userRole == "systemSpecialist" && <div className='flex flex-row gap-2'>
                        <button className='btn btn-primary bg-[#133c81] gap-2 shadow-none border-none dark:text-white' type="button" onClick={HandleAdd}>
                            <IconPlus />
                            Add Facility
                        </button>
                    </div>}
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className='whitespace-nowrap table-hover'
                        records={recordsData}
                        columns={[
                            {
                                accessor: 'facilityName',
                                titleClassName: 'title-center dark-datatable-title-color',
                                cellsClassName: '!text-center !py-1 dark:text-white',
                                title: 'Facility Name',
                                render: (current) => <div className='cursor-pointer' onClick={() => HandleFacility(current)}>{current.facilityName}</div>,
                                sortable: true
                            },
                            {
                                accessor: 'action',
                                cellsClassName: '!py-1 dark:text-white',
                                title: 'Action',
                                titleClassName: 'dark-datatable-title-color',
                                render: ({ id }: any) => <div className='flex gap-2'>
                                <button type="button" className={`p-1 btn-sm status-btn text-sm`} onClick={() => HandleEdit(id)}>
                                    <EditIcon fill="rgb(67 97 238 / 1)" />
                                </button>
                                {userDetails?.userRole == "systemSpecialist" && <button type="button" className={`p-1 btn-sm status-btn text-sm`} onClick={() => HandleDelete(id)}>
                                    <DeleteIcon fill="rgb(231 81 90 / 1)" />
                                </button>}
                            </div>
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
            <div className="panel h-full !p-0 rounded-xl">
                <div className="bg-white dark:bg-black rounded-xl">
                    {loading ? (
                        <div className="min-h-[350px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                            <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                        </div>
                    ) : <Map markers={MapDetails} />}
                    {Image.showImage && <div className="g-white dark:bg-black rounded-lg absolute top-0 h-full w-full">
                        <div className="bg-white h-full w-full">
                            <img src={`${ApiURL.split('api/')[0]}${Image.image[0]?.image}`} className='w-full h-full' />
                        </div>
                    </div>}
                </div>
            </div>

            <AddFacility
                OpenModal={FacilityForm}
                setOpenModal={setFacilityForm}
                LocationData={FacilityData}
                MapDetails={MapDetails}
                OnSuccess={setOnSuccess}
            />
        </div>
    );
};

export default Facility;
