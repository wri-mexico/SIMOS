define(['OpenLayers'],function(OL) {
    
    var template = {
        //pointRadius: "${getSize}",
        fillColor: "${getColor}"
    };
    var styleFeatures = {
            styles:{}, 
            create:function(name,colores){
                this.styles[name] = OL.Util.extend({}, OL.Feature.Vector.style['default']);
                if((colores != null)||(colores != undefined)){
                    this.modify(name,colores);
                }
            },
            modify:function(name,colores){
                for(var x=0;x<colores.length;x++){
                    this.styles[name][colores[x].attr] = colores[x].value;
                }
            },
            getStyle:function(name){
                return this.styles[name];
            }
    };
    
    var getRender = function(){
        var renderer = OL.Util.getParameters(window.location.href).renderer;
        renderer = (renderer) ? [renderer] : OL.Layer.Vector.prototype.renderers;
        return renderer;
    };
    
    var getVectorial = function(){
        return getStyleByFormat(getFormatVector());
    };
    var getStyleByFormat = function(format){
        var style = new OL.Style();
        style.addRules([new OL.Rule({symbolizer: format})]);
        return getStyleMap({"default": style});
    };
     var getStyleMap = function(p){
        return new OL.StyleMap(p);
    };
    
    var getFormatVector = function(){
        var format = {
                "Point": {
                    pointRadius: 4,
                    graphicName: "square",
                    fillColor: "white",
                    fillOpacity: 1,
                    strokeWidth: 1,
                    strokeOpacity: 1,
                    strokeColor: "#59590E",
                },
                "Line": {
                    strokeWidth: 3,
                    strokeOpacity: 1,
                    strokeColor: "#59590E",
                    strokeDashstyle: "dash",
                    zIndex:0
                },
                "Polygon": {
                    strokeWidth: 2,
                    strokeOpacity: 1,
                    strokeColor: "#D7D7D7",
                    fillColor: "#EEEEEE",
                    fillOpacity: 0.3,
                    zIndex:0
                }
        };
        return format;
    };
    return{
        getRender:getRender,
        getVector:getVectorial,
        styleFeatures:styleFeatures
    };

});