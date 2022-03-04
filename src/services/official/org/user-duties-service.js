import http from "../../http-service";
import { apiUrl } from "../../../config.json";

const apiEndpoint = apiUrl + "/official/org/user-duties";

async function getAllData() {
  const { data } = await http.get(`${apiEndpoint}`);

  return data;
}

async function searchData(searchText) {
  const { data } = await http.post(`${apiEndpoint}/search`, { searchText });

  return data;
}

const service = {
  getAllData,
  searchData,
};

export default service;
