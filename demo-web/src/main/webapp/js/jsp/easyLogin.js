


var easyLogin={
		timerObj:null,
		imgId:"#lf_img",
		ulId:"#lf_ul",
		btnOkId:"#lf_ok",
		btnCanId:"#lf_cancel",
		lblId:"#lf_lbl",
		otpId:"#otpSpan",
		notOtpId:"#notOtpSpan",
		easy_login_key:"",
		ctx:"",
		imgUrl:"easylogin/genQRCode.do",
		key:"",
		
		OTPLogin:function(){
			
			
			$(easyLogin.ulId).hide();
			$(easyLogin.btnOkId).hide();
			$(easyLogin.btnCanId).hide();
			$(easyLogin.imgId).show();
			$(easyLogin.lblId).show();
			
			$("#button-wechat-id").hide();
			$("#lf_h2").hide();
			$("#Error").hide();
			
			$(easyLogin.notOtpId).removeClass();
			$(easyLogin.otpId).removeClass();
			
			$(easyLogin.notOtpId).addClass("notactive");
			$(easyLogin.otpId).addClass("active");
			
			var param={type:easyLogin.key};
			
			$.post(easyLogin.ctx+easyLogin.imgUrl,param,function(data){
				if(data.success){
					$(easyLogin.imgId).attr("src",data.img);
					easyLogin.easy_login_key=data.code;
					setTimeout("easyLogin.timeCount()",2000);
				}else{
					alert(data.msg);
				}
				
			});
			
			
			
			
			
		},
		NotOTPLogin:function(){
			
			$(easyLogin.ulId).show();
			$(easyLogin.btnOkId).show();
			$(easyLogin.btnCanId).show();
			
			$("#lf_h2").show();
			$("#Error").show();
			$("#button-wechat-id").show();
			$(easyLogin.imgId).hide();
			$(easyLogin.lblId).hide();
			
			$(easyLogin.notOtpId).removeClass();
			$(easyLogin.otpId).removeClass();
			
			$(easyLogin.notOtpId).addClass("active");
			$(easyLogin.otpId).addClass("notactive");
			
			clearTimeout(easyLogin.timerObj);
		},
		timeCount:function(){
			$.ajax({  
		          type : "post",  
		          url : easyLogin.ctx+"easylogin/checkLogined.do",  
		          data : {code:easyLogin.easy_login_key},  
		          async : false,  
		          success : function(data){  
		            	if(data.result){
		            		
		            		window.location.href=easyLogin.ctx+"easylogin/login.do?code="+easyLogin.easy_login_key;
		            	}else{
		            		
		            		easyLogin.timerObj=setTimeout("easyLogin.timeCount()",1000);
		            	}
		          	}  
		          }); 
			
		},
		guid:function() {
			  function s4() {
			    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			  }
			  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
			}
		
		
};

