var util = {
	trim : function(obj) {
		var str = $(obj).val();
		$(obj).val( jQuery.trim(str));
	},
	getCharLength : function(str) {
		var iLength = 0;
		for (var i = 0; i < str.length; i++) {
			if (str.charCodeAt(i) > 255) {
				iLength += 2;
			} else {
				iLength += 1;
			}
		}
		return iLength;
	},
	isInt:function(str){
		var reg = new RegExp("^[0-9]*$");
		return reg.test(str)
	}
};