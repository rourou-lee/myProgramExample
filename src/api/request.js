
const axios = require('axios');

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    let data=response.data;
    if(data.success&&/login$/g.test(response.config.url)) wenkuToken=data.content.wenkuToken;
    if(data.success&&(/verifyCode$/g.test(response.config.url)||/login$/g.test(response.config.url))) return data;
    if(response.status===200&&/download$/g.test(response.config.url)) {
        let blob=new Blob([data],{type: data.type});
        return Object.assign(blob,{lastModifiedDate:new Date()});
    };
    if(data.success) return data.content||data.success;
    return Promise.reject(data);
}, function (error) {
    console.log(error);
});
const transformResponse=(data)=>{
   return data.success?data.content:data.message||data.success;
};

const request=(param)=>{
    return axios(Object.assign(param, {
            baseURL:'creation/',
            headers:{ 
                'content-type':'application/json',
                //'wenkuToken':wenkuToken||'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNDFhZGJhMi0wMDU3LTRlNjEtYjQzNy1kYTdkNmNkMmEzNzgiLCJleHAiOjE1OTE2ODA5NjEsInVzZXJOYW1lIjoiYWRtaW4iLCJpYXQiOjE1OTE1OTQ1NjF9.Z6noYHU8WFSNHINSLUWh6-Zy-KzYspbFA17Azz8zn-c'
            },
            params:param.method=='get'?param.data:'',
            // transformResponse:[
            //     transformResponse
            // ]
        }
    ));
};
export default request;