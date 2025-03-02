import { drawCardinalPoints, drawDivisionCircleHelper, divisoryLines } from "./debugShapes.js";

export var canvas = document.getElementById("myChart");
export var ctx = canvas.getContext("2d");

var totalDivisions = 10;
var totalTreeRadio = 1200;
var debugMode = true;

export function mainDraw(zoom = .5, currentLineWidth = 2, offset={x:0,y:0}){
    var center = {
        x:(canvas.width / 2) + offset.x,
        y:(canvas.height / 2) + + offset.y
    }

    drawDivisionCircleHelper(ctx, totalTreeRadio, totalDivisions, center, currentLineWidth, zoom)

    drawCardinalPoints(canvas, ctx, center);

    divisoryLines(canvas, ctx, totalTreeRadio, center, zoom);

}