define(['OpenLayers','timer'],function(OL,Timer) {
    var Map;
    var Georeference = {
        window:false,
        infoExport:{
            server:'/php/download.php',
            fileName:'Georeferencias',
            format:'xml'
        },
        Layer:null,
        items:{
            point:{
                image:{
                    path:'img/',
                    format:'.png',
                    width:'35',
                    height:'50'
                },
                getImage:function(){
                    var a = arguments[0];
                    return this.image.path+a+this.image.format;
                },
                getParams:function(){
                    var a = arguments[0];
                    var i = this.image;
                    var icon = 'georeference';
                    return {image:this.getImage(icon),gWith:i.width,gHeight:i.height,opacity:1,type:'point'}
                }
            },
            line:{
                getParams:function(){
                    return {lColor:'blue',lType:'solid',lSize:'3',opacity:0.5,type:'line'}
                }
            },
            polygon:{
                 getParams:function(){
                    return {fColor:'blue',lColor:'blue',lType:'solid',lSize:'1',opacity:0.5,type:'polygon'}
                }
            }
        },
        reg:{
            data:{}, 
            type:{},
            add:function(i,t,p){
                var c = 'custom';
                i[c]=p;
                i[c]['type']=t;
                i[c]['item']=(t!='point')?'feature':t
                var d = this;
                var data = d.data;
                var type = d.type;
                data[i.id]=i;
                if(!type[t]){
                   type[t]={};
                }
                type[t][i.id]="";
                
            },
            get:function(i){
                var data = this.data;
                response = (data[i])?data[i]:null;
                return response;
            }
        },
        defineLayer:function(){
            var obj = this;
            var layer ={
                    type:'Vector',
                    name:'Georeference',
                    position:1,
                    info:{
                        renderers:Map.render,
                        styleMap:new OL.StyleMap({
                                    "default": new OL.Style(OL.Util.applyDefaults({
                                        fillColor: "${fColor}",
                                        strokeWidth: "${lSize}",
                                        strokeColor: "${lColor}",
                                        strokeDashstyle: "${lType}",
                                        fillOpacity:"${opacity}",
                                        externalGraphic: "${image}",
                                        graphicWidth: "${gWith}",
                                        graphicHeight: "${gHeight}",
                                        labelAlign: "center",
                                        fontColor: "#000000",
                                        fontWeight: "bold",
                                        labelOutlineColor: "white",
                                        labelOutlineWidth: 3,
                                        fontFamily: "Courier New, monospace",
                                        fontSize: "16px",
                                        pointRadius: 10
                                    }, OL.Feature.Vector.style["default"]))
                        })
                    }
            };
            Map.addLayer(layer);
            this.Layer = Map.getLayer('Georeference');
        },
        getParamsFor:function(){
            var obj = Georeference;
            var a = arguments[0];
            return obj.items[a].getParams();
        },
        setArguments:function(){
            var a = arguments;
            var obj = Georeference;
            a[0].attributes = a[1];
            obj.reg.add(a[0],a[1].type,a[1]);
            obj.Layer.redraw();
        },
        getAditionalParams:function(){
            var a = arguments;
            var obj = Georeference;
            var p = a[0];
            var params = obj.items[a[1]].getParams();
            for(x in params){
                p[x] =params[x];
            }
            return p;
        },
        
        getLastGeoreference:function(){
          var obj = Georeference;
          return obj.Layer.features[obj.Layer.features.length-1];
        },
        createPoint:function(){
            var obj = Georeference;
            var a = arguments[0];
            var point = new OL.Feature.Vector(new OL.Geometry.Point(a.lon, a.lat));
            point.attributes= obj.getAditionalParams(a.params,a.type);
            obj.reg.add(point,a.type,a.params); 
            obj.Layer.addFeatures([point]);
        },
        getkml:function(){
            var obj = Georeference;
            var features = obj.Layer.features
            var format = new OL.Format.KML({
                'foldersName':"Mapa Digital de Mexico V6.0",
                'foldersDesc':'Georeferencias generadas',
                'maxDepth':10,
                'extractStyles':true,
                'extractAttributes':true,
                'internalProjection': Map.projection.used,
                'externalProjection': Map.projection.used
            });
            return format.write(features);
        },
        getGeoreferenceFromWKT:function(){
            var a = arguments[0];
            var projection = new OL.Projection(Map.projection.used);
            var f = new OL.Format.WKT(projection).read(a);
            var b;
            var v = false;
            if(f){
                    if(f.constructor != Array) {
                        f = [f];
                    }
                    for(x in f){
                        if (!b) {
                            b = f[x].geometry.getBounds();
                        } else {
                            b.extend(f[x].geometry.getBounds());
                        }
                    }
                    v = true;
            }
            return {features:f,valid:v,bounds:b};
        },
        Import:function(){
            var obj = Georeference;
            var a = arguments[0];
            for(x in a){
                var item = a[x];
                var response = obj.getGeoreferenceFromWKT(item.wkt);
                if(response.valid){
                    response.features[0].attributes = obj.getAditionalParams({name:item.name,description:item.description},item.type);
                    obj.reg.add(response.features[0],item.type,response.features[0].attributes);
                    var f = response.features[0];
                    obj.Layer.addFeatures(response.features);
                    Features.added({id:f.id,type:'georeference',data:{name:f.custom.name,description:f.custom.description,type:f.custom.type}});
                    //amplify.publish('mapFeatureAdded',{id:f.id,type:'georeference',data:{name:f.custom.name,description:f.custom.description,type:f.custom.type}});
                }
            }
        },
        Export:function(){
            var obj = Georeference;
            var i=obj.infoExport;
            var kml = obj.getkml();
            var url=i.server+"?filename="+i.fileName+"&format="+i.format+"&export="+kml;
            window.open(url);
            //var form = '<form name="geoForm" onsubmit="window.open(\'\',\'fenser\')" action="'+url+'" method="post" target="fenser"></form>';
            //$("#map").append(form);
            //$("#geoForm").submit();
        },
        showWindow:function(){
            var a = arguments[0];
            var obj = Georeference;           
            if(obj.window){//existe
                $("#descGeoref,#nameGeoref").val('');
                $(".Georef-window,#blockerGeoref").fadeIn();
            }else{
                var chain = '<div id="blockerGeoref" style="z-index:50000;" class="ui-widget-overlay"></div>';                                                                                                
                chain+= '<div id="gordo" class="Georef-window dinamicPanel-box-sizing Georef-container dinamicPanel-border dinamicPanel-shadow ui-corner-all">'+
                            '<div style="position:absolute;top:0px;height:20px;width:100%;background:#808080;color:#FFFFFF">'+
                                '<div style="padding:5px;font-size: 120%;font-weight:bold;">Informaci&oacute;n de elemento georeferenciado</div>'+
                                '<span id="closeBtnGeo" title="Cerrar" style="position:absolute;top:3px;right:5px;" class="ui-icon ui-icon-circle-close"></span>'+
                            '</div>'+
                            '<div align="center" class="pt30">'+
                                    '<div align="right" style="width:30%;float:left">'+
                                        '<label style="font-size: 120%;padding-right:10px;">Nombre :</label>'+
                                    '</div>'+
                                    '<div align="left" style="width:70%;float:left;">'+
                                        '<input type="text" id="nameGeoref" class="ui-corner-all inputItem " value="" placeholder="Nombre">'+
                                    '</div>'+
                            '</div>'+
                            '<div align="center" class="pt30">'+
                                '<div align="right" style="width:30%;float:left">'+
                                    '<label style="font-size: 120%;padding-right:10px;">Descripci&oacute;n :</label>'+
                                '</div>'+
                                '<div align="left" style="width:70%;float:left;">'+
                                    '<textarea rows="4" cols="50" placeholder="Descripci&oacute;n" class="ui-corner-all areaItem" id="descGeoref" style="height:60px;"></textarea>'+
                                '</div>'+
                            '</div>'+
                            '<div align="center" class="pt30">'+
                                '<div style="padding:40px;">'+
                                    '<button id="aceptGeoref">Aceptar</button>'+
                                '</div>'+
                            '</div>'+
                        '</div>';
                $("#map").append(chain);
                
                var window = $(".Georef-window");
                var btnCose = $("#closeBtnGeo");
                var btnAcept = $("#aceptGeoref");
                var bocker = $("#blockerGeoref");
                var Name = $("#nameGeoref");
                var Desc = $("#descGeoref");
                window.draggable();
                btnAcept.button().click(function(){
                    window.fadeOut();
                    bocker.fadeOut();
                    var georeference =obj.getLastGeoreference();
                    georeference.attributes['name']=Name.val();
                    georeference.attributes['description']=Desc.val();
                    //console.log(obj.Layer);
                    Features.added({id:georeference.id,type:'georeference',data:{name:georeference.custom.name,description:georeference.custom.description,type:georeference.custom.type}});
                    //amplify.publish('mapFeatureAdded',{id:georeference.id,type:'georeference',data:{name:georeference.custom.name,description:georeference.custom.description,type:georeference.custom.type}});
                });
                btnCose.click(function(){
                    window.fadeOut();
                    bocker.fadeOut();
                    obj.removeLastGeoreference();
                });
                obj.window=true;
            }
            $("#nameGeoref").focus();
        },
        removeLastGeoreference:function(){
            var obj = Georeference;
            var item = obj.getLastGeoreference();
            item.destroy();
        },
        init:function(map){
            var obj=Georeference;
            Map=map;
            obj.defineLayer();
            var data = [
                {
                    name:'punto',
                    description:'lonalizacion',
                    wkt:'POINT(-11774389.426459 3074800.2628115)',
                    type:'point'
                },
                { 
                    name:'linea',
                    description:'lanzador',
                    wkt:'LINESTRING(-11368355.932281 2815525.8629146,-11725469.728365 2541575.5535896,-11608062.45294 2438844.1875927)',
                    type:'line'
                },
                {
                    name:'polygono',
                    description:'tridente',
                    wkt:'POLYGON((-11202028.958762 2590495.2516833,-11407491.690756 2375248.5800708,-11206920.928571 2399708.4291177,-11202028.958762 2590495.2516833))',
                    type:'polygon'
                },
                
            ]; 
            //obj.Import(data);
        }
    }

    return {
        load:Georeference.init,
        add:Georeference.createPoint,
        getParams:Georeference.getParamsFor,
        setArguments:Georeference.setArguments,
        Export:Georeference.Export,
        fillInformation:Georeference.showWindow,
        reg:Georeference.reg
    }
});