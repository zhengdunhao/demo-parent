
var inven={
	
	search:function(){
		var param={
			//lot:$("#lotNo").val()
		};
		param[skuName_page]=$("#skuName").val();
		$("#invenTable").datagrid("reload",param);
		
		
	},
	detail:function(gid){
		$('#detail').dialog('open');
		inven.initTree(gid);
	},
	btnFormat:function(value, row, index){

		return "<input type=\"button\" value=\""+i18n.detail+"\" onclick=\"inven.detail('"+row.skuId+"');\" >";
	},
	dailogClose:function(){
		$('#packDetail').treegrid('loadData',[]);
	},
	initTree:function(lot){
		
		$.post(basicPath+"package/getPackNode.do",{"skuId":lot},function(data){
			$('#packDetail').treegrid('loadData',data);
			addSerial();
		},"json");
	}
};

var packTest={
	prod:[],
	add:function(){
		var a= $("#test_prod").val();
		packTest.prod.push({"uaid":a});
		
		var str="";
		for (var i = 0; i < packTest.prod.length; i++) {
			str+=packTest.prod[i].uaid+",";
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
				tempId:$("#test_tempId").val(),
				level:$("#test_level").val(),
				uaid:$("#test_box").val(),
				detail:packTest.prod
			};
		
		
		var str=JSON.stringify(obj);
		$.post(basicPath+"package/test.do",{'savePack':str},function(data){
			var str=JSON.stringify(data);
			alert(str);
			packTest.prod=[];
			$("#prod_list").html("");
			$("#test_box").val("");
		},"json");
		
	}
};