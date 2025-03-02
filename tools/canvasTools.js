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

    //GUIDE LINES
    if(debugMode){
        // ctx.beginPath();
        

        // //Divisions line
        // var step = 30;
        // for (let i = 0; i <= canvas.width/2;  i = i + step) {
            
        //     ctx.moveTo(centerX, centerY);
        //     ctx.lineTo(centerX + i, canvas.height); 

        //     ctx.moveTo(centerX, centerY);
        //     ctx.lineTo(centerX - i, canvas.height);
            
        //     ctx.moveTo(centerX, centerY);
        //     ctx.lineTo(centerX + i, 0); 

        //     ctx.moveTo(centerX, centerY);
        //     ctx.lineTo(centerX - i,  0); 
        // }

        // for (let i = 0; i <= canvas.height/2;  i = i + step) {
            
        //     ctx.moveTo(centerX, centerY);
        //     ctx.lineTo(canvas.width, centerY + i); 

        //     ctx.moveTo(centerX, centerY);
        //     ctx.lineTo(canvas.width, centerY - i);
            
        //     ctx.moveTo(centerX, centerY);
        //     ctx.lineTo(0, centerY + i); 

        //     ctx.moveTo(centerX, centerY);
        //     ctx.lineTo(0, centerY - i);
            
        // }

        // ctx.strokeStyle = "#0000ff" + linesOpacity;
        // ctx.lineWidth = 5;
        // ctx.stroke();

    }


    // //First Circle
    // ctx.arc(centerX, centerY, firstCladeSize * zoom, 0, 2 * Math.PI);
    // //Second Partition
    // ctx.arc(centerX, centerY, secondCladeSize * zoom, 0, 1);
    // //We turn back to .5 counterclock wise to be at the middle of the arc
    // ctx.arc(centerX, centerY, secondCladeSize * zoom, 1, .5, true);

    // ctx.arc(centerX, centerY, totalTreeRadio * zoom, 0, 2 * Math.PI);


    // //We need to calculate the slope with the center to have correct angle
    // var angleDegree = 10;
    // var angleRadian = angleDegree * (Math.PI/180);

    // //calculate coordinates with polar to rectangular ecuation base of a distance
    // var distance = (secondCladeSize + 100) * zoom;

    // var exampleCoordX = distance * Math.cos(angleRadian);
    // var exampleCoordY = distance * Math.sin(angleRadian);

    // ctx.moveTo(centerX , centerY);


    // ctx.lineTo((centerX + exampleCoordX), (centerY + exampleCoordY));
}