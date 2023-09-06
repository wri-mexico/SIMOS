define(function(){
	return{
        timeLine:{
            base:{
                url:'http://10.1.30.102/fcgi-bin/mapserv.exe?map=/opt/map/mercator.map',
                layer:'c104'
            },
			layers:'http://10.7.7.234/cgi-bin/mapserv?map=/opt/map/mdm60/mex_mercator.map&'
        },
		sakbe:{
			mainUrl:'http://gaia.inegi.org.mx/sakbe/wservice',
			key:'Lslg4vqD-Jbw8-GVUy-Fhum-ydssu7Zv12gx',//'jbs505ou-9458-10bd-5mqv-32e0gaxw0yi9',// 
			projection:'MERC'
		},
		routing:{
			dataSource:{ 
				fuels:{
					url:'http://10.1.30.102:8181/routing/fuel/all',
					type: 'POST',
					dataType: "json",
					params:{ 
					}
				},
				route:{
					contentType : "application/json",
					//url:'http://10.106.12.12:8080/routing/',
					url:'http://10.1.30.102:8181/routing/',
					type: 'POST',
					dataType: "json",
					stringify:true,
					params:{}
				},
				autocomplete:{
					url:'http://10.1.30.101:9090/solr/busq-ruteodestinos/shard',
					//url:'http://10.1.30.101:9090/solr/busq-redcardestinos/shard',
					params:{
						q: '',
						wt:'json',
						indent:true,
						facet:true,
						'facet.field':'tipo'	
					},
					'dataType': 'jsonp',
					'jsonp': 'json.wrf'
				},
				saveStats:{
					url:'http://10.1.30.102:8181/map/stats/layers',
					type: 'POST',
					contentType : "application/json; charset=utf-8",
					dataType: "json",
				}
			}
		},
		denue:{
			visibleScale:2.388657133483887,
			denueSearchLayerId:'cturistadenue',
			excludeLayer:'cdenue14,c111servicios',
			urlDownloadService:'http://10.153.3.13:8080/DescargaDENUE/procesaDescarga.do',
			tools:{
				'd_what_here':{id:'d_what_here',type:"btn", filter:'',keyWord:'searchLocal',size:30,float:'left',text:'&iquest;Qu&eacute; hay aqu&iacute;?',desc:'Obtener informaci&oacute;n sobre la vista actual',icon:'module-denue-sprite module-denue-sprite-houseSearch'},
				'd_food':{id:'d_food',type:"tool",filter:'Restaurantes',color:'#ff6600',keyWord:'18',size:20,float:'left',desc:'Restaurantes',icon:'module-denue-sprite module-denue-sprite-food'},
				'd_hospital':{id:'d_hospital',type:"tool",filter:'Hospitales',color:'#e02327',keyWord:'12',size:20,float:'left',desc:'Hospitales',icon:'module-denue-sprite module-denue-sprite-hospital'},
				'd_bank':{id:'d_bank',type:"tool",filter:'Bancos',color:'#00ae00',keyWord:'4',size:20,float:'left',desc:'Bancos y cajeros',icon:'module-denue-sprite module-denue-sprite-bank'},
				'd_hotel':{id:'d_hotel',type:"tool",filter:'Hoteles',color:'#0066ff',keyWord:'13',size:20,float:'left',desc:'Sitios para alojamiento',icon:'module-denue-sprite module-denue-sprite-hotel'},
				'd_museum':{id:'d_museum',type:"tool",filter:'Museos',color:'#993300',keyWord:'16',size:20,float:'left',desc:'Museos',icon:'module-denue-sprite module-denue-sprite-museum'},
				
				'd_bar':{id:'d_bar',type:"tool",filter:'Bares',color:'#cc0066',keyWord:'5',size:20,float:'left',desc:'Centros nocturnos',icon:'module-denue-sprite module-denue-sprite-bar'},
				'd_bus':{id:'d_bus',type:"tool",filter:'Centrales de autobuses',color:'#0033ff',keyWord:'7',size:20,float:'left',desc:'Central de autobuses',icon:'module-denue-sprite module-denue-sprite-bus'},
				'd_zoo':{id:'d_zoo',type:"tool",filter:'Zoológicos (Jardines botánicos y zoológicos)',color:'#0b7263',keyWord:'24',size:20,float:'left',desc:'Zool&oacute;gicos',icon:'module-denue-sprite module-denue-sprite-zoo'},
				'd_piramid':{id:'d_piramid',type:"tool",filter:'Sitios históricos',color:'#996600',keyWord:'20',size:20,float:'left',desc:'Sitios hist&oacute;ricos',icon:'module-denue-sprite module-denue-sprite-piramid'},
				'd_mail':{id:'d_mail',type:"tool",filter:'Servicios postales',color:'#ffcc00',keyWord:'19',size:20,float:'left',desc:'Servicios postales',icon:'module-denue-sprite module-denue-sprite-mail'},
				'd_shopping':{id:'d_shopping',type:"tool",filter:'Tiendas departamentales',color:' #ff6699',keyWord:'23',size:20,float:'left',desc:'Tiendas departamentales',icon:'module-denue-sprite module-denue-sprite-shopping'},
				'd_market':{id:'d_market',type:"tool",filter:'Supermercados y minisupers',color:'#00ccff',keyWord:'21',size:20,float:'left',desc:'Super mercados',icon:'module-denue-sprite module-denue-sprite-store'},
				'd_gas':{id:'d_gas',type:"tool",filter:'Gasolineras',color:' #006600',keyWord:'11',size:20,float:'left',desc:'Gasolineras',icon:'module-denue-sprite module-denue-sprite-gas'},
				'd_drugs':{id:'d_drugs',type:"tool",filter:'Farmacias',color:'#e02327',keyWord:'10',size:20,float:'left',desc:'Farmacias',icon:'module-denue-sprite module-denue-sprite-drugs'},
				'd_rentcar':{id:'d_rentcar',type:"tool",filter:'Alquiler de autos',color:'#ff6600',keyWord:'3',size:20,float:'left',desc:'Renta de autos',icon:'module-denue-sprite module-denue-sprite-rentcar'},
				'd_gov':{id:'d_gov',type:"tool",filter:'Oficinas de gobierno',color:'#e02327',keyWord:'17',size:20,float:'left',desc:'Oficinas de gobierno',icon:'module-denue-sprite module-denue-sprite-gov'},
				'd_church':{id:'d_church',type:"tool",filter:'Iglesias',color:'#996600',keyWord:'14',size:20,float:'left',desc:'Iglesias',icon:'module-denue-sprite module-denue-sprite-church'},
				'd_school':{id:'d_school',type:"tool",filter:'Escuelas',color:'#66cc00',keyWord:'8',size:20,float:'left',desc:'Escuelas',icon:'module-denue-sprite module-denue-sprite-school'},
				'd_airport':{id:'d_airport',type:"tool",filter:'Aeropuertos',color:'#067161',keyWord:'1',size:20,float:'left',desc:'Aeropuertos',icon:'module-denue-sprite module-denue-sprite-airport'},
				'd_parking':{id:'d_parking',type:"tool",filter:'Estacionamientos',color:'#0066ff',keyWord:'9',size:20,float:'left',desc:'Estacionamientos',icon:'module-denue-sprite module-denue-sprite-parking'},
				'd_mechanic':{id:'d_mechanic',type:"tool",filter:'Talleres automotrices',color:'#00ddb0',keyWord:'22',size:20,float:'left',desc:'Talleres automotrices',icon:'module-denue-sprite module-denue-sprite-mechanic'},
				'd_package':{id:'d_package',type:"tool",filter:'Mensajería y paquetería',color:'#c69a00',keyWord:'15',size:20,float:'left',desc:'Mensajer&iacute;a y paqueter&iacute;a',icon:'module-denue-sprite module-denue-sprite-package'},
				'd_currency':{id:'d_currency',type:"tool",filter:'Casas de cambio',color:'#00ae00',keyWord:'6',size:20,float:'left',desc:'Casas de cambio',icon:'module-denue-sprite module-denue-sprite-currency'},
				'd_travel':{id:'d_travel',type:"tool",filter:'Agencias de viaje',color:'#0066cc',keyWord:'2',size:20,float:'left',desc:'Agencias de viajes',icon:'module-denue-sprite module-denue-sprite-travel'}
			},
			dataSources:{
					view:{
						url:'http://gaiamapas.inegi.org.mx/mdmSearchEngine/denue_2014/select',
						type: 'POST',
						dataType: "jsonp",
						jsonp:'json.wrf',
						stringify:false,
						params:{ //Params----------------------
							'sort':'geodist() asc',
							'q':'*',
							'df':'busqueda',
							'wt':'json',
							'indent':true,
							'facet':true,
							'facet.field':'tipo',
							'spatial':true,
							'sfield':'locacion',
							'fq':'{!bbox}',
							'rows':0,
						}
					},
					searchInLayer:{
						url:'http://gaiamapas.inegi.org.mx/mdmSearchEngine/denue_2014/select',
						type: 'POST',
						dataType: "jsonp",
						jsonp:'json.wrf',
						stringify:false,
						params:{ //Params----------------------
							'sort':'geodist() asc',
							'q':'*',
							'df':'busqueda',
							'wt':'json',
							'indent':true,
							'facet':true,
							'facet.field':'tipo',
							'spatial':true,
							'sfield':'locacion',
							'fq':'tipo:"text"',
							'rows':10,
						}
					},
					searchLayer:{
						url:'http://10.1.30.101:9090/solr/busq-denue_sector/select',
						type: 'POST',
						dataType: "jsonp",
						jsonp:'json.wrf',
						stringify:false,
						params:{ //Params----------------------
							'hl':true,
							'hl.fl':'busqueda',
							'hl.simple.post':'</strong>',
							'hl.simple.pre':'<strong>',
							'rows':10,
							'wt':'json',
							'indent':true,
							'facet':true,
							'facet.field':'tipo'
						}
					},
					download:{
						url:'http://10.1.30.102:8181/map/denue/list',
						contentType : "application/json; charset=utf-8",
						type: 'POST',
						dataType: "json"
					}
			}
			
		},
		ecoTool:{
			defaultData:{
					_var:{id:'ue',label:'Unidades económicas'},
					gs:{id:'0',label:'Todos',title:'Industria manufacturera, Comercio y Servicios privados no financieros'},
					s:{id:'',label:''},
					ss:{id:'',label:''},
					geo:{id:'00',label:'Nacional'},
					total:0,
					theme:null,
					pdfPath:'json/ce2014/ce2014.pdf',
					years:[2004,2009,2014],
					yearPos:2
			},
			colorRamps:[
						{id:0,name:'Amarillos',colors:['#FFF28C','#DCBB6A','#BE8447','#9F4C25','#801502']},
						{id:1,name:'Verdes',colors:['#D8F2ED','#9FC4BE','#6B9993','#3F736D','#144F4A']},
						{id:2,name:'Naranja',colors:['#F5F500','#F5B800','#F57A00','#F53D00','#F50000']},
						{id:3,name:'Azules',colors:['#B6EDF0','#74B4E8','#1F83E0','#1D44B8','#090991']},
						{id:4,name:'Escarlata',colors:['#FFE0E0','#EBA59B','#CF705F','#B04130','#910A0A']}
					],
			specialStrats:[
						{label:'Confidencialidad',style:'background:url(\'img/stratos/d_reservados.jpg\');'},
						{label:'Sin dato',style:'background-color:#FFF;'}
					],
			vars_gs:[
					{type:'GranSector',name:'Manufactura',title:'Industria manufacturera',label:'Manufactura',id:3,sprite:'sprite-ecoTool sprite-ecoTool-factory'},
					{type:'GranSector',name:'Comercio',title:'Comercio',label:'Comercio',id:4,sprite:'sprite-ecoTool sprite-ecoTool-cart'},
					{type:'GranSector',name:'Servicios',title:'Servicios privados no financieros',label:'Servicios',id:5,sprite:'sprite-ecoTool sprite-ecoTool-system'},
					{type:'GranSector',name:'Todos',title:'Industria manufacturera, Comercio y Servicios privados no financieros',label:'Industria manufacturera, Comercio y Servicios privados no financieros',id:0}
			],
			edos:[
					{id:'00',label:'Nacional'},
					{id:'01',label:'Aguascalientes'},
					{id:'02',label:'Baja California'},
					{id:'03',label:'Baja California Sur'},
					{id:'04',label:'Campeche'},
					{id:'05',label:'Coahuila de Zaragoza'},
					{id:'06',label:'Colima'},
					{id:'07',label:'Chiapas'},
					{id:'08',label:'Chihuahua'},
					{id:'09',label:'Distrito Federal'},
					{id:'10',label:'Durango'},
					{id:'11',label:'Guanajuato'},
					{id:'12',label:'Guerrero'},
					{id:'13',label:'Hidalgo'},
					{id:'14',label:'Jalisco'},
					{id:'15',label:'México'},
					{id:'16',label:'Michoacán de Ocampo'},
					{id:'17',label:'Morelos'},
					{id:'18',label:'Nayarit'},
					{id:'19',label:'Nuevo León'},
					{id:'20',label:'Oaxaca'},
					{id:'21',label:'Puebla'},
					{id:'22',label:'Querétaro'},
					{id:'23',label:'Quintana Roo'},
					{id:'24',label:'San Luis Potosí'},
					{id:'25',label:'Sinaloa'},
					{id:'26',label:'Sonora'},
					{id:'27',label:'Tabasco'},
					{id:'28',label:'Tamaulipas'},
					{id:'29',label:'Tlaxcala'},
					{id:'30',label:'Veracruz de Ignacio de la Llave'},
					{id:'31',label:'Yucatán'},
					{id:'32',label:'Zacatecas'}
			],
			vars_vals:{
				var_eco:{
					label:'Variables económicas',
					list:[
						{id:'ue',id2:'V01',label:'Unidades económicas'},
						{id:'h001a',id2:'V02',label:'Personal ocupado total'},
						{id:'h020a',id2:'V03',label:'Personal ocupado no remunerado'},
						{id:'h010a',id2:'V04',label:'Personal ocupado remunerado'},
						{id:'i100a',id2:'V05',label:'Personal ocupado suministrado'},
						{id:'k000a',id2:'V06',label:'Gastos por consumo de bienes y servicios'},
						{id:'m000a',id2:'V07',label:'Ingresos por suministro de bienes y servicios'},
						{id:'q000a',id2:'V08',label:'Activos fijos totales'},
						{id:'a111a',id2:'V09',label:'Producción Bruta total'},
						{id:'a131a',id2:'V10',label:'Valor agregado'},
						{id:'k412a',id2:'V11',label:'Valor de la energía eléctrica consumida'},
						{id:'k976a',id2:'V12',label:'Valor del consumo de agua'}
					]
				},
				var_relan:{
					label:'Relaciones analíticas',
					list:[
						{id:'r01',label:'Promedio de establecimientos por manzana'},						
						{id:'r02',label:'Promedio de personal ocupado por unidad económica'},
						{id:'r03',label:'Valor promedio de activos fijos por unidad económica'},
						{id:'r04',label:'Relación ingreso-gasto',postfix:'%'},
						{id:'r05',label:'Promedio de producción bruta total por persona ocupada'},
						{id:'r06',label:'Promedio de producción bruta total por unidad económica'},
						{id:'r07',label:'Participación del consumo intermedio en la producción bruta total',postfix:'%'},
						{id:'r08',label:'Remuneraciones promedio por persona ocupada remunerada'},
						{id:'r09',label:'Valor promedio de activos fijos por persona ocupada'},
						{id:'r10',label:'Personal no remunerado con respecto al personal ocupado total ',postfix:'%'},
						{id:'r11',label:'Participación de las mujeres en el personal ocupado total',postfix:'%'}
					]}
				
			},
			dataSources:{
				sectors:{
					url:'http://mdm5beta.inegi.org.mx:8181/map/sector',
					contentType : "application/json; charset=utf-8",
					type: 'GET',
					dataType: "json"
				},
				infoPoint:{
					url:'http://mdm5beta.inegi.org.mx:8181/map/censo/find',
					contentType : "application/json; charset=utf-8",
					type: 'POST',
					dataType: "json"
				},
				theme:{
					url:'http://mdm5beta.inegi.org.mx:8181/map/theme',
					contentType : "application/json; charset=utf-8",
					type: 'POST',
					dataType: "json",
					stringify:true
				},
				themeColor:{
					url:'http://mdm5beta.inegi.org.mx:8181/map/theme/colors',
					contentType : "application/json; charset=utf-8",
					type: 'POST',
					dataType: "json",
					stringify:true
				},
				ficha:{
					url:'http://mdm5beta.inegi.org.mx:8181/map/censo/label',
					contentType : "application/json; charset=utf-8",
					type: 'POST',
					dataType: "json",
					stringify:true
				},	
				exportFicha:{
					url:'http://10.1.30.102:8181/map/export',
					type: 'POST',
					contentType : "application/json; charset=utf-8",
					dataType: "json",
					stringify:true
			   },
			   descargaTabla:{ //http://10.1.30.102:8181/map/export/xls/
					url:'http://200.92.207.46:8080/map/export/xls/',
					type: 'GET',
					contentType : "application/json; charset=utf-8",
					dataType: "json",
					stringify:true
			   },
				
				infoVars:{
					url:'json/ce2014.json',
					contentType : "application/json; charset=utf-8",
					type: 'POST',
					dataType: "json",
				},
				getGeo:{
					url:'http://mdm5beta.inegi.org.mx:8181/map/wkt',
					contentType : "application/json; charset=utf-8",
					type: 'GET',
					dataType: "json",
				}
			}	
		}//finEcoTool
	}
	
	
});