import http from "../../http-service";
import { apiUrl } from "../../../config.json";

const apiEndpoint =
  apiUrl + "/official/timex/user-members-new-vacations-check-manager";

async function getSwapableMembers(vacationMemberID, swapMemberID) {
  const { data } = await http.get(
    `${apiEndpoint}/swapables/${vacationMemberID}/${swapMemberID}`
  );

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
  getSwapableMembers,
  getParams,
  searchData,
  saveResponse,
};

export default service;
