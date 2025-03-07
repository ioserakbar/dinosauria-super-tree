import { adjuztZoom, onPointerDown, onPointerUp, onPointerMove } from './controls.js'
import { CommonVariables } from "../data/commonVariables.js";
import { draw } from "./test.js";

var canvas = document.getElementById("myChart");

$(document).ready(function() {
    var common = new CommonVariables()
    common.canvas = canvas;
    common.context;
    prepararCanvas();
    addListeners();
});

$( window ).on( "resize", function() {
    prepararCanvas();
});

function prepararCanvas(){
    resizeCanvas();
    draw();
}

function resizeCanvas(){
    var common = new CommonVariables()
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    common.center.x = canvas.width / 2;
    common.center.y = canvas.height / 2;
}

function addListeners(){
    document.body.addEventListener( 'wheel', (e) => adjuztZoom(e))
    document.body.addEventListener( 'mouseup', (e) =>  onPointerUp(e))
    document.body.addEventListener( 'mousemove', (e) =>  onPointerMove(e))
    document.body.addEventListener( 'mousedown' , (e) =>  onPointerDown(e))
}


/*
 * TO DO LIST (por orden de imortancia /  relevancia relativa al progreso)
 *  - Hacer que el canvas se vea bien haciendo zoom y pueda ser navegable asi.
 *  - Hacer la  grafica de dona principal (donde se mostraran los principales clados de dinosauria, responsiva obviamente y dependiente de datos(que peudas agregar y quitar clados pues))
 *  - Console logger 
 *  - USAR COORDENADAS POLARES
 *  - Hacer la logica de la ramificación (dios? soy yo de nuevo...)
 *  - Poner los elementos informativos de los clados en sus respectivs lugares. 
*/
