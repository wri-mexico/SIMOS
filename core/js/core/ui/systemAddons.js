define(function(){
  var init = function(){
    //jquery
    $(document).ready(function(){
        $(document).tooltip({
            position: {
              my: "center bottom-20",
              at: "center top",
              using: function( position, feedback ) {
                $( this ).css( position );
                $( "<div>" )
                  //.addClass( "arrow" )
                  .addClass( feedback.vertical )
                  .addClass( feedback.horizontal )
                  .appendTo( this );
              }
            }
          });
		  $( document ).tooltip({
			  items: '*:not(.ui-dialog-titlebar-close)'
			});
    });
	//mensaje
    jQuery.fn.message = function(title,msg){
		var cadena=  '<div id="mdmShareError" title="'+title+'">';
			cadena+= '	<strong><label>'+msg+'</label></strong>';
			cadena+= '</div>';
		
		$("#panel-center").append(cadena);
		$( "#mdmShareError" ).dialog({
			width:350,
			height:130,
			resizable: false,
			close: function(event, ui){
				$(this).dialog('destroy').remove();
			},
			modal: true
		});
	}
	//crea id sesiones de usuario
	jQuery.fn.createIdSession = function(){
		var today       = new Date();
		var time        = today.getTime();
		var seconds = today.getSeconds(); 
		var semilla     = Math.floor(Math.random()*1000000);
		var id = time+''+semilla; 

		return id;
	}
	
    //jquery center function
	jQuery.fn.center = function () {
		this.css("position","absolute");
		this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
													$(window).scrollTop()) + "px");
		this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
													$(window).scrollLeft()) + "px");
		return this;
	}
    $.isMobile = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));  
    
    //javascript
    Number.prototype.formatMoney = function(c, d, t){
            var n = this, 
                c = isNaN(c = Math.abs(c)) ? 2 : c, 
                d = d == undefined ? "." : d, 
                t = t == undefined ? "," : t, 
                s = n < 0 ? "-" : "", 
                i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
                j = (j = i.length) > 3 ? j % 3 : 0;
               return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };
    String.prototype.linkify = function(){
			text = this;
			if (text && typeof(text) == 'string') {
				text = text.replace(
					/((https?\:\/\/)|(www\.))(\S+)(\w{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi,
					function(url){
						var full_url = url;
						if (!full_url.match('^https?:\/\/')) {
							full_url = 'http://' + full_url;
						}
						return '<a href="' + full_url + '" target="_blank">' + url + '</a>';
					}
				);
			}
			return text;
	};
	String.prototype.isUrl = function(){
		text = this;
		var re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
		if (re.test(text)) { 
			return true;
		}else{
			return false;	
		}
	};
	
	//return params from Url
	$.getURLParam = function (name) {
		var url = decodeURI(location.search);
		r = null;
		url = url.split('?');
		if(url.length > 1){
			url = url[1].split('&');
			var object = {}
			for(var x in url){
				var separator = url[x].indexOf('=');
				var n = url[x].substr(0,separator);
				var v = url[x].substr(separator+1,url[x].length);
				object[n] = v;
			}
			if (name){
				r=object[name];
			}else{
				r = object;	
			}
		}
		return r;
		//return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
	}
	
    String.prototype.asId = function(){
                    text = this;
                    text = text.toLowerCase();
                    text = text.replace(/[\u00E1]/gi,'a');
                    text = text.replace(/[\u00E9]/gi,'e');
                    text = text.replace(/[\u00ED]/gi,'i');
                    text = text.replace(/[\u00F3]/gi,'o');
                    text = text.replace(/[\u00FA]/gi,'u');
                    text = text.replace(/[\u00F1]/gi,'n');
                    
                    text = text.replace(/&aacute;/g, 'a');
                    text = text.replace(/&eacute;/g, 'e');
                    text = text.replace(/&iacute;/g, 'i');
                    text = text.replace(/&oacute;/g, 'o');
                    text = text.replace(/&uacute;/g, 'u');
                    text = text.replace(/&ntilde;/g, 'n');
                    
                    text = text.replace(/\s/g, '');
					text = text.replace(/:/g, '');
                    return text;
    };
    
    String.prototype.trim = function() {
	    return this.replace(/\s/g, '');
	};
	String.prototype.trimSides = function() {
	    return this.replace(/(^\s+|\s+$)/g,'');
	}; 
    
	Object.size = function(obj) {
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) size++;
		}
		return size;
	};
    
  };
  return {init:init}  
});