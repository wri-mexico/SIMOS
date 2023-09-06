define(function () {
  var data = {
    themes: {
      
      
      
      T2:{
        label: "DENUE 2022",
        layers: ["cdenue_cluster"],
        desc: "DENUE2022",
        img: "DENUE21.jpg",
      },

      

      T3: {
        label: "Hechos Viales municipio de Colima",
        layers: [
          
          "chechos_viales_colima_2021",// Layer/s
          "cHVColima_cluster2021",
        ],
        desc: "Hechos viales",
        img: "SIMOS_ICONO_COLIMA.png",
      },
      
      
    },
    baseLayers: {
      B1: {
        type: "Wms",
        label: "Topogr&aacute;fico con sombreado- INEGI",
        img: "mapa_con_sombreado.jpg",
        url: [
          "https://gaiamapas1.inegi.org.mx/mdmCache/service/wms?",
          "https://gaiamapas3.inegi.org.mx/mdmCache/service/wms?",
          "https://gaiamapas2.inegi.org.mx/mdmCache/service/wms?",
        ],
        layer: "MapaBaseTopograficov61_consombreado",
        rights: "Derechos Reservados &copy; INEGI",
        tiled: true,
        legendlayer: [
          "c100",
          "c101",
          "c102",
          "c103",
          "c108",
          "cRutasColimaVillaDeAlvarez",
        ],
        desc: "REPRESENTACION DE RECURSOS NATURALES Y CULTURALES DEL TERRITORIO NACIONAL A ESCALA 1: 250 000, BASADO EN IMAGENES DE SATELITE DEL  2002 Y TRABAJO DE CAMPO REALIZADO EN 2003",
        clasification: "VECTORIAL",
      },
      B2: {
        type: "Wms",
        label: "Topogr&aacute;fico sin sombreado- INEGI",
        img: "mapa_sin_sombreado.jpg",
        url: [
          "https://gaiamapas1.inegi.org.mx/mdmCache/service/wms?",
          "https://gaiamapas3.inegi.org.mx/mdmCache/service/wms?",
          "https://gaiamapas2.inegi.org.mx/mdmCache/service/wms?",
        ],
        layer: "MapaBaseTopograficov61_sinsombreado",
        rights: "Derechos Reservados &copy; INEGI",
        tiled: true,
        legendlayer: [
          "c100",
          "c101",
          "c102",
          "c103",
          "c108",
        ],
        desc: "REPRESENTACION DE RECURSOS NATURALES Y CULTURALES DEL TERRITORIO NACIONAL A ESCALA 1: 250 000, BASADO EN IMAGENES DE SATELITE DEL  2002 Y TRABAJO DE CAMPO REALIZADO EN 2003",
        clasification: "VECTORIAL",
      },
      B3: {
        type: "Wms",
        label: "Hipsogr&aacute;fico - INEGI",
        img: "baseHipsografico.jpg",
        url: [
          "https://gaiamapas1.inegi.org.mx/mdmCache/service/wms?",
          "https://gaiamapas3.inegi.org.mx/mdmCache/service/wms?",
          "https://gaiamapas2.inegi.org.mx/mdmCache/service/wms?",
        ],
        layer: "MapaBaseHipsografico",
        rights: "&copy; INEGI 2013",
        tiled: true,
        legendlayer: ["img_altimetria.png"],
        desc: "IMAGEN DE RELIEVE QUE MUESTRA UNA COMBINACION DE ELEVACION A TRAVES DE COLORES HIPSOGRAFICOS, GENERADA POR PROCESAMIENTO DEL CONTINUO DE ELEVACIONES MEXICANOS DE 3.0 DE 15 METROS.",
        clasification: "VECTORIAL",
      },
      B4: {
        type: "Wms",
        label: "Ortofotos - INEGI",
        img: "baseOrtos.jpg",
        url: [
          "https://gaiamapas1.inegi.org.mx/mdmCache/service/wms?",
          "https://gaiamapas3.inegi.org.mx/mdmCache/service/wms?",
          "https://gaiamapas2.inegi.org.mx/mdmCache/service/wms?",
        ],
        layer: "MapaBaseOrtofoto",
        rights: "&copy; INEGI 2013",
        tiled: true,
        desc: "CONJUNTO DE IMAGENES AEREAS ORTORECTIFICADAS A DIVERSAS ESCALAS Y RESOLUCIONES, PROVENIENTES DEL ACERVO DE ORTOFOTOS DE INEGI Y QUE CORRESPONDEN A TOMAS REALIZADAS EN EL LAPSO 2005-2012.",
        clasification: "VECTORIAL",
      },
      B5: {
        type: "Osm",
        label: "Open Street Map",
        img: "Osm.jpg",
        rights: "&copy; OpenStreetMap contributors",
        clasification: "VECTORIAL",
      },
      B7: {
        type: "Esri",
        label: "Esri map",
        img: "Esri.jpg",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/${z}/${y}/${x}",
        rights: "&copy; ESRI",
        clasification: "VECTORIAL",
      },
    },
    layers: {
      groups: {
        G11: {
          label: "L&iacute;mites del Marco Geoestadístico Nacional",
          layers: {
            c100: {
              label: "Límite Estatal",
              synonymous: ["limite", "estatal"],
              scale: 0,
              position: 40,
              active: false,
              texts: {
                scale: 0,
                active: false,
              }, //,
              //metadato:'http://geoweb.inegi.org.mx/WSCBuscador/MuestraMetadatos.jsp?par1=52392&par2=INEGI1'
            },
            c101: {
              label: "Límite Municipal",
              synonymous: ["municipio", "municipales", "municipal"],
              scale: 866685,
              position: 41,
              active: false,
              texts: {
                scale: 0,
                active: false,
              }, //,
              //metadato:'http://geoweb.inegi.org.mx/WSCBuscador/MuestraMetadatos.jsp?par1=52392&par2=INEGI1'
            },
            c102: {
              label: "Localidad",
              synonymous: ["localidad", "localidades", "LOCALIDADES"],
              scale: 866685,
              position: 42,
              active: false,
              texts: {
                scale: 0,
                active: false,
              }, //,
              //metadato:'http://geoweb.inegi.org.mx/WSCBuscador/MuestraMetadatos.jsp?par1=52392&par2=INEGI1'
            },
            
          },
        },
        G70: {
          label: "DENUE 2022",
          layers: {
            
            cDenu2022: {
              label: "Denue",
              synonymous: ["denu", "denue", "DENU", "DENUE", "2022"],
              scale: 866685,
              position: 43,
              active: false,
              texts: {
                scale: 0,
                active: false,
              }, 
            },
            cdenue_cluster_2022: {
              label: "Clúster",
              synonymous: ["clus", "CLUSTER", "2022","CLUS", "cluster"],
              scale: 866685,
              position: 44,
              active: false,
              texts: {
                scale: 0,
                active: false,
              }, 
            },
            cSector11: {
              label: "Agricultura cría y explotación de animales",
              synonymous: ["localidad", "localidades", "LOCALIDADES"],
              scale: 866685,
              position: 110,
              active: false,
              texts: {
                scale: 0,
                active: false,
              }, //,
              //metadato:'http://geoweb.inegi.org.mx/WSCBuscador/MuestraMetadatos.jsp?par1=52392&par2=INEGI1'
            },

            cSector21: {
              label: "Mineria",
              synonymous: ["localidad", "localidades", "LOCALIDADES"],
              scale: 866685,
              position: 111,
              active: false,
              texts: {
                scale: 0,
                active: false,
              }, //,
              //metadato:'http://geoweb.inegi.org.mx/WSCBuscador/MuestraMetadatos.jsp?par1=52392&par2=INEGI1'
            },
            
            cSector22: {
              label: "Generación, transmisión y distribución",
              synonymous: ["localidad", "localidades", "LOCALIDADES"],
              scale: 866685,
              position: 112,
              active: false,
              texts: {
                scale: 0,
                active: false,
              }, //,
              //metadato:'http://geoweb.inegi.org.mx/WSCBuscador/MuestraMetadatos.jsp?par1=52392&par2=INEGI1'
            },
            cSector23: {
              label: "Construcción",
              synonymous: ["localidad", "localidades", "LOCALIDADES"],
              scale: 866685,
              position: 113,
              active: false,
              texts: {
                scale: 0,
                active: false,
              }, //,
              //metadato:'http://geoweb.inegi.org.mx/WSCBuscador/MuestraMetadatos.jsp?par1=52392&par2=INEGI1'
            },
            
            cSector31: {
              label: "Industrias manufactureras",
              synonymous: ["localidad", "localidades", "LOCALIDADES"],
              scale: 866685,
              position: 114,
              active: false,
              texts: {
                scale: 0,
                active: false,
              },
            },
            cSector43: {
              label: "Comercio al por mayor",
              synonymous: ["localidad", "localidades", "LOCALIDADES"],
              scale: 866685,
              position: 115,
              active: false,
              texts: {
                scale: 0,
                active: false,
              },
            },
            cSector46: {
              label: "Comercio al por menor",
              synonymous: ["localidad", "localidades", "LOCALIDADES"],
              scale: 866685,
              position: 116,
              active: false,
              texts: {
                scale: 0,
                active: false,
              },
            },
            cSector48: {
              label: "Transportes, correos y almacenamiento",
              synonymous: ["localidad", "localidades", "LOCALIDADES"],
              scale: 866685,
              position: 117,
              active: false,
              texts: {
                scale: 0,
                active: false,
              },
            },
            cSector51: {
              label: "Información en medios masivos",
              synonymous: ["localidad", "localidades", "LOCALIDADES"],
              scale: 866685,
              position: 118,
              active: false,
              texts: {
                scale: 0,
                active: false,
              },
            },
            cSector52: {
              label: "Servicios financieros y de seguros",
              synonymous: ["localidad", "localidades", "LOCALIDADES"],
              scale: 866685,
              position: 119,
              active: false,
              texts: {
                scale: 0,
                active: false,
              },
            },
            cSector53: {
              label: "Servicios inmobiliarios y de alquiler de bienes",
              synonymous: ["localidad", "localidades", "LOCALIDADES"],
              scale: 866685,
              position: 120,
              active: false,
              texts: {
                scale: 0,
                active: false,
              },
            },
            cSector54: {
              label: "Servicios profesionales, científicos y técnicos",
              synonymous: ["localidad", "localidades", "LOCALIDADES"],
              scale: 866685,
              position: 121,
              active: false,
              texts: {
                scale: 0,
                active: false,
              },
            },
            cSector55: {
              label: "Corporativos",
              synonymous: ["localidad", "localidades", "LOCALIDADES"],
              scale: 866685,
              position: 122,
              active: false,
              texts: {
                scale: 0,
                active: false,
              },
            },
            cSector56: {
              label: "Serv. de apoyo a los negocios y manejo de residuos",
              synonymous: ["localidad", "localidades", "LOCALIDADES"],
              scale: 866685,
              position: 123,
              active: false,
              texts: {
                scale: 0,
                active: false,
              },
            },
            cSector61: {
              label: "Servicios educativos",
              synonymous: ["localidad", "localidades", "LOCALIDADES"],
              scale: 866685,
              position: 124,
              active: false,
              texts: {
                scale: 0,
                active: false,
              },
            },
            cSector62: {
              label: "Servicios de salud y de asistencia social",
              synonymous: ["localidad", "localidades", "LOCALIDADES"],
              scale: 866685,
              position: 125,
              active: false,
              texts: {
                scale: 0,
                active: false,
              },
            },
            cSector71: {
              label: "Servicios de esparcimiento curturales y deportivos",
              synonymous: ["localidad", "localidades", "LOCALIDADES"],
              scale: 866685,
              position: 126,
              active: false,
              texts: {
                scale: 0,
                active: false,
              },
            },
            cSector72: {
              label: "Servicios de alojamiento temporal y de preparación",
              synonymous: ["localidad", "localidades", "LOCALIDADES"],
              scale: 866685,
              position: 127,
              active: false,
              texts: {
                scale: 0,
                active: false,
              },
            },
            cSector81: {
              label: "Otros serv. excepto actividades gubernamentales",
              synonymous: ["localidad", "localidades", "LOCALIDADES"],
              scale: 866685,
              position: 128,
              active: false,
              texts: {
                scale: 0,
                active: false,
              },
            },
            cSector93: {
              label: "Actividades legislativas, gubernamentales",
              synonymous: ["localidad", "localidades", "LOCALIDADES"],
              scale: 866685,
              position: 71,
              active: false,
              texts: {
                scale: 0,
                active: false,
              },
            },
          },
        },
        G80: {
          label: "Hechos viales municipio de Colima",
          layers: {
            
           
            chechos_viales_colima_2021: {
              label:
                "2021 Hechos viales ",
              synonymous: ["Hechos"],
              scale: 866685,
              position: 81,
              active: false,
              texts: {
                scale: 0,
                active: false,
              }, //,
              //metadato:'http://geoweb.inegi.org.mx/WSCBuscador/MuestraMetadatos.jsp?par1=52392&par2=INEGI1'
            },
            cmapas_calor_colima_2021: {
              label:
                "2021 Mapas de Calor ",
              synonymous: ["Hechos"],
              scale: 866685,
              position: 81,
              active: false,
              texts: {
                scale: 0,
                active: false,
              }, //,
              //metadato:'http://geoweb.inegi.org.mx/WSCBuscador/MuestraMetadatos.jsp?par1=52392&par2=INEGI1'
            },
            chechos_colima_2021_weeknd:{
              label: "2021 Hechos Viales por Dia de la Semana (Entre Semana y Fines de Semana)",
              synonymous:["hechos", "viales", "colima","2021", "2021 colima"],
              scale:866685,
              position:125,
              active:false,
              texts:{
                scale:0,
                active:false,
              },
            },
            cHVColima_cluster2021:{
              label:"2021 Clúster",
              synonymous:["2021","cluster", "colima"],
              scale: 866685,
              position: 4456,
              active: false,
              texts:{
                scale:0,
                active: false,
              },
            },
            cHVial_Concentrado_2019_2021:{
              label:"Concentrado Hechos Viales",
              synonymous:["2021","concentrado", "colima"],
              scale: 866685,
              position: 1886,
              active: false,
              texts:{
                scale:0,
                active: false,
              },
            },
            cHVial_Calor_Concentrado_2019_2021:{
              label:"Concentrado Mapa de Calor de Hechos Viales 2019_2021",
              synonymous:["2021","concentrado", "colima"],
              scale: 866685,
              position: 1886,
              active: false,
              texts:{
                scale:0,
                active: false,
              },
            },
          
          },
        },
        

        G85: {
          label: "Indice de Desigualdad Urbana Colima-Villa de Alvarez 2021",
          layers: {
            cIdu_Col_Vda_2021: {
              label: "Indice de Inclusion Social Urbana",
              synonymous: ["indice", "idu"],
              scale: 866685,
              position: 780,
              active: false,
              texts: {
                scale: 0,
                active: false,
              }, //,
              //metadato:'http://geoweb.inegi.org.mx/WSCBuscador/MuestraMetadatos.jsp?par1=52392&par2=INEGI1'
            },
            
            
          },
        },

       

        G88: {
          label: "Escuelas CEMABE",
          layers: {
            
            cPreescolar: {
              label: "Escuelas Preescolares",
              synonymous: ["Preescolares", "Escuelas"],
              scale: 866685,
              position: 109,
              active: false,
              texts: {
                scale: 0,
                active: false,
              }, //,
              //metadato:'http://geoweb.inegi.org.mx/WSCBuscador/MuestraMetadatos.jsp?par1=52392&par2=INEGI1'
            },
            cPrimarias: {
              label: "Escuelas Primarias",
              synonymous: ["Primarias", "Escuelas"],
              scale: 866685,
              position: 110,
              active: false,
              texts: {
                scale: 0,
                active: false,
              }, //,
              //metadato:'http://geoweb.inegi.org.mx/WSCBuscador/MuestraMetadatos.jsp?par1=52392&par2=INEGI1'
            },
            cSecundarias: {
              label: "Escuelas Secundarias",
              synonymous: ["Secundarias", "Escuelas"],
              scale: 866685,
              position: 111,
              active: false,
              texts: {
                scale: 0,
                active: false,
              }, //,
              //metadato:'http://geoweb.inegi.org.mx/WSCBuscador/MuestraMetadatos.jsp?par1=52392&par2=INEGI1'
            },
          },
        },


        G94: {
          label: "Rutas de transporte público de los municipios de Colima y Villa de Álvarez",
          layers: {
            cRutasColimaVillaDeAlvarez: {
              label: "Rutas de transporte",
              synonymous: ["rutas", "tecoman"],
              scale: 866685,
              position: 144,
              active: false,
              texts: {
                scale: 0,
                active: false,
              }, //,
              //metadato:'http://geoweb.inegi.org.mx/WSCBuscador/MuestraMetadatos.jsp?par1=52392&par2=INEGI1'
            },
            
            
          },
        },
      },
    },
  };
  if (typeof treeConfig != "undefined") {
    data = $.extend(data, treeConfig);
  }
  return data;
});
