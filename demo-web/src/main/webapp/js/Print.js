/*
 * 说明：
 * 
 * 此脚本用于分页，请将引用此脚本的 script 标签放在所有 script 标签的后面，
 * 
 * 应用须知：
 * 
 * 引用此脚本的 HTML 页面的 DOCTYPE 建议采用 XHTML 1.0，
 * 
 * 将所有需要打印的内容拆分成最小打印块(块内的内容是相互关联，表格除外)，
 * 
 * 打印块的上下补丁请设置为0mm(包括表格)，
 * 
 * 需要从新的一页开始打印的块，请添加 page='page' 属性，
 * 
 * 包含需要重复显示的报表标题的块的必须添加 pagetitle='pagetitle'，样式中并且不能包含height属性，
 * 
 * 表格的表头必须放入 thead 块中，表尾必须放入 tfoot 块中，可以有多个 tbody 块，
 * 
 * 表头和表尾每一列的宽度必须明确给出，否则可能会出现列无法对齐的现象，
 * 
 * 不可拆分的表格，请在此表格的 table 标签中添加 block='block' 属性，
 * 
 * 请定义 _config_ 变量(JSON)，包含打印纸张的高度，单位毫米(mm)，默认是A纸张(高297mm)和上下边距(与打印设置相同),默认是19.1mm，
 * 
 * 绘制报表时请给定报表的具体宽度，不要用百分比，报表宽度 <= 向下取整(纸张宽度 - 左右边距)，单位：毫米(mm)，
 * 
 * 脚本中提供了两个方法，print(打印)和printSetting(打印设置，只对IE起作用)。
 * 
 */

/*
 * 纸张类型
 * 单位：毫米(mm)
 * 方向：纵向['宽', '高']
 * 
 */
var PageSize = {
	A0 : [840, 1188],
	A1 : [594, 839],
	A2 : [420, 594],
	A3 : [297, 420],
	A4 : [210, 297],
	A5 : [148, 210],
	A6 : [105, 149],
	A7 : [74, 105],
	A8 : [52, 74],
	A9 : [37, 52],
	A10 : [26, 37],
	B0 : [1000, 1414],
	B1 : [707, 1000],
	B2 : [500, 707],
	B3 : [353, 500],
	B4 : [250, 354],
	B5 : [182, 257],
	LETTER : [216, 279],
	NOTE : [191, 254],
	LEGAL : [216, 356],
	LEDGER : [279, 432],
	get : function(key) {
		return this[key.toUpperCase()];
	}
};
if(!_config_) {
	var _config_ = {
		pageSize	: "A4",
		orientation	: "P", // p = "Portrait"(纵向) L = "Landscape"(横向)
		top			: 20,
		right		: 20,
		bottom		: 20,
		left		: 20
	};
}
(function(window) {
	var size = PageSize.get(_config_["pageSize"]);
	if(!size) {
		alert("纸张类型 '" + _config_["pageSize"] + "' 不存在！");
		return;
	}
	if(_config_["orientation"].toUpperCase() == "L") {
		size[0] = size[0] + size[1];
		size[1] = size[0] - size[1];
		size[0] = size[0] - size[1];
	}
	var window = this;
	var	PAGE_WIDTH = Math.floor(size[0] - _config_["left"] - _config_["right"] - 1);
	var PAGE_HEIGHT = Math.floor(size[1] - _config_["top"] - _config_["bottom"] - 1);
	var	PAGINATION_HEIGHT = 5;
	var pagination = (typeof _config_["pagination"] == "undefined" || typeof _config_["pagination"] != "boolean") ? true : _config_["pagination"]; 
	
	var	CONTENT_HEIGHT = PAGE_HEIGHT - (pagination ? PAGINATION_HEIGHT : 0);
	
	var frag, page, content, height = 0, total = 0, paginations = [], title = null, group = null, absElems = [];
	
	function comp(h) { return Math.ceil(h / 3.78) > CONTENT_HEIGHT - height; }

	function isIE() { return navigator.userAgent.indexOf("MSIE") > -1; }

	//将第二个对象参数中的键值对添加到第一个对象参数中并将其返回
Object.extend = function(destination, source) {
  for (var property in source)
    destination[property] = source[property];
  return destination;
};

Object.extend(Object, {
  //将传入的对象参数的键的集合以数组方式返回
  keys: function(object) {
    var keys = [];
    for (var property in object)
      keys.push(property);
    return keys;
  },

  //将传入对象参数的值的集合以数组的方式返回
  values: function(object) {
    var values = [];
    for (var property in object)
      values.push(object[property]);
    return values;
  },

  //复制传入的对象参数并将其返回
  clone: function(object) {
    return Object.extend({ }, object);
  },

  //判断传入参数是否是节点元素，是返回true,否则为false
  isElement: function(object) {
    return object && object.nodeType && object.nodeType == 1;
  },

  //判断传入参数是否是Array类型，是返回true,否则为false
  isArray: function(object) {
    return object && object.constructor === Array;
  },

  //判断传入参数是否是Function类型，是返回true,否则为false
  isFunction: function(object) {
    return typeof object == "function";
  },

  //判断传入参数是否是String类型，是返回true,否则为false
  isString: function(object) {
    return typeof object == "string";
  },

  //判断传入参数是否是Number类型，是返回true,否则为false
  isNumber: function(object) {
    return typeof object == "number";
  },

  //判断传入参数是否是Undefined类型，是返回true,否则为false
  isUndefined: function(object) {
    return typeof object == "undefined";
  }
});

Object.extend(String.prototype, {
  //过滤掉字符串首位的空白字符
  strip: function() {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
  },

  //过滤掉字符串中的标签
  stripTags: function() {
    return this.replace(/<\/?[^>]+>/gi, '');
  },

  //过滤掉字符串中的script标签及其中的script语句
  stripScripts: function() {
    return this.replace(new RegExp('<script[^>]*>([\\S\\s]*?)<\/script>', 'img'), '');
  },

  //将字符串中多个script标签中的script语句以数组方式返回
  extractScripts: function() {
    var matchAll = new RegExp('<script[^>]*>([\\S\\s]*?)<\/script>', 'img');
    var matchOne = new RegExp('<script[^>]*>([\\S\\s]*?)<\/script>', 'im');
    return (this.match(matchAll) || []).map(function(scriptTag) {
      return (scriptTag.match(matchOne) || ['', ''])[1];
    });
  },
  
  //将字符串中多个script标签中的script语句执行，并将执行结果以数组方式返回
  evalScripts: function() {
    return this.extractScripts().map(function(script) { return eval(script) });
  },

  //将字符串拆分成字符数组
  toArray: function() {
    return this.split('');
  },

  //将字符串的第一个字母转换成大写，其它的字母转换成小写
  capitalize: function() {
    return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
  },

  //判读字符串是否包含传入的字符串参数，是则返回true，否则未false
  include: function(pattern) {
    return this.indexOf(pattern) > -1;
  },

  //判断字符串是否以传入的字符串参数开头，是则返回true，否则未false
  startsWith: function(pattern) {
    return this.indexOf(pattern) === 0;
  },

  //判断字符串是否以传入的字符串参数开头，是则返回true，否则未false
  endsWith: function(pattern) {
    var d = this.length - pattern.length;
    return d >= 0 && this.lastIndexOf(pattern) === d;
  },

  //判断字符串是否未空，是则返回true，否则为false
  empty: function() {
    return this == '';
  },

  //判断字符串是否只包含空白字符，是则返回true，否则为false
  blank: function() {
    return /^\s*$/.test(this);
  }
});

Object.extend(Array.prototype, {
  //遍历数组中的元素，并将其作为参数传给函数iterator
  each: function(iterator) {
    for (var i = 0, length = this.length; i < length; i++)
      iterator(this[i]);
  },
  
  //判断数组是否包含传入的参数，是则返回true，否则为false
  include: function(object) {
  	var found = false, len = this.size();
  	for(var i = 0; i < len; i++) {
  		if(this[i] == object) return found = true;
  	}
  	return found;
  },

  //将数组清空
  clear: function() {
    this.length = 0;
    return this;
  },

  //返回数组的第一个元素
  first: function() {
    return this[0];
  },

  //返回数组的最后一个元素
  last: function() {
    return this[this.length - 1];
  },

  //过滤掉数组中的null或undefined元素
  compact: function() {
    var results = [];
    this.each(function(value) {
    	if(value) results.push(value);
    });
    return results;
  },

  //过滤掉数组中重复的元素
  uniq: function(sorted) {
    var results = [];
    this.each(function(value) {
    	if(!results.include(value)) results.push(value);
    });
    return results;
  },

  //返回数组的复制体
  clone: function() {
    return [].concat(this);
  },

  //返回数组的长度
  size: function() {
    return this.length;
  }
});
	
	
	function append(p, c, h) {
		p.appendChild(c);
		if(h) height += Math.ceil(h / 3.78);
	};
	
	function getCurrentStyle(elem, prt) {
		if(isIE()) {
			return elem.currentStyle[prt];
		} else {
			return document.defaultView.getComputedStyle(elem, "").getPropertyValue(prt);
		}
	}
	
	function getNewPage() {
		return (function() {
			page = this;
			append(frag, this);
			this.className = ++total == 1 ? "framework" : "framework spliter";
			if(isIE()) {
				this.style.marginTop = _config_["top"] + "mm";
			} else {
				this.style.paddingTop = _config_["top"] + "mm";
			}
			this.style.width = PAGE_WIDTH + "mm";
			this.style.height = PAGE_HEIGHT + "mm";
			append(this, getContent());
			if(pagination) append(this, getPagination());
			return this;
		}).call(document.createElement("div"));
	}
	
	function getContent() {
		return (function() {
			content = this;
			this.className = "content";
			this.style.width = PAGE_WIDTH + "mm";
			this.style.height = CONTENT_HEIGHT + "mm";
			height = 0;
			if(title) {
				append(content, title.cloneNode(true), title.offsetHeight);
			}
			return this;
		}).call(document.createElement("div"));
	}
	
	function getPagination() {
		return (function() {
			paginations.push(this);
			this.className = "pagination";
			this.style.width = PAGE_WIDTH + "mm";
			return this;
		}).call(document.createElement("div"));
	}
	
	function init() {
		var c = document.body.firstChild;
		while(c) {
			if(c.nodeType == 1 && c.getAttribute('pagetitle')) {
				title = c;
				title.className = title.className ? title.className + " title" : "title";
				break;
			}
			c = c.nextSibling;
		}
		frag = document.createDocumentFragment();
		getNewPage();
	};
	
	function resetPage() {
		if(document.body.innerHTML.replace(/^[\s]*$/g,"") == "") return;
		
		init();
		
		var v = document.body.firstChild;
		while(v) { // 循环处理 body 元素的子节点
			if(v.nodeType != 1) { //如果不为元素节点则 continue
				v = v.nextSibling;
				continue;
			}
			if (!v.offsetHeight) v.style.overflow = "hidden"; // 清除浮动
			
			if(getCurrentStyle(v, "position") == "absolute") { // 剔除绝对定位的元素
				absElems.push(v.cloneNode(true));
				v = v.nextSibling;
				continue;
			}
			
			if(v.nodeName != "TABLE") { // 非 TABLE 节点
				// 当节点具有 page 属性，并且 height 不等于0( title 为 null)或者标题的高度( title 不为 null )时创建新页面
				// 当节点内容超出当前页面时创建新页面
				if((v.getAttribute("page") && height != (title ? title.offsetHeight : 0) ) ||
					comp(v.offsetHeight)) {
					getNewPage();
				}
				if(v.getAttribute("pagetitle")) { // 当节点具有 pagetitle 属性时 continue
					if(title != v) {
						title = v;
						title.className = title.className ? title.className + " title" : "title";
						getNewPage();
					}
					v = v.nextSibling;
					continue;
				}
				if(v.getAttribute("group")) { // 当节点具有 group 属性时 continue
					group = v;
					group.className = group.className ? group.className + " group" : "group";
					v = v.nextSibling;
					continue;
				}
				append(content, v.cloneNode(true), v.offsetHeight); // 将节点添加到当前页面中
			} else { // TABLE 节点
				if(v.getAttribute("block")) { // table 具有 block 属性
					if(group) {
						if(comp(group.offsetHeight)) { // 当组标题内容超出当前页面内容时创建新页面
							getNewPage();
						}
						append(content, group.cloneNode(true), group.offsetHeight);
					}
					if(comp(v.offsetHeight)) { // 如果节点内容超出当前页面时创建新页面
						getNewPage();
					}
					append(content, v.cloneNode(true), v.offsetHeight); // 将节点内容添加到当前页面当中
				} else { // 不具有 block 属性的 table 节点，即可拆分的 table
					// 当组标题的内容加上 table 的内容超过当前页面内容时
					if(comp((group ? group.offsetHeight : 0) + v.offsetHeight)) {
						var th = v.getElementsByTagName("thead")[0];
						var tbs = v.getElementsByTagName("tbody");
						var tf = v.getElementsByTagName("tfoot")[0];
						
						var elems = [];
						for(var k = 0; k < tbs.length; k++) {
							if(tbs[k].parentElement != v) {
								continue;
							}
							if (tbs[k].getAttribute("block")) {
								elems.push(tbs[k]);
							} else {
								var rs = tbs[k].rows;
								for(var ka = 0; ka < rs.length; ka++)
									elems.push(rs[ka]);
							}
						}
						
						var tab, tbody;
						for(var k = 0; k < elems.length; k++) {
							if(!tab) {
								tab = v.cloneNode(false);
								if(comp((group ? group.offsetHeight : 0) + (th ? th.offsetHeight : 0)+ elems[k].offsetHeight)) getNewPage();
								if(group) append(content, group.cloneNode(true), group.offsetHeight);
								if(th) append(tab, th.cloneNode(true), th.offsetHeight);
							}
							if(!tbody) tbody = document.createElement("tbody");
							if (comp(elems[k].offsetHeight)) {
								if(tbody.childNodes.length != 0) append(tab, tbody, th.offsetHeight);
								append(content, tab);
								tab = tbody = null;
								getNewPage();
								if(elems[k].nodeName == "TR") {
									var cs = elems[k].cells;
									for(var l = 0; l < cs.length; l++) {
										if(cs[l].getAttribute('hidevalue')) cs[l].innerHTML = cs[l].getAttribute("hidevalue");
									}
								}
								
								k--;
							} else {
								if(elems[k].nodeName == "TR") { //
									append(tbody, elems[k].cloneNode(true), elems[k].offsetHeight);
								} else {
									if(tbody.childNodes.length != 0) append(tab, tbody, th.offsetHeight);
									append(tab, elems[k], elems[k].offsetHeight);
									tbody = null;
								}
							}
						}
						elems = null;
						
						if(tab && tbody) {
							append(tab, tbody);
							tbody = null;
						}
						
						var flag = true;
						if(tab && tf && !comp(tf.offsetHeight)) {
							append(tab, tf.cloneNode(true), tf.offsetHeight);
							flag = false;
						}

						append(content, tab);
						tab = null;
						
						if(tf && flag) {
							getNewPage();
							var o = v.cloneNode(false);
							append(o, tf.cloneNode(true), tf.offsetHeight);
							append(content, o);
							o = null;
						}
						
						th = tbs = tf = null;
					} else {
						if(group) {
							append(content, group.cloneNode(true), group.offsetHeight);
						}
						append(content, v.cloneNode(true), v.offsetHeight);
					}
				}
			}
			group = null;
			v = v.nextSibling;
		}
		
		for(var k = 0; k < paginations.length; k++) {
			paginations[k].innerHTML = "<span>第&nbsp;&nbsp;" + (k + 1) + "&nbsp;&nbsp;页&nbsp;&nbsp;&nbsp;&nbsp;共&nbsp;&nbsp;" + total+ "&nbsp;&nbsp;页</span>";
		}
		
		if(isIE()) {
			document.body.innerHTML = '<object classid="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2" id="webBrowser" name="webBrowser" height="0" width="0">';
			window.printSetting = function() { webBrowser.ExecWB(8,1); };
		} else
			document.body.innerHTML = '';
		
		append(document.body, frag);
		
		if(absElems.length) {
			for(var i = 0; i < absElems.length; i++) {
				append(document.body, absElems[i]);
			}
		}
		
		page = content = title = paginations = frag = absElems = null;
	}
	
	window._print_ = window.print;
	window.print = function() {
		if(navigator.userAgent.indexOf('MSIE') != -1)
			window.document.execCommand("Print", true);
		else
			window._print_();
	}
	
	if(document.all) window.attachEvent("onload", resetPage)
	else window.addEventListener("load", resetPage, false);
})(window);