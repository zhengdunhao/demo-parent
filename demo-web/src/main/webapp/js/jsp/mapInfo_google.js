//google overlay 的对象
MyOverlay.prototype = null;

function MyOverlay(point, map, obj, pobj, max) {
	this.map_ = map;
	this.point_ = point;
	this.div_ = null;
	this.setMap(map);
	this.obj_ = obj;
	this.pobj_ = pobj;
	this.max_ = max;
}

// amap 的对象
var mapObject = {
	loaded : false,
	map : null,
	overlayList:[],
	mapOptions : {
		zoom : 11,
		center : new google.maps.LatLng(30.374296, 113.567932),
		mapTypeId : google.maps.MapTypeId.ROADMAP
	},
	
	// 一个继承的方法
	init : function(pageObj) {
		$("#googleMap").show();
		$("#amap").hide();

		mapObject.loaded = false;
		mapObject.map = null;
		mapObject.map = new google.maps.Map(document
				.getElementById('googleMap'), mapObject.mapOptions);

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var pos = {
					lat : position.coords.latitude,
					lng : position.coords.longitude
				};

				mapObject.map.setCenter(pos);
			}, function() {

			});
		}

		google.maps.event.addListener(mapObject.map, 'zoom_changed',
				pageObj.loadCompany);

		google.maps.event.addListener(mapObject.map, 'dragend',
				pageObj.loadCompany);
		
		mapObject.initOverLay(pageObj);

	},

	// 一个继承的方法
	loadCompany : function() {


		// 获取当前地图的可视范围
		var mapLatLngBounds = mapObject.map.getBounds();
		// 将地图的边界传递给后台
		var maxX = mapLatLngBounds.getNorthEast().lng();
		var maxY = mapLatLngBounds.getNorthEast().lat();
		var minX = mapLatLngBounds.getSouthWest().lng();
		var minY = mapLatLngBounds.getSouthWest().lat();

		var zoom = mapObject.map.getZoom();
		var getAll = false;
		// alert(zoom);
		var level = 2;
		if (zoom <= 3) {
			getAll = true;
		}
		if (zoom < 6) {
			level = 1;
		} else if (zoom == 6 || zoom == 7) {
			level = 2;
		} else if (zoom == 8 || zoom == 9) {
			level = 3;
		} else if (zoom == 10 || zoom == 11) {
			level = 4;
		} else if (zoom == 13 || zoom == 12) {
			level = 5;
		} else if (zoom == 14) {
			level = 6;
		} else if (zoom > 14) {
			level = 6;
		}
		
		mapObject.removeLabel();

		return {
			swln : minX,
			swla : minY,
			neln : maxX,
			nela : maxY,
			level : level,
			isGetAll : getAll
		};

	},
	// 一个继承的方法
	addLabel : function(pointInfo, partInfo, max, page) {
		

		for (var i = 0; i < pointInfo.length; i++) {
			var obj = pointInfo[i];
			var pobj = partInfo["" + obj.parentId];

			var point = new google.maps.LatLng(obj.latitude, obj.longitude);
			var overlay = new MyOverlay(point, mapObject.map, obj, pobj, max);

			mapObject.overlayList.push(overlay);
		}

		
	},
	removeLabel:function(){
		  for (var i = 0; i < mapObject.overlayList.length; i++) {
			  mapObject.overlayList[i].setMap(null);
		  }
		  mapObject.overlayList=[];
	  },
	initOverLay : function(pageObj) {

		MyOverlay.prototype = new google.maps.OverlayView();

		MyOverlay.prototype.onAdd = function() {
			var div = document.createElement('div');
			div.style.borderStyle = 'solid';
			div.style.borderWidth = '0px';
			div.style.position = 'absolute';
			div.style.backgroundColor = 'white';
			if (this.obj_ != null && this.obj_.code != "") {
				div.id = this.obj_.code;
			}
			var html = pageObj.getHtml(this.obj_, this.pobj_,this.max_);
			if (html != "") {
				div.innerHTML = html;
			}

			div.onmouseover = function() {
				pageObj.index += 10;
				div.style.zIndex = pageObj.index;
			}

			div.onmouseout = function() {

				$(div).find(".addTable").remove();
				var v = $(div).find(".pid").val();
				$(div).find(".nextpid").val(v);
			}

			this.div_ = div;
			var panes = this.getPanes();
			panes.overlayLayer.appendChild(div);

			panes.overlayMouseTarget.appendChild(div);

			var me = this;

			google.maps.event.addDomListener(div, 'mouseover', function() {
				google.maps.event.trigger(me, 'mouseover');
			});
			google.maps.event.addDomListener(div, 'mouseout', function() {
				google.maps.event.trigger(me, 'mouseout');
			});
		};

		MyOverlay.prototype.draw = function() {
			var overlayProjection = this.getProjection();
			var p = overlayProjection.fromLatLngToDivPixel(this.point_);
			var div = this.div_;
			div.style.left = p.x + 'px';
			div.style.top = p.y + 'px';

		};

		MyOverlay.prototype.onRemove = function() {
			this.div_.parentNode.removeChild(this.div_);
			this.div_ = null;
		};

		

	}

}