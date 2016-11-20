<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="/includes/taglibs.jsp"%>
<%@ include file="/includes/meta-jquery.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<script type="text/javascript" language="javascript">

	function showLoginForm(){
		$("#loginForm").show();
	}

</script>
<title>书籍管理系统</title>
<link rel="stylesheet" type="text/css" href="${ctx}css/style.css" />
</head>
<body>
	<div id="parent" style="height: 100%; overflow: auto;">

		<div class="banner"
			style="background:url(${ctx}images/banner.jpg) no-repeat center;background-size:cover;height:20%;">

			<div id="register" style="float: right">
				<div><button type="button" class="btn" 
				onclick="javascript:window.open('${ctx}userRegisterController/register.do','_blank');">
				注 册
				</button></div>
			</div>
			<div id="login" style="float: right">
				<div><button type="button" class="btn" 
				onclick="javascript:showLoginForm();void(0);">
				登 录
				</button></div>
			</div>

		</div>

		<div class="bottom" style="height: 80%; background:url(${ctx}images/background.png) no-repeat center;background-size:cover;">

			<div id="loginForm" class="loginForm" >
				<form>
					    <ul >
		            	<li>用户名 ：<span id="spanCompany" style="color: Red;font-size:11px"></span></li>
		            	<li><input id="companyName" value="${companyName}" name="companyName" type="text" class="txt_input" onblur="oncompanyName();"/></li>
		            	<li>密码 ：<span id="spanCompany" style="color: Red;font-size:11px"></span></li>
		            	<li><input id="companyName" value="${companyName}" name="companyName" type="text" class="txt_input" onblur="oncompanyName();"/></li>
		            	<li>验证码 ：<span id="spanVcode" style="color: Red;font-size:11px"></span></li>
			            	<li>
								<input type="text" id="vCode" name="vCode" class="txt_input1" onblur="onVcode();" maxlength="6" />
			            		<img id="codeId" src="${ctx}validateCode" onclick="refreshCode();"/>
			            </li>	
		            	</ul>
		            	<label><span><input type="button" class="button" value="登 录" onclick="btnLogin(this);" /></label>
		          	    <label></span><span><input type="button" class="button" value="注 册" onclick="btnRegister(this);"/></span></label>
				</form>
			</div>
			

		</div>

	</div>

</body>
</html>