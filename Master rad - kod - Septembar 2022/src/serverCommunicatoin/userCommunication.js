import { USER_SUFFIX, post, get } from "./baseServerCommunicaton";

export const addUser = async (values, setIsLoading, t) => {
  return await post(USER_SUFFIX + "/", values, setIsLoading, t);
};

export const getUser = async (values, setIsLoading, t) => {
  return await get(USER_SUFFIX + "find/", values, setIsLoading, t);
};
