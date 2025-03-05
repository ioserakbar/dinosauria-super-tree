import { adjuztZoom, onPointerDown, onPointerUp, onPointerMove } from '/controls.js'
import { canvas, render } from "./tools/canvasTools.js";


$(document).ready(function() {

    prepararCanvas();
    canvas.addEventListener( 'wheel', (e) => adjuztZoom(e))
    document.body.addEventListener( 'mouseup' ,(e) =>  onPointerUp(e))
    document.body.addEventListener('mousemove', (e) =>  onPointerMove(e))
    document.body.addEventListener( 'mousedown' , (e) =>  onPointerDown(e))
});

$( window ).on( "resize", function() {
    prepararCanvas();
});

function prepararCanvas(){
    resizeCanvas();
    render();
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
