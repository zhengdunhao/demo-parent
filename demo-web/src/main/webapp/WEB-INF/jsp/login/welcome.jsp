<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="/includes/taglibs.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<script type="text/javascript" language="javascript">
	
</script>
<title>书籍管理系统</title>
<link rel="stylesheet" type="text/css" href="${ctx}css/style.css" />
</head>
<body>
	<div id="parent" style="height: 100%; overflow: auto;">

		<div class="banner"
			style="background:url(${ctx}images/banner.jpg) no-repeat center;background-size:cover;height:20%;">

			<div id="btnAdministrator" style="float: right">
				<div><button type="button" class="btn" value="管理用户" 
				onclick="javascript:window.open('${ctx}customerController/customer/customerLoginPage.do','_blank');">
				管理用户
				</button></div>
			</div>
			<div id="btnCompany" style="float: right">
				<div><button type="button" class="btn" value="企业用户" 
				onclick="javascript:window.open('${ctx}customerController/customer/customerLoginPage.do','_blank');">
				企业用户
				</button></div>
			</div>

		</div>

		<div class="bottom" style="height: 80%; width: 100%;">
			<img src="${ctx}images/background.png"
				style="height: 100%; width: 100%">

		</div>

	</div>

</body>
</html>