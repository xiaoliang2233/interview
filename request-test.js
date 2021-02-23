import http from './request';

export default function test() {
  /** 一段时间内只会有一个xhr在执行 */
  for(let i = 0; i <= 10; i++) {
    // 请求一次
    http.get('/normal').then(_ => {
      console.log("宝琴's log：/normal", i);
    })
    // 报错后再一次请求三次
    http.get('/netWorkError', 3).catch(_ => {
      console.log("宝琴's log：/netWorkError", i);
    })
    // 请求一次
    http.get('/serverError').catch(_ => {
      console.log("宝琴's log：/serverError", i);
    })
  }
  setTimeout(() => {
    // 再请求一次
    http.get('/serverError').catch(() => {})
  }, 5000)

  const payload = new FormData()
  payload.append('for', 'bar')
  payload.append('lorem', 'lorem')
  for (let i = 0; i < 2; i++) {
    // 请求一次
    http.post('/post-form-data', payload, 'multipart/form-data', 4)

    // 请求一次
    http.post('/post-x-www-form-urlencoded',
      'foo=bar&lorem=ipsum',
      'application/x-www-form-urlencoded',
      4)

    // 请求一次
    http.post('/post-json',
      JSON.stringify({foo: 'bar', lorem: 'lorem'}),
      'application/json',
      4)
  }
}
