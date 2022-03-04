import http from "../../http-service";
import { apiUrl } from "../../../config.json";

const apiEndpoint = apiUrl + "/official/timex/user-my-missions";

async function getParams() {
  const { data } = await http.get(`${apiEndpoint}/params`);

  return data;
}

async function searchData(filter) {
  const { data } = await http.post(`${apiEndpoint}/search`, filter);

  return data;
}

export async function saveData(record) {
  const { data } = await http.post(`${apiEndpoint}`, record);

  return data;
}

export async function saveReport(record) {
  const { data } = await http.post(`${apiEndpoint}/report`, record);

  return data;
}

export async function deleteData(recordID) {
  const { data } = await http.delete(`${apiEndpoint}/${recordID}`);

  return data;
}

export async function deleteReport(recordID) {
  const { data } = await http.delete(`${apiEndpoint}/report/${recordID}`);

  return data;
}

export async function saveNoteSeenDateTime(record) {
  const { data } = await http.post(
    `${apiEndpoint}/note/seen/${record.NoteID}`,
    {}
  );

  return data;
}

const service = {
  getParams,
  searchData,
  saveData,
  saveReport,
  deleteData,
  deleteReport,
  saveNoteSeenDateTime,
};

export default service;
