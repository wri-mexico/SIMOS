var evento = function(){


};

var getContenido = function(){
  return '<div id="contenido">Prueba de despliegue<div>';
};

function contenidoTema(tema) {
  // const graficas_popup = `
  //   <div id="carouselExampleCaptions" class="carousel carousel-dark slide border border-primary" data-bs-ride="carousel" style="width: 700px;
  //   height: 800px;">
  //     <div class="carousel-indicators">
  //       <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
  //       <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
  //       <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
  //       <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="3" aria-label="Slide 4"></button>
  //     </div>
  //     <div class="carousel-inner">
  //       <div class="carousel-item active">
  //         <div class="card">
  //           <div class="card text-center">
  //             <div class="card-body">
  //               <h5 class="card-title">Tipo de hechos viales registrados en 2019</h5>
  //               <div class="grafica">
  //                 <canvas id="myChart_1" width="100px" height="100px"></canvas>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       <div class="carousel-item">
  //         <div class="card">
  //           <div class="card text-center">
  //             <div class="card-body">
  //               <h5 class="card-title">Tipo de persona usuaria lesioanda en un hecho vial de 2019</h5>
  //               <div class="grafica">
  //                 <canvas id="myChart_2" width="100px" height="100px"></canvas>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       <div class="carousel-item">
  //         <div class="card">
  //           <div class="card text-center">
  //             <div class="card-body">
  //               <h5 class="card-title">Temporalidad hehcos viales cada hora entre semana y fin de semana (2019)</h5>
  //               <div class="grafica">
  //                 <canvas id="myChart_3" width="100px" height="100px"></canvas>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       <div class="carousel-item">
  //         <div class="card">
  //           <div class="card text-center">
  //             <div class="card-body">
  //               <h5 class="card-title">Temporalidad hechos viales por día de la semana (2019)</h5>
  //               <div class="grafica">
  //                 <canvas id="myChart_4" width="100px" height="100px"></canvas>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //     <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
  //       <span class="carousel-control-prev-icon" aria-hidden="true"></span>
  //       <span class="visually-hidden">Previous</span>
  //     </button>
  //     <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
  //       <span class="carousel-control-next-icon" aria-hidden="true"></span>
  //       <span class="visually-hidden">Next</span>
  //     </button>
  //   </div>
  // `;

  switch(tema) {
    case 'T1':
      $("#item_popup").css("display", "block");
      $("#item_popup").html('<h1>ejemplo1</h1>');
      break;
    case 'T3':
      $("#item_popup").css("display", "block");
      $("#item_popup2").css("display", "none");
      $("#item_popup3").css("display", "none");
      $("#item_popup4").css("display", "none");
      
      break;
    case 'T4':
      $("#item_popup2").css("display", "block");
      $("#item_popup").css("display", "none");
      $("#item_popup3").css("display", "none");
      $("#item_popup4").css("display", "none");
      break;
    case 'T5':
      $("#item_popup3").css("display", "block");
      $("#item_popup").css("display", "none");
      $("#item_popup2").css("display", "none");
      $("#item_popup4").css("display", "none");
      break;
    case 'T6':
      $("#item_popup4").css("display", "block");
      $("#item_popup").css("display", "none");
      $("#item_popup2").css("display", "none");
      $("#item_popup3").css("display", "none");
      break;
    
  }
}
var projectParams = {
  'panel':            {
                        'right':{
                                  width:'0px',
                                  content:getContenido(),
                                  load:function(){ 
                                        
                                  }
                                }
                      },
  'aditionalLayers':[
                      {
                        type:'Wms',
                        label:'colima',		             
                        //url:'http://simos.col.gob.mx/cgi-bin/mapserv?map=/opt/map/mdm61vectormxsig.map&',
                        url:'http://127.0.0.1/cgi-bin/mapserv?map=/opt/map/mdm61vectormxsig.map&',
                        layer:'c108',
                        tiled:false,
                        format:'png'
                      }
                    ],
  'onLoad':           evento,
  'onMoveEnd':function(){console.log('move')},
  'onZoomEnd':function(){console.log('zoomend')},
  'onIdentify':function(e){
  requestSelect(e);
  },
  'btnTogglePanels':false
};
if(typeof(projectParams) != "undefined"){
    MDM6('init',projectParams);
}
