define(['cluster','modal'],function(Cluster,Modal) {
    
    
    var getContent = function(){
        var cadena = '<div id="school-tab">'+
                        '<ul>'+
                            '<li><a href="#school-tab-1">Centro educativo</a></li>'+
                            '<li><a href="#school-tab-2">Alumnos y maestros</a></li>'+
                            '<li><a href="#school-tab-3">Gr&aacute;ficas</a></li>'+
                            //'<li><a href="#school-tab-4">Opciones especiales</a></li>'+
                        '</ul>'+
                        '<div id="school-tab-1" style="height:300px;width:350px;">'+
                            getTabla()+
                        '</div>'+
                        '<div id="school-tab-2" style="height:200px;">'+
                            getDatos()+
                        '</div>'+
                        '<div id="school-tab-3" style="height:400px">'+
                            '<p><img src="img/GraficaAlumnos.jpg"></p>'+
                        '</div>'+
                        /*
                        '<div id="school-tab-4">'+
                            '<p></p>'+
                        '</div>'+
                        */
                    '</div>';
        return cadena;
    };
    var getTabla = function(){
        var estilo = 'style="float:left;width:35%;height:25px;background:#E8E8E8;border-bottom:1px solid #BFBFBF;"';
        var estilo2 = 'style="float:left;width:50%;height:25px;border-bottom:1px solid #BFBFBF;"';
        var estilo3 = 'style="margin-left:10px;position:relative;top:2px;"';
        var cadena ='<div align="left" style="font-size:110%;margin-left:10px;margin-top:5px;margin-bottom:10px;margin-right:10px;width:400px">'+
                       '<div style="width:100%"><div '+estilo+'><div '+estilo3+' >Clave</div></div><div '+estilo2+'><div '+estilo3+' id="esculaid">11DPR3084V</div></div></div>'+
                       '<div style="width:100%"><div '+estilo+'><div '+estilo3+'>Nombre</div></div><div '+estilo2+'><div '+estilo3+' id="escuela">Francisco Villa</div></div></div>'+
                       '<div style="width:100%"><div '+estilo+'><div '+estilo3+'>Turno</div></div><div '+estilo2+'><div '+estilo3+'>Vespertino</div></div></div>'+
                       '<div style="width:100%"><div '+estilo+'><div '+estilo3+'>Nivel</div></div><div '+estilo2+'><div '+estilo3+'>Primaria</div></div></div>'+
                       '<div style="width:100%"><div '+estilo+'><div '+estilo3+'>Servicio educativo</div></div><div '+estilo2+'><div '+estilo3+'>Educaci&oacute;n b&aacute;sica</div></div></div>'+
                       '<div style="width:100%"><div '+estilo+'><div '+estilo3+'>Director</div></div><div '+estilo2+'><div '+estilo3+'>Hector Jesus Esparza Chia</div></div></div>'+
                       '<div style="width:100%"><div '+estilo+'><div '+estilo3+'>T&eacute;lefono</div></div><div '+estilo2+'><div '+estilo3+'>Sin dato</div></div></div>'+
                       '<div style="width:100%"><div '+estilo+'><div '+estilo3+'>Pagina Web</div></div><div '+estilo2+'><div '+estilo3+'>Sin dato</div></div></div>'+
                       '<div style="width:100%"><div '+estilo+'><div '+estilo3+'>Entidad</div></div><div '+estilo2+'><div '+estilo3+'>Aguascalientes</div></div></div>'+
                       '<div style="width:100%"><div '+estilo+'><div '+estilo3+'>Municipio</div></div><div '+estilo2+'><div '+estilo3+'>Aguascalientes</div></div></div>'+
                       '<div style="width:100%"><div '+estilo+'><div '+estilo3+'>Localidad</div></div><div '+estilo2+'><div '+estilo3+'>Aguascalientes</div></div></div>'+
                    '</div>';
                
        return cadena;
    };
    var getDatos = function(){
        var estilo = 'style="float:left;width:20%;height:25px;background:#E8E8E8;border-bottom:1px solid #BFBFBF;"';
        var estilo2 = 'style="float:left;width:40%;height:25px;border-bottom:1px solid #BFBFBF;"';
        var estilo4 = 'style="float:left;width:40%;height:25px;border-bottom:1px solid #BFBFBF;"';
        var estilo3 = 'style="margin-left:10px;position:relative;top:2px;"';
        var cadena ='<div align="left" style="font-size:110%;margin-left:10px;margin-top:5px;margin-bottom:10px;margin-right:10px;width:400px;">'+
                       '<div style="width:100%;float"><div '+estilo+'><div '+estilo3+'>Grado</div></div><div '+estilo2+'><div '+estilo3+'>Alumnos</div></div>       <div '+estilo2+'><div '+estilo4+'>Maestros</div></div></div>'+
                       
                       '<div style="width:100%"><div '+estilo+'><div '+estilo3+'>1&deg; grado</div></div><div '+estilo2+'><div '+estilo3+'>138</div></div> <div '+estilo2+'><div '+estilo4+'>4</div></div></div>'+
                       '<div style="width:100%"><div '+estilo+'><div '+estilo3+'>2&deg; grado</div></div><div '+estilo2+'><div '+estilo3+'>103</div></div>       <div '+estilo2+'><div '+estilo4+'>4</div></div></div>'+
                       '<div style="width:100%"><div '+estilo+'><div '+estilo3+'>3&deg; grado</div></div><div '+estilo2+'><div '+estilo3+'>86</div></div>         <div '+estilo2+'><div '+estilo4+'>4</div></div></div>'+
                       '<div style="width:100%"><div '+estilo+'><div '+estilo3+'>4&deg; grado</div></div><div '+estilo2+'><div '+estilo3+'>65</div></div> <div '+estilo2+'><div '+estilo4+'>4</div></div></div>'+
                       '<div style="width:100%"><div '+estilo+'><div '+estilo3+'>5&deg; grado</div></div><div '+estilo2+'><div '+estilo3+'>43</div></div>       <div '+estilo2+'><div '+estilo4+'>4</div></div></div>'+
                       '<div style="width:100%"><div '+estilo+'><div '+estilo3+'>6&deg; grado</div></div><div '+estilo2+'><div '+estilo3+'>30</div></div>         <div '+estilo2+'><div '+estilo4+'>4</div></div></div>'+
                    '</div>';
                
        return cadena;
    };
    var ficha = Modal.create({
                    title:'Ficha',
                    content:getContent(),
                    events:{
                        onCancel:function(){
                            ficha.hide();
                        },
                        onCreate:function(){
                            $("#school-tab").tabs();
                        },
                        onShow:function(){
                           
                        }
                    }
    });
    
    var paramsRequest={};
    
    var source = {
        inmueble:[
            {label:'Caracter&iacute;sticas constructivas',items:[
                                                            {label:'Tipo de construcci&oacute;n',items:[
                                                                                                    {label:'Hecha para fines educativos'},
                                                                                                    {label:'Adaptada para fines educativos'},
                                                                                                    {label:'Provisional (materiales ligeros y precarios)'},
                                                                                                    {label:'Escuela m&oacute;vil (un vag&oacute;n, cami&oacute;n, circo, etc.)'},
                                                                                                    {label:'No tiene construcci&oacute;n (al aire libre)'}
                                                                                                 ]}
                                                        ]
            },
            {label:'Servicios Generales',items:[
                                                            {label:'Fuente de abastecimiento de agua',items:[
                                                                                                    {label:'Red p&uacute;blica'},
                                                                                                    {label:'Pipa'},
                                                                                                    {label:'Pozo o noria del inmueble'},
                                                                                                    {label:'Por acarreo'},
                                                                                                    {label:'No tiene agua'}
                                                                                                 ]
                                                            },
                                                            {label:'Fuente de energ&iacute;a el&eacute;ctrica',items:[
                                                                                                    {label:'Conexi&oacute;n al servicio p&uacute;blico'},
                                                                                                    {label:'Paneles o celdas solares'},
                                                                                                    {label:'Planta de luz propia'},
                                                                                                    {label:'No tiene energ&iacute;a el&eacute;ctrica'}
                                                                                                 ]
                                                            },
                                                            {label:'Servicios generales',items:[
                                                                                                    {label:'L&iacute;nea Tel&eacute;fonica'},
                                                                                                    {label:'Cisterna o Aljibe'},
                                                                                                    {label:'Drenaje'}
                                                                                                 ]
                                                            },
                                                            {label:'Programas de apoyo',items:[
                                                                                                    {label:'Escuelas de Calidad (PEC)'},
                                                                                                    {label:'Desayunos Escolares (PDE)'},
                                                                                                    {label:'Oportunidades '}
                                                                                                 ]
                                                            },
                                                            {label:'Servicios de C&oacute;mputo',items:[
                                                                                                    {label:'Dispone de Laboratorio'},
                                                                                                    {label:'Conexi&oacute;n a internet'},
                                                                                                    {label:'N&uacute;mero de computadoras'}
                                                                                                 ]
                                                            }
                                                        ]
            }
        ],
        profesor:[
            
                {label:'Tipo de construcci&oacute;n',items:[
                                                            {label:'Matutino'},
                                                            {label:'Vespertino'},
                                                            {label:'Nocturno'},
                                                            {label:'Discontin&uacute;o'},
                                                            {label:'Cont&iacute;nuo tiempo completo'},
                                                            {label:'Cont&iacute;nuo, jornada ampliada'},
                                                            {label:'Complementario o Mixto'}
                                                    ]
                },
                {label:'&Uacute;ltimo grado de escolaridad',items:[
                                                            {label:'Sin escolaridad'},
                                                            {label:'Primaria'},
                                                            {label:'Estudios t&eacute;cnicos o comerciales con primaria terminada'},
                                                            {label:'Secundaria'},
                                                            {label:'Profesional t&eacute;cnico'},
                                                            {label:'Preparatoria o bachillerato'},
                                                            {label:'T&eacute;cnico superior'},
                                                            {label:'Normal preescolar'},
                                                            {label:'Normal primaria'},
                                                            {label:'Normal superior (licenciatura)'},
                                                            {label:'Licenciatura'},
                                                            {label:'Maestr&iacute;a'},
                                                            {label:'Doctorado'}
                                                    ]
                },
                {label:'Antig&uuml;edad en el sistema educativo',items:[
                                                            {label:'Menos de 1 a&ntilde;o'},
                                                            {label:'2 o m&aacute;s a&ntilde;os'}
                                                    ]
                },
                {label:'Lengua',items:[
                                                            {label:'Habla alguna lengua ind&iacute;gena'},
                                                            {label:'Habla alguna lengua extranjera'},
                                                            {label:'Imparte su clase en alguna lengua ind&iacute;gena '}
                                                    ]
                },
                {label:'Capacitaci&oacute;n',items:[
                                                            {label:'Ha recibido capacitaci&oacute;n en los &uacute;ltimos 12 meses'},
                                                            {label:'Ha participado en el programa del sistema de formaci&oacute;n continua y superaci&oacute;n profesional de maestros de educaci&oacute;n b&aacute;sica en servicio'},
                                                            {label:'Esta en el programa de carrera magistral'}
                                                    ]
                },
                {label:'Situaci&oacute;n de estudios',items:[
                                                            {label:'Titulado'},
                                                            {label:'T&iacute;tulo en tr&aacute;mite'},
                                                            {label:'Pasante'},
                                                            {label:'Estudios inconclusos o contin&uacute;a estudiando'}
                                                    ]
                }
            
        ],
        alumno:[
            
                {label:'Traslado de su casa a la escuela',items:[
                                                            {label:'Caminando',percent:0},
                                                            {label:'En transporte p&uacute;blico',percent:0},
                                                            {label:'En transporte escolar',percent:0},
                                                            {label:'En autom&oacute;vil o camioneta',percent:0},
                                                            {label:'En bicicleta',percent:0},
                                                            {label:'En motocicleta',percent:0},
                                                            {label:'En panga o lancha',percent:0},
                                                            {label:'En caballo, burro, mula, etc',percent:0},
                                                            {label:'Otros',percent:0}
                                                    ]
                },
                {label:'Becas de apoyos a la educaci&oacute;n',items:[
                                                            {label:'No recibe beca ni apoyo a la educaci&oacute;n',percent:0},
                                                            {label:'Beca de Apoyo a la Educaci&oacute;n B&aacute;sica de Madres J&oacute;venes y J&oacute;venes Embarazadas (PROMAJOVEN)',percent:0},
                                                            {label:'Beca Oportunidades',percent:0},
                                                            {label:'Beca para personas con discapacidad',percent:0},
                                                            {label:'Beca Ac&eacute;rcate a tu Escuela (CONAFE antes FIDUCAR)',percent:0},
                                                            {label:'Beca del gobierno estatal o del Distrito Federal',percent:0},
                                                            {label:'Beca de fundaciones o instituciones privadas ',percent:0},
                                                            {label:'Beca de escuela particular',percent:0},
                                                            {label:'Programa de Educaci&oacute;n Primaria para Ni&ntilde;as y Ni&ntilde;os Migrantes (PRONIM)',percent:0},
                                                            {label:'S&iacute; recibe beca o apoyo, pero no sabe qui&eacute;n lo otorga',percent:0}

                                                    ]
                },
                {label:'Tiene acceso a Internet en',items:[
                                                            {label:'Casa',percent:0},
                                                            {label:'Escuela',percent:0},
                                                            {label:'En otro lugar',percent:0},
                                                            {label:'No tiene acceso',percent:0}

                                                    ]
                },
                {label:'Cuenta con servicios de Eduaci&oacute;n Especial',items:[
                                                            {label:'CAM',percent:0},
                                                            {label:'USAER',percent:0},
                                                            {label:'CAPEP',percent:0},
                                                            {label:'CRIE, CRIO o UOP',percent:0},
                                                            {label:'CAPEP',percent:0},
                                                            {label:'Apoyo psicol&oacute;gico o terapia privados',percent:0},
                                                            {label:'No recibe',percent:0}

                                                    ]
                },
                {label:'Posee capacidades diferentes',items:[
                                                            {label:'Motricidad',percent:0},
                                                            {label:'Baja visi&oacute;n',percent:0},
                                                            {label:'Ceguera',percent:0},
                                                            {label:'Sordera',percent:0},
                                                            {label:'Hipoacusia o baja audici&oacute;n ',percent:0},
                                                            {label:'Autismo',percent:0},
                                                            {label:'Mental',percent:0}

                                                    ]
                }
            
        ]
    };
    var reg = {
        sost:{
            public:'u555',
            private:'r444'
        },
        level:{
            preescolar:'prescolar',
            primaria:'primaria',
            secundaria:'secundaria',
            usaer:'UNIDAD DE SERVICIOS DE APOYO A LA EDUCACION REGULAR (USAER)',
            cam:'CENTRO DE ATENCION MULTIPLE (CAM)',
            biblioteca:'w5858',
            oficina:'ww8787',
            centro:'centros de maestros',
            bodega:'u774'
        },
        options:{}
    };
    var addReg = function(){
        
    }
    var panel = 'panel-right';
    var idContainer;
    var idTitle;
    var define = function(){
        $("#"+panel).panel({
            width:'300px',
            position:'right',
            type:'static',
            title:'panel izquierdo',
            load:function(event,ui){
                //console.log("cargado");
                //console.log(event);console.log(ui);
            }
        }).css('z-index',1);
        idContainer = $("#"+panel).panel('container');
        idTitle = $("#"+panel).panel('title');
        buildContenido(idContainer);
    };
    var getContainer = function(texto,contenido){
        var chain = '<div class="school-container ui-corner-all">'+
                        '<div class="custom-panel-header"><div class="contentPanel">'+texto+'</div></div>'+
                        contenido+
                    '</div>'+
                    '<div style="width:100%;height:5px"></div>';
        return chain;
    };
    var getAdvancedContainer = function(texto,contenido){
       
        var chain = '<div class="school-advanced-container ui-corner-all">'+
                        '<div class="header">'+
                                '<div class="close dinamicPanel-sprite dinamicPanel-close-short"></div>'+
                                '<div class="advanced-option" align="center" option="sec_inmueble">'+
                                    '<div class="school_template small-icon inmueble"></div>'+
                                    '<div>Inmuebles</div>'+
                                    '<div class="advanced-option-selected"></div>'+
                                '</div>'+
                                '<div class="advanced-option"  align="center" option="sec_profesor">'+
                                    '<div class="school_template small-icon profesor"></div>'+
                                    '<div>Profesores</div>'+
                                    '<div></div>'+
                                '</div>'+
                                '<div class="advanced-option" align="center" option="sec_alumno">'+
                                    '<div class="school_template small-icon alumno"></div>'+
                                    '<div>Alumnos</div>'+
                                    '<div></div>'+
                                '</div>'+
                            
                        '</div>'+
                        contenido+
                    '</div>';
        return chain;
    };
    var reduce = function(text){
        var limit = 30;
        result={text:text,title:''};
        if(text.length>limit){
            result.title = ' title="'+text+'" ';
            result.text = text.substring(0,limit)+'...';
        }
        return result;
    };
    var getList = function(list,prefix){
        var chain='';
        for(x in list){
            var info = reduce(list[x].label);
            chain+='<div class="school-list-parent"><div class="label" '+info.title+'>'+info.text+'</div></div>';
            if(list[x].items){
                var list2 = list[x].items;
                for(i in list2){
                    var info = reduce(list2[i].label);
                    if(list2[i].items){
                        chain+='<div class="school-list-section"><div class="label"'+info.title+'>'+info.text+'</div></div>';
                    }else{
                        var slider='';
                        var boton='';
                        var clase='';
                        if(list2[i].percent==0){
                            slider='<div class="school-slider" style="position:relative;left:16px;top:10px;width:80%;display:none" id="s'+prefix+x+i+'"></div>';
                            boton ='<button class="appy_percent" id="b'+prefix+x+i+'" style="float:right;top: -5px;position:relative;display:none;height:20px;width:30px;"></button>';
                            clase='BtnPercent';
                        }
                        chain+='<div class="school-list-option"><div class="label"><input type="checkbox" id="'+prefix+x+i+'" class="'+clase+'"><label id="p'+prefix+x+i+'"></label><label for="'+prefix+x+i+'"'+info.title+'>'+info.text+'</label>'+slider+boton+'</div></div>';
                    }
                    
                    if(list2[i].items){
                        var list3 = list2[x].items;
                        for(f in list3){
                             var info = reduce(list3[f].label);
                            chain+='<div class="school-list-option"><div class="label2"><input type="checkbox" id="'+prefix+x+i+f+'"><label for="'+prefix+x+i+f+'"'+info.title+'>'+info.text+'</label></div></div>';
                        }
                    }
                }
            }
        }
        return chain;
    };
    var getParentList = function(items){
        var chain='';
        for(x in items){
            if(items[x].type=='children'){
                chain+='<div style="margin-left:40px;">'+item[x].label+'</div>';
            }else{
                chain+='<div style="margin-left:40px;">'+item[x].label+'</div>';
            }
        }
    };
    var getNodeList = function(items){
        
    };
    var getHeader = function(text){
        return '<div class="custom-panel-header"><div class="contentPanel">'+text+'</div></div>'
    };
    var getSostenimiento = function(){
        var chain = '<div class="school-sostenimiento">'+
                        '<div class="container">'+
                            '<button class="public">P&uacute;blico</button>'+
                            '<button class="private">Privado</button>'+
                        '</div>'+
                    '</div>';
        return chain;
    }
    var getComputo = function(){
        var chain = '<div class="school-computo">'+
                        '<div class="container">'+
                            '<button class="lab">Laboratorio</button>'+
                            '<button class="internet">Internet</button>'+
                        '</div>'+
                    '</div>';
        return chain;
    }
    var getLengua = function(){
        var chain = '<div class="school-lengua">'+
                        '<div class="container">'+
                            '<button class="lengua">Imparten clase en alguna lengua ind&iacute;gena</button>'+
                        '</div>'+
                    '</div>';
        return chain;
    }
    var getCuadro = function(etiqueta,option){
        var maximo = 15;var title='';
        if(etiqueta.length>maximo){
            title=' title="'+etiqueta+'"';
            etiqueta=etiqueta.substring(0,15)+"...";
        }
        var chain =         '<div class="school-option-main" '+title+'>'+
                                '<div class="ui-corner-all school-option school-option-border">'+
                                    '<div class="container">'+
                                        '<div class="ui-corner-top icon" option="'+option+'" align="center"><div class="school_template big-icon '+option+'"></div></div>'+
                                        '<span class="check ui-button-icon-primary ui-icon ui-icon-check" style="display:none"></span>'+
                                        '<div class="ui-corner-bottom label">'+etiqueta+'</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
        return chain;
    }
    
    var getLevels = function(){
        var chain = '<div style="width:100%px;height:385px;">'+
                      
                        '<div style="width:100%">'+
                            getCuadro('Preescolar','preescolar')+
                            getCuadro('Primaria','primaria')+
                        '</div>'+
                        '<div style="width:100%">'+
                            getCuadro('Secundaria','secundaria')+
                            getCuadro('Unidad de Servicios de Apoyo a la Educaci&oacute;n Regular (USAER)','usaer')+
                        '</div>'+
                        '<div style="width:100%">'+
                            getCuadro('Centro de Atenci&oacute;n M&uacute;ltiple(CAM)','cam')+
                            getCuadro('Bibliotecas','biblioteca')+
                        '</div>'+
                        '<div style="width:100%">'+
                            getCuadro('Oficinas','oficina')+
                            getCuadro('Centros de maestros','centro')+
                        '</div>'+
                        '<div style="width:100%">'+
                            getCuadro('Bodegas','bodega')+
                        '</div>'+
                    '</div>';
        return chain;
    };
    var moreOptions = function(){
        var chain = '<div style="width:100%px;" align="right">'+
                        '<button class="more-options">M&aacute;s opciones..</button>'+
                    '</div>';
        return chain;
    };
    var advancedOptions = function(){
       var chain = '<div class="multipleOptions">'+ //style="width:100%px;height:208px;"
                        '<div id="sec_inmueble" class="school-panel-active">'+
                            getList(source.inmueble,'inmueble')+
                        '</div>'+
                        '<div id="sec_profesor" style="display:none">'+
                            getList(source.profesor,'profesor')+
                        '</div>'+
                        '<div id="sec_alumno" style="display:none">'+
                            getList(source.alumno,'alumno')+
                        '</div>'+
                    '</div>';
        return chain;
    };
    var addEvents = function(){
        var active = false;
        var status = active;
        var status2 = active;
        var status3 = active;
        var status4 = active;
        var status5 = active;
        var opcion = 'public';
        $("."+opcion).button()
        .click(function(){
            var icon = (status)?"":"ui-icon-check";
            if(status){
                delete paramsRequest[opcion];
            }else{
                paramsRequest[opcion]=reg.sost[opcion];
            }
            $(this).button( "option", "icons", { primary: icon} );
            status=!status;
            Cluster.setParams(paramsRequest);
            Cluster.execute();
        });
       
       var opcion2 = 'private';
       $("."+opcion2).button()
       .click(function(){
            var icon = (status2)?"":"ui-icon-check";
            if(status2){
                delete paramsRequest[opcion2];
            }else{
                paramsRequest[opcion2]=reg.sost[opcion2];
            }
            $(this).button( "option", "icons", { primary: icon} );
            status2=!status2;
            Cluster.setParams(paramsRequest);
            Cluster.execute();
        });
       var opcion3 = 'lab'
       $("."+opcion3).button()
        .click(function(){
            var icon = (status3)?"":"ui-icon-check";
            if(status3){
                reg.sost[opcion3]=true;
            }else{
                delete reg.sost[opcion3];
            }
            $(this).button( "option", "icons", { primary: icon} );
            status3=!status3;
            
        });
       
       var opcion4 = 'internet';
       $("."+opcion4).button()
       .click(function(){
            var icon = (status4)?"":"ui-icon-check";
            if(status4){
                reg.sost[opcion4]=true;
            }else{
                delete reg.sost[opcion4];
            }
            $(this).button( "option", "icons", { primary: icon} );
            status4=!status4;
        });
       var opcion5 = 'lengua';
       $("."+opcion5).button()
       .click(function(){
            var icon = (status5)?"":"ui-icon-check";
            if(status5){
                reg.sost[opcion5]=true;
            }else{
                delete reg.sost[opcion5];
            }
            $(this).button( "option", "icons", { primary: icon} );
            status5=!status5;
        });
       $(".school-option").each(function(){
            var status = false;
            
            $(this).click(function(){
                var icon = $(this).children().children().next('span');
                var option = icon.prev().attr('option');
                if(status){
                    icon.hide();
                    delete paramsRequest[option];
                }else{
                    icon.show();
                    paramsRequest[option]=reg.level[option];
                }
                status =!status;
                Cluster.setParams(paramsRequest);
                Cluster.execute();
            });
        });
       $(".more-options").button({icons:{primary:'ui-icon-gear'}}).click(function(){
                //$(this).hide();
                $(".advanced-section").show( 'slide', {direction:"right"}, 500 );
                $(".basic-section").removeClass('basic-section-height').addClass('basic-section-height-adapted');
                //$(".school-advanced-container").show( 'slide', {direction:"right"}, 500 );
        });
       $(".header .close").click(function(){
             $(".advanced-section").hide( 'slide', {direction:"right"}, 500 );
        });
       $(".advanced-option").each(function(){
            $(this).click(function(){
                $(".advanced-option-selected").removeClass('advanced-option-selected');
                $(this).children(':last').addClass('advanced-option-selected');
                var panel = $(this).attr('option');
                $(".school-panel-active").hide().removeClass('school-panel-active');
                $("#"+panel).show().addClass('school-panel-active');
            });
        });
       $(".school-slider").each(function(){
            var id = $(this).attr('id');
            id = id.substring(1,id.length);
            $(this).slider({
                slide: function( event, ui ) {
                    $("#p"+id).html("("+ui.value+"%) ");
                }
            });
        });
       $(".BtnPercent").each(function(){
            $(this).click(function(){
                if($(this).is(":checked")){
                    var id = $(this).attr('id');
                    $("#s"+id).show();
                    $("#b"+id).show();
                    $(this).parent().parent().removeClass('school-list-option').addClass('school-list-option-percent');
                }
            });
            
        });
       $(".appy_percent").each(function(){
            $(this).button({icons: {
                primary: "ui-icon-circle-check"
              }});
            $(this).click(function(){
                var id = $(this).attr('id');
                id = id.substring(1,id.length);
                $("#s"+id).hide();
                $("#b"+id).hide();
                $(this).parent().parent().removeClass('school-list-option-percent').addClass('school-list-option');
            });
        });
    };
    var buildContenido = function(){
        
        //$('#'+idTitle).append('<div style="padding-top:7px;font-size:12px;font-weight:bold;">Sector</div>');
        var seccion1 ='<div class="basic-section basic-section-height"></div>';
        var seccion2='<div class="advanced-section" style="display:none"></div>';
        $("#"+idContainer).addClass('custom-panel-container');
        $("#"+idContainer).append(seccion1);
        $("#"+idContainer).append(seccion2);
        
        $(".basic-section").append(getContainer('Sostenimiento',getSostenimiento()));
        $(".basic-section").append(getContainer('Nivel educativo',getLevels()));
        $(".basic-section").append(getContainer('Servicios de C&oacute;mputo',getComputo()));
        $(".basic-section").append(getContainer('Lengua',getLengua()));
        $(".basic-section").append(moreOptions());
        
        $(".advanced-section").append(getAdvancedContainer('titulo',advancedOptions()));
        
        addEvents();
    }
    return {
        init:function(){
            define();
        },
        verFicha:function(){
            ficha.show();
        }
    }
});