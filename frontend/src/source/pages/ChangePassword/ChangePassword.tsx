import { setPageTitle } from '@/store/themeConfigSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import forgotpassword from "../../../../public/assets/images/forgot-password.svg";
import { EyeIcon, EyeSlashedIcon } from '@/source/helpers/Icons';
import CustomToast from '@/helpers/CustomToast';
import { UserPasswordChange } from '@/source/service/Auth';

const ChangePassword = () => {
    const dispatch = useDispatch();

    const Title = 'Change Password';

    useEffect(() => {
        dispatch(setPageTitle(Title));
    });

    const StoredUser = localStorage.getItem('userDetails');
    const User: any = StoredUser != null ? JSON.parse(StoredUser) : {};

    const [ShowOldPassword, setShowOldPassword] = useState<boolean>(false);
    const [ShowNewPassword, setShowNewPassword] = useState<boolean>(false);

    const [FormData, setFormData] = useState<any>({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [FormError, setFormError] = useState<any>({});

    const HandleInputChange = (e: any) => {
        const { name, value } = e.target;

        setFormData((prevData: any) => ({
            ...prevData,
            [name]: value
        }))
    }

    const HandleValidate = () => {
        let isValid = true;
        let error: any = {};

        if(FormData.oldPassword == '' || FormData.oldPassword.trim() == ''){
            error.oldPassword = 'Old password is required';
            isValid = false;
        } else {
            error.oldPassword = "";
        }

        if(FormData.newPassword == '' || FormData.newPassword.trim() == ''){
            error.newPassword = 'Old password is required';
            isValid = false;
        } else {
            error.newPassword = "";
        }

        if(FormData.confirmPassword == '' || FormData.confirmPassword.trim() == ''){
            error.confirmPassword = 'Old password is required';
            isValid = false;
        } else {
            error.confirmPassword = "";
        }

        if((FormData.newPassword != '' || FormData.newPassword.trim() != "") && FormData.newPassword == FormData.oldPassword){
            error.newPassword = "Old password and new password cant be same";
            isValid = false;
        }

        if((FormData.confirmPassword != '' || FormData.confirmPassword.trim() != "") && FormData.newPassword != FormData.confirmPassword){
            error.confirmPassword = "Password do not match";
            isValid = false;
        }

        if((FormData.confirmPassword != '' || FormData.confirmPassword.trim() != "") && FormData.confirmPassword.length < 6){
            error.confirmPassword = "Minimum 6 characters required";
            isValid = false;
        }

        setFormError(error);

        return isValid;
    }

    const HandleSubmit = async (e: any) => {
        e.preventDefault();
        if(HandleValidate()){
            if(User.hasOwnProperty('email') && User.email != "" && User.email.trim() != ""){
                FormData['email'] = User.email;

                let response: any = await UserPasswordChange(FormData);

                if(response?.response?.data?.status == "error"){
                    CustomToast(response?.response?.data?.message, response?.response?.data?.status);
                } else {
                    CustomToast(response?.data?.message, response?.data?.status);
                    setFormData({
                        oldPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                    });
                }
            } else {
                CustomToast('User not found', 'error');
            }
        }
    }

    return (
        <div className="h-full flex justify-around mt-14">
            <div className="panel">
                <div className="mb-5 flex flex-col items-center justify-between">
                    <img src={forgotpassword} className='w-full h-[30vh]' />
                    <h5 className="text-lg font-semibold dark:text-white-light">{Title}</h5>
                </div>
                <div className="mb-5">
                    <form className="space-y-5 w-80" onSubmit={HandleSubmit}>
                        <div className='relative'>
                            <input
                                name="oldPassword"
                                type={ShowOldPassword ? "text" : "password"}
                                placeholder="Enter old password *"
                                value={FormData.oldPassword}
                                onChange={HandleInputChange}
                                className="form-input dark:text-white-light"
                            />
                            <div onClick={() => setShowOldPassword(!ShowOldPassword)}>
                                {ShowOldPassword ? <EyeSlashedIcon className='absolute top-2 right-2' />
                                    :
                                <EyeIcon className='absolute top-2 right-2' />}
                            </div>
                            {FormError?.oldPassword && FormError?.oldPassword.trim() != "" && <div className='text-danger p-2 pb-0'>{FormError?.oldPassword}</div>}
                        </div>
                        <div className='relative'>
                            <input
                                name="newPassword"
                                type={ShowNewPassword ? "text" : "password"}
                                placeholder="Enter new password *"
                                value={FormData.newPassword}
                                onChange={HandleInputChange}
                                className="form-input dark:text-white-light"
                            />
                            <div onClick={() => setShowNewPassword(!ShowNewPassword)}>
                                {ShowNewPassword ? <EyeSlashedIcon className='absolute top-2 right-2' />
                                    :
                                <EyeIcon className='absolute top-2 right-2' />}
                            </div>
                            {FormError?.newPassword && FormError?.newPassword.trim() != "" && <div className='text-danger p-2 pb-0'>{FormError?.newPassword}</div>}
                        </div>
                        <div>
                            <input
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm Password *"
                                value={FormData.confirmPassword}
                                onChange={HandleInputChange}
                                className="form-input dark:text-white-light"
                            />
                            {FormError?.confirmPassword && FormError?.confirmPassword.trim() != "" && <div className='text-danger p-2 pb-0'>{FormError?.confirmPassword}</div>}
                        </div>
                        <button type="submit" className="btn btn-primary !mt-6">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
