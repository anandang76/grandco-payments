export const GetAQIColor = (value: any) => {
    let color = '#d4086e';

    if (value == 'NA'){
        color = '#6b6a6a';
    } else if(value >= 0 && value <= 50){
        color = '#026107';
    } else if(value >= 51 && value <= 100){
        color = '#729c02';
    } else if(value >= 101 && value <= 200){
        color = '#dbc604';
    } else if(value >= 201 && value <= 300){
        color = '#f78e16';
    } else if (value >= 301 && value <= 400){
        color = '#ed120e';
    } else if (value >= 401){
        color = '#af2d24';
    }

    return color;
}

export const GetAQILabel = (value: any) => {
    var label = 'NA';
    if(value>0){
      if(value<=50){
        label = 'Good';
      } else if(value<=100){
        label = 'Satisfactory';
      // } else if(value<=150){
      //   color = '#f5f50a';
      } else if(value<=200){
        label = 'Moderate';
      } else if(value<=300){
        label = 'Poor';
      } else if (value<=400){
        label = 'Very poor';
      } else {
        label = 'Severe';
      }
    }else{
      label = 'NA';
    }
    return label;
}

export const GetAlertPriorityStatus = (alertType: string) => {
    let element = {
        label: 'Good',
        // color: 'green'
        color: '#00AB55'
    };
    alertType = alertType.toLowerCase()

    switch (alertType) {
        case 'critical':
            element.label = 'Critical';
            // element.color = 'red';
            element.color = '#E61617';
            break;
        case 'out of range':
        case 'out ofrange':
        case 'outof range':
        case 'outofrange':
            element.label = 'Out Of Range';
            // element.color = '#9c27b0';
            element.color = '#B541D2';
            break;
        case 'warning':
            element.label = 'Warning';
            // element.color = 'orange';
            element.color = '#F3CE0C';
            break;
        case 'twa':
            element.label = 'TWA';
            // element.color = 'orange';
            element.color = '#F3CE0C';
            break;
        case 'stel':
            element.label = 'STEL';
            // element.color = 'red';
            element.color = '#E61617';
            break;
        case 'devicedisconnected':
        case 'device disconnected':
            element.label = 'Device is Disconnected';
            // element.color = 'gray';
            element.color = '#9CA3AF';
            break;
        default:
            element.label = 'Good';
            // element.color = 'green';
            element.color = '#00AB55';
            break;
    }

    return element;
}

export const SetAQICategory = (AQI: number) => {
    let AQICategory = "NA"

    if(AQI >= 0 && AQI <= 50){
        AQICategory = "Good";
    } else if(AQI >= 51 && AQI <= 100){
        AQICategory = "Satisfactory";
    } else if(AQI >= 101 && AQI <= 200){
        AQICategory = "Moderate";
    } else if(AQI >= 201 && AQI <= 300){
        AQICategory = "Poor";
    } else if(AQI >= 301 && AQI <= 400){
        AQICategory = "Very Poor";
    } else if(AQI >= 401){
        AQICategory = "Severe";
    }

    return AQICategory;
}

export const ModalSelectBoxDropdown = {
    menuPortal: (provided: any) => ({
        ...provided,
        // Add your custom styles for the menu portal container here
        zIndex: 9999, // Example: You can set a custom z-index
    }),
    input: (provided: any) => ({
        ...provided,
        // Add your custom styles for the input element here
        // fontSize: '15px', // Example: Change the font size
    }),
    singleValue: (provided: any) => ({
        ...provided,
        // Add your custom styles for the selected value here
        // fontSize: '14px', // Example: Change the font size
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        // fontSize: '13px', // Change this value to your desired font size
    }),
    menu: (provided: any) => ({
        ...provided,
        // minWidth: '200px', // Adjust this value to your desired minimum width
    }),
};
