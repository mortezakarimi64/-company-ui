import http from "../../http-service";
import { apiUrl } from "../../../config.json";

const apiEndpoint =
  apiUrl + "/official/timex/user-members-new-missions-check-manager";

async function getSwapableMembers(missionMemberID, swapMemberID) {
  const { data } = await http.get(
    `${apiEndpoint}/swapables/${missionMemberID}/${swapMemberID}`
  );

  return data;
}

async function getNewReports() {
  const { data } = await http.get(`${apiEndpoint}/reports/new`);

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

async function saveReportResponse(response) {
  const { data } = await http.post(`${apiEndpoint}/report/response`, response);

  return data;
}
async function saveResponse(response) {
  const { data } = await http.post(`${apiEndpoint}/response`, response);

  return data;
}

const service = {
  getSwapableMembers,
  getNewReports,
  getParams,
  searchData,
  saveReportResponse,
  saveResponse,
};

export default service;
