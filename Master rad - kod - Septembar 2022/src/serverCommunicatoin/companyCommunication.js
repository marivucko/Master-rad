import { COMPANY_SUFFIX, post, put, get, delete_ } from "./baseServerCommunicaton";

export const addCompany = async (values, setIsLoading, t, successMessage) => {
  return await post(COMPANY_SUFFIX, values, setIsLoading, t, successMessage);
};

export const updateCompany = async (values, setIsLoading, t, successMessage) => {
  return await put(COMPANY_SUFFIX, values, setIsLoading, t, successMessage);
};

export const deleteCompany = async (values, setIsLoading, t, successMessage) => {
  return await delete_(COMPANY_SUFFIX, values, setIsLoading, t, successMessage);
};

export const getCompaniesFromAdmin = async (adminEmail, setIsLoading, t) => {
  return await get(COMPANY_SUFFIX + "admin/", adminEmail, setIsLoading, t);
};
