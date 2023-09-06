requirejs.config({
    paths: {
        map:'core/map/map',
        mapStyles:'core/map/styles',
        mapControls:'core/map/controls',
        mapLayers:'core/map/layer',
        mapTree:'core/map/tree',
        timer:'core/map/clock',
        features:'core/map/features',
        wps:'core/map/wps',
        marker:'core/map/marker',
        popup:'core/map/popup',
        georeference:'core/map/georeference',
        events:'core/events',
        request:'core/map/request',
        linetime:'core/map/lineTime',
        modal:'core/map/modal',
        poi:'core/map/poi',
        dataSource:'../config/dataSourceConfig',
        notification:'core/map/notification',
        cluster:'core/map/cluster',
        escuelas:'core/map/escuelas',
        help:'../help/help',
        thirdService:'core/map/thirdService',
        geolocation:'core/map/geolocation',
        routing:'core/map/routing'
    },
    shim: {
        map: {
            deps:['notification','mapStyles','mapControls','mapLayers','mapTree','marker','features','wps','georeference','events','request','linetime','poi','escuelas','modal','thirdService','geolocation','cluster','restFullApi'],
        },
        routing:{
            deps:['features']
        }
    }
});
//agregado
define(["map","ui","request"], function(map,ui,request){
        amplify.subscribe( 'mapAfterLoad', function(){
            
        });
        return {
            init:function(){
                    if(map.testBrowserCompatibility()){
                    //var evento = function(){
                        map.Tree.event.addAditionals();
                        ui.init(map);
                        amplify.publish( 'mapBeforeLoad');
                        map.init();
                    //}
                    //restFullApi('init',request,map,ui);
                    }
            }
        }
});
