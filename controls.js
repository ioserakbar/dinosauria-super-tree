import {canvas, ctx, draw} from "./canvasTools.js";
let isDragging = false
let dragStart = { x: 0, y: 0 }

let MAX_ZOOM = 10;
let MIN_ZOOM = 0.1;
let SCROLL_SENSITIVITY = 0.0005;

var zoom = .5;
var lineWidth = 2;

var offsetX = 0;
var offsetY = 0;

export function adjustZoom(e) {

    if(!isDragging){
        var delta = e.deltaY * SCROLL_SENSITIVITY;
        if (delta) { 
            zoom -= delta;
        }
    
        zoom = Math.min( zoom, MAX_ZOOM )
        zoom = Math.max( zoom, MIN_ZOOM )
        lineWidth = zoom * 4;

        redraw()
    }

};

export function onPointerDown(e)
{
    isDragging = true;
    dragStart.x = getEventLocation(e).x - offsetX;
    dragStart.y = getEventLocation(e).y - offsetY;
}

export function onPointerUp(e)
{
    //This function doesnt uses "e" but if it's not in the parameters, the site ignores it completly
    isDragging = false;
}

export function onPointerMove(e)
{
    if (isDragging)
    {
        offsetX = getEventLocation(e).x - dragStart.x
        offsetY = getEventLocation(e).y  - dragStart.y

        redraw()
    }
}

function getEventLocation(e)
{
    if (e.touches && e.touches.length == 1)
    {
        return { x:e.touches[0].clientX, y: e.touches[0].clientY }
    }
    else if (e.clientX && e.clientY)
    {
        return { x: e.clientX, y: e.clientY }        
    }
}

function redraw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(zoom, lineWidth, offsetX, offsetY);
}
