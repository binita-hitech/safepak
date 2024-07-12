import React from 'react';

let GlobalURL;

let LocalGlobalURL = [
  {
    url: 'https://safepak.synccare.com.au/api_middleware/public/api/v1/',
    // videourl: 'http://staging.franchise.care/uploaded/videofile/',
    // paypalid: 'sb',
    // paypaltype: 'sandbox',
    version: '1.0',
  },
];

let LiveGlobalURL = [
  {
    url: 'https://safepak.synccare.com.au/api_middleware/public/api/v1/',
    // videourl: 'https://tfg.franchise.care/uploaded/videofile/',
    // paypalid: 'AZ1XjgwM4m-dg7L4OlQMf6jOdzq1H_6IDKLBVf7mh7VqIgJPsYSIKN03iC5LO2XtfSoLUac9NF5R0x8v',
    // paypaltype: 'live',
    version: '1.0',
  },
];

let StagingGlobalURL = [
  {
    url: 'https://safepak.synccare.com.au/api_middleware/public/api/v1/',
    //  url: 'http://psw.synccare.com.au/php/api',
    // videourl: 'http://staging.franchise.care/uploaded/videofile/',
    // paypalid: 'sb',
    // paypaltype: 'sandbox',
    version: '1.0',
  },
];

export default GlobalURL =
  window.location.hostname === 'localhost'
    ? LocalGlobalURL
    : window.location.hostname === ''
    ? StagingGlobalURL
    : LiveGlobalURL;
