import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { useEffect, useState } from 'react';
import { setPageTitle, toggleRTL, setUserDetails } from '../../store/themeConfigSlice';
import IconMail from '../../components/Icon/IconMail';
import IconLockDots from '../../components/Icon/IconLockDots';
import { emptyRegex } from '../../helpers/constants';
import {LoadingIcon} from '../../helpers/icons';
import DefaultLogo from "../assets/images/Janane_Logo.png";
import DefaultImg from "../assets/images/loginimg.jpg";
import {LoginUser, LoginOTPUser} from '../service/Auth';
import CustomToast from '../../helpers/CustomToast';
import {get2FACookie, set2FACookie} from '../../helpers/customFunctions';
import ThemeConfig from '../../theme.config';


const Login = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Login'));
    });

    const APIURL = ThemeConfig.apiURL;
    const navigate = useNavigate();
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const { otp }:any = useParams();


    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };
    const [flag, setFlag] = useState(themeConfig.locale);

    const [FormDetails, setFormDetails] = useState<any>({email:"", password: ""});
    const [OtpFormDetails, setOtpFormDetails] = useState<any>({otp:"", user_id:""});

    const [FormErrors, setFormErrors] = useState<any>({});
    const [OTPFormErrors, setOTPFormErrors] = useState<any>({});

    const [OTP, setOTP] = useState<boolean>(false);
    const [Loading, setLoading] = useState<boolean>(false);

    const CurrentLogo = localStorage.getItem('logo');
    const CurrentImage = localStorage.getItem('image');

    const isValid = () => {
        let valid = true;
        var error:any = {};
        if(emptyRegex.test(FormDetails.email) || !Object.keys(FormDetails).includes('email')){
           valid = false;
           error.email = 'Please enter email';
        }
        if(emptyRegex.test(FormDetails.password) || !Object.keys(FormDetails).includes('password')){
            valid = false;
            error.password = 'Please enter password';
        }
        setFormErrors({...error})
        return valid;
    }

    const isValidOTP = () => {
        let valid = true;
        var error:any = {};
        if(emptyRegex.test(OtpFormDetails.otp) || !Object.keys(OtpFormDetails).includes('otp')){
           valid = false;
           error.otp = 'Please enter otp';
        }
        setOTPFormErrors({...error})
        return valid;
    }

    const handleFieldChange = (event:any) => {
        var name = event.target.name;
        var val = event.target.value;
        let currentFormDetails = {...FormDetails}
        currentFormDetails[name]=val;
        setFormDetails(currentFormDetails);
    }

    const submitForm = async () => {
        if(isValid()){
            setLoading(true);
            let login: any;
            FormDetails['tfa'] = "not_verified";
            if(get2FACookie() == "verified"){
                FormDetails['tfa'] = "verified";
            }
            login = await LoginUser(FormDetails);

            if(login?.data?.twoFA){
                setLoading(false);
                setOTP(true);
                let currentOtpFormDetails = {...OtpFormDetails}
                currentOtpFormDetails['user_id']=login?.data?.user_id;
                setOtpFormDetails(currentOtpFormDetails);
                CustomToast(login?.data?.message, login?.data.status);
                return;
            }
            if(login?.data?.status == 'success'){
                setLoading(false);
                CustomToast('Successfully logged in', login?.data.status);
                login = login.data;

                let ImageInfo = login.userDetails?.imageInfo;
                ImageInfo = JSON.parse(ImageInfo);
                let defaultImageInfo = login.userDetails?.defaultImageInfo;
                defaultImageInfo = JSON.parse(defaultImageInfo);
                let AllData = login.userDetails?.allData;

                let { logo, loginPageImage, companyName } = defaultImageInfo;

                if(ImageInfo){
                    if(ImageInfo != ""){
                        Object.keys(ImageInfo).map(key => {
                            if(key == 'logo'){
                                logo = ImageInfo[key];
                            }
                            if(key == 'loginPageImage'){
                                loginPageImage = ImageInfo[key];
                            }
                            if(key == 'companyName'){
                                companyName = ImageInfo[key];
                            }
                        })
                    }
                }

                localStorage.setItem('image', APIURL.split('api/')[0]+loginPageImage);
                localStorage.setItem('logo', APIURL.split('api/')[0]+logo);
                localStorage.setItem('companyName', companyName);
                localStorage.setItem('AppData', JSON.stringify(AllData?.appVersion));
                localStorage.setItem('branch', JSON.stringify(AllData?.branch));
                localStorage.setItem('building', JSON.stringify(AllData?.building));
                localStorage.setItem('devices', JSON.stringify(AllData?.devices));
                localStorage.setItem('facility', JSON.stringify(AllData?.facility));
                localStorage.setItem('floor', JSON.stringify(AllData?.floor));
                localStorage.setItem('location', JSON.stringify(AllData?.location));
                localStorage.setItem('sensors', JSON.stringify(AllData?.sensors));
                localStorage.setItem('zone', JSON.stringify(AllData?.zone));
                localStorage.setItem('userDetails', JSON.stringify(login.userDetails));
                localStorage.setItem('debug', login.debug);
                sessionStorage.setItem('accessToken', login.accessToken);
                dispatch(setUserDetails(login.userDetails));
                // OTP && set2FACookie();
                window.location.href = "/"
                return;
            }
            if(login.response.data.status == "error"){
                setLoading(false);
                const ErrorMessage = login.response.data.message;
                CustomToast(ErrorMessage, login.response.data.status);
            }
            if(login?.data?.status == "error"){
                setLoading(false);
                const ErrorMessage = login?.data?.message?.email || login?.data?.message?.user || login?.data?.message;
                CustomToast(ErrorMessage, login?.data?.status);
            }
        }
    };

    const submitOTPForm = async () => {
        if(isValidOTP()){
            setLoading(true);
            var response: any = await LoginOTPUser(OtpFormDetails);
            if(response?.data?.status == 'success'){
                setLoading(false);
                CustomToast('Successfully logged in', response?.data.status);
                localStorage.setItem('user', response?.data.accessToken);
                OTP && set2FACookie();
                window.location.href = "/dashboard";
                return;
            }
            if(response?.response?.data?.status == "error"){
                setLoading(false);
                const ErrorMessage = response?.response?.data?.message?.email || response?.response?.data?.message?.user || response?.response?.data?.message;
                CustomToast(ErrorMessage, response?.response?.data?.status);
            }
        }
    };

    useEffect(() => {
        localStorage.setItem('menu', themeConfig.menu);
    }, [])

    return (
        <div>
            {/* <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16"> */}
            <div className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                {/* <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" /> */}
                <div className="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0 border">
                    <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-3">
                                <img className="mx-auto h-12" src={CurrentLogo || DefaultLogo} alt="Workflow" />
                                    <h1 className="text-2xl py-3 text-center dark:text-white">
                                        Welcome
                                        {/* Welcome to <span style={{ color: "#033882" }}>{companyName}</span>{" "} */}
                                    </h1>
                                    <h2 className="text-center text-sm font-sans font-bold text-gray-900 py-1 ">
                                        Sign in to your account
                                    </h2>
                            </div>
                            {OTP ?
                                <>
                                    <form className="space-y-5 dark:text-white" >
                                        <div>
                                            <label htmlFor="otp">OTP</label>
                                            <div className="relative text-white-dark">
                                                <input id="otp" type="text" name="otp" placeholder="Enter OTP" className="form-input ps-10 placeholder:text-white-dark" value={OtpFormDetails?.otp} onChange={(e) => {
                                                    let value = e.target.value;
                                                    let currentOTPFormDetails = {...OtpFormDetails}
                                                    currentOTPFormDetails['otp']=value;
                                                    setOtpFormDetails(currentOTPFormDetails);
                                                }} />
                                                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                    <IconMail fill={true} />
                                                </span>
                                            </div>
                                            {OTPFormErrors?.otp && <div className="text-danger mt-1">{OTPFormErrors?.otp}</div>}
                                        </div>
                                        <button type="button" onClick={submitOTPForm} className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                            {Loading && <LoadingIcon />}
                                            Sign in
                                        </button>
                                    </form>
                                </>
                            :
                                <>
                                    <form className="space-y-5 dark:text-white" >
                                        <div>
                                            <label htmlFor="Email">Email</label>
                                            <div className="relative text-white-dark">
                                                <input id="Email" type="email" name="email" placeholder="Enter Email" className="form-input ps-10 placeholder:text-white-dark dark:text-white" value={FormDetails?.email} onChange={handleFieldChange} />
                                                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                    <IconMail fill={true} />
                                                </span>
                                            </div>
                                            {FormErrors?.email && <div className="text-danger mt-1">{FormErrors?.email}</div>}

                                        </div>
                                        <div>
                                            <label htmlFor="Password">Password</label>
                                            <div className="relative text-white-dark">
                                                <input id="Password" type="password" name="password"  placeholder="Enter Password" className="form-input ps-10 placeholder:text-white-dark dark:text-white" value={FormDetails?.password} onChange={handleFieldChange}/>
                                                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                    <IconLockDots fill={true} />
                                                </span>
                                            </div>
                                            {FormErrors?.password && <div className="text-danger mt-1">{FormErrors?.password}</div>}

                                        </div>
                                        <div className="dark:text-white">
                                            Forgot Your Password ?&nbsp;
                                            <Link to="/forget-password" className="hover:text-primary underline transition text-black dark:text-white dark:hover:text-primary">
                                                Click here
                                            </Link>
                                        </div>
                                        <button type="button" onClick={submitForm} className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                            {Loading && <LoadingIcon />}
                                            Sign in
                                        </button>
                                    </form>
                                    {/* <div className="relative my-7 text-center md:mb-9">
                                        <span className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-white-light dark:bg-white-dark"></span>
                                        <span className="relative bg-white px-2 font-bold uppercase text-white-dark dark:bg-dark dark:text-white-light">or</span>
                                    </div>
                                    <div className="text-center dark:text-white mt-2">
                                        Don't have an account ?&nbsp;
                                        <Link to="/signup" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                            SIGN UP
                                        </Link>
                                    </div>
                                    <div className="text-center dark:text-white mt-2">
                                        Forgot Your Password ?&nbsp;
                                        <Link to="/forget-password" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                            Click
                                        </Link>
                                    </div> */}
                                </>
                            }

                        </div>
                    </div>
                    <div className="w-full space-y-0">
                        <img src={CurrentImage || DefaultImg} alt="Cover Image" className="object-cover flex item-right h-full max-md:hidden" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
