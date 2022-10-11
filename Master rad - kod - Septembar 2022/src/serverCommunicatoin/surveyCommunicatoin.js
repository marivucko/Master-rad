import { SURVEY_SUFFIX, post, get } from "./baseServerCommunicaton";

export const addSurvey = async (values, setIsLoading, t, successMessage) => {
  return await post(SURVEY_SUFFIX + "add/", values, setIsLoading, t, successMessage);
};

export const removeUser = async (values, setIsLoading, t, successMessage) => {
  return await post(SURVEY_SUFFIX + "removeUser/", values, setIsLoading, t, successMessage);
};

export const getSurveysForUserForThisWeek = async (user, companyId, setIsLoading, t) => {
  return await get(SURVEY_SUFFIX + "forUserForWeek/", user + "/" + companyId, setIsLoading, t);
};

export const getSurveysOccupancyForWeek = async (companyId, dateObject, setIsLoading, t) => {
  return await get(
    SURVEY_SUFFIX + "occupancyForWeek/",
    companyId + "/" + dateObject.year + "/" + dateObject.month + "/" + dateObject.day,
    setIsLoading,
    t
  );
};

export const getSurveyForUserForDate = async (user, companyId, dateObject, setIsLoading, t) => {
  return await get(
    SURVEY_SUFFIX + "exists",
    user + "/" + companyId + "/" + dateObject.year + "/" + dateObject.month + "/" + dateObject.day,
    setIsLoading,
    t
  );
};

export const addUserWithoutPlace = async (values, setIsLoading, t) => {
  return await post(SURVEY_SUFFIX + "addUserWithoutPlace/", values, setIsLoading, t);
};

export const getSurveysForUserForMonth = async (user, companyId, year, month, setIsLoading, t) => {
  return await get(
    SURVEY_SUFFIX + "forUserForMonth/",
    user + "/" + companyId + "/" + year + "/" + month,
    setIsLoading,
    t
  );
};
