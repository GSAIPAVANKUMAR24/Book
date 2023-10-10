import axios from "axios";
// import store from "../store/store";
// import { ThunkDispatch } from "redux-thunk";
// import { AnyAction } from "redux";
// import { RootState } from "../models/RootState";
// import { getBaseUrl } from "../api-services/environment-url/environment-url";

const API = axios.create({
  //   baseURL: getBaseUrl(process.env.REACT_APP_NODE_ENV, "REACT_APP_REST_API_URL"),
  baseURL: "http://68.178.162.203:8080/application-test-v1.1/",
  responseType: "json",
  withCredentials: false,
  timeout: 10000, // 10 seconds
});

//Add a response interceptor
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    
    return Promise.reject(error);
  }
);

export default API;
