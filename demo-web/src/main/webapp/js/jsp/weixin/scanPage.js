$(document).ready(function(){
	scanPage.init();
});
var gallery=null;

var mask = mui.createMask(function(){});//callback为用户点击蒙版时自动执行的回调；
function pageChange(id){
	$(".page").hide();
	$(id).show();
	
	if(id!="#succ_result"){
		scanPage.initWXShare("关注爱真品", '关注爱真品', param.ctx+"weixin/followPage.do", param.ctx+"images/label.jpg",scanPage.nothingToDo,scanPage.nothingToDo);
		
    }
	
}

var scanPage={
	/***
	 * 送礼码
	 */
	giveCode:0,
	uaid:"",
	
	/***
	 * 初始化mui的图片空间
	 */
	initGallery:function(){
		gallery = mui('.com-img');
		gallery.slider({
			interval: 20000000 
		});
	},
	/***
	 * 初始化的主方法
	 */
	init:function(){
		mask.show();
		pageChange("#scan");
		
		//初始化微信js
		wx.config(param.weixinConfig);
		//微信js加载完成后执行
		wx.ready(function(){

			//加载完后打开扫描界面
			scanPage.wxScan();
			scanPage.initWXShare("关注爱真品", '关注爱真品', param.ctx+"weixin/followPage.do", param.ctx+"images/label.jpg",scanPage.nothingToDo,scanPage.nothingToDo)
			$("#scanDiv").show();
			mask.close();
			
		});
		//微信js加载失败后执行
		wx.error(function(res){});
	},
	/***
	 * 扫描按钮的点击事件
	 */
	scanClick:function(){
		//点击扫描按钮
		scanPage.wxScan();
	},
	/***
	 * 打开微信扫描界面
	 */
	wxScan:function(){
		
		
		//初始化微信扫描
		wx.scanQRCode({
		    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
		    scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
		    success: scanPage.wxScenResult
		});
	
		//scanPage.checkUaid("p0000314557651949430300000036");
		
	},
	/***
	 * 处理微信扫描的结果
	 * @param res
	 */
	wxScenResult:function(res){
		var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
	    if(result.indexOf(param.UAID_DOWNLOAD_PATH_NEW)>=0){
			var str= result.split(param.UAID_DOWNLOAD_PATH_NEW);
			scanPage.checkUaid(str[1]);
			
		}else if(result.indexOf(param.UAID_DOWNLOAD_PATH)>=0){
			var str= result.split(param.UAID_DOWNLOAD_PATH);
			scanPage.checkUaid(str[1]);
			
		}else{
			alert(param.msg01);
			
			pageChange("#scan");
		}
	},
	/***
	 * 获取脚标的html
	 * @param list
	 */
	getImgIndicatorHtml:function(list){
		var html="";
		for (var i = 0; i < list.length; i++) {
			var sty="mui-active";
			if(i>0){
				sty="";
			}
			html+='<div class="mui-indicator '+sty+'"></div>';
		}
		return html;
	},
	
	/***
	 * 获取图片元素的html
	 * @param url 图片url
	 * @param isLoop 是否要加mui-slider-item-duplicate样式
	 * @returns {String}
	 */
	getImgItemHtml:function(url,isLoop){
		var sty="";
		if(isLoop){
			sty="mui-slider-item-duplicate";
		}
		var html=
		'<div class="mui-slider-item '+sty+' all-width">'+
		'<a href="#" class="inherit-width inherit-height"><img src="'+url+'" class="img-responsive3 center-block commodity-pic" /></a>'+
		'</div>';
		return html;
	},
	/***
	 * 获取图片列表的html
	 * @param list 图片列表
	 * @returns {String}
	 */
	getImgListHtml:function(list){
		
		var size=list.length;
		var first=list[0];
		var last=list[size-1];
		
		var html="";
		
		if(size>1){
			html+=scanPage.getImgItemHtml(last.bigUrl, true);
		}
		for (var i = 0; i < list.length; i++) {
			html+=scanPage.getImgItemHtml(list[i].bigUrl, false);
		}
		if(size>1){
			html+=scanPage.getImgItemHtml(first.bigUrl, true);
		}
		return html;
	},
	/***
	 * 获取文字信息的html
	 * @param list
	 * @returns {String}
	 */
	getTextHtml:function(list){
		var html="";

		for (var i = 0; i < list.length; i++) {
			html+='<li class="mui-table-view-cell"> '+
				'<h4 class="title">'+list[i].key+'</h4>'+
				'<h4 class="content">'+list[i].value+'</h4>'+
			'</li>';
		}
		return html;
		
		
	},
	/***
	 * 生成送礼码
	 * @returns
	 */
	genGiveCode:function(){
		var str= Math.random()+"";
		return str.substring(2, 6);
	},
	toReceive:function(){
		var code= $("#giveCode").val();
		$("#giveCode").val("");
		if(code!=scanPage.giveCode){
			alert("授权码不正确");
			return;
		}
		mask.show();
		//收礼的统一方法,可以借用
		$.post(param.ctx+"weixin/checkUaid.do",{uaid:scanPage.uaid,giveCode:code},function(data){
			mask.close();
			if(data.status=="1" && data.errorCode==0){
				var givemsg='<p class="hint">通过右上角分享按钮"发送给朋友"进行送礼</p>';;

				$("#succMsg").html(data.scanMsgTitle +"<br>"+ data.scanMsgContext+givemsg); 

				
			
				scanPage.uaid=data.argoUaid;
				var textListHtml=scanPage.getTextHtml(data.ribbonList)
				$("#textList").html(textListHtml);
				var imgUrl=param.ctx+"images/label.jpg";;
				if(data.imgList.length>0){
					var imgListHtml=scanPage.getImgListHtml(data.imgList);
					var imgIndiHtml=scanPage.getImgIndicatorHtml(data.imgList);
					$("#imgList").html(imgListHtml);
					$("#imgIndi").html(imgIndiHtml);
					scanPage.initGallery();
					$("#imgDiv").show();
					imgUrl=data.imgList[0].bigUrl;
				}else{
					$("#imgDiv").hide();
				}
				scanPage.giveCode=scanPage.genGiveCode();
				scanPage.initWXShare("你的好友送你一份礼物",'关注爱真品公众号收礼,授权码:'+scanPage.giveCode, 
						param.ctx+"weixin/followPage.do?giveCode="+scanPage.giveCode, imgUrl,
						scanPage.shareSuccess,scanPage.nothingToDo);

				pageChange("#succ_result");
			}else{
				if(data.errorCode>0){
					$("#failMsg").html(data.errorMsg);
					
				}else{
					$("#failMsg").html(data.scanMsgTitle +"<br>"+ data.scanMsgContext);
					
				}
				pageChange("#fail_result");
				
			}
		});
		
		
	},
	queryUUID:"",
	/***
	 * ajax 请求,获取uaid查询结果
	 */
	checkUaid:function(uaid){


		mask.show();
		$.post(param.ctx+"weixin/checkUaid.do",{uaid:uaid},function(data){
			
			mask.close();
			scanPage.uaid=data.uaid;

			scanPage.giveCode=data.giveCode;
			if( data.errorCode==0){
				var givemsg="";

				scanPage.queryUUID=data.uuid;
				
				if(data.status=="1"){
					$("#msgicon").removeClass("icon-jinggao");
					$("#msgicon").addClass("icon-zhengque");
					
					if(data.isArgot){
						scanPage.uaid=data.argoUaid;
						scanPage.giveCode=scanPage.genGiveCode();
						scanPage.initWXShare("你的好友送你一份礼物",'关注爱真品公众号收礼,授权码:'+scanPage.giveCode, 
								param.ctx+"weixin/followPage.do?giveCode="+scanPage.giveCode, imgUrl,
								scanPage.shareSuccess,scanPage.nothingToDo);
						givemsg='<p class="hint">通过右上角分享按钮"发送给朋友"进行送礼</p>';
					}
				}else{
					$("#msgicon").addClass("icon-jinggao");
					$("#msgicon").removeClass("icon-zhengque");
				}
				
				//**************************************************************************************
				

				var textListHtml=scanPage.getTextHtml(data.ribbonList)
				$("#textList").html(textListHtml);
				var imgUrl=param.ctx+"images/label.jpg";
				if(data.imgList.length>0){
					var imgListHtml=scanPage.getImgListHtml(data.imgList);
					var imgIndiHtml=scanPage.getImgIndicatorHtml(data.imgList);
					$("#imgList").html(imgListHtml);
					$("#imgIndi").html(imgIndiHtml);
					scanPage.initGallery();
					imgUrl=data.imgList[0].bigUrl;
					$("#imgDiv").show();
				}else{
					$("#imgDiv").hide();
				}
				
				
				$("#succMsg").html(data.scanMsgTitle +"<br>"+ data.scanMsgContext+givemsg); 
				pageChange("#succ_result");
			}else{
				if(146002==data.errorCode){
					pageChange("#receive");
					return;
				}else if(data.errorCode>0){
					$("#failMsg").html(data.errorMsg);
				}else{
					$("#failMsg").html(data.scanMsgTitle +"<br>"+ data.scanMsgContext);
				}
				pageChange("#fail_result");
				
			}
		});

	},

	/***
	 * 初始化分析给好友的方法
	 * @param title 分享标题
	 * @param desc 分享描述
	 * @param link 分享链接
	 * @param img 分享图标
	 * @param succFun 成功是执行
	 * @param cancFun 取消是执行
	 */
	initWXShare:function(title,desc,link,img,succFun,cancFun){
		
		//本地测试需要注释
		
		wx.onMenuShareAppMessage({
		    title: title, // 分享标题
		    desc: desc, // 分享描述
		    link: link, // 分享链接
		    imgUrl: img, // 分享图标
		    type: "", // 分享类型,music、video或link，不填默认为link
		    dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
		    success: succFun,
		    cancel: cancFun
		});
	},
	/***
	 * 不做任何事
	 */
	nothingToDo:function(){
		
	},

	shareSuccess:function(){
		mask.show();
		$.post(param.ctx+"weixin/shareSuccess.do",{uaid:scanPage.uaid,giveCode:scanPage.giveCode,uuid:scanPage.queryUUID},function(data){
			mask.close();
			if(!data.success){
				alert("送礼失败,请重新操作");
			}else{
				pageChange("#scan");
			}
			
		});
		
		
	}
	
	
	
};