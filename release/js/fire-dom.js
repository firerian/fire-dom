(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.$ = factory());
}(this, function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  // 这个库主要是解决js浏览器中的兼容写法
  if (!document.querySelectorAll) {
    document.querySelectorAll = function (selectors) {
      var style = document.createElement('style'),
          elements = [],
          element;
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

  var f = {
    // 添加元素事件
    event: function event(type, selector, fn) {
      if (selector.addEventListener) {
        selector.addEventListener(type, fn, false);
      } else if (selector.attachEvent) {
        selector.attachEvent('on' + type, fn);
      } else {
        dom['on' + type] = fn;
      }
    },
    // 获取事件对象
    getE: function getE(e) {
      return e || window.e;
    },
    //获取事件的元素对象
    getTarget: function getTarget(e) {
      return this.getE(e).target || this.getE(e).srcElement;
    },
    //获取键盘的键盘值

    /*
    keypress =>返回ascill值 当输入法是中文的时候 不管输入什么都是一样的 229
    keydown =>返回键盘值     当输入法是中文的时候 不管输入什么都是一样的 229
    keyup  =>返回键盘值    当是中文的时候不存在问题
    */
    getKeycode: function getKeycode(e) {
      return this.getE(e).keyCode || this.getE(e).which;
    },
    //阻止默认的元素事件
    preventDefault: function preventDefault(e) {
      var o = this.getE(e);

      if (o.preventDefault) {
        o.preventDefault();
      } else {
        o.returnValue = false;
      }
    },
    //获取dom元素
    createLementByHtml: function createLementByHtml(dom) {
      var div = document.createElement("div");
      div.innerHTML = dom;
      return div.children;
    },
    //查找元素
    querySelectorAll: function querySelectorAll(dom) {
      // 兼容写法
      var result = document.querySelectorAll(dom);

      if (this.isDOMList(result)) {
        return result;
      } else {
        return [result];
      }
    },
    isDOMList: function isDOMList(dom) {
      if (!dom) {
        return false;
      }

      if (dom instanceof HTMLCollection || dom instanceof NodeList) {
        return true;
      }

      return false;
    },
    UA: {
      _ua: navigator.userAgent,
      // 是否 webkit
      isWebkit: function isWebkit() {
        var reg = /webkit/i;
        return reg.test(this._ua);
      },
      // 是否 IE
      isIE: function isIE() {
        return 'ActiveXObject' in window;
      }
    }
  };

  var domFn =
  /*#__PURE__*/
  function () {
    /*
        1,html代码，
        2，id/class
        3,dom 对象
     */
    function domFn(dom) {
      _classCallCheck(this, domFn);

      if (!dom) {
        return false;
      }

      if (dom instanceof domFn) {
        return dom;
      }

      this.dom = dom;
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

      var nodetype = dom.nodeType;
      var selectorResult = [];

      if (nodetype === 9 || nodetype === 1) {
        //当dom= document本身的时候
        selectorResult = [dom];
      } else if (f.isDOMList(dom) || dom instanceof Array) {
        // DOM List 或者数组
        selectorResult = dom;
      } else if (typeof dom === "string") {
        /*
         当以上的选项都不符合的时候 可以考虑参数是不是字符串类型
         如果是那么两种可能：
         1：是不是传入的标签
         2：是不是传入的是class或者id或者tagname
         */
        dom = dom.replace('/\n/mg', '').trim();

        if (dom.indexOf('<') === 0) {
          // 如 <div>
          selectorResult = f.createLementByHtml(dom);
        } else {
          // 如 #id .class
          selectorResult = f.querySelectorAll(dom);
        }
      }

      var length = selectorResult.length;

      if (!length) {
        // 空数组
        return this;
      }

      for (var i = 0; i < length; i++) {
        this[i] = selectorResult[i];
      }

      this.length = length;
    }

    _createClass(domFn, [{
      key: "clone",
      value: function clone(deep) {
        var cloneList = [];
        this.forEach(function (elem) {
          cloneList.push(elem.cloneNode(!!deep));
        });
        return $(cloneList);
      } // 绑定事件

    }, {
      key: "on",
      value: function on(type, selector, fn) {
        // selector 不为空，证明绑定事件要加代理
        if (!fn) {
          fn = selector;
          selector = null;
        } // type 是否有多个


        var types = [];
        types = type.split(/\s+/);
        return this.forEach(function (elem) {
          types.forEach(function (type) {
            if (!type) {
              return;
            } // 记录下，方便后面解绑

            if (!selector) {
              // 无代理
              f.event(type, elem, fn);
              return;
            } // 有代理


            elem.addEventListener(type, function (e) {
              var target = e.target;

              if (target.matches(selector)) {
                fn.call(target, e);
              }
            });
          });
        });
      } // 将该元素插入到某个元素前面

    }, {
      key: "insertBefore",
      value: function insertBefore(selector) {
        var $referenceNode = $(selector);
        var referenceNode = $referenceNode[0];

        if (!referenceNode) {
          return this;
        }

        return this.forEach(function (elem) {
          var parent = referenceNode.parentNode;
          parent.insertBefore(elem, referenceNode);
        });
      } // 将该元素插入到某个元素后面

    }, {
      key: "insertAfter",
      value: function insertAfter(selector) {
        var $referenceNode = $(selector);
        var referenceNode = $referenceNode[0];

        if (!referenceNode) {
          return this;
        }

        return this.forEach(function (elem) {
          var parent = referenceNode.parentNode;

          if (parent.lastChild === referenceNode) {
            // 最后一个元素
            parent.appendChild(elem);
          } else {
            // 不是最后一个元素
            parent.insertBefore(elem, referenceNode.nextSibling);
          }
        });
      } // 获取/设置 属性

    }, {
      key: "attr",
      value: function attr(key, val) {
        if (val == null) {
          // 获取值
          return this[0].getAttribute ? this[0].getAttribute(key) : this[0][key];
        } else {
          // 设置值
          return this.forEach(function (elem) {
            if (elem.setAttribute) {
              elem.setAttribute(key, val);
            } else {
              elem[key] = val;
            }
          });
        }
      }
    }, {
      key: "append",
      value: function append($children) {
        return this.forEach(function (elem) {
          $children.forEach(function (child) {
            elem.appendChild(child);
          });
        });
      } // 添加 class

    }, {
      key: "addClass",
      value: function addClass(className) {
        if (!className) {
          return this;
        }

        return this.forEach(function (elem) {
          var arr;

          if (elem.className) {
            // 解析当前 className 转换为数组
            arr = elem.className.split(/\s/);
            arr = arr.filter(function (item) {
              return !!item.trim();
            }); // 添加 class

            if (arr.indexOf(className) < 0) {
              arr.push(className);
            } // 修改 elem.class


            elem.className = arr.join(' ');
          } else {
            elem.className = className;
          }
        });
      } // parentUntil 找到符合 selector 的父节点

    }, {
      key: "parentUntil",
      value: function parentUntil(selector, _currentElem) {
        var results = document.querySelectorAll(selector);
        var length = results.length;

        if (!length) {
          // 传入的 selector 无效
          return null;
        }

        var elem = _currentElem || this[0];

        if (elem.nodeName === 'BODY') {
          return null;
        }

        var parent = elem.parentElement;
        var i;

        for (i = 0; i < length; i++) {
          if (parent === results[i]) {
            // 找到，并返回
            return $(parent);
          }
        } // 继续查找


        return this.parentUntil(selector, parent);
      } // 取消事件绑定

    }, {
      key: "off",
      value: function off(type, fn) {
        return this.forEach(function (elem) {
          elem.removeEventListener(type, fn);
        });
      }
    }, {
      key: "equal",
      value: function equal($elem) {
        if ($elem.nodeType === 1) {
          return this[0] === $elem;
        } else {
          return this[0] === $elem[0];
        }
      }
    }, {
      key: "isContain",
      value: function isContain($child) {
        var elem = this[0];
        var child = $child[0];
        return elem.contains(child);
      }
      /*
          css方法：
          1.当传入一个css的时候就是获取这个元素的在浏览器中的已经计算好的方法：dom.css("width")=>返回一个值
          2.当传入两个css值的时候就是设置这个元素的浏览器属性   dom.css("height","20px")=>放回的是一个this对象方便链式写法
       */

    }, {
      key: "css",
      value: function css(key, val) {
        if (val == null) {
          var elem = this[0];

          if (typeof elem.currentStyle != 'undefined') {
            //FF
            var style = elem.currentStyle[key];
            return style;
          } else if (typeof window.getComputedStyle != 'undefined') {
            //IE
            var style = window.getComputedStyle(elem, null)[key];
            return style;
          }
        } else {
          var currentStyle = "".concat(key, ":").concat(val, ";");
          return this.forEach(function (elem) {
            var style;

            if (elem.getAttribute) {
              style = (elem.getAttribute('style') || "").trim();
            } else {
              style = (elem["style"] || "").trim();
            }

            var styleArr,
                resultArr = [];

            if (style) {
              // 将 style 按照 ; 拆分为数组
              styleArr = style.split(';');
              styleArr.forEach(function (item) {
                // 对每项样式，按照 : 拆分为 key 和 value
                var arr = item.split(':').map(function (i) {
                  return i.trim();
                });

                if (arr.length === 2) {
                  resultArr.push(arr[0] + ':' + arr[1]);
                }
              }); // 替换或者新增

              resultArr = resultArr.map(function (item) {
                if (item.indexOf(key) === 0) {
                  return currentStyle;
                } else {
                  return item;
                }
              });

              if (resultArr.indexOf(currentStyle) < 0) {
                resultArr.push(currentStyle);
              } // 结果


              if (elem.setAttribute) {
                elem.setAttribute('style', resultArr.join('; '));
              } else {
                elem["style"] = resultArr.join('; ');
              }
            } else {
              if (elem.setAttribute) {
                elem.setAttribute('style', currentStyle);
              } else {
                elem["style"] = currentStyle;
              }
            }
          });
        }
      } // 移除当前节点

    }, {
      key: "remove",
      value: function remove() {
        return this.forEach(function (elem) {
          if (elem.remove) {
            elem.remove();
          } else {
            var parent = elem.parentElement;
            parent && parent.removeChild(elem);
          }
        });
      } // 是否包含某个子节点

    }, {
      key: "isContain",
      value: function isContain($child) {
        var elem = this[0];
        var child = $child[0];
        return elem.contains(child);
      }
    }, {
      key: "get",
      value: function get(index) {
        return this[index];
      } // 尺寸数据

    }, {
      key: "getSizeData",
      value: function getSizeData() {
        var elem = this[0];
        return elem.getBoundingClientRect(); // 可得到 bottom height left right top width 的数据
      } // 封装 nodeName

    }, {
      key: "getNodeName",
      value: function getNodeName() {
        var elem = this[0];
        return elem.nodeName;
      } // 从当前元素查找

    }, {
      key: "find",
      value: function find(selector) {
        var elem = this[0];
        return $(elem.querySelectorAll(selector));
      } // 获取当前元素的 text

    }, {
      key: "text",
      value: function text(val) {
        if (!val) {
          // 获取 text
          var elem = this[0];
          return elem.innerHTML.replace(/<.*?>/g, function () {
            return '';
          });
        } else {
          // 设置 text
          return this.forEach(function (elem) {
            elem.innerHTML = val;
          });
        }
      } // 第一个

    }, {
      key: "first",
      value: function first() {
        return $(this.get(0));
      } // 最后一个

    }, {
      key: "last",
      value: function last() {
        var length = this.length;
        return $(this.get(length - 1));
      } // 获取 html

    }, {
      key: "html",
      value: function html(value) {
        var elem = this[0];

        if (value == null) {
          return elem.innerHTML;
        } else {
          elem.innerHTML = value;
          return this;
        }
      }
    }, {
      key: "children",
      value: function children() {
        var elem = this[0];

        if (!elem) {
          return null;
        }

        return $(elem.children);
      }
    }, {
      key: "parent",
      value: function parent() {
        var elem = this[0];

        if (!elem) {
          return null;
        }

        return $(elem.parentElement);
      } // 类数组，forEach

    }, {
      key: "forEach",
      value: function forEach(fn) {
        var i;

        for (i = 0; i < this.length; i++) {
          var elem = this[i]; // const result = fn.call(elem, elem, i)

          var result = fn.apply(elem, [elem, i]);

          if (result === false) {
            break;
          }
        }

        return this;
      }
    }]);

    return domFn;
  }();

  function $(dom) {
    return new domFn(dom);
  }

  var index = window.$ || $;

  return index;

}));
