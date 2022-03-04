import http from "../../http-service";
import { apiUrl } from "../../../config.json";

const apiEndpoint = apiUrl + "/settings/accesses/page-accesses";

async function getMemberPageAccesses(employee_memberID) {
  const { data } = await http.get(`${apiEndpoint}/pages/${employee_memberID}`);

  return data;
}

export async function saveChangedAccesses(employee_memberID, records) {
  const { data } = await http.post(`${apiEndpoint}`, {
    employee_memberID,
    records,
  });

  return data;
}

const service = {
  getMemberPageAccesses,
  saveChangedAccesses,
};

export default service;
