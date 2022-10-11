import { OFFICE_SUFFIX, post, put, get, delete_ } from "./baseServerCommunicaton";

export const addOffice = async (values, setIsLoading, t, successMessage) => {
  return await post(OFFICE_SUFFIX, values, setIsLoading, t, successMessage);
};

export const updateOffice = async (values, setIsLoading, t, successMessage) => {
  return await put(OFFICE_SUFFIX, values, setIsLoading, t, successMessage);
};

export const deleteOffice = async (values, setIsLoading, t) => {
  return await delete_(OFFICE_SUFFIX, values, setIsLoading, t);
};

export const getOfficiesFromComapny = async (values, setIsLoading, t) => {
  return await get(OFFICE_SUFFIX + "fromCompany/", values, setIsLoading, t);
};
