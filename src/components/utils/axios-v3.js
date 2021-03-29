import axios from 'axios';
import { Message as elMessage, MessageBox } from 'element-ui';
// 是否服务端渲染
const isServer = typeof window === 'undefined';
// 是否生产环境
const isProduction = process.env.NODE_ENV === 'production';
// 是否uat接口
const isUatUrl = url => url.indexOf('uat-') > -1;
// 是否内网接口
const isIntranetUrl = url => url.indexOf('.bilibili.co') > -1;
// 协议
const protocol = isServer ? `http:` : (window.location.protocol || 'https:');
// 是否后台url
const isMng = url => /(-mng|manager).bilibili.co/.test(url);

// const NETWORKERROR = 'Network Error';

const service = axios.create({
    timeout: 10000
});

function paramsToKvp(params) {
    if (params && typeof params === 'object') {
        let temp = [];
        for (let k in params) {
            if (params.hasOwnProperty(k) && params[k] !== undefined) {
                let value = typeof params[k] === 'object' ? JSON.stringify(params[k]) : params[k];
                temp.push(`${k}=${encodeURIComponent(value)}`);
            }
        }
        return temp.join('&');
    }
    return '';
}

const dealWithUrl = (url) => {
    if (isIntranetUrl(url)) {
        if (isMng && !isServer && !isProduction && !isUatUrl(url)) {
            url = url.replace('bangumi-mng', 'uat-bangumi-mng');
            url = url.replace('manager.bilibili.co', 'uat-manager.bilibili.co');
        }
        if (/^http(s)?:/.test(url)) {
            return url;
        } else if (url.indexOf('//') === 0) {
            return `${protocol}${url}`;
        } else {
            return `${protocol}//${url}`;
        }
    } else {
        return `${protocol}//api.bilibili.com/${url}`;
    }
};
let $Loading;
let errorTips;
let noResHeaders;
let getWholeRes;
let showLoginModal = false;
service.interceptors.request.use(
    (config = {}) => {
        !$Loading && ($Loading = document.getElementById('seiya-loading'));
        errorTips = true;
        getWholeRes = false;
        noResHeaders = true;
        let { method = 'GET', params, url, timeout = 10000, wholeRes = false, headers, cookies, loading, noErrTip, addResHeaders, include } = config;
        try {
            if (loading) {
                if ($Loading) {
                    $Loading.style.display = 'block';
                }
                delete config.loading;
            }
            if (noErrTip) {
                errorTips = false;
                delete config.noErrTip;
            }
            if (wholeRes) {
                getWholeRes = true;
            }
            if (addResHeaders) {
                noResHeaders = false;
                delete config.addResHeaders;
            }
        } catch (error) { console.log(error); };
        if (url) config.url = dealWithUrl(url);
        if (include || cookies || (method && method.toUpperCase() === 'GET' && include !== false)) config['withCredentials'] = true;
        if (timeout) config.timeout = timeout;
        if (cookies) config.headers = Object.assign(headers || {}, { cookies });
        if (method.toUpperCase().indexOf('POST') > -1) {
            if (method.toUpperCase() === 'MNG-POST') {
                config.headers['content-type'] = 'application/json;charset=UTF-8';
                config.method = 'POST';
                config.data = params;
            } else {
                config.headers['content-type'] = 'application/x-www-form-urlencoded';
                config.data = (params instanceof window.FormData) ? params : paramsToKvp(params || {});
            }
            delete config.params;
        }
        return config;
    },
    error => {
        if ($Loading) {
            $Loading.style.display = 'none';
        }
        errorTips && elMessage({
            message: error || `<h3>请求出错啦, ⚆ _ ⚆…</h3>`,
            type: 'error',
            duration: 5 * 1000
        });
        // 对请求错误做些什么
        window.__irisReporter__ && window.__irisReporter__.reportInterface(error);
        return Promise.reject(error);
    }
);

// 添加响应拦截器
service.interceptors.response.use(
    (res) => {
        let { data: { code, message }, data, headers } = res;
        if ($Loading) {
            $Loading.style.display = 'none';
        }
        // try {
        //     window.__irisReporter__ && window.__irisReporter__.reportInterface(res);
        // } catch (err) {
        //     console.log(err);
        // }
        // -401 和 -403均为跳转登陆
        if ([-401].includes(code)) {
            if (!showLoginModal) {
                showLoginModal = true;
                MessageBox.confirm('尚未登录，是否跳转到登录页进行登录？', '确定登出', {
                    confirmButtonText: '去登录',
                    cancelButtonText: '等一下',
                    type: 'warning'
                }).then(() => {
                    window.location.href = `//dashboard-mng.bilibili.co/login.html?caller=${isProduction ? 'bangumi-mng' : 'uat-bangumi-mng'}`;
                }).catch(() => {
                    elMessage({
                        message: '尚未登录，功能无法使用，请点击右上角登录按钮去登录',
                        type: 'warning',
                        showClose: true,
                        duration: 5 * 1000
                    });
                    showLoginModal = false;
                });
            }
        } else if (code !== 0 && errorTips) {
            elMessage({
                message: message || `<h3>请求出错啦, ⚆ _ ⚆…</h3>`,
                type: 'warning',
                showClose: true,
                duration: 5 * 1000
            });
        }
        data = noResHeaders ? data : Object.assign(data, { headers });
        if (getWholeRes) {
            return res;
        } else {
            return data;
        }
    },
    (errMsg) => {
        if ($Loading) {
            $Loading.style.display = 'none';
        }
        if (errorTips) {
            elMessage({
                message: errMsg || `<h3>请求出错啦, ⚆ _ ⚆…</h3>`,
                type: 'error',
                duration: 5 * 1000
            });
        }
        window.__irisReporter__ && window.__irisReporter__.reportInterface(errMsg);
        // 对响应错误做点什么
        return Promise.reject(new Error({ status: 404, msg: errMsg }));
    }
);

export default service;
