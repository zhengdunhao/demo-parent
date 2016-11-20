var taskPage={
		uploadFormatter:function(value, row, index){
			if(value==null || value==""){
				return "";
			}
			
			return "<a href='"+param.ctx+"fhs?dn=upload_data.zip&fn="+value+"&t=1'>"+param.task_info044+"</a>";
		},
		downloadFormatter:function(value, row, index){
			if(value==null || value==""){
				return "";
			}
			if(row.status==2){
				return "<a href='"+param.ctx+"fhs?dn=result_data.zip&fn="+value+"&t="+row.status+"'>"+param.task_info044+"</a>";
			}
			if(row.status==3){
				return "<a href='"+param.ctx+"fhs?dn=error_report.zip&fn="+value+"&t="+row.status+"'>"+param.task_info044+"</a>";
			}
			
		},
		statusFormatter:function(value, row, index){
			if(value==1){
				return param.task_info047;
			}
			if(value==2){
				return param.task_info045;
			}
			if(value==3){
				return param.task_info046;
			}
			if(value==4){
				return param.task_info095;
			}
		},
		paramFormatter:function(data, row, index){
			var value=param.task_info051+"：";
			
			if(row.xml==1){
				value+=param.task_info052+" ";
			}
			if(row.csv==1){
				value+=param.task_info053+" ";			
			}
			if(row.xls==1){
				value+=param.task_info054+" ";
			}
			if(row.img==1){
				value+=param.task_info055+"(";
				if(row.imgSize=="L"){
					value+=param.task_info057;
				}
				if(row.imgSize=="M"){
					value+=param.task_info058;
				}
				if(row.imgSize=="S"){
					value+=param.task_info059;
				}
				
				value+=")";
			}
			var num=row.uaidNumber;
			if(num=!null && num>0){
				value+=";&nbsp;&nbsp;&nbsp;"+param.task_info049+"："+row.uaidNumber;
			}

			num=row.boxNumber;
			if(num=!null && num>0){
				value+=";&nbsp;&nbsp;&nbsp;"+param.task_info050+"："+row.boxNumber;
			}
			value+=";&nbsp;&nbsp;&nbsp;"+param.task_info060+"：";
			if(row.locale=="zh_CN"){
				value+=param.task_info061;
			}else{
				value+=param.task_info062;
			}
			value+=";&nbsp;&nbsp;&nbsp;"+param.task_info063+"：";
			if(row.uaidType==1){
				value+=param.task_info064;
			}else if(row.uaidType==2){
				value+=param.task_info065;
			}else{
				value+=param.task_info066;
			}
			return "<span title=\"" + value + "\" class=\"easyui-tooltip\">"
			+ value + "</span>"
		},
		download:function(fn,t){
			window.location.href=param.ctx+"fhs?fn=cd0dc4be-1f48-4ab5-b95b-28eec8553793.zip&t=2";

			window.location.href=param.ctx+"fhs?fn=8e0b0ea5-763e-4464-89e2-f732d06fd40f.zip&t=3";
		}
		
};


var addTask={
		id:"#addTaskDialog",
		obj:{},
		tabSelectIndex:0,
		uploadFail:false,
		uploader1:null,
		uploader2:null,

		open:function(){
			addTask.obj.fileName="";
			addTask.obj.xml=1;
			addTask.obj.xls=1;
			addTask.obj.img=1;
			addTask.obj.csv=1;
			addTask.obj.uaidNumber=0;
			addTask.obj.status=1;
			addTask.obj.boxNumber=0;
			addTask.obj.imgSize="M";
			addTask.obj.locale=param.locale;
			addTask.obj.uaidType=3;
			addTask.obj.timeDo=1;
			addTask.obj.scheduleTimeStr="";
			
			
			
			 $("#taskTab").tabs("select", 0);
			
			$("#uaidNumber").val("0");
			$("#boxNumber").val("0");
			$(addTask.id).dialog("open");
			
			$("#timeDoSelect").hide();
			

			$("input[name='resType']").each(function(){
				this.checked=true;
			}); 
			
			$("input[name='timeDo']").each(function(){
				if(this.value=='1'){
					this.checked=true;
				}else{
					this.checked=false;
				}
				
			});
			
			$("input[name='imgSize']").each(function(){
				if(this.value=='M'){
					this.checked=true;
				}else{
					this.checked=false;
				}
				
			});
			
			$("input[name='locale']").each(function(){
				if(this.value==param.locale){
					this.checked=true;
				}else{
					this.checked=false;
				}
			});
			
			$("input[name='uaidType']").each(function(){
				if(this.value==3){
					this.checked=true;
				}else{
					this.checked=false;
				}
			});
			
			
			$("#okbtn").hide();
			$("#fileName1").html( "");
			$("#fileName2").html( "");
			$(".webuploader-element-invisible").parent().css("width","100%");
			$(".webuploader-element-invisible").parent().css("height","100%");
		},
		onResClick:function(obj){
			
			var v= $("[name='resType']:checked");
			if(v.length==0){
				alert(param.task_info076);
				obj.checked=true;
			}
			
			if(obj.value=="img"){
				if(obj.checked){
					$("#imgSize1").show();
					$("#imgSize2").show();
				}else{
					$("#imgSize1").hide();
					$("#imgSize2").hide();
				}
			}
			
			if(obj.checked){
				addTask.obj[obj.value]=1;
			}else{
				addTask.obj[obj.value]=2;
			}
		},
		onRadioClick:function(obj){
			addTask.obj[obj.name]=obj.value;
		},
		onTabSelect:function(title,index){
			addTask.tabSelectIndex=index;
			$("#okbtn").hide();
			addTask.obj.uaidNumber=0;
			$("#uaidNumber").val("0");
			$("#fileName1").html( "");
			$("#fileName2").html( "");
			addTask.obj.fileName="";
		},
		uploadSuccess:function(data){
			
		},
		uploadError:function(data){
			alert(param.task_info077);
			$("#fileName1").html( "");
			$("#fileName2").html( "");
			addTask.uploadFail=true;
		},
		uploadComplete:function(file){
			if(addTask.uploader1!=null){
				addTask.uploader1.reset();
			}
			if(addTask.uploader2!=null){
				addTask.uploader2.reset();
			}
			
			
			if(!addTask.uploadFail){
				$("#okbtn").show();
				$("#fileName1").html( file.name);
				$("#fileName2").html( file.name);
			}
			$("#loading1").hide();
			$("#loading2").hide();
			
			
		},
		fileQueued:function(file){
			$("#okbtn").hide();
			addTask.uploadFail=false;
			$("#fileName1").html( param.task_info075);
			$("#fileName2").html( param.task_info075);
			
			$("#loading1").show();
			$("#loading2").show();
		},
		uploaderParam:{
		    auto: true,
		    swf: param.ctx + 'js/webuploader/Uploader.swf',
		    server: param.ctx + "task/upload.do",
		    pick: {id:'',multiple :false},
		    accept: {
		        title: 'zip',
		        extensions: 'zip',
		        mimeTypes: 'application/zip'
		    }
		},
		save:function(){
			if(addTask.obj.timeDo==2){
				addTask.obj.scheduleTimeStr=$("#scheduleTime").val();
				if(addTask.obj.scheduleTimeStr=="" || addTask.obj.scheduleTimeStr==null){
					alert(param.task_info093);
					return ;
				}else{
					var str= addTask.obj.scheduleTimeStr.replace("-","/");
					var d2=new Date(str+":00:00")

					var a= parseInt(d2.format("yyyyMMddhh"));
					var b=parseInt((new Date()).format("yyyyMMddhh"));
					if(a<=b){
						alert(param.task_info096);
						return;
					}
					
					
				}
			}
			
			if(addTask.tabSelectIndex==0 && addTask.obj.uaidNumber==0){
				alert(param.task_info078);
				return ;
			}
			$.post(param.ctx+"task/insert.do",addTask.obj,function(data){
				alert(data.msg);
				if(data.success){
					$("#taskTable").datagrid("reload");
					$(addTask.id).dialog("close");
				}
			});
		},
		onTextBlur:function(obj){
			if(obj.value==null || obj.value==""){
				obj.value=0;
				addTask.obj[obj.id]=0;
				return ;
			}
			var s = /^[0-9]*$/;
			if( !s.test(obj.value)){
				obj.value="";
				obj.focus();
				addTask.obj[obj.id]=0;
				alert(param.task_info079);
				return ;
			}
			addTask.obj[obj.id]=obj.value;
		},
		onTimeSelect:function(obj){
			addTask.obj.timeDo=obj.value;
			if(obj.value=="2"){
				var d=new Date();
				var l= d.getTime();
				l=l+(24*60*60*1000);
				var d2=new Date(l);
				var a= d2.format("yyyy-MM-dd")+" 00";

				$("#scheduleTime").val(a);
				$("#timeDoSelect").show();
			}else{
				$("#timeDoSelect").hide();
				addTask.obj.scheduleTimeStr="";
			}
		}
		
		
	
};






$(function(){ 
	var uploaderParam1=addTask.uploaderParam;
	uploaderParam1.pick.id="#filePicker1";
	addTask.uploader1 = WebUploader.create(uploaderParam1);
	addTask.uploader1.on( 'uploadSuccess', addTask.uploadSuccess);
	addTask.uploader1.on( 'uploadError', addTask.uploadError);
	addTask.uploader1.on( 'uploadComplete', addTask.uploadComplete);
	addTask.uploader1.on( 'fileQueued', addTask.fileQueued);
	
	var uploaderParam2=addTask.uploaderParam;
	uploaderParam2.pick.id="#filePicker2";
	addTask.uploader2 = WebUploader.create(uploaderParam1);
	addTask.uploader2.on( 'uploadSuccess', addTask.uploadSuccess);
	addTask.uploader2.on( 'uploadError', addTask.uploadError);
	addTask.uploader2.on( 'uploadComplete', addTask.uploadComplete);
	addTask.uploader2.on( 'fileQueued', addTask.fileQueued);
	
	

	
	

});
