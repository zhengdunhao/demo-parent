

var page = {
	// map:null,
	zindex : 0,
	prodId : "",
	start : "",
	end : "",
	pdata : {},
	mapType : '',
	dataType : '',
	dataTypeParam : "0",

	// 每种地图需要自己实现
	init : function() {
		
		page.mapType = param.mapType;
		if (page.mapType == "amap") {
			$("#mapType_amap").attr('checked', 'true');
			// page.initAmap();
		}else{
			$("#mapType_google").attr('checked','true');
		}

		mapObject.init(page);
		page.zindex = 0;

		$("#charTabs").tabs({
			onSelect : page.tabSelect
		});

		$("#charDetailTabs").tabs({
			onSelect : page.tabSelect2
		});

	},

	addGlobalData : function(obj) {
		$("#global").html(page.getCountData(obj));

	},



	setDate : function(dstr, day) {

		var dobj = new Date(Date.parse(dstr.replace(/-/g, "/")));

		dobj.setDate(dobj.getDate() + day);

		var m = (dobj.getMonth() + 1) + "";
		var d = dobj.getDate() + "";

		if (m.length == 1) {
			m = "0" + m;
		}

		if (d.length == 1) {
			d = "0" + d;
		}

		return dobj.getFullYear() + "-" + m + "-" + d;
	},

	setCountParam : function() {
		var prodId = $('#prodId').combobox('getValue');
		var start = $("#start").val();
		var end = $("#end").val();

		page.idWidthList = {};

		page.dataType = page.dataTypeParam;

		var a = $("input[name='chb_uaidType']:checked")
		if (a.length == 0) {
			alert(param.txt009);
			return;
		}
		var b = $("input[name='chb_dataType']:checked")
		if (b.length == 0) {
			alert(param.txt010);
			return;
		}

		page.prodId = "";
		page.start = "";
		page.end = ""
		$("#param").html("");
		if (prodId == "") {
			alert(param.msg004);
			return;
		}
		if (start == "" && end == "") {
			alert(param.msg005);
			return;
		}

		var endStr = end;
		var staStr = start;

		if (start != "" && end != "") {
			end = page.setDate(end, 1)
		}

		if (end == "") {
			endStr = start;
			end = page.setDate(start, 1)
		}

		if (start == "") {
			staStr = end;
			start = end;
			end = page.setDate(start, 1)
		}

		var sd = new Date(Date.parse(staStr.replace(/-/g, "/")));
		var ed = new Date(Date.parse(endStr.replace(/-/g, "/")));

		if (sd > ed) {
			alert(param.msg006);
			return;
		}

		page.prodId = prodId;
		page.start = start;
		page.end = end;


		page.paramStr = ""
		for ( var key in page.dataParam) {
			page.paramStr += "," + $("#spn_param" + key).html();
		}
		page.paramStr = page.paramStr.substring(1);

		$("#param").html(
				param.msg007 + ":" + $('#prodId').combobox('getText')
						+ "&nbsp;&nbsp;&nbsp;&nbsp;"
						+ $("#dataTypeHead").html() + page.paramStr
						+ "&nbsp;&nbsp;&nbsp;&nbsp;" + param.msg001 + ":"
						+ staStr + " 00:00:00 &nbsp;&nbsp;- &nbsp;&nbsp;"
						+ endStr + " 23:59:59");
		
		page.loadCompany();

	},
	loadCompany : function() {
		var mapInfo = mapObject.loadCompany();

		page.getMRData(mapInfo.swln, mapInfo.swla, mapInfo.neln, mapInfo.nela,
				mapInfo.level, mapInfo.isGetAll);
	},

	

	getMRData : function(maxX, maxY, minX, minY, level, getAll) {
		if (page.prodId != "" && page.start != "" && page.end != "") {
			var url = ctx + "companyController/getMRData.do?spoint=" + maxX
					+ "," + maxY + "&epoint=" + minX + "," + minY + "&level="
					+ level + "&start=" + page.start + "&end=" + page.end
					+ "&id=" + page.prodId + "&mapType=" + page.mapType
					+ "&getAll=" + getAll;
			$.post(url, null, page.addLabel);
		}
	},

	idWidthList : {},

	getHtml : function(obj, pobj, max) {
		var v1 = page.getCountData(obj);

		if (v1 == 0) {
			return "";
		}

		var v2 = page.getCountData(max);
		var v3 = page.getCountData(pobj);
		var w = Math.ceil(v1 / v2 * 100);
		var cw = 0;

		var attr = 'id="mapDiv_' + obj.id + '" c1="' + obj.count1 + '" c2="'
				+ obj.count2 + '" c3="' + obj.count3 + '" c4="' + obj.count4
				+ '" c5="' + obj.count5 + '" c6="' + obj.count6 + '" v1="' + v1
				+ '" v3="' + v3 + '" n="' + obj.name + '" pn="' + pobj.name
				+ '" '

		var html = '<div  '
				+ attr
				+ ' class="sell_count_info" onclick="page.charDialogOpen('
				+ obj.id
				+ ')" style="background-color: white;font-family:微软雅黑;font-size: 12px;padding: 0px ;width:104px">'
				+ '<table border="1" cellpadding="0" cellspacing="0" width="102px">'
				+ '<tr height="20px">' + '<td>' + obj.name + ' - ' + v1
				+ '</td>' + '</tr>' + '<tr>' + '<td height="20px">'
				+ '<div class="changeDiv" id="div_' + obj.id
				+ '" style="height: 100%;width: ' + cw
				+ '%;background-color: green;"></div>' + '</td>' + '</tr>'
				+ '</table>' + '</div>';

		page.idWidthList["_" + obj.id] = w;

		return html;
	},
	changeWidth : function() {
		for ( var key in page.idWidthList) {
			if (page.idWidthList.hasOwnProperty(key)) {
				$("#div" + key).width(page.idWidthList[key] + "%");
			}
		}

		page.idWidthList = {};
	},

	// 每个地图应该独立实现这个方法
	addLabel : function(data) {

		var point = data.data;
		var part = data.pdata;
		var max = data.max;
		page.pdata = {};

		for ( var p in part) {
			page.pdata[p] = part[p];
		}

		mapObject.addLabel(point, part, max, page);

		

		window.setTimeout(page.changeWidth, 50);

		page.addGlobalData(data.global);
	},
	onmouseover : function(obj) {
		page.zindex++;
		obj.currentTarget._container.style.zIndex = page.zindex;

	},
	onmouseout : function(obj) {

		$(obj.currentTarget._container).find(".addTable").remove();
		var v = $(obj.currentTarget._container).find(".pid").val();
		$(obj.currentTarget._container).find(".nextpid").val(v);

	},
	onclickObj : null,
	amapClick : function() {

	},
	radioClick : function(type) {

		window.location.href=ctx+"mapData/mapCount.do?mapType="+type;
	},

	charDialogOpen : function(areaId) {
		page.selectAreaId = areaId;

		var obj = $("#mapDiv_" + areaId)

		page.changeTitle($(obj).attr("n"), $(obj).attr("pn"));

		$("#charDialog").dialog('open');
		page.setTab0Char(areaId);

	},
	/***************************************************************************
	 * 加载第一个tab的数据,当前数据占上级数据百分比
	 * 
	 * @param name
	 * @param val
	 * @param pname
	 * @param pval
	 * @param areaId
	 */
	setTab0Char : function(areaId) {
		var obj = $("#mapDiv_" + areaId);
		var name = $(obj).attr("n");
		var val = $(obj).attr("v1");
		var pname = $(obj).attr("pn");
		var pval = $(obj).attr("v3");
		option = {
			title : {
				text : getMsg(param.txt011,[name,pname]) ,
				x : 'center'
			},
			tooltip : {
				trigger : 'item',
				formatter : "{b} : {c} ({d}%)"
			},
			legend : {
				orient : 'vertical',
				x : 'left',
				data : [ name, getMsg(param.txt012,[pname])  ]
			},
			calculable : false,
			series : [ {
				type : 'pie',
				radius : '55%',
				center : [ '50%', '60%' ],
				data : [ {
					value : val,
					name : name
				}, {
					value : pval - val,
					name : getMsg(param.txt012,[pname])
				} ]
			} ]
		};

		

			var myChart = echarts.init(document.getElementById('tab0char'),"macarons");
			myChart.setOption(option);
		
	},

	/***************************************************************************
	 * 加载第2个tab的数据,当前数据的详情
	 * 
	 * @param name
	 * @param val
	 * @param pname
	 * @param pval
	 * @param areaId
	 */
	setTab1Char : function() {

		var obj = $("#mapDiv_" + page.selectAreaId);
		var name = $(obj).attr("n");
		var count1 = $(obj).attr("c1");
		var count2 = $(obj).attr("c2");
		var count3 = $(obj).attr("c3");
		var count4 = $(obj).attr("c4");
		var count5 = $(obj).attr("c5");
		var count6 = $(obj).attr("c6");

		var option1 = {
			title : {
				text : getMsg(param.txt013,[name]),
				x : 'center'
			},
			tooltip : {
				trigger : 'item',
				formatter : "{b} : {c} ({d}%)"
			},
			legend : {
				orient : 'vertical',
				x : 'left',
				data : [ param.txt014, param.txt015, param.txt016, param.txt017, param.txt018,
				         param.txt019 ]
			},
			calculable : false,
			series : [ {
				type : 'pie',
				radius : '55%',
				center : [ '50%', '60%' ],
				data : [ {
					value : count1,
					name : param.txt014
				}, {
					value : count2,
					name : param.txt015
				}, {
					value : count5,
					name : param.txt016
				}, {
					value : count6,
					name : param.txt017
				}, {
					value : count3,
					name : param.txt018
				}, {
					value : count4,
					name : param.txt019
				} ]
			} ]
		};

		
			var myChart = echarts.init(document.getElementById('tab1char'),"macarons");
			myChart.setOption(option1);
		
	},

	setTab2Char : function() {
		var pname = $("#mapDiv_" + page.selectAreaId).attr("pn");
		var qparam = {
			areaId : page.selectAreaId,
			start : page.start,
			end : page.end,
			prodId : page.prodId,
			mapType : page.mapType
		};
		$.post(ctx + "mapData/getSameAreaRank.do", qparam, function(data) {
			if (data == null || data.length == 0) {
				return;
			}

			var list = [];
			for (var i = 0; i < data.length; i++) {
				var val = page.getCountData(data[i]);

				list.push({
					name : data[i].name,
					value : val
				});
			}

			list = quickSort(list, "value");
			var nameList = [];
			var valList = [];
			for (var i = 0; i < list.length; i++) {
				nameList.push(list[i].name);
				valList.push(list[i].value);
			}

			option2 = {
				title : {
					text :getMsg(param.txt020,[pname]) 
				},
				tooltip : {
					trigger : 'axis'
				},
				legend : {
					data : [ param.txt021 ]
				},
				grid : {
					left : '3%',
					right : '4%',
					bottom : '3%',
					containLabel : true
				},
				xAxis : [ {
					type : 'value',
					boundaryGap : [ 0, 0.01 ]
				} ],
				yAxis : [ {
					type : 'category',
					data : nameList
				} ],
				series : [ {
					name : param.txt021,
					type : 'bar',
					data : valList
				} ]
			};

			
				var myChart = echarts.init(document.getElementById('tab2char'),"macarons");
				myChart.setOption(option2);
			

		});
	},

	setTab3Char : function() {

		var qparam = {
			areaId : page.selectAreaId,
			start : page.start,
			end : page.end,
			prodId : page.prodId,
			mapType : page.mapType
		};
		$.post(ctx + "mapData/getDataDetail.do", qparam, function(data) {
			if (data == null || data.length == 0) {
				return;
			}

			var nameList = [];
			var valList = [];

			var map = {};
			for (var i = 0; i < data.length; i++) {
				var val = page.getCountData(data[i]);
				map["_" + data[i].date] = val
			}

			var startStr = page.start;
			var endStr = page.end;

			while (startStr != endStr) {
				var key = startStr.replace("-", "").replace("-", "");
				var v = map["_" + key];
				if (v == null) {
					v = 0;
				}
				nameList.push(startStr);
				valList.push(v);
				startStr = page.setDate(startStr, 1)

			}

			var option3 = {
				title : {
					text : param.txt022
				},
				tooltip : {
					trigger : 'axis'
				},
				legend : {
					data : [ param.txt021 ]
				},
				grid : {
					left : '3%',
					right : '4%',
					bottom : '3%',
					containLabel : true
				},

				xAxis : [ {
					type : 'category',
					boundaryGap : false,
					data : nameList
				} ],
				yAxis : [ {
					type : 'value'
				} ],
				series : [ {
					name : param.txt021,
					type : 'line',
					
					data : valList
				} ]
			};

			
			var myChart = echarts.init(document.getElementById('tab3char'),"macarons");
			myChart.setOption(option3);
			

		});
	},
	setTab4Char : function() {
		var obj = $("#mapDiv_" + page.selectAreaId);
		var name = $(obj).attr("n");
		var qparam = {
			areaId : page.selectAreaId,
			start : page.start,
			end : page.end,
			prodId : page.prodId,
			mapType : page.mapType
		};
		$.post(ctx + "mapData/getDataDetail.do", qparam, function(data) {
			if (data == null || data.length == 0) {
				return;
			}

			var nameList = [];
			var valList = [];

			var map = {};
			for (var i = 0; i < data.length; i++) {

				map["_" + data[i].date] = data[i];
			}

			var startStr = page.start;
			var endStr = page.end;

			var count1value = {
				name : param.txt014,
				type : 'line',
				 
				data : []
			};
			var count2value = {
				name : param.txt015,
				type : 'line',
				
				data : []
			};
			var count3value = {
				name : param.txt018,
				type : 'line',
				
				data : []
			};
			var count4value = {
				name : param.txt019,
				type : 'line',
				
				data : []
			};
			var count5value = {
				name : param.txt016,
				type : 'line',
				
				data : []
			};
			var count6value = {
				name : param.txt017,
				type : 'line',
				
				data : []
			};

			while (startStr != endStr) {
				var key = startStr.replace("-", "").replace("-", "");
				var v = map["_" + key];
				if (v == null) {
					count1value.data.push(0);
					count2value.data.push(0);
					count3value.data.push(0);
					count4value.data.push(0);
					count5value.data.push(0);
					count6value.data.push(0);
				} else {
					count1value.data.push(v.count1);
					count2value.data.push(v.count2);
					count3value.data.push(v.count3);
					count4value.data.push(v.count4);
					count5value.data.push(v.count5);
					count6value.data.push(v.count6);
				}
				nameList.push(startStr);

				startStr = page.setDate(startStr, 1)
			}

			valList = [ count1value, count2value, count5value, count6value,
					count3value, count4value ];

			var option4 = {
				title : {
					text : param.txt022
				},
				tooltip : {
					trigger : 'axis'
				},
				legend : {
					data : [ param.txt014, param.txt015, param.txt016, param.txt017, param.txt018,
					         param.txt019 ],
					top:'7%'
				},
				grid : {
					top:"17%",
					left : '3%',
					right : '4%',
					bottom : '3%',
					containLabel : true
				},

				xAxis : [ {
					type : 'category',
					boundaryGap : false,
					data : nameList
				} ],
				yAxis : [ {
					type : 'value'
				} ],
				series : valList

			};

			
				var myChart = echarts.init(document.getElementById('tab4char'),"macarons");
				myChart.setOption(option4);
			

		});
	},

	changeTitle : function(name, pname) {
		$("#charDialog").dialog({
			'title' : name
		});

		$('#charTabs').tabs('update', {
			tab : $('#charTabs').tabs('getTab', 0),
			options : {
				title :getMsg(param.txt011,[name,pname])  
			}
		});
		$('#charTabs').tabs('update', {
			tab : $('#charTabs').tabs('getTab', 1),
			options : {
				title : getMsg(param.txt024,[name]) 
			}
		});
		$('#charTabs').tabs('update', {
			tab : $('#charTabs').tabs('getTab', 2),
			options : {
				title :getMsg(param.txt020,[pname]) 
			}
		});

		$('#charTabs').tabs('update', {
			tab : $('#charTabs').tabs('getTab', 3),
			options : {
				title : getMsg(param.txt025,[name])  
			}
		});

	},

	dataParam : {},
	paramStr : "",
	selectAreaId : "",
	inAreaData:null,
	getInAreaData:function(){
		if(page.inAreaData!=null){
			return page.inAreaData;
		}
		var qparam = {
				areaId : page.selectAreaId,
				start : page.start,
				end : page.end,
				prodId : page.prodId,
				mapType : page.mapType
			};
		var opt={
				type: "POST",
				url:ctx+"mapData/getInAreaData.do",
				data:qparam,
				dataType: "json",
				success:function(data){
					page.inAreaData=data;
				},
				async:false
		
		};
		$.ajax(opt);
	},

	setDataParam : function(obj) {
		// var a= $("input[name='chb_uaidType']:checked")
		// var b= $("input[name='chb_dataType']:checked")

		if (obj.checked) {
			page.dataParam["_" + obj.value] = obj.value;
		} else {
			delete page.dataParam["_" + obj.value];
		}

	},
	getCountData : function(obj) {
		var result = 0;
		if (page.dataParam._1 != null) {
			if (page.dataParam._3 != null) {
				result += obj.count1;
			}
			if (page.dataParam._4 != null) {
				result += obj.count5;
			}
			if (page.dataParam._5 != null) {
				result += obj.count3;
			}
		}
		if (page.dataParam._2 != null) {
			if (page.dataParam._3 != null) {
				result += obj.count2;
			}
			if (page.dataParam._4 != null) {
				result += obj.count6;
			}
			if (page.dataParam._5 != null) {
				result += obj.count4;
			}
		}
		return result;
	},
	tabSelect : function(titel, index) {

		if (page.charSelected["_" + index] == null) {
			if (index == 1) {
				page.setTab1Char();

			} else if (index == 2) {
				page.setTab2Char();

			} else if (index == 3) {
				page.setTab3Char();

			}

			page.charSelected["_" + index] = index;
		}

	},
	charSelected2 : {},
	tabSelect2 : function(titel, index) {

		if (page.charSelected2["_" + index] == null) {
			if (index == 1) {
				page.setTab4Char();

			}

			page.charSelected2["_" + index] = index;
		}

	},
	dialogClose : function() {
		page.charSelected = {};
		page.charSelected2 = {};

		$("#charTabs").tabs("select", 0);
		$("#charDetailTabs").tabs("select", 0);

	},
	charSelected : {}

};

/*******************************************************************************
 * 
 * 快速排序,对对象进行排序,propName是用来比较大小的属性
 * 
 */
var quickSort = function(arr, propName) {
	if (arr.length <= 1) {
		return arr;
	}
	var pivotIndex = Math.floor(arr.length / 2);
	var pivot = arr.splice(pivotIndex, 1)[0];
	var left = [];
	var right = [];
	for (var i = 0; i < arr.length; i++) {
		if (arr[i][propName] < pivot[propName]) {
			left.push(arr[i]);
		} else {
			right.push(arr[i]);
		}
	}
	return quickSort(left, propName).concat([ pivot ], quickSort(right,propName));
};
