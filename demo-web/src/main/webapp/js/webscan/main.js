// QRCODE reader Copyright 2011 Lazar Laszlo
// http://www.webqr.com

var gCtx = null;
var gCanvas = null;
var c=0;
var stype=0;
var gUM=false;
var webkit=false;
var moz=false;
var v=null;
var localStream;

var imghtml='<div id="qrfile"><canvas id="out-canvas" width="320" height="240"></canvas>'+
    '<div id="imghelp" style="text-align:center">drag and drop a QRCode here'+
	'or select a file</br>'+
	'<input type="file" onchange="handleFiles(this.files)"/>'+
	'</div>'+
'</div>';

var vidhtml = '<video id="v" autoplay></video>';

var AJAX_URL = 'ajax.jsp';

var uaid;

var browser = {
	versions:function(){
		var u = window.navigator.userAgent;
		var num ;
		if(u.indexOf('Mobile') > -1){
			//移动端
			if(!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
				//ios
					if(u.indexOf('iPhone') > -1){
						//iphone
						return "iPhone"   
					}else if(u.indexOf('iPod') > -1){
						//ipod   
						return "iPod"
					}else if(u.indexOf('iPad') > -1){
						//ipad
						return "iPad"
					}
			}else if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1){
				//android
				num = u.substr(u.indexOf('Android') + 8, 3);
				return {"type":"Android", "version": num};
			}else if(u.indexOf('BB10') > -1 ){
				//黑莓bb10系统
				return "BB10";
			}else if(u.indexOf('IEMobile')){
				//windows phone
				return "Windows Phone"
			}
		}else if(u.indexOf('Trident') > -1){
			//IE
			return "IE";
		}else if(u.indexOf('Presto') > -1){
			//opera
			return "Opera";
		}else if(u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1){
			//firefox
			return "Firefox";
		}else if(u.indexOf('AppleWebKit'> -1) && u.indexOf('Safari') > -1){
			//苹果、谷歌内核
			if(u.indexOf('Chrome') > -1){
				//chrome   
				return "Chrome";
			}else if(u.indexOf('OPR')){
				//webkit Opera
				return "Opera_webkit"
			}else{
				//Safari
				return "Safari";
			}
		}
	},
	language:function() {
		var baseLang = 'en';
		if (navigator.userLanguage) {  

			baseLang = navigator.userLanguage.substring(0,2).toLowerCase();  

		 } else {  

			 baseLang = navigator.language.substring(0,2).toLowerCase();  

		}  
		return baseLang;
	}
}



function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}
function drop(e) {
  e.stopPropagation();
  e.preventDefault();

  var dt = e.dataTransfer;
  var files = dt.files;
  if(files.length>0)
  {
	handleFiles(files);
  }
  else
  if(dt.getData('URL'))
  {
	qrcode.decode(dt.getData('URL'));
  }
}

function handleFiles(f)
{
	var o=[];
	
	for(var i =0;i<f.length;i++)
	{
        var reader = new FileReader();
        reader.onload = (function(theFile) {
        return function(e) {
            gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);

			qrcode.decode(e.target.result);
        };
        })(f[i]);
        reader.readAsDataURL(f[i]);	
    }
}

function initCanvas(w,h)
{
    gCanvas = document.getElementById("qr-canvas");
    gCanvas.style.width = w + "px";
    gCanvas.style.height = h + "px";
    gCanvas.width = w;
    gCanvas.height = h;
    gCtx = gCanvas.getContext("2d");
    gCtx.clearRect(0, 0, w, h);
}


function captureToCanvas() {
	
    if(stype!=1)
        return;
    if(gUM)
    {
        try{
            gCtx.drawImage(v,0,0);
            try{
                qrcode.decode();
            }
            catch(e){       
                console.log(e);
				//处理异常
                setTimeout(captureToCanvas, 500);
            };
        }
        catch(e){       
                console.log(e);
                setTimeout(captureToCanvas, 500);
        };
    }
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

//
function read(a)
{

	
	stopWebCam();
	
	//Couldn't find enough finder patterns
	
	if(a=="Couldn't find enough finder patterns"){
		$("#spanProvid").html(param.msg02);
	}else{
		if(a.indexOf(UAID_DOWNLOAD_PATH_NEW)>=0){
			var str= a.split(UAID_DOWNLOAD_PATH_NEW);
			$("#fileSelect").val("");
			window.location.href = ctx+"uaidInfo/webScanQueqy.do?code="+str[1];
		}else{
			$("#spanProvid").html(param.msg01);
		}
		
		
	}
	
    
	
}	

function getTokenSuccess (data) {
	//alert ($.trim(data) + "|" + uaid);
	var resultJSON = eval("(" + $.trim(data) + ")");
	//alert(resultJSON.errCode + '|' + resultJSON.apiToken);
	
	var json = new Object();
		
	json.uaid = uaid;
	json.apiToken = resultJSON.apiToken;
	json.locale = browser.language();
	json.recordType = 1;
	
	if (browser.versions() == 'iPhone' || browser.versions() == 'iPad' || browser.versions() == 'iPod') {
		json.platformType = 2;
	} else if (browser.versions().type && browser.versions().type == 'Android') {
		json.platformType = 1;
	} else if (browser.versions() == 'BB10' || browser.versions() == 'Windows Phone' ) {
		json.platformType = 3;
	} else {
		json.platformType = 4;
	}

	//alert(uaid + '|' + JSON.stringify(json));

	if (resultJSON.errCode == 0) {

		$.ajax(
			{ 
				type: 'POST', 
				url:AJAX_URL,
				data: 'act=2&data=' + JSON.stringify(json),
				success:getMessage
			}
		);
	}
	uaid = null;
}

function getMessage (data) {
	//alert ($.trim(data));
	var resultJSON = eval("(" + $.trim(data) + ")");
	
	//document.getElementById("result").innerHTML = data;
	showMessage(resultJSON);
}

function showMessage (data) {
	var htmlStr = '';
	
	if (data) {
		if (data.errCode == 0) {
	
			htmlStr += '<div style="background-color:rgb(240, 246, 145);padding:5px">';
			htmlStr += '<img width="20px" '
			if(data.isShow == 1) {
				htmlStr += 'src="suc.png"';//'<p style="color:green; font-weight:bold; font-size:14px">';
			} else {
				htmlStr += 'src="warning.png"';//'<p style="color:red; font-weight:bold; font-size:14px">';
			}
			htmlStr += '/><br>';
			
			htmlStr += '<p style="word-break: keep-all; word-wrap:break-word;">' + data.uaidScanMsg1 + '</p>';
			htmlStr += '<font style="word-break: keep-all; word-wrap:break-word;">' + data.uaidScanMsg2 + '</font>';
			htmlStr += '</div>';
			
			htmlStr += '<table border=0 width="95%"><tr>';
			
			htmlStr += '<td width=1px>';

			if (data.socialImg && data.socialImg != 'undefined') {
				htmlStr += '<a target="_blank" href="' + data.socialImg + '"><img width="100px" src="' + data.socialImg + '"/></a><br>';
			} 
			
			for (i=0;i<data.imgList.length;i++) {
				htmlStr += '<a target="_blank" href="' + data.imgList[i].bigUrl + '"><img width="100px" src="' + data.imgList[i].smallUrl + '"/></a><br>';
			}
			
			htmlStr += '</td>';
			htmlStr += '<td valign="top">'
			for (i=0;i<data.textList.length;i++) {
				if (data.textList[i].fieldCode == 'name' 
					|| data.textList[i].fieldCode == 'skuNo'
					|| data.textList[i].fieldCode == 'lot'
					|| data.textList[i].fieldCode == 'cateId') {
					htmlStr += '<b>';
					htmlStr += data.textList[i].key;
					htmlStr += '</b><br>';
					htmlStr += data.textList[i].value;
					htmlStr += '<br>';
				} 
			}
			htmlStr += '</td></tr></table>'
			
			
			document.getElementById("result").innerHTML = htmlStr;
			
			document.getElementById("spanProvid").innerHTML = "When you download AccessReal within the next 24 hours and register, input this one-time-use code to claim 1000 reward points!! Code: " + getRandom(999999);
		} else {
			var html="<br>";
			if (data.errCode == 140801) {
				html+="<b style='color:red'>You have tried N invalid enquires. Please try to enquiry after M minutes.</b><br><br>"
			} else {
				html+="<b style='color:red'>" + data.errMsg + "</b><br><br>";
			}
			
			document.getElementById("result").innerHTML=html;
		}

	}
}

//get uaid
function getUAID (url) {
	var msg = '';
	if (url && url.length > 0) {
		var params = url.split('&');
		for (i = 0;i < params.length;i++) {
			var temps = params[i].split('u=');
			if (temps.length == 2) {
				return temps[1];
			} else {
				msg = 'QRCode is ERROR';
			}
		}
		
		
	} else {
		msg = 'QRCode is NULL';
	}
	
	if (msg.length > 0) {	
		alert (msg);
	}
	
	return '';
}



function isCanvasSupported(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}
function success(stream) {
	localStream = stream;
    if(webkit) {
        v.src = window.webkitURL.createObjectURL(stream);
    } else {
		if(moz) {
			v.mozSrcObject = stream;
			v.play();
		} else {
			v.src = stream;
		}
	}
    gUM=true;
    setTimeout(captureToCanvas, 500);
}
		
function error(error) {
    gUM=false;
	alert(error);
    return;
}

function load(w,h)
{
	if(isCanvasSupported() && window.File && window.FileReader)
	{
		initCanvas(w,h);
		qrcode.callback = read;
		document.getElementById("mainbody").style.display="inline";

		if (browser.versions() == 'iPhone' || browser.versions() == 'iPad' || browser.versions() == 'iPod') {
			setimg();
		} else {
			setwebcam();
		}
		
        
	}
	else
	{
		document.getElementById("mainbody").style.display="inline";
		document.getElementById("mainbody").innerHTML='<p id="mp1">QRCode scanner for HTML5 capable browsers</p><br>'+
        '<br><p id="mp2">Sorry your browser is not supported.</p><br><br>'+
        '<p id="mp1">Please try <a href="http://www.mozilla.com/firefox"><img src="firefox.png"/></a> or <a href="http://chrome.google.com"><img src="chrome_logo.gif"/></a> or <a href="http://www.opera.com"><img src="Opera-logo.png"/></a></p>';
	}
}

function stopWebCam() {
	document.getElementById("spanProvid").innerHTML = "";
	if (stype == 1 && localStream) {
		if (moz) {
			gCanvas.style.display = "none";
		}
		localStream.getVideoTracks().forEach(function(videoTrack) {
						videoTrack.stop();
					});
		stype = 0;
		gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
	}
}

function setwebcam()
{
	document.getElementById("spanProvid").innerHTML = "";
	document.getElementById("result").innerHTML="<br>- scanning -<br><br>";
    if(stype==1)
    {
        setTimeout(captureToCanvas, 500);    
        return;
    }
    var n=navigator;
    document.getElementById("outdiv").innerHTML = vidhtml;
    v=document.getElementById("v");

    if(n.getUserMedia) {
        n.getUserMedia({video: true, audio: false}, success, error);
    } else {
		if(n.webkitGetUserMedia)
		{
			webkit=true;
			n.webkitGetUserMedia({video:true, audio: false}, success, error);
		} else {
			if(n.mozGetUserMedia)
			{
				moz=true;
				n.mozGetUserMedia({video: true, audio: false}, success, error);
				if (browser.versions().type == "Android") {
					gCanvas.style.display = "inline";
			
				}
			}
		}
	}

    //document.getElementById("qrimg").src="qrimg2.png";
    //document.getElementById("webcamimg").src="webcam.png";
    document.getElementById("qrimg").style.opacity=0.2;
    document.getElementById("webcamimg").style.opacity=1.0;

    stype=1;
    setTimeout(captureToCanvas, 500);
}
function setimg()
{
	stopWebCam();
	document.getElementById("spanProvid").innerHTML = "";
	document.getElementById("result").innerHTML="<br><br><br>";
    if(stype==2)
        return;
    document.getElementById("outdiv").innerHTML = imghtml;
    //document.getElementById("qrimg").src="qrimg.png";
    //document.getElementById("webcamimg").src="webcam2.png";
    document.getElementById("qrimg").style.opacity=1.0;
    document.getElementById("webcamimg").style.opacity=0.2;
    var qrfile = document.getElementById("qrfile");
    qrfile.addEventListener("dragenter", dragenter, false);  
    qrfile.addEventListener("dragover", dragover, false);  
    qrfile.addEventListener("drop", drop, false);
    stype=2;
}

function getRandom(n){
       return Math.floor(Math.random()*n+1)
}



