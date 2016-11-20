
var uploader=null;






var pageObj = {

	
	textFormater : function(value, row, index) {
		if (value == null) {
			return "";
		}
		return "<span title=\"" + value + "\" class=\"easyui-tooltip\">"
				+ value + "</span>";
	},
	isShowFormater : function(value, row, index) {
		if (value == 1) {
			return param.showTxt;
		} else {
			return param.notShowTxt;
		}
	},
	textEditFormater : function(value, row, index) {
		var html = "";
		html += "<input type=\"button\" value=\"" + param.editTxt
				+ "\" onclick=\"textGrid.edit(" + index + ");\">";
		if (value == null || value == "") {
			html += "<input type=\"button\" value=\"" + param.deleteTxt
					+ "\" onclick=\"textGrid.del(" + index + "," + row.id
					+ ",'" + row.editId + "');\">";
		}
		return html;
	},
	imgEditFormater : function(value, row, index) {
		var html = "";
		html += "<input type=\"button\" value=\"" + param.editTxt
				+ "\" onclick=\"imgGrid.edit(" + index + ");\">";
		if (value == null || value == "") {
			html += "<input type=\"button\" value=\"" + param.deleteTxt
					+ "\" onclick=\"imgGrid.del(" + index + "," + row.id
					+ ",'" + row.editId + "');\">";
		}
		return html;
	},
	imgFormater : function(value, row, index) {
		var html = "";
		if(value!=null && value!=""){
			var url = param.ctx + "fhs?fn=" +row.urlBig;

			
			html="<a href=\"javascript:imgGrid.view('" + row.urlBig + "');\" onmouseover=\"pageObj.openImgView('"+value+"');\"  onmouseout=\"pageObj.closeImgView();\">"+param.lbl36+"</a>"
		}
		
		
		return html;
	},
	openImgView:function(value){

		var url = param.ctx + "skuCustInfo/showImg.do?name=" +value;
		$("#img_view").dialog("open");
		$("#img_view_img").attr("src",url);
	},
	closeImgView:function(){
		$("#img_view_img").attr("src","");
		$("#img_view").dialog("close");
	},
	
	save : function() {
		var data = [];
		var deleteId=[];
		
		if (!pageObj.valdataText()) {
			return;
		}
		
		if(!textGrid.endEditing()){
			return ;
		}
		
		if(!imgGrid.endEditing()){
			return ;
		}
		if(!imgGrid.validataImg()){
			return;
		}
		$("#reqLoading_loading").dialog("open");
		
		var textData= $(textGrid.gid).datagrid("getRows");
		var imgData=$(imgGrid.gid).datagrid('getRows');
		
		var saveData={};
		
		saveData.name_cn=$("#name_cn").val();
		saveData.name_en=$("#name_en").val();
		saveData.name_tw=$("#name_tw").val();
		saveData.skuNo=$("#skuNo").val();
		//saveData.lot=$("#lot").val();
		
		var inactiveOper = "";
		$('input[name="inactiveOper"]:checked').each(
				function(){
	                inactiveOper += $(this).val()+",";
				}
			)
		saveData.inactiveOper = inactiveOper;
		
		
		saveData.imgData=JSON.stringify(imgData);
		saveData.textData=JSON.stringify(textData);
		
		
		
		for (var i = 0; i < textGrid.deleteId.length; i++) {
			deleteId.push(textGrid.deleteId[i]);
		}
		for (var i = 0; i < imgGrid.deleteId.length; i++) {
			deleteId.push(imgGrid.deleteId[i]);
		}
		
		
		
		saveData.cateId=$("#cateId").val();
		saveData.skuId=$("#skuId").val();
		saveData.deleteId=JSON.stringify(deleteId);
		var url=param.ctx + "skuCustInfo/saveData.do";
		$.post(url,saveData,function(res){
			if(res.success){
				alert(param.msg017);
				
				window.location.href = param.ctx+ "skuController/sku/skuManage.do";
			}else{
				alert(res.msg);
			}
			$("#reqLoading_loading").dialog("close");
		});
	},
	skuNoChange:function(){
		

		var skuNo=$("#skuNo").val();
		if(skuNo==""){
			return;
		}
		
		$.ajax ({
			type : "post",
			url : param.ctx+"skuController/verifySkuNo.do",
			data : {"skuNo" : skuNo},
			dataType : 'json',
			async : false,  
			success : function(map) {
				var flag = map.msg;
				if(flag == "false") {
					alert(param.msg009);
					$("#skuNo").val("");
				} 
			}
		});
		
	},
	valdataText : function() {
		debugger;
		var name_cn=$("#name_cn").val();
		var name_en=$("#name_en").val();
		var name_tw=$("#name_tw").val();
		var skuNo=$("#skuNo").val();
		//var lot=$("#lot").val();
		var cateId=$("#cateId").val();
		
		if(name_cn==""){
			alert(param.msg019);
			return false;
		}
		if(name_en==""){
			alert(param.msg020);
			return false;
		}
		if(name_tw==""){
			alert(param.msg030);
			return false;
		}
		if(skuNo==""){
			alert(param.msg022);
			return false;
		}

		return true;;
	},
	endWith:function(v,str){
		if(str==null||str==""||v.length==0||str.length>v.length)
		  return false;
		if(v.substring(v.length-str.length)==str)
		  return true;
		else
		  return false;
		return true;
	},
	isInt:function(i){

		var re = /^\d*$/;
		return re.test(i);
	},
	cancel:function(){
		window.location.href = param.ctx+ "skuController/sku/skuManage.do";
	},
	radioFormatter:function(value, row, index){
		var ched="";
		if(value=="3"){
			ched="checked='checked'";
		}
		return "<input name='gridRadio' class='gridRadio' type='radio' "+ched+"  onclick='imgGrid.radioClick("+index+")' >";
	}
		

};

var textGrid = {
	editingRowIndex : -1,
	editingRow : null,
	deleteId : [],
	gid : "#textTable",
	did : "#textTableDialog",

	editIndex :undefined,
	editField:undefined,
	onClickCell:function(index, field){
		if (textGrid.endEditing()){
			$(textGrid.gid).datagrid('selectRow', index)
					.datagrid('editCell', {index:index,field:field});
			textGrid.editIndex = index;
			textGrid.editField=field;
		}
	},
	checkCellNotNull:function(){
		var item= $(textGrid.gid).prev().find(".datagrid-editable-input");
		if(item==null || item.length==0){
			return true;
		}
		var v= $(textGrid.gid).prev().find(".datagrid-editable-input").val();
		
		
		if(v=="" || v==null){
			alert(param.msg023);
			return false;
		}
		return true;
	},
	
	endEditing:function(){
		if (textGrid.editIndex == undefined){return true}
		if (textGrid.checkCellNotNull()){
			$(textGrid.gid).datagrid('endEdit', textGrid.editIndex);
			textGrid.editIndex = undefined;
			return true;
		} else {
			return false;
		}
	},
	edit : function(index) {
		textGrid.isAdd = 0;
		var rows = $(textGrid.gid).datagrid('getRows');
		textGrid.editingRow = rows[index];
		textGrid.editingRowIndex = index;

		$("#tcnKey").val(textGrid.editingRow.cnKey);
		$("#tenKey").val(textGrid.editingRow.enKey);
		$("#ttwKey").val(textGrid.editingRow.twKey);
		$("#torderNum").val(textGrid.editingRow.orderNum);
		var skuId=$("#skuId").val();

		if (textGrid.editingRow.readonly == 1 ) {
			$(".contentRow").hide();
		} else {
			$("#tcnValue").val(textGrid.editingRow.cnValue);
			$("#tenValue").val(textGrid.editingRow.enValue);
			$("#ttwValue").val(textGrid.editingRow.twValue);
		}
		$(textGrid.did).dialog("open");
	},
	add : function() {
		textGrid.isAdd = 1;
		textGrid.editingRow = {
			cnKey : null,
			cnValue : null,
			twKey : null,
			twValue : null,
			createTime : null,
			enKey : null,
			enValue : null,
			fieldCode : null,
			id : null,
			isShow : 2,
			modifyTime : null,
			orderNum : null,
			readonly : 2,
			skuId : null,
			type : 1,
			urlBig : null,
			urlSmall : null,
		};
		var rows = $(textGrid.gid).datagrid('getRows');
		$("#torderNum").val(rows.length + 1);
		
		

		$(textGrid.did).dialog("open");
	},
	del : function(index, id, editId) {
		$(textGrid.gid).datagrid('deleteRow', index);
		if (id != null) {
			textGrid.deleteId.push(id);
		}


	},
	ok : function() {

		if (!textGrid.validata()) {
			return;
		}
		textGrid.editingRow["cnKey"] = $("#tcnKey").val();
		textGrid.editingRow["enKey"] = $("#tenKey").val();
		textGrid.editingRow["cnValue"] = $("#tcnValue").val();
		textGrid.editingRow["enValue"] = $("#tenValue").val();
		
		textGrid.editingRow["twKey"] = $("#ttwKey").val();
		textGrid.editingRow["twValue"] = $("#ttwValue").val();


		if (textGrid.editingRowIndex < 0) {

			$(textGrid.gid).datagrid('appendRow', textGrid.editingRow);
		} else {
			$(textGrid.gid).datagrid('updateRow', {
				index : textGrid.editingRowIndex,
				row : textGrid.editingRow
			});
		}

		textGrid.close();
		$(textGrid.did).dialog("close");
	},
	cancel : function() {
		textGrid.close();
		$(textGrid.did).dialog("close");
	},
	close : function() {
		textGrid.editingRowIndex = -1;
		textGrid.editingRow = null;
		$(".contentRow").show();
		$("#tcnKey").val("");
		$("#tenKey").val("");
		$("#tcnValue").val("");
		$("#tenValue").val("");
		
		$("#ttwKey").val("");
		$("#ttwValue").val("");

	},
	validata : function() {

		var ck = $("#tcnKey").val();
		var ek = $("#tenKey").val();
		var cv = $("#tcnValue").val();
		var ev = $("#tenValue").val();
		
		var tk = $("#ttwKey").val();
		var tv = $("#ttwValue").val();



		if (ck == "" || ck == null) {
			alert(param.msg001);
			return false;
		}
		
		if (tk == "" || tk == null) {
			alert(param.msg026);
			return false;
		}
		if (ek == "" || ek == null) {
			alert(param.msg002);
			return false;
		}

		if (textGrid.editingRow.readonly != 1) {
			if (cv == "" || cv == null || cv.length>4000) {
				alert(param.msg003);
				return false;
			}
			
			if (tv == "" || tv == null || tv.length>4000) {
				alert(param.msg027);
				return false;
			}
			if (ev == "" || ev == null || ev.length>4000) {
				alert(param.msg004);
				return false;
			}
		}



		return true;

	}

};

var imgGrid = {
	editingRowIndex : -1,
	editingRow : null,
	deleteId : [],
	gid : "#imgTable",
	did : "#imgTableDialog",
	fileName:"",
	add:function(){
		imgGrid.editingRowIndex = -1;
		imgGrid.editingRow = {
			cnKey : null,
			cnValue : null,
			twKey : null,
			twValue : null,
			createTime : null,
			enKey : null,
			enValue : null,
			fieldCode : null,
			id : null,
			isShow : 2,
			modifyTime : null,
			orderNum : null,
			readonly : 2,
			skuId : null,
			type : 2,
			urlBig : null,
			urlSmall : null,
		};
		
		var rows = $(imgGrid.gid).datagrid('getRows');
		$("#iorderNum").val(rows.length + 1);
		
		$.post(param.ctx +"skuCustInfo/deleteFile.do",{"isDel":0});
		$(".webuploader-element-invisible").parent().css("width","100%");
		$(".webuploader-element-invisible").parent().css("height","100%");
		$(imgGrid.did).dialog("open");
	},
	ok:function(){
		

		imgGrid.editingRow.cnKey=$("#icnKey").val();
		imgGrid.editingRow.enKey=$("#ienKey").val();
		imgGrid.editingRow.cnValue=$("#icnValue").val();
		imgGrid.editingRow.enValue=$("#ienValue").val();
		
		imgGrid.editingRow.twKey=$("#itwKey").val();
		imgGrid.editingRow.twValue=$("#itwValue").val();

		
		if(!imgGrid.validata()){
			return ;
		}
		var rows= $(imgGrid.gid).datagrid('getRows');
		if(rows.length==0){
			imgGrid.editingRow.type=3;
		}
		
		var editId = imgGrid.editingRow["editId"];
		if (editId == null) {
			editId = "b" + Math.floor(Math.random() * 10000000);
			imgGrid.editingRow["editId"] = editId;

		}

		if (imgGrid.editingRowIndex < 0) {

			$(imgGrid.gid).datagrid('appendRow', imgGrid.editingRow);
		} else {
			$(imgGrid.gid).datagrid('updateRow', {
				index : imgGrid.editingRowIndex,
				row : imgGrid.editingRow
			});
		}


		imgGrid.close(0);
		$(imgGrid.did).dialog("close");
		
		
	},
	
	edit:function(index){
		imgGrid.editingRowIndex=index;
		var rows= $(imgGrid.gid).datagrid("getRows");
		imgGrid.editingRow=rows[index];
		

		
		$("#icnKey").val(imgGrid.editingRow.cnKey);
		$("#ienKey").val(imgGrid.editingRow.enKey);
		$("#icnValue").val(imgGrid.editingRow.cnValue);
		$("#ienValue").val(imgGrid.editingRow.enValue);
		
		$("#itwKey").val(imgGrid.editingRow.twKey);
		$("#itwValue").val(imgGrid.editingRow.twValue);

		$("#file").val("");
		$("#smallUrl").attr("src",param.ctx + "skuCustInfo/showImg.do?name="+imgGrid.editingRow.urlSmall);
		
		$(".webuploader-element-invisible").parent().css("width","100%");
		$(".webuploader-element-invisible").parent().css("height","100%");
		
		$(imgGrid.did).dialog("open");
		
	},
	
	fileUpload : function() {
		var v= $("#file").val();
		if(v==""){
			return ;
		}
		if(!pageObj.endWith(v,"gif") && !pageObj.endWith(v,"bmp") && !pageObj.endWith(v,"jpg") && !pageObj.endWith(v,"png")  ){
			alert(param.msg010);
			$("#file").val("");
			return ;
		}
		
		imgGrid.editingRow.urlSmall=null;
		imgGrid.editingRow.urlBig=null;
		$("#reqLoading_loading").dialog("open");
		$.ajaxFileUpload({
			url : param.ctx + "skuCustInfo/uploadImg.do",
			secureuri : false,
			dataType : 'json',
			fileElementId : 'file',
			success : function(data, status) {

				if (data.success) {
					var url = param.ctx + "skuCustInfo/showImg.do?name=" + data.urlSmall;
					$("#smallUrl").attr("src", url);
					
					imgGrid.editingRow.urlSmall=data.urlSmall;
					imgGrid.editingRow.urlBig=data.urlBig;
					
				} else {
					alert(data.msg);
					$("#file").val("");
				}
				$("#reqLoading_loading").dialog("close");
			},
			error : function(data, status, e) {
				alert(param.msg007);
			}
		});
	},
	cancel:function(){
		$(imgGrid.did).dialog("close");
		imgGrid.close();
	},
	close:function(isDel){
		if(isDel==null){
			isDel==1;
		}

			$.post(param.ctx +"skuCustInfo/deleteFile.do",{"isDel":isDel});

		
		$("#icnKey").val("");
		$("#ienKey").val("");
		$("#icnValue").val("");
		$("#ienValue").val("");
		
		$("#itwKey").val("");
		$("#itwValue").val("");

		$("#file").val("");
		$("#smallUrl").attr("src","");
		
		textGrid.editingRow=null;
		textGrid.editingRowIndex=-1;
		
	},
	view:function(img){
		var url = param.ctx + "skuCustInfo/showImg.do?name=" +img;
		window.open(url);  
	},
	del : function(index, id, editId) {
		$(imgGrid.gid).datagrid('deleteRow', index);
		if (id != null) {
			imgGrid.deleteId.push(id);
		}

	},
	validata:function(){
		if(imgGrid.editingRow.urlSmall==null){
			alert(param.msg012);
			return false;
		}
		if(imgGrid.editingRow.cnKey==null || imgGrid.editingRow.cnKey==""){
			alert(param.msg013);
			return false;
		}
		
		if(imgGrid.editingRow.twKey==null || imgGrid.editingRow.twKey==""){
			alert(param.msg028);
			return false;
		}
		if(imgGrid.editingRow.enKey==null || imgGrid.editingRow.enKey==""){
			alert(param.msg014);
			return false;
		}
		if(imgGrid.editingRow.cnValue==null || imgGrid.editingRow.cnValue=="" ||imgGrid.editingRow.cnValue.length>4000){
			alert(param.msg015);
			return false;
		}
		
		if(imgGrid.editingRow.twValue==null || imgGrid.editingRow.twValue=="" ||imgGrid.editingRow.twValue.length>4000){
			alert(param.msg029);
			return false;
		}
		if(imgGrid.editingRow.enValue==null || imgGrid.editingRow.enValue=="" ||imgGrid.editingRow.enValue.length>4000){
			alert(param.msg016);
			return false;
		}

		
		
		
		return true;
	},
	editIndex:undefined,
	onClickCell:function(index, field){
		if (imgGrid.endEditing()){
			$(imgGrid.gid).datagrid('selectRow', index)
					.datagrid('editCell', {index:index,field:field});
			imgGrid.editIndex = index;
			imgGrid.editField=field;
		}
	},
	checkCellNotNull:function(){
		var item= $(imgGrid.gid).prev().find(".datagrid-editable-input");
		if(item==null || item.length==0){
			return true;
		}
		var v= $(imgGrid.gid).prev().find(".datagrid-editable-input").val();
		
		
		if(v=="" || v==null){
			alert(param.msg023);
			return false;
		}
		return true;
	},
	
	endEditing:function(){
		if (imgGrid.editIndex == undefined){return true}
		if (imgGrid.checkCellNotNull()){
			$(imgGrid.gid).datagrid('endEdit', imgGrid.editIndex);
			imgGrid.editIndex = undefined;
			return true;
		} else {
			return false;
		}
	},

	radioClick:function(index){
		debugger;
		var rows= $(imgGrid.gid).datagrid('getRows');
		for (var i = 0; i < rows.length; i++) {
			if(i==index){
				rows[i].type=3;
			}else{
				rows[i].type=2;
			}
		}
	},
	validataImg:function(){
		var rows= $(imgGrid.gid).datagrid('getRows');
		var count=0;
		for (var i = 0; i < rows.length; i++) {

			if(rows[i].type==3){
				count++;
			}
		}
		if(count>0){
			return true;
		}
		alert(param.msg024);
		return false;
	}

};


$(function(){ 

	uploader = WebUploader.create({

	    // 选完文件后，是否自动上传。
	    auto: true,

	    // swf文件路径
	    swf: param.ctx + 'js/webuploader/Uploader.swf',

	    // 文件接收服务端。
	    server: param.ctx + "skuCustInfo/uploadImg.do",

	    pick: {id:'#filePicker',multiple :false},
	    
	    

	    accept: {
	        title: 'Images',
	        extensions: 'gif,jpg,jpeg,bmp,png',
	        mimeTypes: 'image/*'
	    }
	});

	uploader.on( 'uploadSuccess', function( data ) {
		var small= imgGrid.fileName+"_scale."+data.ext;
		var big= imgGrid.fileName+"."+data.ext;
		
		var url =  param.ctx + "skuCustInfo/showImg.do?name=" + small;
		$("#smallUrl").attr("src", url);
		
		imgGrid.editingRow.urlSmall=small;
		imgGrid.editingRow.urlBig=big;
		
	});

	uploader.on( 'uploadError', function( data ) {
		alert(param.msg007);
	});
	
	uploader.on( 'uploadComplete', function( file ) {
		uploader.reset();
		$("#reqLoading_loading").dialog("close");
	});
	
	uploader.on( 'fileQueued', function( file ) {
		
		var unixTimestamp = new Date();
		 
		
		imgGrid.fileName= "product"+"_"+unixTimestamp.format("yyyyMM")+"_"+ (new Date()).valueOf()+""+Math.floor(Math.random()*1000000);
		uploader.option("formData",{"fileName":imgGrid.fileName});
		$("#reqLoading_loading").dialog("open");
	});
	
	

	
	

});
