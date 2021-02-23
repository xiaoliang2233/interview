(function () {
  'use strict';

  class Cache {
    constructor() {
      this.cached = [];
    }
    setCache(params) {
      if(!this.hasCache(params)) {
        this.cached.push(params);
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
      });
    }
  }
  class Http {
      constructor() {
        this.cache = new Cache();
      }
      request(url, retryTimes, method = 'get', contentType = '', payload = null) {
        let _resolve, _reject;
        const promise = new Promise(((resolve, reject) => {
          _reject = reject;
          _resolve = resolve;
        }));
        function xhr() {
          return new Promise((ok, error) => {
            const xhr = new XMLHttpRequest();
            xhr.timeout = 5000;
            xhr.open(method, url);
            xhr.onreadystatechange = function(){
              if (xhr.readyState === 4) {
                if (xhr.status === 200 ) {
                  ok(xhr.responseText);
                } else {
                  error(xhr.statusText);
                }
              }
            };
            xhr.onerror = function (event) {
              error(event);
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
              _reject(err);
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
          };
          if (this.cache.hasCache(cache)) {
             return this.cache.getCache(cache)
          } else {
            const promise = this.request(url, retryTimes);
            this.cache.setCache({
              ...cache,
              promise
            });
            return promise.catch(err => {
              this.cache.deleteCache(cache);
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
        };
        if(this.cache.hasCache(cache)) {
          return this.cache.getCache(cache)
        }
        const promise = this.request(url, retryTimes, 'post', contentType, payload);
        this.cache.setCache({
          ...cache,
          promise
        });
        return promise.catch(err => {
          this.cache.deleteCache(cache);
          throw err; // 业务模块catch
        });
      }
  }

  var http = new Http();

  function test() {
    /** 一段时间内只会有一个xhr在执行 */
    for(let i = 0; i <= 10; i++) {
      // 请求一次
      http.get('/normal').then(_ => {
        console.log("宝琴's log：/normal", i);
      });
      // 报错后再一次请求三次
      http.get('/netWorkError', 3).catch(_ => {
        console.log("宝琴's log：/netWorkError", i);
      });
      // 请求一次
      http.get('/serverError').catch(_ => {
        console.log("宝琴's log：/serverError", i);
      });
    }
    setTimeout(() => {
      // 再请求一次
      http.get('/serverError').catch(() => {});
    }, 5000);

    const payload = new FormData();
    payload.append('for', 'bar');
    payload.append('lorem', 'lorem');
    for (let i = 0; i < 2; i++) {
      // 请求一次
      http.post('/post-form-data', payload, 'multipart/form-data', 4);

      // 请求一次
      http.post('/post-x-www-form-urlencoded',
        'foo=bar&lorem=ipsum',
        'application/x-www-form-urlencoded',
        4);

      // 请求一次
      http.post('/post-json',
        JSON.stringify({foo: 'bar', lorem: 'lorem'}),
        'application/json',
        4);
    }
  }

  const find = function(origin) {
      if(this === undefined || this.constructor !== find) {
          return new find(origin)
      }
      this.origin = origin;
      this.result = null;
      return this;
  };
  find.prototype.where = function (condition) {
      Object.keys(condition).forEach(key => {
          if(!this.result) {
              this.result = this.origin.filter(item => {
                  return condition[key].exec(item[key])
              });
          } else {
              this.result = this.result.filter(item => {
                  return condition[key].exec(item[key])
              });
          }
      });
      return this;
  };
  find.prototype.orderBy = function (key, type) {
      switch (type) {
          case 'desc': {
              this.result.sort((a, b) => b[key] - a[key]);
              break;
          }
          case 'asc': {
              this.result.sort((a, b) => a[key] - b[key]);
              break;
          }
      }
      return this.result;
  };

  test();

  const data = [
    {userId: 8, title: 'title1'},
    {userId: 11, title: 'other'},
    {userId: 15, title: null},
    {userId: 19, title: 'title2'}
  ];
  const result = find(data).where({
    'title': /\d$/
  }).orderBy('userId', 'desc');
  console.log(result);// [{ userId: 19, title: 'title2'}, { userId: 8, title: 'title1' }];

}());
