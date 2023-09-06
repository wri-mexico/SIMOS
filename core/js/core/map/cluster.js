define(['OpenLayers','request','dataSource','timer','marker','printControl'],function(OL,Request,DataSource,Timer,Marker,printControl) {
    var obj=this;
    var counter=0;
    var clockPopup=null;
    var clearItems=true;
    var firstNodes = false;
    var clockGeometry=null;
    var settings={
        nodes:{
            size:{
                height:300,
                width:300
            }
        }
    }
    var getSizeContainer = function(size,json){
        
            var response = {height:340,width:340,linkDistance:90};
            if(json.children.length>10){
                response.height=400;
                response.width=400;
                response.linkDistance=150;
            }
            return response;
    };
    
    var showFichaDenue = function(){
        counter+=1;
        var idDiv = 'info_recordCard'+counter;
        var div = '<div id="'+idDiv+'" style="height: 300px; width: 300px;"></div>';
        $("#"+idDiv).parent().attr('align','');
        $("#"+idDiv).recordCard(
            {data:data.data,
            controller:{request:Request,dataSource:DataSource,printer:printControl,printClusters:enablePrintClusters}
        });  
    };
    var isFirstNodes = function(){
      return firstNodes;  
    };
    var drawGeometry = function(a){
	a.time = (a.time!=null)?1000:0;
	if(clockGeometry){
	    clearTimeout(clockGeometry);
	}
	clockGeometry = setTimeout(function(){
			var params = {point:a.wkt,resolution:a.resolution};
			requestGeometry.setParams(JSON.stringify(params));
			requestGeometry.execute(); 
			},a.time);
    };
    var requestGeometry = Request.New({
        url:DataSource.cluster.geometry.url,
        type:DataSource.cluster.geometry.type,
        format:DataSource.cluster.geometry.dataType,
        contentType:"application/json; charset=utf-8",
        params:'',
        events:{
            success:function(data,extraFields){
                var messages=[];
                if(data){
                    if(data.response.success){
                        var options = {fColor:"none",lSize:2,lColor:"#01FCEF",lType:"line",type:'buffer'};
			MDM6('addPolygon',data.data.geometry,options);
                    }else{
                        messages.push(data.response.message);
			MDM6('deletePolygons');
                    }
                }else{
                    messages.push('Servicio de cluster no disponible');
		    MDM6('deletePolygons');
                }
                if(messages.length>0){
                    for(var x=0;x<messages.length;x++){
                        //MDM6('newNotification',{message:messages[x],time:5000});
                    }
                }
            },
            before:function(a,extraFields){
                
            },
            error:function(a,b,extraFields){
                
            },
            complete:function(a,b,extraFields){
                
            }
        }
    });
    var requestRecordCard = Request.New({
        url:DataSource.cluster.recordCard.url,
        type:DataSource.cluster.recordCard.type,
        format:DataSource.cluster.recordCard.dataType,
        contentType:"application/json; charset=utf-8",
        params:'',
        events:{
            success:function(data,extraFields){
                var messages=[];
                if(data){
                    if(data.response.success){
                        counter+=1;
                        //var idDiv = 'info_recordCard'+counter;
                        var idDiv = 'info_recordCard';
                        var div = '<div id="'+idDiv+'" style="height: 300px; width: 300px;"></div>';
                        var evento = function(){
                                isCardActive=false;
                                //$("#nodos").mouseleave();
                        };
                        //$("#nodos").popup('destroy');
                        $("#panel-center").popup({xy:extraFields.xy,title:'',text:div,btnClose:true,showOn:'now',events:{onMouseOut:evento}});
                        $("#"+idDiv).parent().attr('align','');
                        
                        $("#"+idDiv).recordCard(
                                                {data:data.data,
                                                controller:{request:Request,dataSource:DataSource,printer:printControl,printClusters:enablePrintClusters}
                                                });
                                                
                    }else{
                        if(extraFields.Event){
                            extraFields.Event();
                        }else{
                            messages.push(data.response.message);
                        }
                    }
                }else{
                    messages.push('Servicio de cluster no disponible');
                }
                if(messages.length>0){
                    for(var x=0;x<messages.length;x++){
                        MDM6('newNotification',{message:messages[x],time:5000});
                    }
                }
            },
            before:function(a,extraFields){
                
            },
            error:function(a,b,extraFields){
                
            },
            complete:function(a,b,extraFields){
                
            }
        }
    });
    
    var request = Request.New({
        url:DataSource.cluster.nodes.url,
        type:DataSource.cluster.nodes.type,
        format:DataSource.cluster.nodes.dataType,
        contentType:"application/json; charset=utf-8",
        params:'',
        events:{
            success:function(data,extraFields){
                var messages=[];
                if(data){
                    if(data.response.success){
                        if(data.data.size>1){
                            Marker.event({action:'delete',items:'all',type:'identify'});
                            if(extraFields.action){
                                firstNodes=false;
                                redefineJson(data.data.children,extraFields.source);
                                showDetailCluster(data.data.children,extraFields.source.name);
                            }else{
                                //data.data=brenda.data;
                                firstNodes=true;
                                show(extraFields.xy,data.data,extraFields.lonlat);
                                
                            }
                        }else{
                            if(data.data.size==1){
                                Marker.event({action:'delete',items:'all',type:'identify'});
                                setTimeout(function(){
                                    showRecordCard({lonlat:extraFields.lonlat,xy:extraFields.xy});
                                },0);
                            }else{
                                extraFields.Event();
                            }
                        }
                        
                    }else{
                        messages.push(data.response.message);
                    }
                }else{
                    messages.push('Servicio de cluster no disponible');
                }
                if(messages.length>0){
                    for(var x=0;x<messages.length;x++){
                        MDM6('newNotification',{message:messages[x],time:5000});
                    }
                }
            },
            before:function(a,extraFields){
                
            },
            error:function(a,b,extraFields){
                
            },
            complete:function(a,b,extraFields){
            }
        }
    });
    var isCardActive=false;
    var showRecordCard = function(a){
        isCardActive=true;
        var extraPath='';
        var coordinates;
        var params=false;
        if(a.id){
           extraPath='/id';
           params={id:a.id};
        }else{
           extraPath='/geom'; 
        }
        if((a.lonlat)&&(!a.id)){
            var activeDenue = (typeof a.denue === "undefined")?true:a.denue;
            params={geometry:'POINT('+a.lonlat.lon+' '+a.lonlat.lat+')',resolution:MDM6('getResolution'),denue:activeDenue};
        }
        if(a.xy){
            coordinates=a.xy;
        }else{
            coordinates = getMousePosition();
        }
        requestRecordCard.setUrl(DataSource.cluster.recordCard.url+extraPath);
        if(params){
            requestRecordCard.setParams(JSON.stringify(params));
        }
        var evento = (a.evento)?a.evento:$.nooop;
        requestRecordCard.setExtraFields({xy:coordinates,Event:evento});
        requestRecordCard.execute();  
    };
    var start=function(a){
	clearClock();
        $("#nodos,#background_nodes").remove();
	$("#map").append('<div id="background_nodes"></div><div id="nodos" style="text-align:-webkit-auto !important"></div>');
        destroyDetailCluster();
        var sizeMap = MDM6('getSizeMap');
        var wkt = 'POINT('+a.lonlat.lon+' '+a.lonlat.lat+')';
        var extent = MDM6('getExtent');
        var bbox = extent.lon[0]+','+extent.lon[1]+','+extent.lat[0]+','+extent.lat[1];
        point=wkt;
	var resolution = MDM6('getResolution');
        var params={superTypeId:32,
            type:'sector',
            point:wkt,
            resolution:resolution,
            x:a.xy.x,
            y:a.xy.y,
            bbox:bbox,
            width:sizeMap.width,
            height:sizeMap.height
        };
	var url = DataSource.cluster.nodes.url;
	if(a.whatshere){
	    url = DataSource.cluster.nodesWhatsHere.url;
	    parms['tipoturista']=a.whatshere;
	}
        request.setUrl(url);
        request.setParams(JSON.stringify(params));
        request.setExtraFields({xy:a.xy,lonlat:a.lonlat,Event:a.evento});
        request.execute();
	if(a.geometry){
	    if(resolution<4891.969809375){
		drawGeometry({wkt:wkt,time:null,resolution:resolution});
	    }
	}
    };
    var coordinates={x:0,y:0};
    var storeMousePosition = function(e){
	mie = (navigator.appName == "Microsoft Internet Explorer") ? true : false;
	if (!mie) {
	    mouseX = e.pageX; 
	    mouseY = e.pageY;
	}
	else {
	    mouseX = event.clientX + document.body.scrollLeft;
	    mouseY = event.clientY + document.body.scrollTop;
	}
        coordinates = {x:mouseX,y:mouseY};
    };
    var getMousePosition = function(){
        coordinates.y-=55;
        return coordinates;  
    };
    var destroyDetailCluster = function(){
        $("#detailCluster").css({'display':'none'});
    };
    var updateDetailCluster = function(data,events,parent,name){
	var parametros = {};
        if(name!='root'){
	    parametros.title=name;
	}else{
	    parametros.title='Establecimientos';
	}
	if(events){
            parametros.events=events;
        }
        if(parent){
            parametros.parent=parent;
        }
	parametros.data=data;
        $("#detailCluster").detailCluster(parametros);
    };
    var showDetailCluster = function(data,name){
        var obj=this;
        $("#detailCluster").css({'display':''});
        $("#map").append('<div id="detailCluster" class="no-print"></div>');
        var eventoHover = function(){
            $("#nodos").mouseenter();
        };
        var eventoOut = function(){
            $("#nodos").mouseleave();
        };
        var parent = 'nodos';
        var eventos = {hover:eventoHover,out:eventoOut};
        updateDetailCluster(data,eventos,parent,name);
    };
    var enablePrintClusters = function(status){
	if(!status){
	    $("#nodos,#background_nodes").addClass('no-print');
	}else{
	    $("#nodos,#background_nodes").removeClass('no-print');
	}
    };
    var getPositionNodes = function(positons,prop,lonlat){
        var valid=false;
        var sizeMap = MDM6('getSizeMap');
        var limits = {left:0,right:sizeMap.width,top:55,bottom:sizeMap.height-26};
        var sizeNodes = prop;
        var section = {left:positons.left,right:positons.left+sizeNodes.width,top:positons.top,bottom:positons.top+prop.height};
        if((section.left>=limits.left)&&(section.right<=limits.right)&&(section.top>=limits.top)&&(section.bottom<=limits.bottom)){
            valid=true;
        }
        if(valid){
            return positons;
        }else{
            clearItems = false;
            MDM6('setCenter',lonlat.lon,lonlat.lat);
            positons.left = (sizeMap.width/2)-(sizeNodes.width/2);
            positons.top=((sizeMap.height/2)-(sizeNodes.height/2));
            return positons;
        }
    };
    var show = function(px,json,lonlat){
        //var prop = settings.nodes.size;
	var prop = getSizeContainer(json.size,json);
	var root = $("#nodos");
	var root_mirror = $("#nodos_mirror");
        var bg = $("#background_nodes");
	var bg_mirror = $("#background_nodes_mirror");
	var w = (root.width()==0)?prop.width:root.width();
	var h = (root.height()==0)?prop.height:root.height();
	var pos = {left:0,right:0};
        pos.left = (px.x-(w/2));
        pos.top = ((px.y-(h/2)));
        pos = getPositionNodes(pos,prop,lonlat);
        var left=pos.left+'px';
        var top =pos.top+'px';
        root.css("left",left);
	root.css("top",top);
	root_mirror.css("left",left);
	root_mirror.css("top",top);
	root_mirror.css("display","none");
        bg.css({left:left,top:top,height:h+"px",width:w+"px"});
	bg_mirror.css({left:left,top:top,height:h+"px",width:w+"px",display:'none'});
        //if(nodes){
            
        //}else{
            nodes=json;
        //}
	create(nodes);
	
    };
    
    var clock=null;		    
    var currentCluster;
    var nodes=null;
    var point='';
    var update = function(json) {
            //var prop = settings.nodes.size;
            var prop = getSizeContainer(json.size,json);
            // remove previous flower to save memory
            if (currentCluster) currentCluster.cleanup();
            // adapt layout size to the total number of elements
            var total = countElements(json);
            // create a new cluster
            currentCluster = new CodeFlower("#nodos", prop.width ,prop.height,prop.linkDistance).update(json);
    };
    var clearClock=function(){
	if(clock!=null){
                    clearTimeout(clock);
        }
    }
    var create = function(json){
            clearClock();
            //d3.json('json/data.json', createCluster);
            update(json);
            $("#nodos").mouseenter(function(){
                clearClock();
            })
            .mouseleave(function(){
                if(!isCardActive){
                    clock = setTimeout(function(){
                       clear();
                    },2500);
                }
            });
    };
    var setClearItems = function(status){
	clearItems=status;
    };
    var clear = function(){
            if(clearItems){
                $("#nodos,#background_nodes" ).effect( 'fade', {}, 500,function(){
                                    $("#nodos").remove();
                                    $("#background_nodes").remove();
                                    destroyDetailCluster();
                });
                prevBranch=null;
                nodes=null;
                try{
                    $("#panel-center" ).popup('hide');
                }catch(e){}
		MDM6('deletePolygons');
            }else{
                clearItems =true;
            }
    };
    var prevBranch=null;
    var redefineJson = function(json,source){
        disablePrev(json);
        source.children = json;
        prevBranch = source;
        update(nodes);
        
    };
    var disablePrev=function(json){
        var disable=false;
        if((prevBranch)){
            if(prevBranch.children){
                if(prevBranch.children.length!=json.length){
                        disable=true;
                }else{
                    for(var x in prevBranch.children){
                        if(prevBranch.children[x].id!=json[x].id){
                            disable=true;
                            break;
                        }
                    }
                }
                if(disable){
                    prevBranch._children = prevBranch.children;
                    prevBranch.children = null;
                }
                
            }
        }
        return disable;
    }
    var compact = function(json,source){
        var r = disablePrev(json);
        prevBranch = source;
        //if(r){
            update(nodes);
        //}
    };
    var rebuild = function(a){
        var params={superTypeId:a.typeId,type:/*a.type*/'subsector',point:point,resolution:MDM6('getResolution'),limit:a.size};
	var url = DataSource.cluster.nodes.url;
	if(a.whatshere){
	    url = DataSource.cluster.nodesWhatsHere.url;
	    parms['tipoturista']=a.whatshere;
	}
	request.setUrl(url+'/detail');
        request.setParams(JSON.stringify(params));
        request.setExtraFields({action:'update',source:a});
        request.execute();
    };
    var events = function(){
        $("body").mousemove(function(e){
            storeMousePosition(e);
        });
        $("body").append('<div id="nodo_title" class="no-print"></div>');
    };
    var getPositionLabel=function(){
        var xy = getMousePosition();
        xy.y;
        var position ={left:xy.x+"px",top:xy.y+'px'};
        return position;
    };
    var showLabel=function(d){
            var label = (d.name=='root')?d.label:d.name;
            if(label!=''){
                $("#nodo_title").remove();
		$("body").append('<div id="nodo_title" class="no-print"></div>');
		var xy = getPositionLabel();
                $("#nodo_title")
                .css('display','')
                .css(xy)
                .html(label);
            }
    };
    var hideLabel=function(){
        $("#nodo_title").css('display','none');
	$("#nodo_title").remove();
    };
    events();
    return {
        show:start,
        update:rebuild,
        showRecordCard:showRecordCard,
        clear:clear,
        showLabel:showLabel,
        hideLabel:hideLabel,
        getMousePosition:getMousePosition,
        compact:compact,
        updateDetailCluster:showDetailCluster,
        destroyDetailCluster:destroyDetailCluster,
        isFirstNodes:isFirstNodes,
	showGeometry:drawGeometry,
	setClearItems:setClearItems
    };
});

function faty(x,y){
    $("body").append('<div id="background_nodes"></div><div id="nodos" style="text-align:-webkit-auto !important"></div>');
    var div = '<div style="height:300px;width:300px;"></div>';
    $("#nodos").popup({title:'',text:div,btnClose:true,xy:{x:x,y:y},showOn:'now',events:{onMouseOut:function(){}}});
}