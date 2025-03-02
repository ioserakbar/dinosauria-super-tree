

export function drawCardinalPoints(canvas, ctx, center, color = '#ff0000', width = 3){
    
    ctx.beginPath();
    //Main cardinal points
    //North
    ctx.moveTo(center.x , center.y);
    ctx.lineTo(center.x , 50);  
    ctx.font = "48px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("N", center.x , 0);

    //South
    ctx.moveTo(center.x , center.y);
    ctx.lineTo(center.x , canvas.height - 50);
    ctx.font = "48px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("S", center.x , canvas.height);

    //West
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(50, center.y); 
    ctx.font = "48px serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("W", 0, center.y);

    //East
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

export function drawDivisionCircleHelper(ctx, totalTreeRadio, totalDivisions, center, width = 3, zoom){
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

export function divisoryLines(canvas, ctx, totalTreeRadio, center, zoom, lines = 64){

    for(var i = 1; i <= lines; i++){
        drawLineToPolarCoord(ctx, center, (360 / lines) * i  ,totalTreeRadio, zoom);
    }   
}

export function drawLineToPolarCoord(ctx, offset, angle, distance, zoom){
    ctx.beginPath();
    ctx.moveTo(offset.x, offset.y);

    angle = -angle * (Math.PI / 180);

    var x = offset.x + (distance * Math.cos(angle)) * zoom;
    var y = offset.y + (distance * Math.sin(angle)) * zoom;
    ctx.lineTo(x, y);

    ctx.strokeStyle = "#0000ff";
    ctx.lineWidth = 1;
    ctx.stroke();

}