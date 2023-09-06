define(['OpenLayers','tree','timer','linetime'],function(OL,tree,timer,LineTime) {//
    var Tree = {
        load:false,
        idItem:'treePruve',
        visible:false,
        clase:'hidden',
        repository:{},
        timer:null,
        layerAfected:{},
        tempStore:{},
        getTemporalStore:null,
        addToRepository:null
    };
    var load = function(){
        clearTempStore();
        //buildComponent();//interfaz prueba
        //getInfoLayers();
        defineSource();
        //LineTime.init(Tree);
        //defineTimer();
    };
    
    var getTemporalStore = function(){
        return Tree.tempStore;
    };
    Tree.getTemporalStore = getTemporalStore;
    
    var defineTimer = function(event){
        Tree.timer = timer.define(600,event,true,true);
    };
    var getInfoLayers = function(){
        var e = $("#infoLayers");
        var counter=0;
        var idT="Item";
        for(x in tree.layers.groups){
            var g = tree.layers.groups[x];
            e.append('<label style="font-size:180%">'+g.label+'</label>');
            e.append('<br>');
            for(y in g.layers){
                counter+=1;
                var grupo = ' group="'+x+'"';
                //var cadena = '<input class="itemLayer" '+grupo+'" type="checkbox" '+((g.layers[y].active)?' checked="checked" ':'')+' id="idL'+counter+'" value="'+y+'">'+
                var cadena = '<input class="itemLayer" '+grupo+'" type="checkbox" id="idL'+counter+'" value="'+y+'">'+
                             '<label for="idL'+counter+'" style="font-size:120%;-khtml-user-select:none;-moz-user-select:-moz-none;-webkit-user-select:none; " >'+g.layers[y].label+'</label>'+
                             ((g.layers[y].texts)?
                              '<label> ---- </label>'+
                             //'<input class="itemLayer" '+grupo+'" tipo="'+y+'" type="checkbox" '+((g.layers[y].texts.active)?' checked="checked" ':'')+' id="idT'+counter+'" value="'+(getIdText(y))+'">'+
                             '<input class="itemLayer" '+grupo+'" tipo="'+y+'" type="checkbox" id="idT'+counter+'" value="'+(getIdText(y))+'">'+
                             '<label for="idT'+counter+'" style="font-size:120%;-khtml-user-select:none;-moz-user-select:-moz-none;-webkit-user-select:none; ">Etiqueta</label>':'');
                e.append(cadena);
                e.append('<br>');
            }
            e.append('<br>');
        }
    };
    
    var defineEvents = function(){
        $('.itemLayer').each(function(){
            var e = $(this);
            e.click(function(){
                var tipo = e.attr('tipo')||null;
                var params = [{id:e.val(),active:e.prop("checked"),group:e.attr('group'),label:true}];
                //addToRepository(e.val(),e.prop("checked"),e.attr('group'),tipo);
                addToRepository(params);
            });
        });
    };
    /*
    var enableBoxes = function(l){
        if(l){
            for(x in l.item){
                $('input[value="'+x+'"]').attr("checked",true);
            }
        }
    }*/
    var checkBoxes = function(){
        var layers = getLayersActivated();
        for(x in layers){
            $('input[value="'+layers[x]+'"]').attr("checked",true);
        }
        /*
        var V = get('Vectorial');
        var T = get('Text');
        enableBoxes(V);
        enableBoxes(T);
        */
    };
    
    var storeItem = function(){
        var a = arguments;
        if(a[0]==null){a[0]={item:{},position:{}}}
        a[0].position[a[1]];
        a[0].position[a[1]]={id:a[2],group:a[3],scale:a[4]};
        a[0].item[a[2]];
        a[0].item[a[2]]=a[1];
        return a[0];
    };
    var getIdText = function(i){
        
        return 't'+ (i.substring(1,i.length));
    };
     
    var getIdRoot = function(i){
		return 'c'+ (i.substring(1,i.length));
    };
    
    var activeLayersByUrl = function(layers){
        if(layers){
            var items = layers.split(',');
            for(var x in items){
                activateLayerOnConfig(items[x]);
            }
        }
    };
    var activateLayerOnConfig = function(Layer){
	var isText = (Layer.substr(0,1)=='t')?true:false;
	var Text='';
	if(isText){
	    Text=Layer+'';
	    Layer = 'c'+Layer.substr(1,Layer.length);
	}
        for(x in tree.layers.groups){
            var g = tree.layers.groups[x];
            for(y in g.layers){
                if(Layer == y){
		    if(isText){
                g.layers[y].texts.active = true;
		    }else{
                g.layers[y].active = true;
		    }
                    break;
                    break;
                }
            }
        }
    };
    var defineSource = function(){
        amplify.store('Vectorial',null);
        amplify.store('Text',null);
        var L = getStored('Vectorial');
        var T = getStored('Text');
        if(!L){
            for(x in tree.layers.groups){
                var g = tree.layers.groups[x];
                for(y in g.layers){
                    l = g.layers[y];
                    if(y.indexOf('c')!=-1){
                        if(false/*l.time*/){ //*cambio---------------------------------------
                            var params = {layer:y,branch:x,visible:l.active,label:l.label,enable:true};
                            LineTime.addLayerAvailable(params);
                        }
                        if(l.active){
                            L=storeItem(L,l.position,y,x,l.scale);
                        }
                        if((l.texts)&&(l.texts.active)){
                            T=storeItem(T,l.position,getIdText(y),x,l.scale);
                        }
                    }else{
                        if(l.active){
                            T=storeItem(T,l.position,y,x,l.scale);
                        }
                    }
                }
            }
            if(L!=null){
                //store('Vectorial',L);
                storeInTem('Vectorial',L);
                Tree.layerAfected['Vectorial']=true;
            }
            if(T!=null){
                //store('Text',T);
                storeInTem('Text',T);
                Tree.layerAfected['Text']=true;
            }
        }else{
            storeInTem('Vectorial',L);
            if(T){
                storeInTem('Text',T);
            }
        }
    };
    var buildComponent = function(){
        var cadena ='<div id="'+Tree.idItem+'" class="'+Tree.clase+'" style="top:0px;position:absolute;width:100%;height:100%;z-index:50000;background:white;-moz-opacity:0.60;opacity:0.60;filter:alpha(opacity=60)">'+
                        '<div style="background:black;-moz-opacity:0.90;opacity:0.90;filter:alpha(opacity=90);position:absolute;top:0px;left:0px;right:0px;bottom:95%">'+
                            '<div id="closeLayers" style="float:right;color:white;font-weight:bold;margin-right:10px;margin-top:6px">X</div>'+
                        '</div>'+
                        '<div style="background:white;-moz-opacity:0.90;opacity:0.90;filter:alpha(opacity=90);position:absolute;top:5%;left:0px;right:0px;bottom:0px"></div>'+   
                        '<div style="position:absolute;top:5%;left:0px;right:0px;bottom:0px">'+
                            '<div id="infoLayers" style="position:absolute;top:10px;left:10px;right:10px;bottom:10px;overflow:auto;"></div>'+
                        '</div>'+   
                    '</div>';
        $("#map").append(cadena);
        $("#mdm6Layers_layerManager_btnLayers").click(function(){
            show();
            if(!Tree.load){
                buildComponent();
                getInfoLayers();
                defineEvents();
                checkBoxes();
                Tree.load=true;
            }
        });
        $("#closeLayers").click(function(){
            hide();
        });
    };
    var show = function(){
        var c = Tree.clase;
         if(!Tree.visible){
            $("#"+Tree.idItem).removeClass(c);
            Tree.visible=!Tree.visible;
        }
    };
    var hide = function(){
         var c = Tree.clase;
         if(Tree.visible){
            $("#"+Tree.idItem).addClass(c);
            Tree.visible=!Tree.visible;
        }
    };
    var clearTempStore = function(){
        Tree.tempStore={Text:{item:{},position:{}},Vectorial:{item:{},position:{}}};
    };
    var reset = function(){
        clearTempStore();
        Tree.timer.execute();
    };
    var getLayer = function(i){
        var fi = i.substring(0,1);
        fi = fi.toLowerCase();
        var type='';
        switch(fi){
            case 'c':type='Vectorial';break;
            default: type='Text';
        }
        return type;
    };
    var getTypeOfLayer = function(i){
        var type='c';
        if(i.indexOf('t')!=-1){
            type='t';
        }
        return type;
    };
    var cleanObject = function(e){
        e=null;
        e={};
        return e;
    };
    var cleanRepository = function(){
        Tree.layerAfected= cleanObject(Tree.layerAfected);
        Tree.repository = cleanObject(Tree.repository);
    };
    var getLayersAlterated = function(){
      return Tree.layerAfected;  
    };
    /*
    var addToRepository = function(){
        var r = Tree.repository;
        var a = arguments;
        if(r[a[0]]){
            r[a[0]].active=a[1];
        }else{
            r[a[0]]={active:a[1],group:a[2],type:a[3]};
        }
        Tree.layerAfected[getLayer(a[0])]=true;
        Tree.timer.execute();
    }
   */
    var scanTimeLayer = function(group,id){
		var i = null;
		var layers = group.layers;
		for(var xd in layers){
			var layer = layers[xd];
			if(layer.time){
				var dates = layer.dates;
				for(var yd in dates){
					var date = dates[yd].join();
					if (date == id){
						i = layer;
						break;
					}
				}	
			}
			if(i)break;
		}
		return i;
	}
    var addToRepository = function(e){
        var r = Tree.repository;
        for(var x=0;x<e.length;x++){
            var i = e[x];
            if(r[i.id]){
                r[i.id].active=i.active;
            }else{
                //r[i.id]={active:i.active,group:i.group,type:i.label};
				var type = null;
				var isTime = scanTimeLayer(tree.layers.groups[i.group],i.id);
				if (!isTime){
                	type = (tree.layers.groups[i.group].layers[i.id])?null:getIdRoot(i.id);
				}
                r[i.id]={active:i.active,group:i.group,type:type};
            }
            Tree.layerAfected[getLayer(i.id)]=true;
        }
        Tree.timer.execute();
    };
    Tree.addToRepository = addToRepository;
    var registerItemsSelecteds = function(){
        var r = Tree.repository;
        var t = tree.layers.groups;
        for(x in r){
            var source = (r[x].type!=null)?r[x].type:x;
            //var id = (r[x].type!=null)?getIdText(x):x;
            var id = x;
            var type = getLayer(id);
            l = get(type);
            if(r[x].active){
                if(!l.item[x]){
                    var i = tree.layers.groups[r[x].group].layers[source];
					if(!i){
						i = scanTimeLayer(tree.layers.groups[r[x].group],id);
					}
                    var pos = i.position;
                    i = (r[x].type!=null)?i.texts:i;
                    l=storeItem(l,pos,id,r[x].group,i.scale);
                }
            }else{
                var pos = l.item[id];
                delete l.position[pos];
                delete l.item[id];
            }
            LineTime.setVisibilityLayerTime(x,r[x].active);
            //store(type,l);
            storeInTem(type,l);
        }
    };
    
    var storeInTem = function(){
        var a = arguments;
        Tree.tempStore[a[0]];
        Tree.tempStore[a[0]]=a[1];
    };
    var store = function(){
        var a = arguments; 
        amplify.store(a[0],a[1]);
    };
    
    var getStored = function(){
        var a = arguments;
        return amplify.store(a[0]);
    };
    var get = function(){
        var a = arguments;
        /*
        return amplify.store(a[0]);
        */
        var r = (Tree.tempStore[a[0]])?Tree.tempStore[a[0]]:null;
        return  r;
    };
    
    var serialize = function(){
        var o=',';
        var s='';
        var a = arguments;
        var item = a[0].position;
        for(x in item){
            var id = item[x].id;
            if(s!=''){
                s+=o+id;
            }else{
                s+=id;
            }
        }
        return s;
    };
    
    var pushToArray = function(){
        var a = arguments;
        if(a[1]){
            for(x in a[1].item){
                a[0].push(x);
            }
        }
        return a[0];
    };
    
    var pushToObject = function(){
        
        var a = arguments;
        if(a[1]){
            for(x in a[1].position){
                var i = a[1].position[x];
                a[0].push({id:i.id,group:i.group});
            }
        }
        return a[0];
    };
    var getLayersActivated = function(){
        var V = get('Vectorial');
        var T = get('Text');
        var r = [];
        //r = pushToArray(r,V);
        //r = pushToArray(r,T);
        r = pushToObject(r,V);
        r = pushToObject(r,T);
        return r;
    };
    var getItem = function(i){
        
        var r = null;
        var type = getLayer(i);
        var l = get(type);
        if(l){
            var p = (l.item[i])?l.item[i]:null;
            r = (p)?l.position[p]:null;
        }
        return r;
    };
    var storeLayers = function(){
        var i = getTemporalStore();
        if(i){
            for(x in i){
                store(x,i[x]);
            }
        }
    };
    return{
        reset:reset,
        load:load,
        get:get,
        serialize:serialize,
        defineTimer:defineTimer,
        registerChanges:registerItemsSelecteds,
        cleanRepository:cleanRepository,
        layersAlterated:getLayersAlterated,
        getActiveLayers:getLayersActivated,
        getItem:getItem,
        addToRepository:addToRepository,
        store:storeLayers,
        getTemporalStore:getTemporalStore,
        getMain:function(){
            return Tree;
        },
        activateLayers:activeLayersByUrl,
        runTimer:function(){
            Tree.timer.execute();
        }
    };
});