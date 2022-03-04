import http from "../http-service";
import { apiUrl } from "../../config.json";

const apiEndpoint = apiUrl + "/global/modules";

async function accessibleModuleCategories() {
  const { data } = await http.get(`${apiEndpoint}/accessibleModuleCategories`);

  return data;
}

async function accessibleModules(categoryID) {
  const { data } = await http.get(
    `${apiEndpoint}/accessibleModules/${categoryID}`
  );

  return data;
}

async function accessiblePages(moduleID) {
  const { data } = await http.get(`${apiEndpoint}/accessiblePages/${moduleID}`);

  return data;
}

const service = {
  accessibleModuleCategories,
  accessibleModules,
  accessiblePages,
};

export default service;
