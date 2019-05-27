// 这个库主要是解决js浏览器中的兼容写法
if (!document.querySelectorAll) {
    document.querySelectorAll = function (selectors) {
        var style = document.createElement('style'), elements = [], element;
        document.documentElement.firstChild.appendChild(style);
        document._qsa = [];
        style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
        window.scrollBy(0, 0);
        style.parentNode.removeChild(style);
        while (document._qsa.length) {
            element = document._qsa.shift();
            element.style.removeAttribute('x-qsa');
            elements.push(element);
        }
        document._qsa = null;
        return elements;
    };
}
let f = {
	// 添加元素事件
	event(type,selector,fn){

		if(selector.addEventListener){
			selector.addEventListener(type,fn,false)

		}else if(selector.attachEvent){
			selector.attachEvent('on'+type,fn)
		}else{
			dom['on'+type] = fn
		}
	},
	// 获取事件对象
	getE(e){
		return e || window.e
	},
	//获取事件的元素对象
	getTarget(e){
		return this.getE(e).target || this.getE(e).srcElement;
	},
	//获取键盘的键盘值
	/*
	keypress =>返回ascill值 当输入法是中文的时候 不管输入什么都是一样的 229
	keydown =>返回键盘值     当输入法是中文的时候 不管输入什么都是一样的 229
	keyup  =>返回键盘值    当是中文的时候不存在问题
	*/
	getKeycode(e){
		return this.getE(e).keyCode ||this.getE(e).which
	},
	//阻止默认的元素事件
	preventDefault(e){
		let o = this.getE(e);
		if(o.preventDefault){
			o.preventDefault();
		}else{
			o.returnValue = false;
		}
	},
	//获取dom元素
	createLementByHtml(dom){
		let div = document.createElement("div")
		div.innerHTML = dom
		return div.children
	},
	//查找元素
	querySelectorAll(dom){
		// 兼容写法
	    const result = document.querySelectorAll(dom)
	    if (this.isDOMList(result)) {
	        return result
	    } else {
	        return [result]
	    }
	},

	isDOMList(dom){
		if (!dom) {
	        return false
	    }
	    if (dom instanceof HTMLCollection || dom instanceof NodeList) {
	        return true
	    }
	    return false
	},

	UA:{
	    _ua: navigator.userAgent,

	    // 是否 webkit
	    isWebkit: function () {
	        const reg = /webkit/i
	        return reg.test(this._ua)
	    },

	    // 是否 IE
	    isIE: function () {
	        return 'ActiveXObject' in window
	    }
	}

};



export default f;