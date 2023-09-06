define([],function() {
    
    var Request = function(){
	    this.params=arguments[0];
	    this.setParams=function(a){
		this.params[0].params=a;
	    }
	    this.setUrl=function(a){
		this.params[0].url=a;
	    }
	    this.setExtraFields = function(a){
		this.params[0].extraFields=a;
	    }
	    this.execute = function(){
		    var obj=this;
		    var a = obj.params[0];
		    var f = a.events;
		    var request = {
			   type: ((a.type)?a.type:'POST'),
			   dataType: (a.format)?a.format:'json',
			   url: a.url,
			   data: a.params,
			   success:function(json,estatus){
				if($.isFunction(f.success)){
				    f.success(json,a.extraFields);
				}
			   },
			   beforeSend: function(solicitudAJAX) {
				if($.isFunction(f.before)){
				    f.before(a.params,a.extraFields);
				}
			   },
			   error: function(solicitudAJAX,errorDescripcion,errorExcepcion) {
				if ($.isFunction(f.error)){
				    f.error(errorDescripcion,errorExcepcion,a.extraFields);
				}
			   },
			   complete: function(solicitudAJAX,estatus) {
				if ($.isFunction(f.complete)){
				    f.complete(solicitudAJAX,estatus,a.extraFields);
				}
			   }
		    };
		    if(a.type =='jsonp'){
			//jsonp:'json.wrf',
			request['jsonCallback']=((a.callback)?a.callback:'json.wrf');
		    }
		    
		    if(a.contentType){
			request['contentType']=a.contentType;
		    }
		    if(obj.params[0].xhrFields){
			request['xhrFields']=obj.params[0].xhrFields;
		    }
		    //console.log(request);
		    $.ajax(request);
	    }
    };
    
    var generate = function(){
	//params = {type:'post',formta:'jsonp',callback:'',url:'',params:'',extraFields:'',events:{success:'',before:'',error:'',complete:''}}
	var a = arguments;
	var request = new Request(a);
	return request;
    };
    return {
	New:generate
    };
});