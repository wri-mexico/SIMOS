define(['OpenLayers','features'],function(OL,Features) {
    
    var getFormat = function(a){
        
        var f = {
                    lSize:4,
                    lType:'solid',
                    type:'routing_'+a.type,
                    name:(a.description)?a.description:'Optima',
                    item:'feature',
                    unit:'metric'
                };
        switch(a.type){
            case 'free':
                f.lColor='#59590E';
                f.name='Libre';
                f.lType='dash';
                break;
            case 'pay':
                 f.lSize=5;
                f.lColor='#0000ff';
                break;
            case 'segment':
                f.name='Segmento';
                f.lColor='#FF0000';
                break;
        }
        return f;
    }
    var action = function(){
        //{action:'remove',type:'pay'}
        //{action:'hide',type:'free'}
        //{action:'add',geometry:'',type:'segment'}
        //{action:'show',type:''}
        //{action:'select',items:[''],type:''}
         //{action:'add',items:[''],type:'',params:{title:'',description:''}}
        var a = arguments[0];
        switch(a.action){
            case 'add':
                    //Features.removeAll('routing_'+a.type);
                    
                    create(a);             
                break;
            case 'delete':
                Features.removeAll('routing_'+a.type);
                break;
            case 'hide':
                Features.setVisibility('all',a.type,false);
                break;
            case 'show':
                Features.setVisibility('all',a.type,true);
                break;
        }
    };
    var getWkt = function(data){
        return Features.getFeatureFromGeojson(data);
    }
    var create = function(){
        var a = arguments[0];
        var wkt = getWkt(a.geometry);
        var params = {
                        wkt:wkt,//a.geometry,
                        zoom:false,
                        store:false,
                        params:getFormat(a)
                    };
        if(a.params){
            params.params = $.extend(params.params,a.params);
        }
        Features.add(params);
    }
    return{
        event:action
    };
});