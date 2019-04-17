import axios from 'axios';
import qs from 'qs';
import { Loading } from 'element-ui';
import Cookies from 'js-cookie';
let loading;
axios.defaults.baseURL = process.env.BASE_API;
function startLoading() {
  loading = Loading.service({
    lock: true,
    text: '请稍后',
    spinner: 'el-icon-loading',
    background: 'rgba(255, 255, 255, .9)'
  });
}
let needLoadingRequestCount = 0;

export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) {
    return
  }
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}
function endLoading() {
  loading.close()
}
axios.interceptors.request.use(
  config => {
    // config.data = qs.stringify(config.data); 可以在这里进行序列化
    config.headers['Authorization'] = Cookies.get('access_token');
    showFullScreenLoading();
    return config;
  },
  error => {
    return Promise.reject(error);
  });

axios.interceptors.response.use(
  response => {
    tryHideFullScreenLoading();
    return response;
  },
  error => {
    return Promise.reject(error)
  });
const ajax = {
  get: function (url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.get(url, {params: params})
        .then( (response) => {
          if(response.data.code){
            resolve(response.data);
          } else {
            resolve(response.data);
          }
        })
        .catch( (error) => {
          this.$get( 'error/error',{api_url: url, send_data: params,http_options: 1});
          reject(error)
        })
    })
  },
  post: function (url, data = {}) {
    return new Promise((resolve, reject) => {
      axios.post(url, qs.stringify(data))
        .then( (response) => {
          if(response.data.code){
            resolve(response.data);
          } else {
            resolve(response.data)
          }
        })
        .catch( (error) => {
          this.$get( 'error/error',{api_url: url, send_data: data,http_options: 2})
            .then( (data) => {
            })
            .catch(() => {
            });
          reject(error)
        })
    })
  },
  delete: function (url, data = {}) {
    return new Promise((resolve, reject) => {
      axios.delete(url, qs.stringify(data))
        .then((response) => {
          if (response.data.code) {
            resolve(response.data);
          } else {
            resolve(response.data);
          }
        })
        .catch((error) => {
          this.$get( 'error/error',{api_url: url, send_data: data, http_options: 3})
            .then( (data) => {
            })
            .catch(() => {
            });
          reject(error)
        })
    })
  },
  put: function (url, data = {}) {
    return new Promise((resolve, reject) => {
      axios.put(url, qs.stringify(data),{method: 'get'})
        .then( (response) => {
          if (response.data.code) {
            resolve(response.data);
          } else {
            resolve(response.data);
          }
        })
        .catch( (error) => {
          this.$get( 'error/error',{api_url: url, send_data: data, http_options: 4})
            .then( (data) => {
            })
            .catch(() => {
            });
          reject(error)
        })
    })
  },
  patch: function (url, data = {}) {
    return new Promise((resolve, reject) => {
      axios.patch(url, qs.stringify(data))
        .then((response) => {
          if(response.data.code){
            resolve(response.data);
          } else {
            resolve(response.data)
          }
        })
        .catch((error) => {
          this.$get( 'error/error',{api_url: url, send_data: data,http_options: 5})
            .then( (data) => {
            })
            .catch(() => {
            });
          reject(error)
        })
    })
  },
};
export default ajax;
