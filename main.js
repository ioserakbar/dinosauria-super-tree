import { adjustZoom, onPointerDown, onPointerUp, onPointerMove } from '/controls.js'
import { canvas, mainDraw } from "./tools/canvasTools.js";


$(document).ready(function() {

    prepareCanvas();
    canvas.addEventListener( 'wheel', (e) => adjustZoom(e))
    document.body.addEventListener( 'mouseup' ,(e) =>  onPointerUp(e))
    document.body.addEventListener('mousemove', (e) =>  onPointerMove(e))
    document.body.addEventListener( 'mousedown' , (e) =>  onPointerDown(e))
});

$( window ).on( "resize", function() {
    prepareCanvas();
});

function prepareCanvas(){
    resizeCanvas();
    mainDraw();
}

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}


/*
 * TO DO LIST (por orden de imortancia /  relevancia relativa al progreso)
 *  - Hacer que el canvas se vea bien haciendo zoom y pueda ser navegable asi.
 *  - Hacer la  grafica de dona principal (donde se mostraran los principales clados de dinosauria, responsiva obviamente y dependiente de datos(que peudas agregar y quitar clados pues))
 *  - Console logger 
 *  - USAR COORDENADAS POLARES
 *  - Hacer la logica de la ramificación (dios? soy yo de nuevo...)
 *  - Poner los elementos informativos de los clados en sus respectivs lugares. 
 * 
*/
