define(['OpenLayers','timer'],function(OL,timer) {
    var configure = {
        server:'http://demo.opengeo.org/geoserver/wps',
        process:null
    };
    
    var getGeometry = function(){
         
        var wktf = 'LINESTRING(117 22,112 18,118 13, 115 8)';
        var wktg = 'POLYGON((110 20,120 20,120 10,110 10,110 20),(112 17,118 18,118 16,112 15,112 17))';
        var F = [new OL.Feature.Vector(OL.Geometry.fromWKT(wktf))];
        var G = OL.Geometry.fromWKT(wktg);
        return {features:F,geometry:G};
    };
    var client;
    var applyConfiguration = function(){
        client = new OL.WPSClient({
            servers:{
                mdm6:configure.server
            }
        });
    };
    
    var runProcess = function(){
        var a = arguments;
        client.execute({
            server: mdm6,
            process: a[0].process,
            inputs:a[0].inputs,
            success:a[0].success
        });
    };
    
    var getParams = function(){
        var geometries = getGeometry();
        var params = {
            process:'JTS:intersection',
            inputs:{
                a:geometries.features,
                b:geometries.geometry
            },
            success:function(outputs){
                 map.baseLayer.addFeatures(outputs.result);
            }
        };
        return params;
    };
    var init = function(){
        applyConfiguration();
        
        /*
        var geometries = getGeometry();
        var params = {
            process:'JTS:intersection',
            inputs:{
                a:geometries.features,
                b:geometries.geometry
            },
            success:function(outputs){
                 map.baseLayer.addFeatures(outputs.result);
            }
        };
        
        runProcess(params);
        */
    };
     
    return{
        init:init,
        execute:runProcess,
        getParams:getParams
    };
});