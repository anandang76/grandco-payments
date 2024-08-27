import CustomToast from '@/helpers/CustomToast';
import IconX from '@/components/Icon/IconX';
import { Transition, Dialog } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { AddAQI, GetAQI, GetUnit, UpdateAQI } from '@/source/service/DeviceManagementService';
import themeConfig from '@/theme.config';
import Select from 'react-select';


const AQIForm = ({ openModal, closeModal, DefaultData, OnSuccess }: any) => {
    const BackendURL = themeConfig.apiURL.slice(0, -4);

    const [modal2, setModal2] = useState(false);
    const [Title, setTitle] = useState('AQI');

    const [formData, setFormData] = useState<any>({
        parameter: '',
        units: '',
        goodMinimumValue: '',
        goodMaximumValue: '',
        satisfactoryMinimumValue: '',
        satisfactoryMaximumValue: '',
        moderatelyMinimumValue: '',
        moderatelyMaximumValue: '',
        poorMinimumValue: '',
        poorMaximumValue: '',
        veryPoorMinimumValue: '',
        veryPoorMaximumValue: '',
        severeMinimumValue: '',
        severeMaximumValue: ''
    });
    const [formError, setFormError] = useState<any>({});
    const [UnitsOptions, setUnitsOptions] = useState<any>([]);

    const HandleClose = () => {
        closeModal(false);
        setModal2(false);
    }

    const GetUnitOptions = async () => {
        let Unitresponse = await GetUnit({
            id: 'all'
        });

        if(Unitresponse.data?.status == "success"){
            Unitresponse = Unitresponse.data.data;
            Unitresponse.map((category: any) => {
                category.label = category.unitLabel;
                category.value = category.unitLabel;
            });

            setUnitsOptions(Unitresponse);
        } else {
            CustomToast('Unable to fetch units', 'error')
        }
    }

    const HandleSelectChange = (e: any, name: string) => {
        setFormData((prevData: any) => ({
            ...prevData,
            [name]: e?.value
        }))
    }

    const HandleChange = (e: any, type:string="string") => {
        let { name, value } = e.target;

        if(type == "number"){
            value = value.replace(/[^\d-]/g, '')
        }

        setFormData((prevData: any) => ({
            ...prevData,
            [name]: value
        }))
    };

    const HandleValid = () => {
        let isValid: boolean = true;
        let error: any = {};

        if(formData.parameter == '' || formData.parameter.trim() == ''){
            isValid = false;
            error.parameter = 'Name is required';
        }

        if(formData.goodMinimumValue == '' || formData.goodMinimumValue.trim() == ''){
            isValid = false;
            error.goodMinimumValue = 'Minimum value is required';
        }

        if(formData.goodMaximumValue == '' || formData.goodMaximumValue.trim() == ''){
            isValid = false;
            error.goodMaximumValue = 'Maximum value is required';
        }

        if(formData.satisfactoryMinimumValue == '' || formData.satisfactoryMinimumValue.trim() == ''){
            isValid = false;
            error.satisfactoryMinimumValue = 'Minimum value is required';
        }

        if(formData.satisfactoryMaximumValue == '' || formData.satisfactoryMaximumValue.trim() == ''){
            isValid = false;
            error.satisfactoryMaximumValue = 'Maximum value is required';
        }

        if(formData.moderatelyMinimumValue == '' || formData.moderatelyMinimumValue.trim() == ''){
            isValid = false;
            error.moderatelyMinimumValue = 'Minimum value is required';
        }

        if(formData.moderatelyMaximumValue == '' || formData.moderatelyMaximumValue.trim() == ''){
            isValid = false;
            error.moderatelyMaximumValue = 'Maximum value is required';
        }

        if(formData.poorMinimumValue == '' || formData.poorMinimumValue.trim() == ''){
            isValid = false;
            error.poorMinimumValue = 'Minimum value is required';
        }

        if(formData.poorMaximumValue == '' || formData.poorMaximumValue.trim() == ''){
            isValid = false;
            error.poorMaximumValue = 'Maximum value is required';
        }

        if(formData.veryPoorMinimumValue == '' || formData.veryPoorMinimumValue.trim() == ''){
            isValid = false;
            error.veryPoorMinimumValue = 'Minimum value is required';
        }

        if(formData.veryPoorMaximumValue == '' || formData.veryPoorMaximumValue.trim() == ''){
            isValid = false;
            error.veryPoorMaximumValue = 'Maximum value is required';
        }

        if(formData.severeMinimumValue == '' || formData.severeMinimumValue.trim() == ''){
            isValid = false;
            error.severeMinimumValue = 'Minimum value is required';
        }

        if(formData.severeMaximumValue == '' || formData.severeMaximumValue.trim() == ''){
            isValid = false;
            error.severeMaximumValue = 'Maximum value is required';
        }

        setFormError(error);

        return isValid;

    }

    const HandleAdd = async () => {
        if(HandleValid()){

            let message: string = "Something went wrong, Unable to add";
            let status: string = "error";

            let response: any;
            let data: any = {
                parameter: formData.parameter,
                units: formData.units || '',
                good: `${formData.goodMinimumValue},${formData.goodMaximumValue}`,
                satisfactory: `${formData.satisfactoryMinimumValue},${formData.satisfactoryMaximumValue}`,
                moderately: `${formData.moderatelyMinimumValue},${formData.moderatelyMaximumValue}`,
                poor: `${formData.poorMinimumValue},${formData.poorMaximumValue}`,
                veryPoor: `${formData.veryPoorMinimumValue},${formData.veryPoorMaximumValue}`,
                severe: `${formData.severeMinimumValue},${formData.severeMaximumValue}`,
            };

            if(DefaultData.edit){
                message = 'Something went wrong, unable to update';
                data['id'] = DefaultData.aqiID;
                response = await UpdateAQI(data);
            } else {
                response = await AddAQI(data);
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

    const GetData = async () => {
        let response = await GetAQI({
            id: DefaultData.aqiID
        });

        if(response?.data?.status == "success"){
            let { parameter, units, good, satisfactory, moderately, poor, veryPoor, severe } = response.data.data;
            good = good.split(',');
            satisfactory = satisfactory.split(',');
            moderately = moderately.split(',');
            poor = poor.split(',');
            veryPoor = veryPoor.split(',');
            severe = severe.split(',');

            setFormData({
                parameter: parameter,
                units: units,
                goodMinimumValue: good[0],
                goodMaximumValue: good[1],
                satisfactoryMinimumValue: satisfactory[0],
                satisfactoryMaximumValue: satisfactory[1],
                moderatelyMinimumValue: moderately[0],
                moderatelyMaximumValue: moderately[1],
                poorMinimumValue: poor[0],
                poorMaximumValue: poor[1],
                veryPoorMinimumValue: veryPoor[0],
                veryPoorMaximumValue: veryPoor[1],
                severeMinimumValue: severe[0],
                severeMaximumValue: severe[1]
            });
        } else {
            CustomToast('AQI Not found','error');
            HandleClose();
        }
    }

    useEffect(() => {
        if(openModal){
            GetUnitOptions();
            if(DefaultData.edit){
                GetData();
                setTitle(`Edit`);
            } else {
                setFormData({
                    parameter: '',
                    units: '',
                    goodMinimumValue: '',
                    goodMaximumValue: '',
                    satisfactoryMinimumValue: '',
                    satisfactoryMaximumValue: '',
                    moderatelyMinimumValue: '',
                    moderatelyMaximumValue: '',
                    poorMinimumValue: '',
                    poorMaximumValue: '',
                    veryPoorMinimumValue: '',
                    veryPoorMaximumValue: '',
                    severeMinimumValue: '',
                    severeMaximumValue: ''
                });
                setTitle(`Add`);
            }
            setFormError({});
            setModal2(openModal);
        }
    }, [openModal])

    return (
        <>
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
                                <Dialog.Panel as="div" className="panel my-8 w-full max-w-3xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <h5 className="text-lg font-bold dark:text-white">{Title}</h5>
                                        <button type="button" className="text-white-dark hover:text-dark  dark:text-white" onClick={HandleClose}>
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex flex-col items-center">
                                            <form className="flex flex-col items-center gap-2 w-full">
                                                <div className="flex flex-row gap-4 w-full">
                                                    <div className="w-full flex justify-center items-center dark:text-white">Name: </div>
                                                    <div className="w-full">
                                                        <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="parameter"
                                                            onChange={HandleChange}
                                                            value={formData.parameter}
                                                        />
                                                        {formError.parameter && <div className='text-sm text-danger'>{formError.parameter}</div>}
                                                    </div>
                                                    <div className="w-full"></div>
                                                </div>
                                                <div className="flex flex-row gap-4 w-full">
                                                    <div className="w-full flex justify-center items-center dark:text-white">Units: </div>
                                                    <div className="w-full">
                                                        {/* <input
                                                            type="text"
                                                            className='form-input'
                                                            name="units"
                                                            onChange={HandleChange}
                                                            value={formData.units}
                                                        />  */}
                                                        <Select
                                                            name="units"
                                                            className="w-full select-box dark:text-white"
                                                            options={UnitsOptions}
                                                            value={UnitsOptions?.filter((row:any)=>row.value==formData.units)[0] || ''}
                                                            isClearable
                                                            onChange={(e) => HandleSelectChange(e, 'units')}
                                                        />
                                                        {formError.units && <div className='text-sm text-danger'>{formError.units}</div>}
                                                    </div>
                                                    <div className="w-full"></div>
                                                </div>

                                                <div className="flex flex-row gap-4 w-full">
                                                    <div className="w-full flex justify-center items-center dark:text-white">Good: </div>
                                                    <div className="w-full">
                                                        <label htmlFor="goodMinimumValue" className='dark:text-white'>Minimum Value</label>
                                                        <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="goodMinimumValue"
                                                            onChange={(e) => HandleChange(e, 'number')}
                                                            value={formData.goodMinimumValue}
                                                        />
                                                        {formError.goodMinimumValue && <div className='text-sm text-danger'>{formError.goodMinimumValue}</div>}
                                                    </div>
                                                    <div className="w-full">
                                                        <label htmlFor="goodMaximumValue" className='dark:text-white'>Maximum Value</label>
                                                        <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="goodMaximumValue"
                                                            onChange={(e) => HandleChange(e, 'number')}
                                                            value={formData.goodMaximumValue}
                                                        />
                                                        {formError.goodMaximumValue && <div className='text-sm text-danger'>{formError.goodMaximumValue}</div>}
                                                    </div>
                                                </div>
                                                <div className="flex flex-row gap-4 w-full">
                                                    <div className="w-full flex justify-center items-center dark:text-white">Satisfactory: </div>
                                                    <div className="w-full">
                                                        <label htmlFor="satisfactoryMinimumValue" className='dark:text-white'>Minimum Value</label>
                                                        <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="satisfactoryMinimumValue"
                                                            onChange={(e) => HandleChange(e, 'number')}
                                                            value={formData.satisfactoryMinimumValue}
                                                        />
                                                        {formError.satisfactoryMinimumValue && <div className='text-sm text-danger'>{formError.satisfactoryMinimumValue}</div>}
                                                    </div>
                                                    <div className="w-full">
                                                        <label htmlFor="satisfactoryMaximumValue" className='dark:text-white'>Maximum Value</label>
                                                        <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="satisfactoryMaximumValue"
                                                            onChange={(e) => HandleChange(e, 'number')}
                                                            value={formData.satisfactoryMaximumValue}
                                                        />
                                                        {formError.satisfactoryMaximumValue && <div className='text-sm text-danger'>{formError.satisfactoryMaximumValue}</div>}
                                                    </div>
                                                </div>
                                                <div className="flex flex-row gap-4 w-full">
                                                    <div className="w-full flex justify-center items-center dark:text-white">Moderately: </div>
                                                    <div className="w-full">
                                                        <label htmlFor="moderatelyMinimumValue" className='dark:text-white'>Minimum Value</label>
                                                        <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="moderatelyMinimumValue"
                                                            onChange={(e) => HandleChange(e, 'number')}
                                                            value={formData.moderatelyMinimumValue}
                                                        />
                                                        {formError.moderatelyMinimumValue && <div className='text-sm text-danger'>{formError.moderatelyMinimumValue}</div>}
                                                    </div>
                                                    <div className="w-full">
                                                        <label htmlFor="moderatelyMaximumValue" className='dark:text-white'>Maximum Value</label>
                                                        <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="moderatelyMaximumValue"
                                                            onChange={(e) => HandleChange(e, 'number')}
                                                            value={formData.moderatelyMaximumValue}
                                                        />
                                                        {formError.moderatelyMaximumValue && <div className='text-sm text-danger'>{formError.moderatelyMaximumValue}</div>}
                                                    </div>
                                                </div>
                                                <div className="flex flex-row gap-4 w-full">
                                                    <div className="w-full flex justify-center items-center dark:text-white">Poor: </div>
                                                    <div className="w-full">
                                                        <label htmlFor="poorMinimumValue" className='dark:text-white'>Minimum Value</label>
                                                        <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="poorMinimumValue"
                                                            onChange={(e) => HandleChange(e, 'number')}
                                                            value={formData.poorMinimumValue}
                                                        />
                                                        {formError.poorMinimumValue && <div className='text-sm text-danger'>{formError.poorMinimumValue}</div>}
                                                    </div>
                                                    <div className="w-full">
                                                        <label htmlFor="poorMaximumValue" className='dark:text-white'>Maximum Value</label>
                                                        <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="poorMaximumValue"
                                                            onChange={(e) => HandleChange(e, 'number')}
                                                            value={formData.poorMaximumValue}
                                                        />
                                                        {formError.poorMaximumValue && <div className='text-sm text-danger'>{formError.poorMaximumValue}</div>}
                                                    </div>
                                                </div>
                                                <div className="flex flex-row gap-4 w-full">
                                                    <div className="w-full flex justify-center items-center dark:text-white">Very Poor: </div>
                                                    <div className="w-full">
                                                        <label htmlFor="veryPoorMinimumValue" className='dark:text-white'>Minimum Value</label>
                                                        <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="veryPoorMinimumValue"
                                                            onChange={(e) => HandleChange(e, 'number')}
                                                            value={formData.veryPoorMinimumValue}
                                                        />
                                                        {formError.veryPoorMinimumValue && <div className='text-sm text-danger'>{formError.veryPoorMinimumValue}</div>}
                                                    </div>
                                                    <div className="w-full">
                                                        <label htmlFor="veryPoorMaximumValue" className='dark:text-white'>Maximum Value</label>
                                                        <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="veryPoorMaximumValue"
                                                            onChange={(e) => HandleChange(e, 'number')}
                                                            value={formData.veryPoorMaximumValue}
                                                        />
                                                        {formError.veryPoorMaximumValue && <div className='text-sm text-danger'>{formError.veryPoorMaximumValue}</div>}
                                                    </div>
                                                </div>
                                                <div className="flex flex-row gap-4 w-full">
                                                    <div className="w-full flex justify-center items-center dark:text-white">Severe: </div>
                                                    <div className="w-full">
                                                        <label htmlFor="severeMinimumValue" className='dark:text-white'>Minimum Value</label>
                                                        <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="severeMinimumValue"
                                                            onChange={(e) => HandleChange(e, 'number')}
                                                            value={formData.severeMinimumValue}
                                                        />
                                                        {formError.severeMinimumValue && <div className='text-sm text-danger'>{formError.severeMinimumValue}</div>}
                                                    </div>
                                                    <div className="w-full">
                                                        <label htmlFor="severeMaximumValue" className='dark:text-white'>Maximum Value</label>
                                                        <input
                                                            type="text"
                                                            className='form-input dark:text-white'
                                                            name="severeMaximumValue"
                                                            onChange={(e) => HandleChange(e, 'number')}
                                                            value={formData.severeMaximumValue}
                                                        />
                                                        {formError.severeMaximumValue && <div className='text-sm text-danger'>{formError.severeMaximumValue}</div>}
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="mt-8 flex items-center justify-end">
                                            <button type="button" className="btn btn-primary" onClick={HandleAdd}>
                                                {DefaultData.edit ? 'Save' : 'Add'}
                                            </button>
                                            <button type="button" className="btn btn-outline-danger ltr:ml-4 rtl:mr-4" onClick={HandleClose}>
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
        </>
    )
};

export default AQIForm;
