define(function(){
	var mapConfig = {
        layers:[
			{
				type:'Wms',
				label:'Vectorial',		             
				url:'http://127.0.0.1/cgi-bin/mapserv?map=/opt/map/mdm61vectormxsig.map&',
				tiled:false,
				format:'png'
			},
			{
				type:'Wms',
				label:'Text',		             
				url:'http://127.0.0.1/cgi-bin/mapserv?map=/opt/map/mdm61textomxsig.map&',
				tiled:false,
				format:'png'
            }
		],
		projection:"EPSG:4326",
		initialExtent:{lon:[-103.77878818791268,18.689033437490526],lat:[-103.89139804383733,20.27364672788709]}, // Vista inicial, Colima
		//initialExtent:{lon:[-120.9103, 10.9999 ],lat:[-83.3810,34.5985]},
		restrictedExtent:{lon:[-120.9103, 10.9999 ],lat:[-83.3810,34.5985]},
		resolutions:[4891.969809375,2445.9849046875,1222.99245234375,611.496226171875,305.7481130859375,152.87405654296876,76.43702827148438,38.21851413574219,19.109257067871095,9.554628533935547,4.777314266967774,2.388657133483887,1.1943285667419434,0.5971642833709717,0.29858214168548586/*,0.14929107084274293,0.07464553542137146*/],
		buffers:{
			limit:'1000'
		},
		timeLine:{
			base:{
				url:'http://127.0.0.1/cgi-bin/mapserv?map=/opt/map/seig_salud_vector.map',
				layer:'c104'
			},
			layers:'http://127.0.0.1/cgi-bin/mapserv?map=/opt/map/seig_salud_vector.map&'//,
		}
	}
	return mapConfig;
});
