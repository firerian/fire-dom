import f from "../lib/exterior.js";
// 记录所有的事件绑定
// 
// 
// 
const eventList = []
class domFn{
    /*
        1,html代码，
        2，id/class
        3,dom 对象
     */
    constructor(dom){
        if(!dom){
            return false;
        }    
        if(dom instanceof domFn){
            return dom
        }
        this.dom = dom 
        /* *************************
         *
         * nodeType                                    value            meanning
            Node.ELEMENT_NODE                            1            Element    代表元素
            Node.ATTRIBUTE_NODE                        2            Attr    代表属性
            Node.TEXT_NODE                            3            Text    代表元素或属性中的文本内容
            Node.CDATA_SECTION_NODE                    4            CDATASection    代表文档中的 CDATA 部（不会由解析器解析的文本）
            Node.ENTITY_REFERENCE_NODE                5            EntityReference    代表实体引用
            Node.ENTITY_NODE                        6            Entity    代表实体
            Node.PROCESSING_INSTRUCTION_NODE        7            ProcessingInstruction    代表处理指令
            Node.COMMENT_NODE                        8            Comment    代表注释
            Node.DOCUMENT_NODE                        9            Document    代表整个文档（DOM 树的根节点）
            Node.DOCUMENT_TYPE_NODE                    10            DocumentType    向为文档定义的实体提供接口
            Node.DOCUMENT_FRAGMENT_NODE                11            DocumentFragment    代表轻量级的 Document 对象（文档的某个部分）
            Node.NOTATION_NODE                        12            Notation    代表 DTD 中声明的符号
         **************************************************************************************************
         */
        const nodetype = dom.nodeType
        let selectorResult = []
        if (nodetype === 9 ||nodetype === 1 ){//当dom= document本身的时候
            selectorResult = [dom]
        }else if(f.isDOMList(dom) || dom instanceof Array){
            // DOM List 或者数组
            selectorResult = dom
        }else if(typeof dom === "string"){  
            /*
             当以上的选项都不符合的时候 可以考虑参数是不是字符串类型
             如果是那么两种可能：
             1：是不是传入的标签
             2：是不是传入的是class或者id或者tagname
             */
            dom = dom.replace('/\n/mg', '').trim()
            if (dom.indexOf('<') === 0) {
                // 如 <div>
                selectorResult = f.createLementByHtml(dom)
            } else {
                // 如 #id .class
                selectorResult = f.querySelectorAll(dom)
            }
        }
        const length = selectorResult.length
         if (!length) {
            // 空数组
            return this
        }
        for ( let i = 0; i < length; i++) {
            this[i] = selectorResult[i]
        }
        this.length = length
    }
    clone(deep){
        const cloneList = []
        this.forEach(elem => {
            cloneList.push(elem.cloneNode(!!deep))
        })
        return $(cloneList)
    }
    // 绑定事件
    on(type, selector,fn){
        // selector 不为空，证明绑定事件要加代理
        if (!fn) {
            fn = selector
            selector = null
        }
        // type 是否有多个
        let types = []
        types = type.split(/\s+/)
        return this.forEach(elem => {
            types.forEach(type => {
                if (!type) {
                    return
                }
                // 记录下，方便后面解绑
                eventList.push({
                    elem: elem,
                    type: type,
                    fn: fn
                })
                if (!selector) {
                    // 无代理
                    f.event(type,elem,fn)
                    return
                }
                // 有代理
                elem.addEventListener(type, e => {
                    const target = e.target
                    if (target.matches(selector)) {
                        fn.call(target, e)
                    }
                })
            })
        })
    }

     // 将该元素插入到某个元素前面
    insertBefore(selector) {
        const $referenceNode = $(selector)
        const referenceNode = $referenceNode[0]
        if (!referenceNode) {
            return this
        }
        return this.forEach(elem => {
            const parent = referenceNode.parentNode
            parent.insertBefore(elem, referenceNode)
        })
    }

    // 将该元素插入到某个元素后面
    insertAfter(selector) {
        const $referenceNode = $(selector)
        const referenceNode = $referenceNode[0]
        if (!referenceNode) {
            return this
        }
        return this.forEach(elem => {
            const parent = referenceNode.parentNode
            if (parent.lastChild === referenceNode) {
                // 最后一个元素
                parent.appendChild(elem)
            } else {
                // 不是最后一个元素
                parent.insertBefore(elem, referenceNode.nextSibling)
            }
        })
    }

    // 获取/设置 属性
    attr(key, val){
        if (val == null) {
            // 获取值
            return this[0].getAttribute?this[0].getAttribute(key):this[0][key]
        } else {
            // 设置值
            return this.forEach(elem => {
                if(elem.setAttribute){
                    elem.setAttribute(key, val)
                }else{
                     elem[key] = val
                }
            })
        }
    }
    
    append($children){
        return this.forEach(elem =>{
                $children.forEach(child => {
                    elem.appendChild(child)
                })
        })
    }
    // 添加 class
    addClass(className){
        if (!className) {
            return this
        }
        return this.forEach(elem => {
            let arr
            if (elem.className) {
                // 解析当前 className 转换为数组
                arr = elem.className.split(/\s/)
                arr = arr.filter(item => {
                    return !!item.trim()
                })
                // 添加 class
                if (arr.indexOf(className) < 0) {
                    arr.push(className)
                }
                // 修改 elem.class
                elem.className = arr.join(' ')
            } else {
                elem.className = className
            }
        })
    }

     // parentUntil 找到符合 selector 的父节点
    parentUntil(selector, _currentElem) {
        const results = document.querySelectorAll(selector)
        const length = results.length
        if (!length) {
            // 传入的 selector 无效
            return null
        }

        const elem = _currentElem || this[0]
        if (elem.nodeName === 'BODY') {
            return null
        }

        const parent = elem.parentElement
        let i
        for (i = 0; i < length; i++) {
            if (parent === results[i]) {
                // 找到，并返回
                return $(parent)
            }
        }

        // 继续查找
        return this.parentUntil(selector, parent)
    }

     // 取消事件绑定
    off(type, fn){
        return this.forEach(elem => {
            elem.removeEventListener(type, fn)
        })
    }

    equal($elem){
        if ($elem.nodeType === 1) {
            return this[0] === $elem
        } else {
            return this[0] === $elem[0]
        }
    }

    isContain($child){
        const elem = this[0]
        const child = $child[0]
        return elem.contains(child)
    }

    /*
        css方法：
        1.当传入一个css的时候就是获取这个元素的在浏览器中的已经计算好的方法：dom.css("width")=>返回一个值
        2.当传入两个css值的时候就是设置这个元素的浏览器属性   dom.css("height","20px")=>放回的是一个this对象方便链式写法
     */
    
     css(key,val){

         if (val == null){
              const elem = this[0]
              if(typeof elem.currentStyle!='undefined') {//FF
                      var style= elem.currentStyle[key];
                      return style
             }else if(typeof window.getComputedStyle!='undefined') {//IE
                      var style = window.getComputedStyle(elem, null)[key];
                       return style
             }

         }else{
             const currentStyle = `${key}:${val};`
             return this.forEach(elem => {
                     let style ;
                     if(elem.getAttribute){
                         style = (elem.getAttribute('style')||"").trim();
                     }else{
                        style = (elem["style"]||"").trim();
                     }
                        
                   
                    let styleArr, resultArr = []
                    if (style) {
                        // 将 style 按照 ; 拆分为数组
                        styleArr = style.split(';')
                        styleArr.forEach(item => {
                            // 对每项样式，按照 : 拆分为 key 和 value
                            let arr = item.split(':').map(i => {
                                return i.trim()
                            })
                            if (arr.length === 2) {
                                resultArr.push(arr[0] + ':' + arr[1])
                            }
                        })
                        // 替换或者新增
                        resultArr = resultArr.map(item => {
                            if (item.indexOf(key) === 0) {
                                return currentStyle
                            } else {
                                return item
                            }
                        })
                        if (resultArr.indexOf(currentStyle) < 0) {
                            resultArr.push(currentStyle)
                        }
                        // 结果
                        if( elem.setAttribute){
                             elem.setAttribute('style', resultArr.join('; '))
                         }else{
                             elem["style"] = resultArr.join('; ')
                         }
                       
                    } else {
                        if( elem.setAttribute){
                             elem.setAttribute('style', currentStyle)
                         }else{
                             elem["style"] = currentStyle
                         }
                    }
                })
         }
     }
     // 移除当前节点
    remove(){
        return this.forEach(elem => {
            if (elem.remove) {
                elem.remove()
            } else {
                const parent = elem.parentElement
                parent && parent.removeChild(elem)
            }
        })
    }

    // 是否包含某个子节点
    isContain($child) {
        const elem = this[0]
        const child = $child[0]
        return elem.contains(child)
    }

    get(index){
        return this[index]

    }

    // 尺寸数据
    getSizeData(){
        const elem = this[0]
        return elem.getBoundingClientRect()  // 可得到 bottom height left right top width 的数据
    }

    // 封装 nodeName
    getNodeName(){
        const elem = this[0]
        return elem.nodeName
    }

    // 从当前元素查找
    find(selector) {
        const elem = this[0]
        return $(elem.querySelectorAll(selector))
    }

    // 获取当前元素的 text
    text(val) {
        if (!val) {
            // 获取 text
            const elem = this[0]
            return elem.innerHTML.replace(/<.*?>/g, () => '')
        } else {
            // 设置 text
            return this.forEach(elem => {
                elem.innerHTML = val
            })
        }
    }
    // 第一个
    first(){
        return $(this.get(0))
    }

    // 最后一个
    last(){
        const length = this.length
        return $(this.get(length - 1))
    }

    // 获取 html
    html(value) {
        const elem = this[0]
        if (value == null) {
            return elem.innerHTML
        } else {
            elem.innerHTML = value
            return this
        }
    }
    children() {
        const elem = this[0]
        if (!elem) {
            return null
        }

        return $(elem.children)
    }
    parent(){
        const elem = this[0]
        if(!elem){
            return null
        }
        return $(elem.parentElement)
    }
    // 类数组，forEach
    forEach(fn){
        let i
        for (i = 0; i < this.length; i++) {
            const elem = this[i]
            // const result = fn.call(elem, elem, i)
            const result = fn.apply(elem, [elem, i])
            if (result === false) {
                break
            }
        }
        return this
    }
}
function $(dom) {
    return new domFn(dom)
}

export default $
