var tagSelect={
	callback:null,
	tagList: [],
	selectList:[],
	width:475,
	height:455,
	locale:"zh_CN",
	getTypeUrl:window.location.origin+"/mc/tag/getAllTagType.do",
	getTagUrl:window.location.origin+"/mc/tag/getAllTag.do",
	showAllTag:false,

	txtCn:{
		tagListTitle : "待选择标签",
		selectedListTitle : "已选择标签",
		selectTxt : "选择",
		deleteTxt : "删除",
		searchTxt:"搜索标签",
		type:"标签类型",
		search:"搜索",
		tagname:"标签名称",
		save:"确定",
		title:"选择标签",
		loading:"加载中..."
	},
	txtEn:{
		tagListTitle : "Pending Tag", 
		selectedListTitle : "Selected Tag", 
		selectTxt : "Select", 
		deleteTxt : "Delete", 
		searchTxt:"Search Tag", 
		type:"Tag Type", 
		search:"Search", 
		tagname:"Tag Name", 
		save:"OK", 
		title:"Select Tag", 
		loading:"Loading..." 
		
	},
	txtTw:{
		tagListTitle : "待選擇標籤",
		selectedListTitle : "已選擇標籤",
		selectTxt:"選擇",
		deleteTxt:"刪除",
		searchTxt:"搜索標籤",
		type:"標籤類型",
		search:"搜索",
		tagname:"標籤名稱",
		save:"確定",
		title:"選擇標籤",
		loading:"加載中..."
	},
	txt:{},
	
	
	
	init:function(locale,option){
		tagSelect.locale=locale;
		if(option!=null){
			if(option.getTypeUrl!=null ){
				tagSelect.getTypeUrl=option.getTypeUrl;
			}
			if(option.getTagUrl!=null ){
				tagSelect.getTagUrl=option.getTagUrl;
			}
			if(option.width!=null){
				tagSelect.width=option.width;
			}
			if(option.height!=null){
				tagSelect.height=option.height;
			}
			
		}
		
		if($('#tagSelectDialog').length==0){
			if(locale=="zh_TW"){
				this.txt=this.txtTw;
			}else if(locale=="en_US"){
				this.txt=this.txtEn;
			}else{
				this.txt=this.txtCn;
			}
			$("body").append(tagSelect.getHtml());
			
			
			
			$('#tagSelectDialog').dialog({
			    title: this.txt.title,
			    buttons: [{
                    text:tagSelect.txt.save,
                    iconCls:'icon-ok',
                    handler:function(){
                    	tagSelect.saveClick();
                    }
                }],
                width: tagSelect.width,
			    height: tagSelect.height,

			    closed: true,
			    modal: true
			});
			
			
			
			$.post(tagSelect.getTypeUrl,{locale:this.locale},function(data){
				var html="<option value=\"\"></option>";
				for (var int = 0; int < data.length; int++) {
					html+="<option value=\""+data[int].value+"\">"+data[int].text+"</option>";
				}
				$("#selectTagType").html(html);
				
			});
			
						
			$("#tagListTitle").text(this.txt.tagListTitle);
			$("#selectedListTitle").text(this.txt.selectedListTitle);
			
		}
	},
	selectTag:function(id){
		tagSelect.listItemChange(tagSelect.tagList,tagSelect.selectList,id);
	},
	deleteTag:function(id){
		tagSelect.listItemChange(tagSelect.selectList,tagSelect.tagList,id);
	},
	listItemChange:function(fromList,toList,id){
		var i = 0
		for (; i < fromList.length; i++) {
			if((fromList[i].id+'') ==(id +'')){
				break;
			}
		}
		
		var obj=fromList.splice(i,1);
		
		toList.push(obj[0]);
		tagSelect.loadData();
	},

	getHtml:function(){
		var html='';

		
		 html+='<div id="tagSelectDialog" class="tagSelectDialog"><table class="dialogBody"><tr><td><table class="search">';
		 html+='<tr><td colspan="2">'+this.txt.searchTxt+'</td></tr><tr><td  class="search_name">'+this.txt.type+'</td><td  class="search_value">';
		 html+='<select id="selectTagType" style="width: 100%"></select></td></tr><tr><td class="search_name">'+this.txt.tagname+'</td><td class="search_value">';
		 html+='<input id="selectTagName" style="width: 100%" type="text"></td></tr><tr><td colspan="2" class="search_btn"><button onclick="tagSelect.getSelectTag();">'+this.txt.search+'</button></td>';
		 html+='</tr><tr><td colspan="2">&nbsp;<td></tr></table></td><td></td></tr><tr><td><div class="tag_div"><table class="tag_title" ><tr><td id="tagListTitle"></td>';
		 html+='</tr></table><table id="tagList" class="tag_list" ></table></div></td><td><div class="tag_div" ><table class="tag_title">';
		 html+='<tr><td id="selectedListTitle"></td></tr></table><table class="tag_list"  id="selectedList" ></table></div></td></tr>';
		 html+='</table></div>';
		
		//<tr><td colspan="2"><button class="save_btn" onclick="tagSelect.saveClick()">'+this.txt.save+'</button></td></tr>
		
		return html;
	},
	openSelectDialog:function(selected,callback){
		$("#selectTagType").val("");
		$("#selectTagName").val("");
		
		tagSelect.tagList=[];
		
		tagSelect.callback=callback;
	
		tagSelect.selectList=selected;
		if(tagSelect.showAllTag){
			tagSelect.getSelectTag();
		}else{
			tagSelect.loadData();
		}
		
		$('#tagSelectDialog').dialog('open');
	},
	getSelectTag:function(){
		var param={
				id:$("#selectTagType").val(),
				name:$("#selectTagName").val(),
				locale:tagSelect.locale
		};
		
		$("#tagList").html("<tr><td>"+tagSelect.txt.loading+"</td></tr>")
		$.post(tagSelect.getTagUrl,param,function(data){
			var str=[];
			for (var int = 0; int < tagSelect.selectList.length; int++) {
				str.push(tagSelect.selectList[int].id+"");
			}
			tagSelect.tagList=[];
			for (var int = 0; int < data.length; int++) {
				if(str.indexOf(data[int].id+"")<0){
					tagSelect.tagList.push(data[int]);
				}
			}

			tagSelect.loadData();
		});
		
		       		
		
	},
	loadData:function(){
		tagSelect.addRow("tagList",tagSelect.tagList,"tagSelect.selectTag",this.txt.selectTxt,"item_button_choose");
		tagSelect.addRow("selectedList",tagSelect.selectList,"tagSelect.deleteTag",this.txt.deleteTxt,"item_button_delete");
	},
	addRow:function(id,data,fun,btnTxt,clazz){
		var html="";
		$("#"+id).html("");
		for (var i = 0; i < data.length; i++) {
			if(data[i].name==null && data[i].tagName!=null){
				data[i].name=data[i].tagName;
			}
			
			html+="<tr class=\"tag_item\" \">";
			html+="<td class=\"item_name\" >"+data[i].name+"</td>";
			html+="<td class=\"item_btn\"><button class=\""+clazz+"\" onclick=\""+fun+"('"+data[i].id+"')\">"+btnTxt+"</button></td>";
			html+="</tr>";
		}
		$("#"+id).html(html);
	},
	saveClick:function(){
		
		if(tagSelect.callback(tagSelect.selectList)){
			$('#tagSelectDialog').dialog('close');
		}
		
	},
	showTag:function(data,id){
		
		var str="";
		for (var i = 0; i < data.length; i++) {
			str+="<p class='selectTag'>"+data[i].name+"</p>";
		}

		$("#"+id).html(str);
		
	},
	
		
};