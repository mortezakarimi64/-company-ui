import jwtDecode from "jwt-decode";
import { apiUrl } from "../config.json";
import http from "./http-service.js";

const apiEndpoint = apiUrl + "/auth";
const tokenKey = "token";

http.setJwt(getJwt());

async function login(username, password) {
  const { data: jwt } = await http.post(apiEndpoint, {
    username,
    password,
  });

  localStorage.setItem(tokenKey, jwt);

  http.setJwt(getJwt());

  //console.log("JWT", jwt);
  //await userService.me();
}

function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

function logout() {
  localStorage.removeItem(tokenKey);
}

function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

function getJwt() {
  return localStorage.getItem(tokenKey);
}

const service = {
  login,
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt,
};

export default service;
