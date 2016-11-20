//amap 的对象
var mapObject = {
	map : null,
	// 一个继承的方法
	init : function(pageObj) {
		$("#amap").show();
		$("#googleMap").hide();

		// 这部分可以提取出来
		var top_left_navigation = new BMap.NavigationControl(); // 左上角，添加默认缩放平移控件
		mapObject.map = new BMap.Map("amap");
		mapObject.map.addControl(top_left_navigation);
		mapObject.map.enableScrollWheelZoom();
		mapObject.map.setMaxZoom(14);
		mapObject.map.setMinZoom(6);
		mapObject.map.addEventListener("tilesloaded", pageObj.loadCompany);
		// 这部分可以提取出来

		mapObject.getCityNameByIp();
	},

	loadCompany : function() {
		mapObject.map.clearOverlays();

		// page.zindex=0;

		var zoom = mapObject.map.getZoom();
		var bs = mapObject.map.getBounds(); // 获取可视区域
		var bssw = bs.getSouthWest(); // 可视区域左下角
		var bsne = bs.getNorthEast(); // 可视区域右上角

		// alert(zoom);
		var level = 2;
		if (zoom == 6 || zoom == 7) {
			level = 2
		} else if (zoom == 8 || zoom == 9) {
			level = 3
		} else if (zoom == 10 || zoom == 11) {
			level = 4
		} else if (zoom == 13 || zoom == 12) {
			level = 5
		} else if (zoom == 14) {
			level = 6
		}

		return {
			swln : bssw.lng,
			swla : bssw.lat,
			neln : bsne.lng,
			nela : bsne.lat,
			level : level,
			isGetAll : false
		};

	},

	addLabel : function(point, part, max, page) {
		mapObject.map.clearOverlays();
		for (var i = 0; i < point.length; i++) {
			var obj = point[i];
			var pobj = part["" + obj.parentId];
			var html = page.getHtml(obj, pobj, max);
			if (html != "") {

				// 这部分可以提取出来

				var rm = new BMapLib.RichMarker(html, new BMap.Point(
						obj.longitude, obj.latitude), {
					"enableDragging" : false
				});
				rm.addEventListener("onmouseover", page.onmouseover);
				rm.addEventListener("onmouseout", page.onmouseout);
				mapObject.map.addOverlay(rm);
				// 这部分可以提取出来
			}
		}

	},

	// 这方法可以提取出来
	getCityNameByIp : function() {
		var myCity = new BMap.LocalCity();
		myCity.get(function(result) {
			var cityName = result.name;
			mapObject.map.centerAndZoom(cityName, 10);
		});
	},
}