define(function(){
var engineSakbe = {
		timeoutJson:15000,
		mainUrl:'',
		key:'',
		projection:'',
		destinySearch:function(text,func){
			var obj = this;
			var json = {
					type:'get',
					dataType: "json",
					url: obj.mainUrl,
					data: {
							make:'SD',
							buscar:text,
							type:'json',
							key:obj.key,
							proj:obj.projection
							} //params
				}
				
			obj.getData(json,func);
			
		},
		init:function(map,config){
			map.Routing['sakbe'] = this;
			var conf = config.sakbe;
			for(var x in conf){
				this[x] = conf[x];	
			}
		},
		lineSearch:function(lon,lat,scale,func){
			var obj = this;
			scale = scale||100000;
			var json = {
					type:'get',
					dataType: "json",
					url: obj.mainUrl,
					data: {
							make:'IL',
							x:lon,
							y:lat,
							escala:scale,
							type:'json',
							proj:obj.projection,
							key:obj.key
						   } //params
				}
				
			obj.getData(json,func);
				
		},
		routing:function(type,origen,destino,tipoRuta,tipoVehiculo,ejesExcedentes,lineasOmitir,scale,func){
			var obj = this;
			var scale = scale||100000;
			tipoRuta = tipoRuta||0;
			tipoVehiculo = tipoVehiculo||1;
			lineasOmitir = lineasOmitir||[];
			type = type||'calc';
			
			type = (type == 'calc')?'CR':'GD'
			
			
			var params = {};
			var getParams = function(data,position){
				if(data.source && data.id_routing_net){ // es una linea
					params['id'+position] = data.id_routing_net;
					params['target'+position] = data.target;
					params['source'+position] = data.source;
				}else{
					params['dest'+position] = data.id_dest;
				}
			}
			
			getParams(origen,'_i');//origen _i (inicio);
			getParams(destino,'_f');//origen _i (inicio);
			
			params.p = tipoRuta;//tipo de ruta
			params.v = tipoVehiculo; //tipo de vehiculo
			if(ejesExcedentes)params.e = ejesExcedentes;//ejes excedentes
			//lineas a omitir
			var lOmitir = [];
			for(var x in lineasOmitir){
				lOmitir.push(lineasOmitir[x].id_routing_net);
			}
			if(lOmitir.length > 0)params.b = lOmitir.join();
			//campos extra para peticion
			params.make=type;
			params.type='json';
			params.key=obj.key;
			params.proj=obj.projection;
			
			
			var json = {
					type:'get',
					dataType: "json",
					url: obj.mainUrl,
					data: params
				}
				
			obj.getData(json,func);
		},
		getFuels:function(func){
			var obj = this;
			var json = {
					type:'get',
					dataType: "json",
					url: obj.mainUrl,
					timeout: obj.timeoutJson,
					data: {
							make:'CM',
							type:'json',
							key:obj.key
						   } //params
				}
				
			obj.getData(json,func);
		},
		//----------------------------------------
		getData:function(objSearch,success,beforeSend,error,complete){
			if(!beforeSend)var beforeSend = function(){};
			if(!error)var error = function(){};
			if(!complete)var complete = function(){};
			objSearch.success = success;
			objSearch.beforeSend = beforeSend;
			objSearch.error = error;
			objSearch.complete = complete;
			$.ajax(objSearch);
		}
	
	}
	return engineSakbe;
})