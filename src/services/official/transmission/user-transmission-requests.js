import http from "../../http-service";
import { apiUrl } from "../../../config.json";

const apiEndpoint =
  apiUrl + "/official/transmission/user-transmission-requests";

async function getResponseParams() {
  const { data } = await http.get(`${apiEndpoint}/params/response`);

  return data;
}

async function getParams() {
  const { data } = await http.get(`${apiEndpoint}/params`);

  return data;
}

async function searchData(filter) {
  const { data } = await http.post(`${apiEndpoint}/search`, filter);

  return data;
}

async function saveResponse(response) {
  const { data } = await http.post(`${apiEndpoint}/response`, response);

  return data;
}

const service = {
  getResponseParams,
  getParams,
  searchData,
  saveResponse,
};

export default service;
