
var shipPage={
	tid:"#invenTable",
	
	btnFormat:function(value, row, index){
		var str="";
		if(row.shipQuantity>0){
			str="<input type=\"button\" value=\""+i18n.shipInfo+"\" onclick=\"infoDialog.open("+row.skuId+");\" >&nbsp;&nbsp;";
		}

		if(row.quantity>0){
			str+="<input type=\"button\" onclick=\"shipDialog.open("+row.skuId+","+index+",1);\" value=\""+i18n.ship+"\"  >"
		}
		
		addSerial();
		return str;
	},
	search:function(){
		var param={};
		param[skuName_page]=$("#prodName").val();
		param.skuNo=$("#prodCode").val();
		
		$(shipPage.tid).datagrid("reload",param);
	}
};

var shipDialog={
	did:"#shipDialog",
	tid:"#shipDialogTable",
	t3id:"#shipDialogType3",
	data:{},
	t2Data:{},
	isOpen:false,
	skuId:0,
	shipNum:0,
	prodName:"",
	shipType:1,
	openType:0,
	open:function(skuId,index,type){
		
		var rows=$(shipPage.tid).datagrid("getRows");
		
		var prodName= rows[index][skuName_page];
		
		shipDialog.prodName=prodName;
		$(shipDialog.did).dialog('setTitle', prodName+" - "+i18n.ship); 
		$(shipDialog.tid).datagrid("reload",{});
		$(shipDialog.did).dialog("open");
		shipDialog.data={};
		shipDialog.isOpen=true;
		shipDialog.skuId=skuId;
		shipDialog.shipNum=0;
		$("#shipNumber").html(0)
		shipDialog.openType=type;
	},

	chbFormat:function(value, row, index){
		var ced="";
		if(row.listSize==1){
			ced="checked=\"checked\"";
		}
		return "<input id=\"sd_chb_"+row.toCompany+"\" "+ced+" type=\"checkbox\" value=\""+value+"\" class=\"shipDialog_checkbox\"  onclick=\"shipDialog.onChb(this,'"+row.toCompany+"',"+index+")\">";
	},
	txtFormat:function(value, row, index){
		return "<input id=\"sd_txt_"+row.toCompany+"\" type=\"text\" class=\"shipDialog_txt\" value=\""+value+"\" onblur=\"shipDialog.onTxt(this,'"+row.toCompany+"',"+index+")\">";
	},
	txtNameFormat:function(value, row, index){
		return "<span id=\"sd_txt_name_"+row.toCompany+"\">"+value+"</span>";
	},
	countShipNumber:function(){
		var a=0;
		for (var key in shipDialog.data){
			var v=shipDialog.data[key];
			if(v!=null){
				a+=v.quan;
			}
		}
		$("#shipNumber").html(a);
	},
	onChb:function(obj,key,index){
		var id=key;
		key="key"+key;
		
		
		if(obj.checked){
			var num= $("#sd_txt_"+id).val();
			if(num==null || num==""){
				num=0;
			}
			var num_int=parseInt(num);
			var item={};
			item.id=id;
			item.name=$("#sd_txt_name_"+id).html();
			item.quan=num_int;
			
			
			
			shipDialog.data[key]=item;
		}else{
			shipDialog.data[key]=null;
		}
		shipDialog.countShipNumber();
		
	},
	onTxt:function(obj,key,index){
		var id=key;
		key="key"+key;
		var v= shipDialog.data[key];
		
		
		var r = /^[0-9]*[0-9]*$/
		var str=$("#sd_txt_"+id).val();
		if(str==null || str==""){
			str="0";
		}
		if(r.test(str)){
			var num=parseInt(str);
			$("#sd_txt_"+id).val(num)
			if(v!=null){
				
				v.quan=num;
				shipDialog.data[key]=v;
			}
		}else{
			$("#sd_txt_"+id).val(0);
			alert(i18n.msg001);
		}
		shipDialog.countShipNumber();
	},
	close:function(){
		shipDialog.isOpen=false;
		shipDialog.data={};
		
		$(".shipTypeDetail").hide();
		$("#shipType1").show();
		shipDialog.shipType=1;
		$("#shipNumber").html(0);
		
		$(".shipTypeRad").prop("checked",false);
		$("#shipTypeRad1").prop("checked",true);
		$("#shipMinNo").val(0);
		$("#shipMaxNo").val(0);
		
		
	},
	beforeLoad:function(param){
		param.data="";
		if(shipDialog.isOpen){
			var str= JSON.stringify(shipDialog.getDataList());
			param.data=str;
		}
	},
	getDataList:function(){
		var list={};
		for (var key in shipDialog.data){
			var v=shipDialog.data[key];
			if(v!=null){
				list["_"+v.id]=v.quan;
			}
		}
		return list;
	},
	getDataListForGrid:function(){
		shipDialog.shipNum=0;
		var list=[];
		for (var key in shipDialog.data){
			var v=shipDialog.data[key];
			if(v!=null && v.quan>0){
				var item={};
				item.toComName=v.name;
				item.id=v.id;
				item.page=v.quan;
				list.push(item);
				shipDialog.shipNum+=v.quan;
			}
		}
		return list;
	},
	shipTypeClick:function(obj){
		var id="shipType"+ obj.value
		$(".shipTypeDetail").hide();
		
		$("#"+id).show();
		shipDialog.shipType=obj.value;
		
		if(obj.value==3){
			
			$(shipDialog.t3id).datagrid("reload",{"skuId":shipDialog.skuId});
			$(shipDialog.t3id).datagrid("resize");
		}
		
		
	},
	openShipInveDialog:function(){
		var data= shipDialog.getDataListForGrid();

		if(data.length==0){
			alert(i18n.msg002);
			return;
		}
		
		var param={};
		param.skuId=shipDialog.skuId;

		param.type=shipDialog.shipType;
		param.num=$("#shipNumber").html();
		if(param.type==1){

		}else if(param.type==2){
			var r = /^[0-9]*[0-9]*$/
			param.max=$("#shipMaxNo").val();
			param.min=$("#shipMinNo").val();
			
			if(!r.test(param.max)){
				alert(i18n.msg005);
				return;
			}else{
				param.max=parseInt(param.max);
				if(param.max==0){
					alert(i18n.msg005);
					return;
				}
			}
			
			if(!r.test(param.min)){
				alert(i18n.msg006);
				return;
			}else{
				param.min=parseInt(param.min);
				if(param.min==0){
					alert(i18n.msg006);
					return;
				}
			}
			
			if(param.max<param.min){
				alert(i18n.msg007);
				return;
			}

			
		}else if(param.type==3){
			var i=0;
			for (var k in shipDialog.t2Data){
				i+=shipDialog.t2Data[k];
			}
			if(i==0){
				alert(i18n.msg003);
				return ;
			}
			param.t2Data=JSON.stringify(shipDialog.t2Data);;
		}
		
		shipInventoryDialog.open(param,data);
	},
	shipType2Fmt:function(value, row, index){
		if(value==null){
			value=0;
		}
		return "<input id=\"st2_"+row.produceQuantity+"\" class=\"st2_num\" type=\"text\"  value=\""+value+"\" onblur=\"shipDialog.onOhipTypeTxt(this,"+row.produceQuantity+","+row.quantity+")\">";
	},
	onOhipTypeTxt:function(obj,quan,max){
		var v= shipDialog.t2Data['_'+quan];
		
		
		var r = /^[0-9]*[0-9]*$/
			
			
			
		
		if(obj.value==null || obj.value==""){
				obj.value=0;
		}
		if(!r.test(obj.value)){
			alert(i18n.msg001);
			obj.value=0;
			return;
		}
		if(max<obj.value){
			alert(i18n.msg004);
			obj.value=0;
		}
		shipDialog.t2Data['_'+quan]=obj.value;
	}
	
	
};








var shipInventoryDialog={
	did:"#shipInventoryDialog",
	tid:"#shipInventoryDialogTable",
	trid:"#shipInventoryDialogTree",
	uaidData:null,
	compData:null,
	open:function(param,gridData){
		$(shipInventoryDialog.did).dialog("open");
		$(shipInventoryDialog.tid).datagrid("loadData",gridData);
		shipInventoryDialog.uaidData=null;
		shipInventoryDialog.compData=gridData;
		$("#reqLoading_loading").dialog("open");
		$.post(basicPath+"shipInfo/getShipInventory.do",param,function(data){
			$("#reqLoading_loading").dialog("close");
			if(data!=null){
				if(data.success){
					$("#shipInventoryDialogSumbit").show();
				}else{
					$("#shipInventoryDialogSumbit").hide();
				}
				
				
				shipInventoryDialog.uaidData=data.data;
				$(shipInventoryDialog.trid).treegrid('loadData',data.data);
				if(data.msg!=null && data.msg.length>0){
					var msg="";
					for (var i = 0; i < data.msg.length; i++) {
						msg+=data.msg[i]+"\n";
					}
					alert(msg);
				}
			}
			
		},"json");
	},
	close:function(){
		$(shipInventoryDialog.tid).datagrid("loadData",[]);
		$(shipInventoryDialog.trid).treegrid('loadData',[]);
	},
	submit:function(){
		var data={};
		data.produceId=shipDialog.skuId;
		data.produceName=shipDialog.prodName;
		data.companys=[];
		data.produces=[];
		
		$("#reqLoading_loading").dialog("open");

		var num=0;
		for (var i = 0; i < shipInventoryDialog.compData.length; i++) {
			var item=shipInventoryDialog.compData[i];
			var obj={};
			obj.companyName=item.toComName;
			obj.quantity=item.page;
			obj.id=item.id;
			data.companys.push(obj);
			
			num+=obj.quantity;
		}
		for (var i = 0; i < shipInventoryDialog.uaidData.length; i++) {
			var item=shipInventoryDialog.uaidData[i];
			var obj={};
			obj.uaid=item.uaid;
			data.produces.push(obj);
		}
		
		var str=JSON.stringify(data);
		
		$.post(basicPath+"shipInfo/saveShipInfo.do",{"data":str},function(data){
			$("#reqLoading_loading").dialog("close");
			if(data!=null){
				var msg=data.errMsg+"\n";
				for (var i = 0; i < data.companys.length; i++) {
					msg+=data.companys[i].errMsg+"\n";
				}
				for (var i = 0; i < data.produces.length; i++) {
					msg+=data.produces[i].errMsg+"\n";
				}
				alert(msg);
				if(data.errCode==0){
					$(shipInventoryDialog.did).dialog("close");
					$(shipDialog.did).dialog("close");
					shipPage.search();
					if( infoDialog.skuId >0){
						$(infoDialog.tid).datagrid("reload",{"skuId":infoDialog.skuId });
					}
				}
				
				debugger;
				var inveNum= $("#i_inve").html();
				var shipNum= $("#i_ship").html();
				
				$("#i_inve").html(inveNum-num);
				$("#i_ship").html(parseInt( shipNum)+num);
				
			}else{
				alert(i18n.sys_err);
			}
			
		},"json");
		
	}
};








var infoDialog={
	did:"#infoDialog",
	tid:"#infoDialogTable",
	skuId:0,

	open:function(skuId){

		$(infoDialog.did).dialog("open");
		$(infoDialog.tid).datagrid("reload",{"skuId":skuId});
		infoDialog.initProdData(skuId);
		infoDialog.skuId=skuId;
	},
	close:function(){
		$(infoDialog.tid).datagrid("loadData",{total:0,rows:[]});
		infoDialog.skuId=0;
	},
	statusFormat:function(value, row, index){
		if(value==1){
			return i18n.shipStatus;
		}
		return i18n.receiptStatus;
	},
	btnFormat:function(value, row, index){
		return "<input type=\"button\" value=\""+i18n.ship_info_detail+"\" onclick=\"shipInfoDialog.open("+value+","+index+");\" >";
	},
	initProdData:function(skuId){
		
		$.post(basicPath+"shipInfo/shipProduceInfo.do",{"skuId":skuId},function(data){
			if(data!=null){
				debugger;
				$("#i_prodName").html(data[skuName_page]);
				$("#i_skuNo").html(data.skuNo);
				$("#i_inve").html(data.quantity);
				$("#i_ship").html(data.shipQuantity);
				$("#i_receipt").html(data.receiptQuantity);
				if(data.quantity==0){
					$("#i_ship_btn").hide();
				}else{
					$("#i_ship_btn").show();
				}
				
				
			}
		},"json");
	},
	openShipDialog:function(){
		
		shipDialog.open(infoDialog.skuId,$("#i_prodName").html(),2);
	}
	
};

var shipInfoDialog={
	did:"#shipInfoDialog",
	tid:"#shipInfoDialogTable",
	shipId:-1,
	open:function(shipId,index){
		$(shipInfoDialog.did).dialog("open");
		shipInfoDialog.shipId=shipId;
		var rows= $(infoDialog.tid).datagrid("getRows");
		var row= rows[index];
		$("#s_shipNo").html(row.shipCode);
		$("#s_shipNum").html(row.quantity);
		var status="";
		if(row.status==1){
			status=i18n.shipStatus;
		}else{
			status=i18n.receiptStatus;
		}
		$("#s_status").html(status);
		var d = new Date(row.shipTime);
		$("#s_shipTime").html(d.format("yyyy-MM-dd hh:mm:ss"));
		
		$(shipInfoDialog.tid).datagrid("reload",{"shipId":shipId});
	},
	openShipUaid:function(){
		uaidDialog.open(shipInfoDialog.shipId,null);
	},
	openShipDetailUaid:function(shipDetailId){
		uaidDialog.open(null,shipDetailId);
	},
	btnFormat:function(value, row, index){
		if(row.receiptQuantity==null ||row.receiptQuantity==0){
			return "";
		}
		return "<input type=\"button\" value=\""+i18n.detail+"\" onclick=\"shipInfoDialog.openShipDetailUaid("+value+");\" >";
	},
	close:function(){
		$(shipInfoDialog.tid).datagrid("loadData",{total:0,rows:[]});
	}
	
}





var uaidDialog={
	did:"#uaidDialog",
	tid:"#uaidDialogTable",
	open:function(shipId,shipDetailId){
		$(uaidDialog.did).dialog("open");
		
		$.post(basicPath+"shipInfo/getTreeRoot.do",{"shipId":shipId,"shipDetailId":shipDetailId},function(data){
			$(uaidDialog.tid).treegrid('loadData',data);
		},"json");
	},
	close:function(){
		$(uaidDialog.tid).treegrid('loadData',[]);
	}
};























var test={
		prod:[],
		comp:[],
		addComp:function(){
			
			
			var c={};
			c.id=$("#test_comp").val();
			c.quantity=$("#test_comp_num").val();
			c.companyName=$("#test_comp_name").val();
			test.comp.push(c);
			
			$("#test_comp").val("")
			$("#test_comp_num").val("")
			$("#test_comp_name").val("");
			
			var str="";
			for (var i = 0; i < test.comp.length; i++) {
				str+="{"+test.comp[i].id+":"+test.comp[i].companyName+" - "+test.comp[i].quantity+"},";
			}
			$("#comp_list").html(str);
		},
		addProd:function(){
			var a= $("#test_prod").val();
			test.prod.push({"uaid":a});
			
			var str="";
			for (var i = 0; i < test.prod.length; i++) {
				str+=test.prod[i].uaid+",";
			}
			$("#prod_list").html(str);
			$("#test_prod").val("")
		},
		
		sub:function(){
			var obj={
					userName:$("#test_userName").val(),
					companyName:$("#test_compName").val(),
					password:$("#test_pwd").val(),
					locale:"zh_CN",
					companys:test.comp,
					produces:test.prod,
					produceId:$("#test_prodId").val(),
					produceName:$("#test_prodName").val()
				};
			
			
			var str=JSON.stringify(obj);
			$.post(basicPath+"shipInfo/test.do",{'data':str},function(data){
				var str=JSON.stringify(data);
				alert(str);
			},"json");
			
		}
		
}