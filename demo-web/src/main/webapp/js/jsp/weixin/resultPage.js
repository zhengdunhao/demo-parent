$(document).ready(function(){
	resultPage.init();
});

var mask=null;

var resultPage={
		

		init:function(){
			mui.init();
			mask = mui.createMask(function(){});
			mask.show();//显示遮罩
			wx.config(param.weixinConfig);
			
			wx.ready(function(){
				
				wx.onMenuShareAppMessage({
				    title: param.nickname+'送礼给你', // 分享标题
				    desc: '关注爱真品公众号收礼', // 分享描述
				    link: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc81dc935326d2d00&redirect_uri=http%3A%2F%2F111.223.87.200%2FCDSServer%2Fweixin%2FcheckLogin.do%3Fpage%3DreceivePage%26uaid%3DA23456789&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect", // 分享链接
				    imgUrl: "https://mp.weixin.qq.com/misc/getheadimg?fakeid=3081328963&token=214332171&lang=zh_CN", // 分享图标
				    type: "", // 分享类型,music、video或link，不填默认为link
				    dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
				    success: function () { 
				        
				    },
				    cancel: function () { 
				        
				    }
				});
				mask.close();//关闭遮罩
			});

			wx.error(function(res){


			});
		},
}