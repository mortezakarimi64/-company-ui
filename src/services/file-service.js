import http from "./http-service";
import { apiUrl } from "../config.json";
// import { saveAs } from "file-saver";

const apiEndpoint = apiUrl + "/filemanager";

export async function uploadFile(formData, uploadConditions, eventHandler) {
  let headers = {};

  if (uploadConditions) {
    const { category, extensions, maxFileSize, deleteFileName } =
      uploadConditions;

    if (category) {
      headers.category = category;
    }
    if (extensions) {
      headers.extensions = extensions;
    }
    if (maxFileSize) {
      headers.maxFileSize = maxFileSize;
    }
    if (deleteFileName) {
      headers.deleteFileName = deleteFileName;
    }
  }

  const { data } = await http.post(apiEndpoint + "/upload", formData, {
    headers,
    onUploadProgress: eventHandler,
  });

  return data;
}

// export async function downloadFile(fileName, category) {
//   const headers = { category };

//   const { data } = await http.get(`${apiEndpoint}/download/${fileName}`, {
//     headers,
//   });

//   saveAs(new Blob([data]), fileName);
// }

export async function deleteFile(fileName, category) {
  const headers = { category };

  //const { data } =
  await http.delete(`${apiEndpoint}/${fileName}`, {
    headers,
  });
}

const service = {
  uploadFile,
  //   downloadFile,
  deleteFile,
};

export default service;
