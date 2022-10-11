import { RESERVATION_SUFFIX, post, get } from "./baseServerCommunicaton";

export const getReservationsFromComapny = async (values, setIsLoading, t) => {
  return await get(RESERVATION_SUFFIX + "/fromCompany/", values, setIsLoading, t);
};

export const getReservationFromComapnyForDate = async (values, setIsLoading, t) => {
  return await get(RESERVATION_SUFFIX + "/fromCompanyForDate/", values, setIsLoading, t);
};
