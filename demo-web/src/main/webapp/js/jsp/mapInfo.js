var gmap=null;

MyOverlay.prototype=null;

function MyOverlay(point,map,obj,pobj) {
	  this.map_ = map;
	  this.point_=point;
	  this.div_ = null;
	  this.setMap(map);
	  this.obj_=obj;
	  this.pobj_=obj;
	}

var page={
		map:null,
		zindex:0,
		prodId:"", start:"" , end:"",
		pdata:{},
		mapType:'',
		dataType:'',
		dataTypeParam:"0",
		init:function(){
			$("#dataType_count").attr('checked','true');
			page.mapType=param.mapType;
			if(page.mapType=="amap"){
				$("#mapType_amap").attr('checked','true');
				page.initAmap();
			}else{
				$("#mapType_google").attr('checked','true');
				
				
				//********************************
				MyOverlay.prototype =new google.maps.OverlayView();
				

				MyOverlay.prototype.onAdd = function() {
					var div = document.createElement('div');
					div.style.borderStyle = 'solid';
					div.style.borderWidth = '0px';
					div.style.position = 'absolute';
					div.style.backgroundColor='white';
					if(this.obj_!=null &&  this.obj_.code!=""){
						div.id=this.obj_.code;
					}
					var html= page.getHtml(this.obj_,this.pobj_);
					if(html!=""){
						div.innerHTML=html;
					}
					
					
//					div.onclick=function(){
//						alert(this.innerText);
//					}
					div.onmouseover=function(){
						
						if(gmap!=null){
							gmap.index+=10;
							div.style.zIndex=gmap.index;
						}

						
					}
					
					div.onmouseout=function(){

						$(div).find(".addTable").remove();
						var v=$(div).find(".pid").val();
						$(div).find(".nextpid").val(v);
					}
					
					 

					this.div_ = div;
					var panes = this.getPanes();
					panes.overlayLayer.appendChild(div);
					  
					panes.overlayMouseTarget.appendChild(div);

					var me = this;


//					google.maps.event.addDomListener(div, 'click', function() {
//						google.maps.event.trigger(me, 'click');
//					});
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

				
				
				
				
				//*********************************
				
				
				
				
				
				
				
				
				
				
				gmap={
						map:null,
						overlayList:[],
						index:0,
						mapOptions:{
						    zoom: 11,
						    center: new google.maps.LatLng(30.374296,113.567932),
						    mapTypeId: google.maps.MapTypeId.ROADMAP
						  },
						  init:function(){
							  $("#googleMap").show();
							  $("#amap").hide();
							  
							  
							  
							  
							  gmap.loaded=false;
							  gmap.map=null;
							  gmap.map = new google.maps.Map(document.getElementById('googleMap'), gmap.mapOptions);
							  
							  if (navigator.geolocation) {
								    navigator.geolocation.getCurrentPosition(function(position) {
								    	var pos = {
								    	        lat: position.coords.latitude,
								    	        lng: position.coords.longitude
								    	      };

								      
								    	gmap.map.setCenter(pos);
								    }, function() {
								      
								    });
								  }
							  
							  
							  
							  
							  google.maps.event.addListener(gmap.map,'zoom_changed',gmap.zoom_changed);
							  
							  google.maps.event.addListener(gmap.map,'dragend',gmap.dragend);
							  
							  //google.maps.event.addListener(map,'tilesloaded',gmap.tilesloaded);
							  
							  
							  
							  
						  },
						  zoom_changed:function(){
							  gmap.loadCompany();
						  },
						  dragend:function(){
							  gmap.loadCompany();
						  },
						  
						  loaded:false,
						  loadCompany:function(){
							  //page.zindex=0;

								if(gmap.map==null){
									return ;
								}
								
								
								//获取当前地图的可视范围
							    var mapLatLngBounds = gmap.map.getBounds();
							    //将地图的边界传递给后台
							    var maxX = mapLatLngBounds.getNorthEast().lng();
							    var maxY = mapLatLngBounds.getNorthEast().lat();
							    var minX = mapLatLngBounds.getSouthWest().lng();
							    var minY = mapLatLngBounds.getSouthWest().lat();
								
								var zoom=gmap.map.getZoom();
								var getAll=false;
								//alert(zoom);
								var level=2;
								if(zoom<=3){
									getAll=true;
								}
								if(zoom<6){
									level=1;
								}
								else if(zoom==6 || zoom==7 ){
									level=2;
								}else  if(zoom==8 || zoom==9 ) {
									level=3;
								}
								else  if(zoom==10 || zoom==11 ) {
									level=4;
								}
								else  if(zoom==13 || zoom==12 ) {
									level=5;
								}else if( zoom==14){
									level=6;
								}else if(zoom>14){
									level=6;
								}
								
								

								if(page.prodId!="" && page.start!="" && page.end!=""){
									gmap.removeLabel();
									var url=ctx+"companyController/getMRData.do?spoint="
									+maxX+","+maxY+"&epoint="+minX+","+minY+"&level="
									+level+"&start="+page.start+"&end="+page.end+"&id="+page.prodId+"&mapType=google&getAll="+getAll;
									$.post(url,null,gmap.addLabel);
								}
						  },

						  addLabel:function(data){
							  gmap.zindex=0;
							  var pointInfo=data.data;
							  var partInfo=data.pdata;
							  
							  
							  for (var i = 0; i < pointInfo.length; i++) {
								  var obj=pointInfo[i];
								  var pobj=partInfo[""+obj.parentId];
								  
								  
								  var point = new google.maps.LatLng(obj.latitude,obj.longitude);
								  var overlay=new MyOverlay(point, gmap.map,obj,pobj);

								  gmap.overlayList.push(overlay);
							  }
							  
							  page.addGlobalData(data.global);
							  
							  
						  },
						  removeLabel:function(){
							  for (var i = 0; i < gmap.overlayList.length; i++) {
								  gmap.overlayList[i].setMap(null);
							  }
							  gmap.overlayList=[];
						  }
						  
						  
				};
				
				
				
				
				gmap.init();
			}
		},
		
		addGlobalData:function(obj){

			var c1=0;
			var c2=0;
			if(page.dataType=='0'){
				c1=obj.count1+obj.count5;
				c2=obj.count2+obj.count6;
				
				
			}
			if(page.dataType=='1'){
				c1=obj.count1;
				c2=obj.count2;
				
				
			}
			if(page.dataType=='2'){
				c1=obj.count5;
				c2=obj.count6;
				
			}
			$("#global").html(param.msg013+":"+c1+"&nbsp;&nbsp;&nbsp;&nbsp;"+
					param.msg014+":"+c2+"&nbsp;&nbsp;&nbsp;&nbsp;"+
					param.msg015+":"+(obj.count3+obj.count4));
			
		},

		initAmap:function(){
			$("#amap").show();
			$("#googleMap").hide();
			

			//gmap.map=null;
//			var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
			var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
			page.map = new BMap.Map("amap");
//			page.map.addControl(top_left_control);        
			page.map.addControl(top_left_navigation);
			page.map.enableScrollWheelZoom();   
			page.map.setMaxZoom(14);
			page.map.setMinZoom(6);
			
			page.map.addEventListener("tilesloaded",page.loadCompany);
			page.zindex=0;
			page.getCityNameByIp();
		},
		getCityNameByIp:function(){
			var myCity = new BMap.LocalCity();
			myCity.get(function(result){
				var cityName = result.name;
				page.map.centerAndZoom(cityName,10);
			});
		},
		
		setDate:function(dstr,day){

			var dobj=new Date(Date.parse(dstr.replace(/-/g,"/"))); 
			
			dobj.setDate(dobj.getDate() + day); 
			
			var m= (dobj.getMonth()+1)+"";
			var d= dobj.getDate()+"";
			
			if(m.length==1){
				m="0"+m;
			}
			
			if(d.length==1){
				d="0"+d;
			}
			
			return dobj.getFullYear()+"-"+m+"-"+d;
		},
		
		setCountParam:function(){
			var prodId=$('#prodId').combobox('getValue');
			var start=$("#start").val();
			var end=$("#end").val();
			
			page.dataType= page.dataTypeParam;  
			
			
			page.prodId=""; 
			page.start="";
			page.end=""
				$("#param").html("");
			if(prodId==""){
				alert(param.msg004);
				return;
			}
			if(start=="" && end==""){
				alert(param.msg005);
				return;
			}
			
			
			
			var endStr=end;
			var staStr=start;
			
			if(start!="" && end!=""){
				end=page.setDate(end,1)
			}

			if(end==""){
				endStr=start;
				end=page.setDate(start,1)
			}
			
			if(start==""){
				staStr=end;
				start=end;
				end=page.setDate(start,1)
			}
			
			
			
			var sd=new Date(Date.parse(staStr.replace(/-/g,"/")));
			var ed=new Date(Date.parse(endStr.replace(/-/g,"/")));
			
			if(sd>ed){
				alert(param.msg006);
				return ;
			}

			page.prodId=prodId; 
			page.start=start;
			page.end=end;
			
			

			if(page.mapType=="amap"){
				page.map.clearOverlays();
				page.loadCompany();
			}else{
				if(gmap!=null){
					gmap.loadCompany();
				}
				
			}
			var dtStr=$("#dataType_"+page.dataType).html();
			
			
			
			$("#param").html(param.msg007+":"+$('#prodId').combobox('getText')
					+"&nbsp;&nbsp;&nbsp;&nbsp;"
					+$("#dataTypeHead").html()+":"+dtStr
					+"&nbsp;&nbsp;&nbsp;&nbsp;"
					+param.msg001+":"+staStr+" 00:00:00 &nbsp;&nbsp;- &nbsp;&nbsp;"+endStr+ " 23:59:59");
			
			
			
//			$('#prodId').combobox('setValue',"");
//			$("#start").val("");
//			$("#end").val("");
			
			
			
		},
		loadCompany:function(){
			page.zindex=0;
			if(page.map==null){
				return ;
			}
			var zoom=page.map.getZoom();
			var bs = page.map.getBounds();   //获取可视区域
			var bssw = bs.getSouthWest();   //可视区域左下角
			var bsne = bs.getNorthEast();   //可视区域右上角
			
			
			
			
			//alert(zoom);
			var level=2;
			if(zoom==6 || zoom==7 ){
				level=2
			}else  if(zoom==8 || zoom==9 ) {
				level=3
			}
			else  if(zoom==10 || zoom==11 ) {
				level=4
			}
			else  if(zoom==13 || zoom==12 ) {
				level=5
			}else if( zoom==14){
				level=6
			}

			if(page.prodId!="" && page.start!="" && page.end!=""){
				var url=ctx+"companyController/getMRData.do?spoint="
				+bssw.lng+","+bssw.lat+"&epoint="+bsne.lng+","+bsne.lat+"&level="
				+level+"&start="+page.start+"&end="+page.end+"&id="+page.prodId+"&mapType="+page.mapType;
				$.post(url,null,page.addLabel);
			}
		},

		getColor:function(v){
			var color="";
			if(v<=10){
				color="blue";
			}else if(v>10 && v<=30){
				color="green";
			}else if(v>30 && v<=60){
				color="yellow";
			}else if(v>60 && v<=90){
				color="orange";
			}else{
				color="red";
			}
			return color;
		},
		dateTypeClick:function(v){
			page.dataTypeParam=''+v;
		},
		getHtml:function(obj,pobj){
			var v1=0;
			var v2=0;
			var v3=0;
			
			var c1=0;
			var c2=0;
			
			var pc1=0;
			var pc2=0;
			
			if(page.dataType=='0'){
				c1=obj.count1+obj.count5;
				c2=obj.count2+obj.count6;
				
				pc1=pobj.count1+pobj.count5;
				pc2=pobj.count2+pobj.count6;
			}
			if(page.dataType=='1'){
				c1=obj.count1;
				c2=obj.count2;
				
				pc1=pobj.count1;
				pc2=pobj.count2;
			}
			if(page.dataType=='2'){
				c1=obj.count5;
				c2=obj.count6;
				
				pc1=pobj.count5;
				pc2=pobj.count6;
			}
			
			if(c1==0 && c2==0){
				return "";
			}
			
			
			if(pobj!=null ){
				if(pc1>0){
					v1=Math.ceil(c1/pc1*100);
				}
				if(pc2>0){
					v2=Math.ceil(c2/pc2*100);
				}
				if(pobj.count3+pobj.count4>0){
					v3=Math.ceil((obj.count3+obj.count4)/(pobj.count3+pobj.count4)*100);
				}
			}else{
				if(c1!=0){
					v1=100;
				}
				if(c2!=0){
					v2=100;
				}
				if(obj.count3!=0){
					v3=100;
				}
				
				
				
			}
			

			var html='<div  class="sell_count_info" style="background-color: white;font-family:微软雅黑;font-size: 12px;border-color: black;border-style: inset;border-width: 1px;padding: 0px ">'+

			'<table border="0px" onclick="page.click(this);" cellspacing="0px" cellpadding="0px" style="width: 120px;">'+
			'<tr>'+
				'<td colspan="3"  style="padding-left: 5px;font-size: 8px;padding-bottom: 0px;padding-right: 0px;padding-top: 0px;font-family: 微软雅黑;background-color: white;border-bottom-width: 1px;border-bottom-color: black;border-bottom-style: inset">'+
				obj.name+" - "+c1+" - "+c2+" - "+(obj.count3+obj.count4)+'<input type="hidden" value="'+obj.parentId+'" class="pid"><input type="hidden" value="'+obj.parentId+'" class="nextpid">'+
				'</td>'+
			'</tr>'+
			
			
			'<tr>'+
				'<td  height="5px" width="34%" style="background-color: white;border-right-width: 1px;border-right-color: black;border-right-style: inset">'+
				'<div style="width: '+v1+'%;height:100%;background-color:'+page.getColor(v1)+' ;"></div>'+
				'</td>'+
				
				'<td  height="5px" width="33%" style="background-color: white;border-right-width: 1px;border-right-color: black;border-right-style: inset">'+
				'<div style="width: '+v2+'%;height:100%;background-color:'+page.getColor(v2)+' ;"></div>'+
				'</td>'+
				
				'<td  height="5px" width="33%" style="background-color: white;">'+
				'<div style="width: '+v3+'%;height:100%;background-color:'+page.getColor(v3)+' ;"></div>'+
				'</td>'+
				
			'</tr>'+

			'</table>'+
			'</div>';
			
			return html;
		},
		addLabel: function(data){
			page.map.clearOverlays();
			var point=data.data;
			var part=data.pdata;
			page.pdata={};
			
			for ( var p in part ){ 
				page.pdata[p]=part[p];
			}
			
		
			for (var i = 0; i < point.length; i++) {
				var obj=point[i];
				var pobj=part[""+obj.parentId];
				var html=page.getHtml(obj,pobj);
				if(html!=""){
					var rm = new BMapLib.RichMarker(page.getHtml(obj,pobj),  new BMap.Point(obj.longitude,obj.latitude),{
						  "enableDragging" : false});
					
					rm.addEventListener("onmouseover", page.onmouseover);
					rm.addEventListener("onmouseout", page.onmouseout);
					
					

					page.map.addOverlay(rm);
				}
				
				
			}
			
			page.addGlobalData(data.global);
		},
		onmouseover:function(obj){
			page.zindex++;
			obj.currentTarget._container.style.zIndex=page.zindex;

	
		},
		onmouseout:function(obj){
			
			
			
			$(obj.currentTarget._container).find(".addTable").remove();
			var v=$(obj.currentTarget._container).find(".pid").val();
			$(obj.currentTarget._container).find(".nextpid").val(v);
			
	
		},
		onclickObj:null,
		amapClick:function(){
			
		},
		click:function(obj){
			
			if( obj.nodeName=="table" || obj.nodeName=="TABLE" ){
				obj=$(obj).parent();
			}
			
			var pid= $(obj).find(".nextpid").val();
			page.onclickObj=obj;
			if(pid=="" ){
				return;
			}
			$(obj).find(".basic").val(1);
			$(obj).find(".div_basic").val(1);
			var data= page.pdata[pid];
			if(data!=null){
				var html=page.getHtml2(data);
				if(html!=""){
					$(obj).parent().append(page.getHtml2(data));
					$(obj).find(".nextpid").val(data.parentId);
				}
				
				page.onclickObj=null;
			}else{
				var url=ctx+"companyController/getParentMRData.do?start="+page.start+"&end="+page.end+"&id="+page.prodId+"&mapType="+page.mapType+"&areaId="+pid;
				$.post(url,null,function(res){
					$(page.onclickObj).parent().append(page.getHtml2(res));
					page.pdata[pid]=res;
					$(page.onclickObj).find(".nextpid").val(res.parentId);
					page.onclickObj=null;
				});
			}
			
			
		},
		getHtml2:function(obj){
			
			var c1=0;
			var c2=0;
			if(page.dataType=='0'){
				c1=obj.count1+obj.count5;
				c2=obj.count2+obj.count6;
				
				
			}
			if(page.dataType=='1'){
				c1=obj.count1;
				c2=obj.count2;
				
				
			}
			if(page.dataType=='2'){
				c1=obj.count5;
				c2=obj.count6;
				
			}
			
			var html='<table class="addTable"  border="0px" onclick="page.click(this);" cellspacing="0px" cellpadding="0px" style="width: 120px;">'+
			'<tr>'+
				'<td colspan="3"  style="padding-left: 5px;font-size: 8px;padding-bottom: 0px;padding-right: 0px;padding-top: 0px;font-family: 微软雅黑;background-color: white;border-top-width: 1px;border-top-color: black;border-top-style: inset">'+
				obj.name+" - "+c1+" - "+c2+''+" - "+(obj.count3+obj.count4)+''+
				'</td>'+
			'</tr>'+'</table>';
			
			return html;
		},
		radioClick:function(type){
//			$('#prodId').combobox('setValue',"");
//			$("#start").val("");
//			$("#end").val("");
//			$("#param").text("");
//			page.prodId="";
//			page.start="" ;
//			page.end="";
//			if(type=="amap"){
//				page.initAmap();
//			}else{
//				gmap.init();
//			}
//			page.mapType=type;
			
			window.location.href=ctx+"companyController/mapCount.do?mapType="+type;
		}
};

























