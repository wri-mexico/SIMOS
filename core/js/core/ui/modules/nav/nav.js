define(function(){
	var saveHistory = true;
	var isReady = false;
	var timeHistory;
	return {
		onMapLoad:function(){
			var obj = this;
			obj.goToUrlParams();
		},
		goToUrlParams:function(){
			  var obj = this;
			  
			  var lon = null;
			  var lat = null;
			  var z = null;
			  
			  var v = $.getURLParam('v');
			  if(v){
				  var v = Base64.decode(v).split(',');
				  var list = {};
				  for(var x in v){
					  var item = v[x].split(':');  
					  list[item[0]] = item[1];
				  }
				  lon = list.lon;
				  lat = list.lat;
				  z = list.z;
			  }
			  if(lon && lat && z){
				  var merc = obj.map.transformToMercator(parseFloat(lon,10),parseFloat(lat,10));
				  setTimeout(function(){
				  	obj.map.goCoords(merc.lon,merc.lat,{zoomLevel:parseInt(z,10)});
				  },1000);
			  }
		},
		init:function(map){
			this.map = map;	
		},
		setEvent:function(){
			var obj = this;
			amplify.subscribe( 'onMoveEnd', function(){
					obj.mapMove();
			});
			/*amplify.subscribe( 'mapAfterLoad', function(){
					obj.onMapLoad();
					isReady = true;
			});*/
			amplify.subscribe( 'onActiveLayer', function(){
					obj.mapMove('layer');
			});
			amplify.subscribe( 'onDeactiveLayer', function(){
					obj.mapMove('layer');
			});
			$(window).on("navigate", function (event, data) {
				  var direction = data.state.direction;
				  console.log(document.location);
				  if (direction == 'back') {
					console.log(document.location);
				  }
				  if (direction == 'forward') {
					console.log(document.location);
				  }
			});
			window.onpopstate = function(event) {
				  saveHistory = false;
				  clearTimeout(timeHistory);
				  timeHistory = setTimeout(function(){saveHistory=true},1000); //no guardara el historial en el proximo segundo
				  obj.goToUrlParams();
			};
			
			isReady = true;
			obj.goToUrlParams();
		},
		mapMove:function(mode){
			var obj = this;
			if(saveHistory && isReady){
				var centroid = obj.map.getDistanceFromCentroid().centroid;
				var zoom = obj.map.getZoomLevel();
				var layers = $("#layersDisplay").layerDisplay('getAllActiveLayers');
				var strLayers = '';
				if(layers && layers.length > 0){
					strLayers = [];
					for(var x in layers){
						if(layers[x].active)
							strLayers.push(layers[x].idLayer);
						var texts = layers[x].texts;
						if(texts)
							if(texts.active)
							  strLayers.push('t'+layers[x].idLayer);
					}
					strLayers = ',l:'+strLayers.join('|');
				}
				//codificacion base64
				var dataParams = Base64.encode('lat:'+centroid.lat.toFixed(5)+",lon:"+centroid.lon.toFixed(5)+",z:"+zoom+strLayers);
				var stateObj = { foo: "bar" };
				
				//preserve other url params				
				var urlParams = $.getURLParam();
				var reservedParams = ['s','v','c','z','l']; //reserved url params
				var cadenaParams = [];
				for(var x in urlParams){
					var item = reservedParams.indexOf(x);
					if(item < 0){
						cadenaParams.push(x+'='+urlParams[x]);
					}
				}
				cadenaParams = (cadenaParams.length > 0)?'&'+cadenaParams.join('&'):'';
				//
				
				if(!mode){
					 history.pushState(null, null, "?v="+dataParams+cadenaParams);
					//history.pushState(stateObj, "page 2", "?v="+dataParams);			
				}else{
					history.replaceState(null, null, "?v="+dataParams+cadenaParams);
					//history.replaceState(stateObj, "page 2", "?v="+dataParams);			
				}
			}
		}
	}
	
});