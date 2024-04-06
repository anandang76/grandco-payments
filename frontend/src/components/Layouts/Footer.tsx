const Footer = () => {
    let CompanyName = "";
    let userDetails: any = localStorage.getItem('userDetails');
    if(userDetails){
        CompanyName = JSON.parse(userDetails).companyName;
    }
    return <div className="dark:text-white-dark text-center ltr:sm:text-left rtl:sm:text-right p-6 pt-0 mt-auto">
        © {new Date().getFullYear()}. {CompanyName}
    </div>;
};

export default Footer;
