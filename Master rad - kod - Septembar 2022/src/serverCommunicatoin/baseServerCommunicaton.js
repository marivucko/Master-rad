import { toast } from "react-toastify";

const APP_URL = "http://localhost:3000";
const SERVER_URL = "http://localhost:4000/";

const COMPANY_SUFFIX = "company/";
const OFFICE_SUFFIX = "office/";
const PROJECT_SUFFIX = "project/";
const RESERVATION_SUFFIX = "reservation/";
const SURVEY_SUFFIX = "survey/";
const USER_SUFFIX = "user/";
const USER_COMPANY_SUFFIX = "userCompany/";

const GET = "get";
const POST = "post";
const PUT = "put";
const DELETE = "delete";

const get = async (urlSuffix, param, setIsLoading, t, successMessage = null) => {
  return await request(GET, urlSuffix, param, null, setIsLoading, t, successMessage);
};

const post = async (urlSuffix, data, setIsLoading, t, successMessage = null) => {
  return await request(POST, urlSuffix, "", data, setIsLoading, t, successMessage);
};

const put = async (urlSuffix, data, setIsLoading, t, successMessage = null) => {
  return await request(PUT, urlSuffix, "", data, setIsLoading, t, successMessage);
};

const delete_ = async (urlSuffix, param, setIsLoading, t, successMessage = null) => {
  return await request(DELETE, urlSuffix, param, null, setIsLoading, t, successMessage);
};

const request = async (method, urlSuffix, param, data, setIsLoading, t, successMessage = null) => {
  console.log("--", SERVER_URL + urlSuffix + param);
  let result;
  setIsLoading(true);
  let fetchBody;
  if (method === DELETE) {
    fetchBody = {
      method: method,
    };
  } else if (method === GET) {
    fetchBody = {};
  } else {
    fetchBody = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  }
  await fetch(SERVER_URL + urlSuffix + param, fetchBody)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      result = data;
      if (result.status === 200) {
        if (!!successMessage) {
          toast.success(successMessage);
        }
      } else {
        toast.error(t("default_server.error." + method));
      }
    })
    .catch((error) => {
      toast.error(t("default_server.error." + method));
    });
  setIsLoading(false);
  return result;
};

export {
  APP_URL,
  COMPANY_SUFFIX,
  OFFICE_SUFFIX,
  PROJECT_SUFFIX,
  RESERVATION_SUFFIX,
  SURVEY_SUFFIX,
  USER_SUFFIX,
  USER_COMPANY_SUFFIX,
  get,
  post,
  put,
  delete_,
};
