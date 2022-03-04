import http from "../../http-service";
import { apiUrl } from "../../../config.json";

const apiEndpoint = apiUrl + "/settings/timex/security-guard-reged-cards";

async function getParams() {
  const { data } = await http.get(`${apiEndpoint}/params`);

  return data;
}

async function searchData(filter) {
  const { data } = await http.post(`${apiEndpoint}/search`, filter);

  return data;
}

export async function transferData(securityGuardRegID) {
  const { data } = await http.post(
    `${apiEndpoint}/transfer/${securityGuardRegID}`
  );

  return data;
}

const service = {
  getParams,
  searchData,
  transferData,
};

export default service;
