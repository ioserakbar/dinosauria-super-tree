import { Generic } from "../data/genericClass.js";
import { CommonVariables } from "../data/commonVariables.js";

var common = new CommonVariables();
export class debugShapes extends Generic{
    constructor(){
        super();
    }

    renderCardinalPoints(color = '#ff0000', width = 3){

        common.context.beginPath();
        //Puntos cardinales
        //Norte
        common.context.moveTo(common.center.x , common.center.y);
        common.context.lineTo(common.center.x , 50);  
        common.context.font = "48px serif";
        common.context.textAlign = "center";
        common.context.textBaseline = "top";
        common.context.fillText("N", common.center.x , 0);

        //Sur
        common.context.moveTo(common.center.x , common.center.y);
        common.context.lineTo(common.center.x , common.canvas.height - 50);
        common.context.font = "48px serif";
        common.context.textAlign = "center";
        common.context.textBaseline = "bottom";
        common.context.fillText("S", common.center.x , common.canvas.height);

        //Oeste
        common.context.moveTo(common.center.x, common.center.y);
        common.context.lineTo(50, common.center.y); 
        common.context.font = "48px serif";
        common.context.textAlign = "left";
        common.context.textBaseline = "middle";
        common.context.fillText("O", 0, common.center.y);

        //Este
        common.context.moveTo(common.center.x, common.center.y);
        common.context.lineTo(common.canvas.width - 30 , common.center.y);
        common.context.font = "48px serif";
        common.context.textAlign = "right";
        common.context.textBaseline = "middle";
        common.context.fillText("E", common.canvas.width, common.center.y);
    
        common.context.strokeStyle = color;
        common.context.lineWidth = width;
        common.context.stroke();

        common.context.beginPath();
    }

    renderArchDivisions(color = 'green', width = 3){
        common.context.beginPath();
        common.context.lineWidth = width;
        common.context.stroke();
    
        var separation = common.totalTreeRadio / common.totalDivisions;
        for(var i = 0; i <= common.totalDivisions; i++){
            common.context.beginPath();
            common.context.arc(common.center.x, common.center.y, (separation * i) * common.zoom, 0, 2 * Math.PI);
            common.context.strokeStyle = color;
            common.context.stroke()
        }
    
    }

    renderDivisoryLines(lines = 64){
        for(var i = 1; i <= lines; i++){
            this.drawLineToPolarCoord((360 / lines) * i, common.treeRadio);
        }   
    }

    drawLineToPolarCoord(angle, distance, color = '#0000ff', width = 3){
        common.context.beginPath();
        common.context.moveTo(common.center.x, common.center.y);
    
        var coords = this.getCardinalCoordsFromPolar(distance, angle);
        common.context.lineTo(coords.x, coords.y);
    
        common.context.strokeStyle = color;
        common.context.lineWidth = width;
        common.context.stroke();
    
        return coords
    }

    getCardinalCoordsFromPolar(distancia, angulo){
        //0° siendo el este y 180° el oeste
        angulo = -angulo * (Math.PI / 180);
        var x = common.center.x + (distancia * Math.cos(angulo)) * common.zoom;
        var y = common.center.y + (distancia * Math.sin(angulo)) * common.zoom;
    
        return {x: x, y:y}
    }

    getPoint(c1,c2,radius,angle){
        return {
           x: c1+Math.cos(angle)*radius,
           y: c2+Math.sin(angle)*radius
        };
    }
}

function renderCardinalPoints(canvas, ctx, center, color = '#ff0000', width = 3){
    
    ctx.beginPath();
    //Puntos cardinales
    //Norte
    ctx.moveTo(center.x , center.y);
    ctx.lineTo(center.x , 50);  
    ctx.font = "48px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("N", center.x , 0);

    //Sur
    ctx.moveTo(center.x , center.y);
    ctx.lineTo(center.x , canvas.height - 50);
    ctx.font = "48px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("S", center.x , canvas.height);

    //Oeste
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(50, center.y); 
    ctx.font = "48px serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("O", 0, center.y);

    //Este
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(canvas.width - 30 , center.y);
    ctx.font = "48px serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText("E", canvas.width, center.y);
 
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();

    ctx.beginPath();
}

function renderArchDivisions(ctx, totalTreeRadio, totalDivisions, center, zoom, width = 3){
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.stroke();

    var separation = totalTreeRadio / totalDivisions;
    for(var i = 0; i <= totalDivisions; i++){
        ctx.beginPath();
        ctx.arc(center.x, center.y, (separation * i) * zoom, 0, 2 * Math.PI);
        ctx.strokeStyle = "green";
        ctx.stroke()
    }

    ctx.beginPath();
    ctx.arc(center.x, center.y, 10 * zoom, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    
    ctx.strokeStyle = "red";
    ctx.fill();
    ctx.stroke()
}

function renderDivisoryLines(ctx, totalTreeRadio, center, zoom, lines = 64){

    for(var i = 1; i <= lines; i++){
        drawLineToPolarCoord(ctx, center, (360 / lines) * i  ,totalTreeRadio, zoom);
    }   
}

function drawLineToPolarCoord(ctx, offset, angle, distance, zoom, color = '#0000ff', width = 1){
    ctx.beginPath();
    ctx.moveTo(offset.x, offset.y);

    var coords = getCardinalCoordsFromPolar(distance, angle, offset, zoom);
    ctx.lineTo(coords.x, coords.y);

    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();

    return coords
}

export function renderTreeBranch(ctx, offset, angle, distance, zoom, totalTreeRadio, totalDivisions ){
    
    //drawLineToPolarCoord(ctx, offset, angle, distance, zoom, 'black', 4);
    console.log('rendering', name)
    var separation = totalTreeRadio / totalDivisions;
       
}

export function renderearTestDeRamaDeArbol(ctx, offset, angle, distance, zoom){
    dibujarPuntoACoordenadaPolar(ctx, offset, angle, distance, zoom);
}

function dibujarPuntoACoordenadaPolar(ctx, offset, angle, distance, zoom){
    ctx.beginPath();
    ctx.moveTo(offset.x, offset.y);

    var coords = gerCardinalCoordsFromPolar(distance, angle, offset, zoom)
    ctx.moveTo(coords.x, coords.y)
    ctx.arc(coords.x, coords.y, 10 * zoom, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    
    ctx.strokeStyle = "red";
    ctx.fill();
    ctx.stroke()

}





