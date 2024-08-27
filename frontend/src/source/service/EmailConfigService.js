import { Client, ErrorFunction } from './Client.js';
import themeConfig from '../../theme.config.tsx';

const EmailConfigURL = `${themeConfig.apiURL}emailConfig/`;

export const GetEmailConfig = async (data) => {
    try {
        return await Client.post(`${EmailConfigURL}get/${data.id}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const AddNewEmailConfig = async (data) => {
    try {
        return await Client.post(`${EmailConfigURL}add`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const UpdateEmailConfig = async (data) => {
    try {
        return await Client.post(`${EmailConfigURL}edit/${data.id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const DeleteEmailConfig = async (data) => {
    try {
        return await Client.post(`${EmailConfigURL}delete/${data.id}`);
    } catch (error) {
        return ErrorFunction(error);
    }
}
