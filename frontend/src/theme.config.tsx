// const serverMode:string = "live";
// const serverMode:string = "local";
const serverMode: string = "check";

const liveThemeConfig = {
    locale: 'en', // en, da, de, el, es, fr, hu, it, ja, pl, pt, ru, sv, tr, zh
    theme: 'light', // light, dark, system
    menu: 'collapsible-vertical', // vertical, collapsible-vertical, horizontal
    layout: 'full', // full, boxed-layout
    rtlClass: 'ltr', // rtl, ltr
    animation: '', // animate__fadeIn, animate__fadeInDown, animate__fadeInUp, animate__fadeInLeft, animate__fadeInRight, animate__slideInDown, animate__slideInLeft, animate__slideInRight, animate__zoomIn
    navbar: 'navbar-sticky', // navbar-sticky, navbar-floating, navbar-static
    semidark: false,
    //Server details
    apiURL: `${window.location.origin}/backend/api/`,
    reportsURL: `${window.location.origin}/reportsAPI/`,
    auth2FA: false,
};

const localThemeConfig = {
    locale: 'en', // en, da, de, el, es, fr, hu, it, ja, pl, pt, ru, sv, tr, zh
    theme: 'light', // light, dark, system
    menu: 'collapsible-vertical', // vertical, collapsible-vertical, horizontal
    layout: 'full', // full, boxed-layout
    rtlClass: 'ltr', // rtl, ltr
    animation: '', // animate__fadeIn, animate__fadeInDown, animate__fadeInUp, animate__fadeInLeft, animate__fadeInRight, animate__slideInDown, animate__slideInLeft, animate__slideInRight, animate__zoomIn
    navbar: 'navbar-sticky', // navbar-sticky, navbar-floating, navbar-static
    semidark: false,
    //Server details
    apiURL: 'http://127.0.0.1:8000/api/',
    reportsURL: 'http://localhost/dabaduv3/reportsAPI/',
    auth2FA: true,
};

const checkThemeConfig = {
    locale: 'en', // en, da, de, el, es, fr, hu, it, ja, pl, pt, ru, sv, tr, zh
    theme: 'light', // light, dark, system
    menu: 'collapsible-vertical', // vertical, collapsible-vertical, horizontal
    layout: 'full', // full, boxed-layout
    rtlClass: 'ltr', // rtl, ltr
    animation: '', // animate__fadeIn, animate__fadeInDown, animate__fadeInUp, animate__fadeInLeft, animate__fadeInRight, animate__slideInDown, animate__slideInLeft, animate__slideInRight, animate__zoomIn
    navbar: 'navbar-sticky', // navbar-sticky, navbar-floating, navbar-static
    semidark: false,
    //Server details
    apiURL: `https://dabadu.grandcopayments.com/backend/api/`,
    reportsURL: `https://dabadu.grandcopayments.com/reportsAPI/`,
    auth2FA: false,
};


let themeConfig: any;

if (serverMode == "local") {
    themeConfig = localThemeConfig;
} else if (serverMode == "live") {
    themeConfig = liveThemeConfig;
} else if (serverMode == "check") {
    themeConfig = checkThemeConfig;
}

export default themeConfig;
