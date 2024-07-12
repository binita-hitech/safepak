import axios from 'axios';
import GlobalURL from './global';

var token = localStorage.getItem("token");
var tokenData = JSON.parse(token);

let httpclient = axios.create({
  baseURL: GlobalURL[0].url, 
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type',
    // 'Content-Type': "application/json",
    Authorization: "Bearer " + tokenData,
  },
});

export default httpclient;