import axios from 'axios' 

const BASE_URL = "http://localhost:8222/api/v1/";
export const Config = {
  base_server: `${BASE_URL}`,
  image_path: `${BASE_URL}upload/`,
  version: 1,
};

export const request = (method = "", url = "", data = {}) => {
  return axios({
    method: method,
    url: Config.base_server + url,
    data: data,
  }).then(res => {
    return res
  }).catch(() => {
    return false;
  });
}


