import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { useEffect, useState } from 'react';
import { setPageTitle, toggleRTL } from '../../store/themeConfigSlice';
import IconMail from '../../components/Icon/IconMail';
import { emptyRegex } from '../../helpers/constants';
import CustomToast from '../../helpers/CustomToast';
import {PasswordForgot} from '@/source/service/Auth';
import {LoadingIcon} from '../../helpers/icons';

const ForgetPassword = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Recover Password'));
    });
    const navigate = useNavigate();
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };
    const [flag, setFlag] = useState(themeConfig.locale);

    const [FormDetails, setFormDetails] = useState<any>(
            {
                email:"",
            }
        );
    const [FormErrors, setFormErrors] = useState<any>({});
    const [OTP, setOTP] = useState<boolean>(false);
    const [EnableResendOTP, setEnableResendOTP] = useState<boolean>(false);
    const [Loading, setLoading] = useState<boolean>(false);
    const [MailSent, setMailSent] = useState<boolean>(false);

    const handleFieldChange = (event:any) => {
        var name = event.target.name;
        var val = event.target.value;
        let currentFormDetails = {...FormDetails}
        currentFormDetails[name]=val;
        setFormDetails(currentFormDetails);
    }

    const isValid = () => {
        let valid = true;
        var error:any = {};
        if(emptyRegex.test(FormDetails.email) || !Object.keys(FormDetails).includes('email')){
        valid = false;
        error.email = 'Please enter email';
        }
        setFormErrors({...error})
        return valid;
    }



    const submitForm = async () => {
        // navigate('/');
        if(isValid()){
            setLoading(true);
            var response: any = await PasswordForgot(FormDetails);
            if(response?.data?.status === "success"){
                setLoading(false);
                setMailSent(true);
                CustomToast(response.data?.message)
                navigate('/login');
            }else{
                CustomToast("Something went wrong!!!", 'error');
                setLoading(false);
            }
        }
    };

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[758px] py-20">
                        {/* <div className="absolute top-6 end-6">
                            <div className="dropdown">
                                <Dropdown
                                    offset={[0, 8]}
                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                    btnClassName="flex items-center gap-2.5 rounded-lg border border-white-dark/30 bg-white px-2 py-1.5 text-white-dark hover:border-primary hover:text-primary dark:bg-black"
                                    button={
                                        <>
                                            <div>
                                                <img src={`/assets/images/flags/${flag.toUpperCase()}.svg`} alt="image" className="h-5 w-5 rounded-full object-cover" />
                                            </div>
                                            <div className="text-base font-bold uppercase">{flag}</div>
                                            <span className="shrink-0">
                                                <IconCaretDown />
                                            </span>
                                        </>
                                    }
                                >
                                    <ul className="!px-2 text-dark dark:text-white-dark grid grid-cols-2 gap-2 font-semibold dark:text-white-light/90 w-[280px]">
                                        {themeConfig.languageList.map((item: any) => {
                                            return (
                                                <li key={item.code}>
                                                    <button
                                                        type="button"
                                                        className={`flex w-full hover:text-primary rounded-lg ${flag === item.code ? 'bg-primary/10 text-primary' : ''}`}
                                                        onClick={() => {
                                                            i18next.changeLanguage(item.code);
                                                            // setFlag(item.code);
                                                            setLocale(item.code);
                                                        }}
                                                    >
                                                        <img src={`/assets/images/flags/${item.code.toUpperCase()}.svg`} alt="flag" className="w-5 h-5 object-cover rounded-full" />
                                                        <span className="ltr:ml-3 rtl:mr-3">{item.name}</span>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </Dropdown>
                            </div>
                        </div> */}
                        <div className="mx-auto w-full max-w-[440px]">

                        {!MailSent ?
                            <>
                                <div className="mb-7">
                                    <h1 className="mb-3 text-2xl font-bold !leading-snug dark:text-white">Password Reset</h1>
                                    <p>Enter your email to recover your ID</p>
                                </div>


                                <form className="space-y-5" >
                                    <div>
                                        <label htmlFor="Email" className="dark:text-white">
                                            Email
                                        </label>
                                        <div className="relative text-white-dark">
                                            <input id="Email" type="email" placeholder="Enter Email" className="form-input ps-10 placeholder:text-white-dark" name="email" value={FormDetails?.email} onChange={handleFieldChange}/>
                                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                <IconMail fill={true} />
                                            </span>
                                        </div>
                                        {FormErrors?.email && <div className="text-danger mt-1">{FormErrors?.email}</div>}

                                    </div>
                                    <button type="button" onClick={submitForm} className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                        {Loading && <LoadingIcon />} Send Email
                                    </button>
                                </form>

                                <div className="relative my-7 text-center md:mb-9">
                                    <span className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-white-light dark:bg-white-dark"></span>
                                    <span className="relative bg-white px-2 font-bold uppercase text-white-dark dark:bg-dark dark:text-white-light">or</span>
                                </div>
                                <div className="text-center dark:text-white mt-2">
                                    Go to ?&nbsp;
                                    <Link to="/login" className="uppercase hover:text-primary underline transition text-black dark:text-white dark:hover:text-primary">
                                        Login
                                    </Link>
                                </div>
                            </>
                            :
                            <div className="mb-7 text-center">
                                <h1 className="text-3xl text-center font-extrabold uppercase !leading-snug text-primary md:text-4xl">Mail Sent Successfully!!!</h1>
                                <p className='text-base font-bold leading-normal text-white-dark'>Please check your inbox</p>
                            </div>

                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;
