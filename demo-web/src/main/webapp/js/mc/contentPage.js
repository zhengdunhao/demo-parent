var contentData={};

	var cont = {
		skuId : "",
		searchTag:[],
		getTrueFalse:function(value){
			if (value == 1) {
				return txt.msg014;
			}
			return txt.msg015;
		},
		getType:function(value){
			if (value == 1) {
				return txt.type1;
			}
			if (value == 2) {
				return txt.type2;
			}
			if (value == 3) {
				return txt.type3;
			}
			if (value == 4) {
				return txt.type4;
			}
			if (value == 5) {
				return txt.type5;
			}
		},
		getState:function(value){
			if (value == 1) {
				return txt.msg012;
			}
			return txt.msg013;
		},
		getTagStr:function(list){
			var str="";
			for (var i = 0; i < list.length; i++) {
				str+=","+list[i].tagName;
			}
			if(str!=""){
				str=str.substring(1);
			}
			return str;
		},
		needLoginFormat : function(value, row, index) {
			return cont.getTrueFalse(value);
		},
		needBuyFormat : function(value, row, index) {
			return cont.getTrueFalse(value);
		},
		typeFormat : function(value, row, index) {
			 return cont.getType(value);
		},
		stateFormat : function(value, row, index) {
			return cont.getState(value);
			
		},
		btnFormat : function(value, row, index) {
			var html = "<div class='del'  onclick='cont.loadData("+value+",cont.openDetailDialog);'>"+txt.msg019+"</div>";
			html += "<div class='del'  onclick='cont.loadData("+value+",cont.openEditDialog);'>"+txt.msg020+"</div>";
			//html += "<button>"+txt.msg021+"</button>";
			return html;
		},
		search : function() {
			var param = {};
			param.skuId = this.skuId;
			param.title = $("#name").val();
			param.needLogin = $("#needLogin").val();
			param.needBuy = $("#needPay").val();
			param.type = $("#type").val();
			param.state = $("#state").val();
			
			var str="";
			for (var i = 0; i < cont.searchTag.length; i++) {
				str+=","+cont.searchTag[i].id;
			}
			param.tagId=str;

			$('#skuTable').datagrid('load', param);
		},
		
		openDetailDialog : function(data,tag) {
			$("#dtitleCn").html(data.cnTitle);
			$("#dtitleTw").html(data.twTitle);
			$("#dtitleEn").html(data.enTitle);
			$("#dneedLogin").html(cont.getTrueFalse( data.needLogin));
			$("#dneedBuy").html(cont.getTrueFalse(data.needBuy));
			$("#dtype").html(cont.getType(data.type));
			$("#dstate").html(cont.getState(data.state));
			$("#dremark").html(data.remark);
			$("#dtag").html(cont.getTagStr(tag));
			$("#durl").html(data.url);
			$("#dprice").html(data.price);
			$("#dpoints").html(data.points);
			
			if(data.needBuy==0){
				$(".dpay").hide();
			}else{
				$(".dpay").show();
			}
			
			contentData.data=data;
			contentData.tag=tag;
			
			
			$("#detailDialog").dialog("open");
		},
		clickEditBtn:function(){
			$("#detailDialog").dialog("close");
			cont.openEditDialog(contentData.data,contentData.tag);
		},
		openEditDialog : function(data,tag,title) {
		
			if(title==null){
				title=txt.msg020;
			}
			$("#editDialog").dialog({"title":title});
			
			
			contentData.data=data;
			contentData.tag=tag;
			
			$("#etitleCn").val(data.cnTitle);
			$("#etitleTw").val(data.twTitle);
			$("#etitleEn").val(data.enTitle);
			$("#eneedLogin").val(data.needLogin);
			$("#eneedBuy").val(data.needBuy);
			$("#etype").val(data.type);
			$("#estate").val(data.state);
			$("#eremark").val(data.remark);
			$("#etag").html(cont.getTagStr(tag));
			$("#eurl").val(data.url);
			
			
			
			if(data.price!=null && data.price!="" && (data.price+"").indexOf(".")<0){
				$("#eprice").val(data.price+".0");
			}else{
				$("#eprice").val(data.price);
			}
			
			cont.showEpay(data.needBuy);
			
			
			$("#epoints").val(data.points);

			$("#editDialog").dialog("open");
		},
		showEpay:function(needBuy){
			if(needBuy==0){
				$(".epay").hide();
				$("#eprice").val("");
				$("#epoints").val("");
			}else{
				$(".epay").show();
				
			}
		},
		
		delData : function(id) {

		},
		loadData:function(id,fun){
			contentData={};
			$.post(txt.ctx+"mc/ctx/getDtail.do",{"id":id},function(data){
				if(data.success){
					fun(data.obj,data.tag);
				}else{
					alert(data.msg);
				}
			});
		},
		searchOpenTag:function(){
			tagSelect.openSelectDialog(cont.searchTag, cont.showSearchTag);
		},
		
		showSearchTag:function(data){
			cont.searchTag=data;
			tagSelect.showTag(data,"stag");
			return true;
		},
		
		
		editOpenTag:function(){
			
			tagSelect.openSelectDialog(contentData.tag, cont.showEditTag);
		},
		showEditTag:function(data){
			contentData.tag=data;
			tagSelect.showTag(data,"etag");
			return true;
		},
		saveData:function(){
			var data={};
			if(contentData.data!=null){
				data.id=contentData.data.id;
			}
			data.skuId=cont.skuId;
			
			data.cnTitle=$("#etitleCn").val();
			data.twTitle=$("#etitleTw").val();
			data.enTitle=$("#etitleEn").val();
			data.needLogin=$("#eneedLogin").val();
			data.needBuy=$("#eneedBuy").val();
			data.type=$("#etype").val();
			data.state=$("#estate").val();
			data.remark=$("#eremark").val();
			data.url=$("#eurl").val();
			data.price=$("#eprice").val();
			data.points=$("#epoints").val();
			
			if(!cont.validate(data)){
				return ;
			}
			if(data.price==""){
				data.price=0;
			}
			if(data.points==""){
				data.points=0;
			}
			
			
			var str="";
			for (var i = 0; i < contentData.tag.length; i++) {
				str+=","+contentData.tag[i].id;
			}
			data.tagId=str;
			var url=txt.ctx+"mc/ctx/update.do";
			if(data.id==null || data.id==""){
				url=txt.ctx+"mc/ctx/insert.do";
			}
			
			$.post(url,data,function(data){
				if(data.success){
					$('#skuTable').datagrid('reload');
					$("#editDialog").dialog("close");
				}else{
					alert(data.msg);
				}
				
			});
			
		},
		add:function(){
			cont.openEditDialog({needLogin:0,needBuy:0,type:1,state:1,price:'0.0',points:0},[],txt.msg023);
		},
		validate:function(data){

			
			var title="";
			if(data.cnTitle=="" ||data.cnTitle== null ){
				title+=","+txt.msg007;
			}
			if(data.twTitle=="" ||data.twTitle== null ){
				title+=","+txt.msg008;
			}
			if(data.enTitle=="" ||data.enTitle== null ){
				title+=","+txt.msg009;
			}
			if(data.url=="" ||data.url== null ){
				title+=","+txt.msg016;
			}
			if(title!=""){
				title=title.substring(1);
				alert(title+txt.msg024);
				return false;
			}
			
			if(data.needBuy==1 && data.needLogin!=1){
				alert(title+txt.msg025);
				return false;
			}

			if(data.needBuy==1 ){
				var reg1 = new RegExp(/^\d+(\.\d{1,2})?$/);
				var reg2 = new RegExp(/^[0-9]*$/);
				
				if(data.price!="" && !reg1.test(data.price)){
					
					alert(txt.msg026);
					return false;
				}
				
				if(data.points!="" && !reg2.test(data.points)){
					
					alert(txt.msg027);
					return false;
				}
				if( (data.price=="" ||  parseFloat( data.price)==0 ) && (data.points=="" ||  parseFloat( data.points)==0 )  ){
					alert(txt.msg052);
					return false;
				}
			}
			
			
			return true;
			
			//
			
		},
		exports:function(){
			var param = {};
			param.skuId = this.skuId;
			param.title = $("#name").val();
			param.needLogin = $("#needLogin").val();
			param.needBuy = $("#needPay").val();
			param.type = $("#type").val();
			param.state = $("#state").val();
			
			var str="";
			for (var i = 0; i < cont.searchTag.length; i++) {
				str+=","+cont.searchTag[i].id;
			}
			param.tagId=str;
			
			$.post(txt.ctx+"mc/ctx/exportExcelParam.do",param,function(data){
				if(data!=null){
					window.location.href=txt.ctx+"mc/ctx/exportExcel.do?code="+data;
				}
			})
		}
		
		
		
	};