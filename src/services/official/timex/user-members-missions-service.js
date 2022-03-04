import http from "../../http-service";
import { apiUrl } from "../../../config.json";

const apiEndpoint = apiUrl + "/official/timex/user-members-missions";

async function getParams() {
  const { data } = await http.get(`${apiEndpoint}/params`);

  return data;
}

async function searchData(filter) {
  const { data } = await http.post(`${apiEndpoint}/search`, filter);

  return data;
}

async function saveNote(note) {
  const { data } = await http.post(`${apiEndpoint}/note`, note);

  return data;
}

async function deleteNote(recordID) {
  const { data } = await http.delete(`${apiEndpoint}/note/${recordID}`);

  return data;
}

const service = {
  getParams,
  searchData,
  saveNote,
  deleteNote,
};

export default service;
