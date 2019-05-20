// import Editor from "./editor/index.js";
// // 检验是否浏览器环境
// try {
//     document
// } catch (ex) {
//     throw new Error('请在浏览器环境下运行')
// } 

// // 这里的 `inlinecss` 将被替换成 css 代码的内容，详情可去 ./gulpfile.js 中搜索 `inlinecss` 关键字
// const inlinecss = 'release/css/main.css'

// // 将 css 代码添加到 <style> 中
// let link = document.createElement('link')
// link.type = 'text/css'
// link.rel= "stylesheet"
// link.href= "release/css/main.css"

// document.getElementsByTagName('HEAD').item(0).appendChild(link)


// export default (window.wEditor || Editor)



import $ from "./util/element.js";


export default (window.$ || $)

















