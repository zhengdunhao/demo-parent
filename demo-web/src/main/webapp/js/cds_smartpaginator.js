(function ($) {
    $.fn.extend({
        smartpaginator: function (options) {
        	
        	var i18n={
        		zh_CN:{
        			page1:"第",
        			page2:"页 | ",
        			of1:"共",
        			of2:"页",
        			size1:"每页",
        			size2:"行",
        			totel1:"共",
        			totel2:"条记录"
        			
        			
        				
        		},
        		en_US:{
        			page1:"Page",
        			page2:"",
        			of1:"of",
        			of2:"",
        			size1:"View",
        			size2:"record",
        			totel1:"Found total",
        			totel2:"records"
        		}
        	};
        	
            var settings = $.extend({
                totalrecords: 0,
                recordsperpage: 0,
                length: 10,
                next: 'Next',
                prev: 'Prev',
                first: 'First',
                last: 'Last',
                go: 'Go',
                theme: 'green',
                display: 'double',
                select:0,
                showseelct:false,
                selecturl:'',
                onselect:null,//wyman add 2014-8-12
                initval: 1,
                datacontainer: '', //data container id
                dataelement: '', //children elements to be filtered e.g. tr or div
                onchange: null,
                controlsalways: false,
                i18n:"zh_CN"
            }, options);
            return this.each(function () {
                var currentPage = 0;
                var startPage = 0;
                var totalpages = parseInt(settings.totalrecords / settings.recordsperpage);
                if (settings.totalrecords % settings.recordsperpage > 0) totalpages++;
                if(totalpages == 0) {
                	totalpages ++;
                }
                var initialized = false;
                var container = $(this).addClass('pager').addClass(settings.theme);
                container.find('ul').remove();
                container.find('div').remove();
                container.find('span').remove();
                var dataContainer;
                var dataElements;
                if (settings.datacontainer != '') {
                    dataContainer = $('#' + settings.datacontainer);
                    dataElements = $('' + settings.dataelement + '', dataContainer);
                }
                var list = $('<ul/>');
                var btnPrev = $('<div/>').text(settings.prev).click(function () { if ($(this).hasClass('disabled')) return false; currentPage = parseInt(list.find('li a.active').text()) - 1; navigate(--currentPage); }).addClass('btn');
                var btnNext = $('<div/>').text(settings.next).click(function () { if ($(this).hasClass('disabled')) return false; currentPage = parseInt(list.find('li a.active').text()); navigate(currentPage); }).addClass('btn');
                var inputPage = $('<input/>').attr('type', 'text').keydown(function (e) {
                    if (isTextSelected(inputPage)) inputPage.val('');
                    if (e.which >= 48 && e.which < 58) {
                        var value = parseInt(inputPage.val() + (e.which - 48));
                        if (!(value > 0 && value <= totalpages)) e.preventDefault();
                    } else 
                    if (e.which >= 96 && e.which < 106) {
                        var value = parseInt(inputPage.val() + (e.which - 96));
                        if (!(value > 0 && value <= totalpages)) e.preventDefault();
                    } else if (!(e.which == 8 || e.which == 46)) e.preventDefault();
                });
                var btnGo = $('<input/>').attr('type', 'button').attr('value', settings.go).addClass('btn').click(function () { if (inputPage.val() == '') return false; else { currentPage = parseInt(inputPage.val()) - 1; navigate(currentPage); } });
                var selectSize = $('<select/>').attr('name', 'listSize').attr('id', 'listSize').addClass('sele')/*.change(function () { currentPage = 1; })*/;
                selectSize.append('<option value="5">5</option>');
                if(settings.select == 10) {
                	selectSize.append('<option value="10" selected>10</option>');
                } else {
                	selectSize.append('<option value="10">10</option>');
                }
                if(settings.select == 15) {
                	selectSize.append('<option value="15" selected>15</option>');
                } else {
                	selectSize.append('<option value="15">15</option>');
                }
                if(settings.select == 20) {
                	selectSize.append('<option value="20" selected>20</option>');
                } else {
                	selectSize.append('<option value="20">20</option>');
                }
                selectSize.change(function () {
                		var listSize =document.getElementById("listSize").value;
                		//wyman edit 2014-8-12
                		if(settings.onselect!=null){
                			settings.onselect(listSize);
                		}else{
                			window.document.location=settings.selecturl + listSize;
                		}
                		
                		
                	}
                );
                container.append(btnPrev).append($('<div/>').addClass('short').append(inputPage)).append(btnNext);
                if (settings.display == 'single') {
                    btnGo.css('display', 'none');
                    inputPage.css('display', 'none');
                }
                
                buildNavigation(startPage);
                if (settings.initval == 0) settings.initval = 1;
                currentPage = settings.initval - 1;
                navigate(currentPage);
                initialized = true;
                function showLabels(pageIndex) {
                	//debugger;
                	
                	var text=i18n[settings.i18n];
                	
                	container.find(".page_text").html(text.page1);
                    container.find('span').remove();
                    var upper = (pageIndex + 1) * settings.recordsperpage;
                    if (upper > settings.totalrecords) upper = settings.totalrecords;
                    container.append($('<span/>').text(text.page2+text.of1)).append($('<span/>').append($('<b/>').text(totalpages)))
                    		.append($('<span/>').text(text.of2+' | '+text.size1));
                    if(settings.showselect) {
                    	container.append(selectSize);
                    }		
                    container.append($('<span/>').text(text.size2+' | '+text.totel1+' ' + settings.totalrecords + ' '+text.totel2));
                    /*if (evt.keyCode==13) {
                    	if (inputPage.val() == '') return false; else { currentPage = parseInt(inputPage.val()) - 1; navigate(currentPage); } 
                    }*/
                }
                document.onkeydown = function(evt) {
                	var evt = window.event?window.event:evt;
                	if (evt.keyCode==13) {
                 	   if (inputPage.val() == '') {
                 		   return false; 
                 	   }
                 	   else { 
                 		   currentPage = parseInt(inputPage.val()) - 1; 
                 		   navigate(currentPage); 
                 	   }
                 	}
                }
                function buildNavigation(startPage) {
                    list.find('li').remove();
                    if (settings.totalrecords <= settings.recordsperpage) return;
                    for (var i = startPage; i < startPage + settings.length; i++) {
                        if (i == totalpages) break;
                        list.append($('<li/>')
                                    .append($('<a>').attr('id', (i + 1)).addClass(settings.theme).addClass('normal')
                                    .attr('href', 'javascript:void(0)')
                                    .text(i + 1))
                                    .click(function () {
                                        currentPage = startPage + $(this).closest('li').prevAll().length;
                                        navigate(currentPage);
                                    }));
                    }
                    showLabels(startPage);
                    inputPage.val((startPage + 1));
                    list.find('li a').addClass(settings.theme).removeClass('active');
                    list.find('li:eq(0) a').addClass(settings.theme).addClass('active');
                    //set width of paginator
                    var sW = list.find('li:eq(0) a').outerWidth() + (parseInt(list.find('li:eq(0)').css('margin-left')) * 2);
                    var width = sW * list.find('li').length;
                    list.css({ width: width });
                    showRequiredButtons(startPage);
                }
                function navigate(topage) {
                    //make sure the page in between min and max page count
                    var index = topage;
                    var mid = settings.length / 2;
                    if (settings.length % 2 > 0) mid = (settings.length + 1) / 2;
                    var startIndex = 0;
                    if (topage >= 0 && topage < totalpages) {
                        if (topage >= mid) {
                            if (totalpages - topage > mid)
                                startIndex = topage - (mid - 1);
                            else if (totalpages > settings.length)
                                startIndex = totalpages - settings.length;
                        }
                        buildNavigation(startIndex); showLabels(currentPage);
                        list.find('li a').removeClass('active');
                        inputPage.val(currentPage + 1);
                        list.find('li a[id="' + (index + 1) + '"]').addClass('active');
                        var recordStartIndex = currentPage * settings.recordsperpage;
                        var recordsEndIndex = recordStartIndex + settings.recordsperpage;
                        if (recordsEndIndex > settings.totalrecords)
                            recordsEndIndex = settings.totalrecords % recordsEndIndex;
                        if (initialized) {
                            if (settings.onchange != null) {
                                settings.onchange((currentPage + 1), recordStartIndex, recordsEndIndex);
                            }
                        }
                        if (dataContainer != null) {
                            if (dataContainer.length > 0) {
                                //hide all elements first
                                dataElements.css('display', 'none');
                                //display elements that need to be displayed
                                if ($(dataElements[0]).find('th').length > 0) { //if there is a header, keep it visible always
                                    $(dataElements[0]).css('display', '');
                                    recordStartIndex++;
                                    recordsEndIndex++;
                                }
                                for (var i = recordStartIndex; i < recordsEndIndex; i++)
                                    $(dataElements[i]).css('display', '');
                            }
                        }

                        showRequiredButtons();
                    }
                }
                function showRequiredButtons() {
                    if (totalpages > 1/*settings.length*/) {
                        if (currentPage > 0) {
                            if (!settings.controlsalways) {
                                btnPrev.css('display', '');
                            }
                            else {
                                btnPrev.css('display', '').removeClass('disabled');
                            }
                        }
                        else {
                            if (!settings.controlsalways) {
                                btnPrev.css('display', 'none');
                            }
                            else {
                                btnPrev.css('display', '').addClass('disabled');
                            }
                        }

                        if (currentPage == totalpages - 1) {
                            if (!settings.controlsalways) {
                                btnNext.css('display', 'none');
                            }
                            else {
                                btnNext.css('display', '').addClass('disabled');
                            }
                        }
                        else {
                            if (!settings.controlsalways) {
                                btnNext.css('display', '');
                            }
                            else {
                                btnNext.css('display', '').removeClass('disabled');
                            }
                        }
                    }
                    else {
                        if (!settings.controlsalways) {
                            btnPrev.css('display', 'none');
                            btnNext.css('display', 'none');
                        }
                        else {
                            btnPrev.css('display', '').addClass('disabled');
                            btnNext.css('display', '').addClass('disabled');
                        }
                    }
                }
                function isTextSelected(el) {
                    var startPos = el.get(0).selectionStart;
                    var endPos = el.get(0).selectionEnd;
                    var doc = document.selection;
                    if (doc && doc.createRange().text.length != 0) {
                        return true;
                    } else if (!doc && el.val().substring(startPos, endPos).length != 0) {
                        return true;
                    }
                    return false;
                }
            });
        }
    });
})(jQuery);