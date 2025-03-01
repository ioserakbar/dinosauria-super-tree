
var zoom = .5;
let canvas;
var ctx;
var debugMode = true;
var totalDivisions = 10;
var totalTreeRadio = 1200;

let MAX_ZOOM = 10;
let MIN_ZOOM = 0.1;
let SCROLL_SENSITIVITY = 0.0005;

let isDragging = false
let dragStart = { x: 0, y: 0 }

let centerPoint = { x: window.innerWidth/2, y: window.innerHeight/2 }

var currentLineWidth = zoom * 4;

$(document).ready(function() {
    canvas = document.getElementById("myChart");
    ctx = canvas.getContext("2d");

    prepareCanvas();
    canvas.addEventListener( 'wheel', (e) => adjustZoom(e))

});

$( window ).on( "resize", function() {
    prepareCanvas();
});

function prepareCanvas(){
    resizeCanvas();
    draw();
}

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function draw(){
    console.log('drawing');
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;

    var currentX = centerX;
    var currentY = centerY;


    //GUIDE LINES
    if(debugMode){
        ctx.beginPath();
        
        var linesOpacity = '100';

        // //Main cardinal points
        // //North
        // ctx.moveTo(centerX , centerY);
        // ctx.lineTo(centerX, 0);  

        // //South
        // ctx.moveTo(centerX , centerY);
        // ctx.lineTo(centerX , canvas.height);

        // //West
        // ctx.moveTo(centerX, centerY);
        // ctx.lineTo(0, centerY); 

        // //East
        // ctx.moveTo(centerX, centerY);
        // ctx.lineTo(canvas.width , centerY);

        // ctx.strokeStyle = '#ff0000' + linesOpacity;
        // ctx.lineWidth = 3;
        // ctx.stroke();

        // ctx.beginPath();
        // //X = 0 - CANVAS.WIDTH
        // //Y = 0 - CANVAS.HEIGHT


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

        ctx.beginPath();
        ctx.lineWidth = currentLineWidth;
        ctx.stroke();

        var separation = totalTreeRadio / totalDivisions;
        for(var i = 0; i <= totalDivisions; i++){
            ctx.beginPath();
            ctx.arc(currentX, currentY, (separation * i) * zoom, 0, 2 * Math.PI);
            ctx.strokeStyle = "green";
            ctx.stroke()
        }

        ctx.beginPath();
        ctx.arc(currentX, currentY, 10 * zoom, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        
        ctx.strokeStyle = "red";
        ctx.fill();
        ctx.stroke()
        
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
    ;
}

function adjustZoom(e) {

    var delta = e.deltaY * SCROLL_SENSITIVITY;
    if (delta) { //Wheel goes down
        zoom += delta;
    }

    zoom = Math.min( zoom, MAX_ZOOM )
    zoom = Math.max( zoom, MIN_ZOOM )
    
    if(debugMode){
        console.log("Zoom value: " + zoom);
        console.log("lineWidth value: " + currentLineWidth);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();

    return false;
};


/*
 * TO DO LIST (por orden de imortancia /  relevancia relativa al progreso)
 *  - Hacer que el canvas se vea bien haciendo zoom y pueda ser navegable asi.
 *  - Hacer la  grafica de dona principal (donde se mostraran los principales clados de dinosauria, responsiva obviamente y dependiente de datos(que peudas agregar y quitar clados pues))
 *  - USAR COORDENADAS POLARES
 *  - Hacer la logica de la ramificación (dios? soy yo de nuevo...)
 *  - Poner los elementos informativos de los clados en sus respectivs lugares. 
 * 
*/
