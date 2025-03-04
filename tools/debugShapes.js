

export function renderearPuntosCardinales(canvas, ctx, center, color = '#ff0000', width = 3){
    
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

export function rendereaDivisionesDeArcos(ctx, totalTreeRadio, totalDivisions, center, zoom, width = 3){
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

export function renderearLineasDivisorias(ctx, totalTreeRadio, center, zoom, lines = 64){

    for(var i = 1; i <= lines; i++){
        dibjuarLineaACoordenadaPolar(ctx, center, (360 / lines) * i  ,totalTreeRadio, zoom);
    }   
}

function dibjuarLineaACoordenadaPolar(ctx, offset, angle, distance, zoom){
    ctx.beginPath();
    ctx.moveTo(offset.x, offset.y);

    var coords = getCoordenadasCardinalesDePolares(distance, angle, offset, zoom);
    ctx.lineTo(coords.x, coords.y);

    ctx.strokeStyle = "#0000ff";
    ctx.lineWidth = 1;
    ctx.stroke();

}

export function renderearTestDeRamaDeArbol(ctx, offset, angle, distance, zoom){
    dibujarPuntoACoordenadaPolar(ctx, offset, angle, distance, zoom);
}

function dibujarPuntoACoordenadaPolar(ctx, offset, angle, distance, zoom){
    ctx.beginPath();
    ctx.moveTo(offset.x, offset.y);

    var coords = getCoordenadasCardinalesDePolares(distance, angle, offset, zoom)
    ctx.moveTo(coords.x, coords.y)
    ctx.arc(coords.x, coords.y, 10 * zoom, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    
    ctx.strokeStyle = "red";
    ctx.fill();
    ctx.stroke()

}


function getCoordenadasCardinalesDePolares(distancia, angulo, offset, zoom){


    angulo = -angulo * (Math.PI / 180);
    var x = offset.x + (distancia * Math.cos(angulo)) * zoom;
    var y = offset.y + (distancia * Math.sin(angulo)) * zoom;

    return {x: x, y:y}
}
