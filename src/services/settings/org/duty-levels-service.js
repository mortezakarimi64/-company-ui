import http from "../../http-service";
import { apiUrl } from "../../../config.json";

const apiEndpoint = apiUrl + "/settings/org/duty-levels";

async function getAllData() {
  const { data } = await http.get(`${apiEndpoint}`);

  return data;
}

async function changeOrder(levelID, changeType) {
  const { data } = await http.get(
    `${apiEndpoint}/change-order/${levelID}/${changeType}`
  );

  return data;
}

async function searchData(searchText) {
  const { data } = await http.post(`${apiEndpoint}/search`, { searchText });

  return data;
}

export async function saveData(record) {
  const { data } = await http.post(`${apiEndpoint}`, record);

  return data;
}

export async function deleteData(recordID) {
  const { data } = await http.delete(`${apiEndpoint}/${recordID}`);

  return data;
}

const service = {
  getAllData,
  changeOrder,
  searchData,
  saveData,
  deleteData,
};

export default service;
