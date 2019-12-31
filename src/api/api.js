import {parseRequest} from "../services";
const EVN = window.ENV || 'dev'

const testHost = 'https://esuite.jd.com/'
const proHost = 'https://esuite.jd.com/'

const ROOT =  EVN =='dev' ? testHost : proHost


// 获取token
const tokenRequest = parseRequest({
    url: `${ROOT}login/api/erp`,
    method: 'POST'
})

function getToken() {

    return new Promise((resolve, reject) => {
        tokenRequest({}).then(newToken => {
            resolve(newToken)
        }).catch(err => {
            reject(err)
        })
    })
}



function __ensureToken(option) {
    const realRequest = parseRequest(option)

    if (!option.headers) {
        option.headers = {}
    }
    return p => {
        return getToken().then(token => {
            option.headers['token'] = token
            return realRequest(p)
        })
    }
}

export const erpCheck = parseRequest({
    url: `${ROOT}login/api/erp`,
    method: 'POST',
    loading: true
})

/**
 * 组织号关注列表 - 用户已经关注的列表
 * siteId 100216
 * channelId 1002161
 * erp
 * type 1:关注   2:全部  ??
 */
export const orgFollowList = __ensureToken({
    url: `${ROOT}/news/api/v1/news/follow/list`,
    method: 'GET',
    loading: true,
})

/**
 * 组织号列表
 * siteId 100216
 * channelId 1002161
 */
export const orgAllList = __ensureToken({
    url: `${ROOT}/news/api/v1/news/channel/list`,
    loading: true,
    method: 'POST'
})



