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

// function draw(){
//     console.log('drawing');
//     var centerX = canvas.width / 2;
//     var centerY = canvas.height / 2;

//     var currentX = centerX + offsetX;
//     var currentY = centerY + offsetY;


//     //GUIDE LINES
//     if(debugMode){
//         ctx.beginPath();
        
//         var linesOpacity = '100';

//         // //Main cardinal points
//         // //North
//         // ctx.moveTo(centerX , centerY);
//         // ctx.lineTo(centerX, 0);  

//         // //South
//         // ctx.moveTo(centerX , centerY);
//         // ctx.lineTo(centerX , canvas.height);

//         // //West
//         // ctx.moveTo(centerX, centerY);
//         // ctx.lineTo(0, centerY); 

//         // //East
//         // ctx.moveTo(centerX, centerY);
//         // ctx.lineTo(canvas.width , centerY);

//         // ctx.strokeStyle = '#ff0000' + linesOpacity;
//         // ctx.lineWidth = 3;
//         // ctx.stroke();

//         // ctx.beginPath();
//         // //X = 0 - CANVAS.WIDTH
//         // //Y = 0 - CANVAS.HEIGHT


//         // //Divisions line
//         // var step = 30;
//         // for (let i = 0; i <= canvas.width/2;  i = i + step) {
            
//         //     ctx.moveTo(centerX, centerY);
//         //     ctx.lineTo(centerX + i, canvas.height); 

//         //     ctx.moveTo(centerX, centerY);
//         //     ctx.lineTo(centerX - i, canvas.height);
            
//         //     ctx.moveTo(centerX, centerY);
//         //     ctx.lineTo(centerX + i, 0); 

//         //     ctx.moveTo(centerX, centerY);
//         //     ctx.lineTo(centerX - i,  0); 
//         // }

//         // for (let i = 0; i <= canvas.height/2;  i = i + step) {
            
//         //     ctx.moveTo(centerX, centerY);
//         //     ctx.lineTo(canvas.width, centerY + i); 

//         //     ctx.moveTo(centerX, centerY);
//         //     ctx.lineTo(canvas.width, centerY - i);
            
//         //     ctx.moveTo(centerX, centerY);
//         //     ctx.lineTo(0, centerY + i); 

//         //     ctx.moveTo(centerX, centerY);
//         //     ctx.lineTo(0, centerY - i);
            
//         // }

//         // ctx.strokeStyle = "#0000ff" + linesOpacity;
//         // ctx.lineWidth = 5;
//         // ctx.stroke();

//         ctx.beginPath();
//         ctx.lineWidth = currentLineWidth;
//         ctx.stroke();

//         var separation = totalTreeRadio / totalDivisions;
//         for(var i = 0; i <= totalDivisions; i++){
//             ctx.beginPath();
//             ctx.arc(currentX, currentY, (separation * i) * zoom, 0, 2 * Math.PI);
//             ctx.strokeStyle = "green";
//             ctx.stroke()
//         }

//         ctx.beginPath();
//         ctx.arc(currentX, currentY, 10 * zoom, 0, 2 * Math.PI);
//         ctx.fillStyle = "red";
        
//         ctx.strokeStyle = "red";
//         ctx.fill();
//         ctx.stroke()
        
//     }

//     // //First Circle
//     // ctx.arc(centerX, centerY, firstCladeSize * zoom, 0, 2 * Math.PI);
//     // //Second Partition
//     // ctx.arc(centerX, centerY, secondCladeSize * zoom, 0, 1);
//     // //We turn back to .5 counterclock wise to be at the middle of the arc
//     // ctx.arc(centerX, centerY, secondCladeSize * zoom, 1, .5, true);

//     // ctx.arc(centerX, centerY, totalTreeRadio * zoom, 0, 2 * Math.PI);


//     // //We need to calculate the slope with the center to have correct angle
//     // var angleDegree = 10;
//     // var angleRadian = angleDegree * (Math.PI/180);

//     // //calculate coordinates with polar to rectangular ecuation base of a distance
//     // var distance = (secondCladeSize + 100) * zoom;

//     // var exampleCoordX = distance * Math.cos(angleRadian);
//     // var exampleCoordY = distance * Math.sin(angleRadian);

//     // ctx.moveTo(centerX , centerY);


//     // ctx.lineTo((centerX + exampleCoordX), (centerY + exampleCoordY));
//     ;
// }

// Gets the relevant location from a mouse or single touch event


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
