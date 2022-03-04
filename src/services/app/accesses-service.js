import http from "../http-service";
import { apiUrl } from "../../config.json";

const apiEndpoint = apiUrl + "/global/accesses";

async function getPageAccess(pageName) {
  const { data } = await http.post(`${apiEndpoint}`, { pageName });

  return data;
}

async function searchMembers(pageName, searchText) {
  const { data } = await http.post(`${apiEndpoint}/search-members`, {
    pageName,
    searchText,
  });

  return data;
}

async function searchCompanies(pageName, searchText) {
  const { data } = await http.post(`${apiEndpoint}/search-companies`, {
    pageName,
    searchText,
  });

  return data;
}

const service = {
  getPageAccess,
  searchMembers,
  searchCompanies,
};

export default service;
