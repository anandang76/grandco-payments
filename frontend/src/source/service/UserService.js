import { Client, ErrorFunction } from './Client.js'
import themeConfig from '../../theme.config.tsx';

let URL = `${themeConfig.apiURL}users/`

export const GetAllUsers = async () => {
    try {
        return await Client.post(URL.slice(0, -1));
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const GetUser = async (data) => {
    try {
        return await Client.post(`${URL}get/${data.id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const AddNewUser = async (data) => {
    try {
        return await Client.post(`${URL}add`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const UpdatedUser = async (data) => {
    try {
        return await Client.post(`${URL}edit/${data.id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const DeleteUser = async (data) => {
    try {
        return await Client.post(`${URL}delete/${data.id}`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}

export const resetUserPassword = async (data) => {
    try {
        return await Client.post(`${URL}resetPassword`, data);
    } catch (error) {
        return ErrorFunction(error);
    }
}
