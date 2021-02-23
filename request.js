class Cache {
  constructor() {
    this.cached = []
  }
  setCache(params) {
    if(!this.hasCache(params)) {
      this.cached.push(params)
    }
  }
  isTheSame(cache, params) {
    return cache.url === params.url
      && cache.method === params.method
      && cache.payload === params.payload
      && cache.contentType === params.contentType
  }
  hasCache(params) {
    return this.cached.findIndex(cache => {
      return this.isTheSame(cache, params)
    }) !== -1;
  }
  getCache(params) {
    return this.cached.find(cache => {
      return this.isTheSame(cache, params)
    }).promise;
  }
  deleteCache(params) {
    this.cached = this.cached.filter(cache => {
      return !this.isTheSame(cache, params)
    })
  }
}
class Http {
    constructor() {
      this.cache = new Cache()
    }
    request(url, retryTimes, method = 'get', contentType = '', payload = null) {
      let _resolve, _reject;
      const promise = new Promise(((resolve, reject) => {
        _reject = reject;
        _resolve = resolve;
      }))
      function xhr() {
        return new Promise((ok, error) => {
          const xhr = new XMLHttpRequest()
          xhr.timeout = 5000;
          xhr.open(method, url)
          xhr.onreadystatechange = function(){
            if (xhr.readyState === 4) {
              if (xhr.status === 200 ) {
                ok(xhr.responseText)
              } else {
                error(xhr.statusText)
              }
            }
          };
          xhr.onerror = function (event) {
            error(event)
          } ;
          if(contentType) {
            xhr.setRequestHeader("Content-type", contentType);
          }
          xhr.send(payload);
        }).then(res => {
          _resolve(res);
        }).catch(err => {
          if(retryTimes) {
            retryTimes--;
            return xhr()
          } else {
            _reject(err)
          }
        })
      }
      xhr();
      return promise;
    }
    async get(url, retryTimes = 0) {
        const cache = {
          url,
          method: 'get',
          payload: '',
          contentType: ''
        }
        if (this.cache.hasCache(cache)) {
           return this.cache.getCache(cache)
        } else {
          const promise = this.request(url, retryTimes);
          this.cache.setCache({
            ...cache,
            promise
          })
          return promise.catch(err => {
            this.cache.deleteCache(cache)
            throw err; // 业务模块catch
          });
        }
    }
    post(url, payload, contentType, retryTimes = 0) {
      const cache = {
        url,
        method: 'post',
        payload,
        contentType
      }
      if(this.cache.hasCache(cache)) {
        return this.cache.getCache(cache)
      }
      const promise = this.request(url, retryTimes, 'post', contentType, payload);
      this.cache.setCache({
        ...cache,
        promise
      })
      return promise.catch(err => {
        this.cache.deleteCache(cache)
        throw err; // 业务模块catch
      });
    }
}

export default new Http();
