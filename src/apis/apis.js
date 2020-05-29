import instance from './axios'

/* 注册 */
export function signUp(data) {
    return instance.post('/domain/api/auth/local/signup', data)
}

/* 登录 */
export function signIn(data) {
    return instance.post('/domain/api/auth/local', data)
}

/* 添加奥哲日志 */
export function addAuLog(data) {
    return instance.post('/domain/api/authine_logs', data)
}

/* 修改奥哲日志 */
export function patchAuLog(id, data) {
    return instance.patch(`/domain/api/authine_logs/${id}`, data)
}

/* 删除奥哲日志 */
export function deleteAuLog(id) {
    return instance.delete(`/domain/api/authine_logs/${id}`)
}

/* 查询奥哲日志 */
export function getAuLog(options,_filters) {
    return instance.get(`/domain/api/authine_logs?_options=${JSON.stringify(options)}&_filters=${JSON.stringify(_filters
    )}`)
}


