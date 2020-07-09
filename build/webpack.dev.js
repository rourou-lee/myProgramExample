

const webpack=require('webpack');
const path = require('path');
const merge=require('webpack-merge');
const commonConfig=require('./webpack.common.js');
//去掉域名的sso登录地址
const RETURN_PATH = '/creation';
const loginUrl =`foundation?returnurl=${encodeURIComponent(RETURN_PATH)}`;
//不同浏览器存放cookie的对象
const cookieMap = {};
// 设置cookie
const setCookie = (userAgent, cookies) => {
    let map = cookieMap[userAgent] || {};
    cookies.forEach((cookie) => {
        let [string, key, value] = cookie.match(/^(.*?)=(.*?);/);
        map[key] = value;
    });
    cookieMap[userAgent] = map;
};
let flag=false;
// 获取cookie
const getCookie = (userAgent) => {
    let map = cookieMap[userAgent] || {};
    let cookie = '';
    for (let key in map) {
        cookie += `${key}=${map[key]}; `;
    }
    return cookie;
};
const proxyConfig = [
    {
        context: ["/creation"],
        //target: "http://192.168.105.26:8080",
        target: "http://km.dev.cnki.net:8080",
        changeOrigin: true,
        // 监听代理请求，将cookie插入到请求头
        onProxyReq(proxyReq, req, res) {
            proxyReq.setHeader('Cookie', getCookie(req.get('User-Agent')));
        },
        onProxyRes(proxyRes, req, res) {
            if(proxyRes.headers['set-cookie']) {
                setCookie(req.get('User-Agent'), proxyRes.headers['set-cookie']);
                if(flag){
                    flag = false;
                    res.redirect('/');
                }
            }
            if(proxyRes.statusCode === 302) {
                flag = true;
            }
        }
    }, {
    context: ['/foundation', '/Foundation','/pmc','/PMC'],
    target: "http://km.dev.cnki.net",
    changeOrigin: true,
    onProxyRes(proxyRes, req, res) {
      if(proxyRes.statusCode === 302) {
        if(proxyRes.headers['set-cookie']) {
          setCookie(req.get('User-Agent'), proxyRes.headers['set-cookie']);
        }
        proxyRes.headers['Location'] = '/';
      }
    }
   },
];

const proxy = {};

proxyConfig.forEach(config => {
    if (typeof config.context === 'string') {
        proxy[config.context] = config;
    } else if (Array.isArray(config.context)) {
        config.context.forEach(context => {
            proxy[context] = config;
        });
    }
});
const devConfig={
    mode:'development',
    devtool:'cheap-module-eval-source-map',
    devServer:{
        contentBase: path.join(__dirname, '../'),
        open:true,
        hot:true,
        //hotOnly:true,
        proxy,
        index: 'creation.html',
        openPage: loginUrl
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin()
    ]
};
module.exports=merge(commonConfig,devConfig);