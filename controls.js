import { draw } from "./test.js";
import { CommonVariables } from "./data/commonVariables.js";

let isDragging = false
let dragStart = { x: 0, y: 0 }

let MAX_ZOOM = 10;
let MIN_ZOOM = 0.1;
let SCROLL_SENSITIVITY = 0.0005;

var lineWidth = 2;

var offset = {
    x:0,
    y:0
}

var common = new CommonVariables();
export function adjuztZoom(e) {

    if(!isDragging){
        var zoom = common.zoom;
        var delta = e.deltaY * SCROLL_SENSITIVITY;

        if (delta) { 
            zoom -= delta;
        }
    
        zoom = Math.min( zoom, MAX_ZOOM )
        zoom = Math.max( zoom, MIN_ZOOM )
        lineWidth = zoom * 4;
        common.zoom = zoom;

        reDraw()
    }

};

export function onPointerDown(e)
{
    isDragging = true;
    dragStart.x = getEventLocation(e).x - offset.x;
    dragStart.y = getEventLocation(e).y - offset.y;
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
        offset.x = getEventLocation(e).x - dragStart.x
        offset.y = getEventLocation(e).y  - dragStart.y

        reDraw()
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

function reDraw(){
    common.context.clearRect(0, 0, common.canvas.width, common.canvas.height);
    draw(lineWidth, offset);
}
