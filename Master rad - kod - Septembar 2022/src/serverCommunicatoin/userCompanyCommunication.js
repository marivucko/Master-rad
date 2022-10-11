import { USER_COMPANY_SUFFIX, post, get, put } from "./baseServerCommunicaton";

export const addUserCompany = async (values, setIsLoading, t) => {
  return await post(USER_COMPANY_SUFFIX, values, setIsLoading, t);
};

export const doesUserCompanyExist = async (values, setIsLoading, t) => {
  return await get(USER_COMPANY_SUFFIX + "userCompanyExist/", values, setIsLoading, t);
};

export const getCompaniesInWhichUserIsRegistered = async (userEmail, setIsLoading, t) => {
  return await get(USER_COMPANY_SUFFIX + "userCompanies/", userEmail, setIsLoading, t);
};

export const getRegisteredUsersInComapny = async (companyId, setIsLoading, t) => {
  return await get(USER_COMPANY_SUFFIX + "registeredUserCompany/", companyId, setIsLoading, t);
};

export const getRegisteredUserNamesInCompany = async (companyId, setIsLoading, t) => {
  return await get(USER_COMPANY_SUFFIX + "registeredUserNamesCompany/", companyId, setIsLoading, t);
};

export const getInvitedUsersToComapny = async (companyId, setIsLoading, t) => {
  return await get(USER_COMPANY_SUFFIX + "invitedUserCompany/", companyId, setIsLoading, t);
};

export const setUserRegistered = async (userEmailBody, setIsLoading, t) => {
  return await put(USER_COMPANY_SUFFIX + "setRegistered/", userEmailBody, setIsLoading, t);
};
