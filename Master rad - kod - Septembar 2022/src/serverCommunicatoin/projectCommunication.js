import { PROJECT_SUFFIX, post, put, get, delete_ } from "./baseServerCommunicaton";

export const addProject = async (values, setIsLoading, t, successMessage) => {
  return await post(PROJECT_SUFFIX, values, setIsLoading, t, successMessage);
};

export const updateProject = async (values, setIsLoading, t, successMessage) => {
  return await put(PROJECT_SUFFIX, values, setIsLoading, t, successMessage);
};

export const deleteProject = async (values, setIsLoading, t, successMessage) => {
  return await delete_(PROJECT_SUFFIX, values, setIsLoading, t, successMessage);
};

export const getProjectsFromComapny = async (values, setIsLoading, t) => {
  return await get(PROJECT_SUFFIX + "getAll/", values, setIsLoading, t);
};
