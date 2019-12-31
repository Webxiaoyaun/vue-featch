import {request, renderTemplate} from './request'

let DEBUG = false

const requestListeners = {
    // 请求前
    willRequest: [],

    // 请求结束， 不管是否报错
    requested: [],

    // 报错
    error: []
}

function __parseResponse(apiOption, data) {
    return new Promise((resolve, reject) => {
        let resolveData = data

        if (typeof apiOption.parseResponse === 'function') {
            resolveData = apiOption.parseResponse(data)
        }

        resolve(resolveData)
    })
}

function __parseParam(p, apiOption) {
    return new Promise((resolve, reject) => {
        if (typeof apiOption.parseParam === 'function') {
            resolve(apiOption.parseParam(p))
        } else {
            resolve(p)
        }
    })
}

function getCookieValue(name) {
    let arr
    const reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");

    if(arr=document.cookie.match(reg)) {
        return unescape(arr[2])
    }

    return null;
}

function __parseOption(apiOption, param) {
    const {headers, ...requestOption} = apiOption

    let newHeaders = headers
    if (typeof headers === 'function') {
        newHeaders = headers(param, apiOption)
    }

    let jdMeCookieHeader = {
        'third-name': getCookieValue('third_name'),
        'third-safetyToken': getCookieValue('third_safetyToken'),
        'third-token': getCookieValue('third_token'),
        'third-timestamp': getCookieValue('third_timestamp'),
    }

    return p => {
        let op = {
            body: p,
            headers: newHeaders,
            ...requestOption
        }

        if (op.headers) {
            op.headers = {
                ...op.headers,
                ...jdMeCookieHeader
            }
        } else {
            op.headers = jdMeCookieHeader
        }

        return Promise.resolve(op)
    }
}

function __request(apiOption, p) {
    return op => {
        const url = renderTemplate(apiOption.url, p)

        __handleWillRequest(apiOption)

        return request(url, op)
    }
}

function __response(apiOption) {
    return res => {
        if (apiOption.useOriginResponseData) {
            return __parseResponse(apiOption, res)
        } else {
            if (res && res.code == 200) {
                return __parseResponse(apiOption, res.data)
            } else {
                return Promise.reject(res)
            }
        }
    }
}

function __handleEvent(eventName, ...args) {
    requestListeners[eventName].forEach(fun => {
        fun(...args)
    })
}

function __handleError(err) {
    __handleEvent('error', err)
}

function __handleWillRequest(...args) {
    __handleEvent('willRequest', ...args)
}

function __handleRequested(...args) {
    __handleEvent('requested', ...args)
}

export function parseRequest(apiOption) {
    return (p) => {
        // 解析传参
        let promise = __parseParam(p, apiOption)

        // DEBUG模式下，使用mock数据
        if ((DEBUG || apiOption.debug) && apiOption.mock) {
            // debug模式下， 使用mock数据模拟数据
            __handleWillRequest(apiOption)

            promise = promise.then(() => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        const data = apiOption.mock
                        if (typeof data === 'function') {
                            resolve(data(p))
                        } else {
                            resolve(data)
                        }
                    }, 1000)
                })
            })
        } else {
            // 解析请求选项
            promise = promise.then(__parseOption(apiOption, p))

            // 开始发送请求
                .then(__request(apiOption, p))
        }

        // 响应请求
        promise = promise.then(__response(apiOption))

        // 请求出错
        promise.catch(err => !apiOption.noErrorTip && __handleError(err))

        // 请求结束
            .finally(() => __handleRequested(apiOption))

        return promise
    }
}

export function on(eventName, fun) {
    requestListeners[eventName].push(fun)
}

export function setDebug(b) {
    DEBUG = !!b
}