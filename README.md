## 面试题目实现

第一题的实现在 find.js里

第二题的实现在request.js里

第三题 的实现在pipeline.jsx里面。

### 测试

因为第二题需要服务器来辅助测试，所以额外增加了一个Koa服务器server.js

另外要求声明周期内唯一，按照平时习惯不会全局挂载，所以使用了es module的方式导出。故多出了rollup打包了js的这一步。

### 验收
需要启动一个服务器，前两题会打印在控制台。最后一题展示在页面上。
```
npm install
npm run dev
```

