import { renderearPuntosCardinales, rendereaDivisionesDeArcos, renderearLineasDivisorias, renderearTestDeArbol } from "./debugShapes.js";

export var canvas = document.getElementById("myChart");
export var ctx = canvas.getContext("2d");

var totalDivisions = 10;
var totalTreeRadio = 1200;
var debugMode = true;

export function render(zoom = .5, currentLineWidth = 2, offset={x:0,y:0}){
    var center = {
        x:(canvas.width / 2) + offset.x,
        y:(canvas.height / 2) + + offset.y
    }

    
    rendereaDivisionesDeArcos(ctx, totalTreeRadio, totalDivisions, center, zoom);

    renderearLineasDivisorias(ctx, totalTreeRadio, center, zoom);

    renderearPuntosCardinales(canvas, ctx, center);

    renderearTestDeArbol(ctx, center, 45, 450, zoom);

}