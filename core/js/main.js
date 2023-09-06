requirejs.config({
    urlArgs: "ver=" + (new Date()).getTime(),
    paths: {
        mdmVersion:'../config/mdmVersion',
		socialNetworks:'../config/socialNetworks'
    }
});
define(['mdmVersion','socialNetworks'],function(version,socialNetworks){
    $.when(
				$('<link>', {rel: 'stylesheet',type: 'text/css',href:'js/frameworks/OpenLayers/theme/default/style.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href:'css/main.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href:'css/htmlObjectsMod.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href:'css/effects.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href:'css/header.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href:'css/print.css'+'?ver='+mdmVersion}).appendTo('head'),
				$('<link>', {rel: 'stylesheet',type: 'text/css',href:'css/plantillas/mainSprite.css'+'?ver='+mdmVersion}).appendTo('head'),
				
				$.Deferred(function( deferred ){
					$( deferred.resolve );
				})
    ).done(function(){
			/////////
                        requirejs.config({
                        urlArgs: "ver=" + mdmVersion,
                        baseUrl: ((typeof apiUrl!=='undefined')?((apiUrl)?apiUrl:''):'')+'js/',
                        paths: {
                            OpenLayers:'frameworks/OpenLayers/OpenLayers',
                            //rutas de carga
                            framework: 'frameworks',
							math:'frameworks/math/math.min',
							sugar:'frameworks/sugar/sugar.min',
                            core:'core/core',
                            config:'../config/config',
                            tree:'../config/tree',
                            ui:'core/ui/ui',
                            api:'api',
                            restFullApi:'restfullApi',
                            project:'../projects/init',
                            tutorial:'../tutorial/tutorial',
                            tutorialDenue:'../tutorial/tutorialDenue',
                            tmsReader:'../json/TMSCapabilities'
                        },
                        shim: {
                            tmsReader:{
                                exports:'tmsReader',
                                deps:['OpenLayers']
                            },
							sugar:{
								exports:'sugar'
							},
                            OpenLayers: {
                                exports: 'OpenLayers',
                                deps:['config','tree','api','restFullApi']
                            },
                            core:{
                                deps:['ui','sugar','math']
                                },
							
                            project:{
                                deps:['api']   
                            },
                            Cookies:{
                                deps:['tutorial']
                            }/*,
							jsPdf:{
								exports:['jsPdf']
							}*/
                        }
                });
                require(['tmsReader','api','project','core','ui','tutorial'],function   (OpenLayers,api,project,core,ui,tutorial) {
                            
                        $('#header').show();
                        core.init();
                });
                        /////////
    });
    
});
