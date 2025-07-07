import { Vector2 } from './Vector2';
import { DrawingOptions } from './DrawingOptions';
import { drawLine, drawArc, drawDot, drawAnimatedLineFrame, drawAnimatedArcFrame, drawAnimatedDotFrame, drawText} from '../functions/canvasTools';

export class DrawingObject {

    name!: string
    options = new DrawingOptions()
    initialDeltaTime = 0
    deltaTime = 0
    hasCollition = false
    finishedAnimating = false
    isCollitioningWithMouse?: boolean = false
    doesAnimate = true

    constructor(name: string) {
        this.name = name;
    }

    SetOptions(options : DrawingOptions) : DrawingObject {
        this.options = options
        return this
    }

    SetDoesAnimate(doesAnimate: boolean): DrawingObject{
        this.doesAnimate = doesAnimate
        return this
    }

    ActivateCollition(): DrawingObject{
        this.hasCollition = true
        return this
    }


    draw(context: CanvasRenderingContext2D, center: Vector2, zoom: number, isColliding?: boolean){}

    drawCollition(context: CanvasRenderingContext2D, center: Vector2, zoom: number) {}

    drawAnimationFrame(context: CanvasRenderingContext2D, center: Vector2, zoom: number, step: number, position:number, totalInstructions: number, onAnimationFinished?:CallableFunction, isFinished = false){}

    resetAnimation(){
        this.initialDeltaTime = 0
        this.finishedAnimating = false
    }
}

export class Dot extends DrawingObject {
    point!: Vector2;
    size!: number;

    constructor(
        name: string,
        point: Vector2,
        size: number
    ) {
        super(name);
        this.point = point;
        this.size = size;
    }

    override draw(context: CanvasRenderingContext2D, center: Vector2, zoom: number, isColliding = false) {
        drawDot(
            context,
            center,
            zoom, 
            this.point,
            this.size, 
            this.options,
            isColliding
        );
    }

    override drawCollition(context: CanvasRenderingContext2D, center: Vector2, zoom: number) {
        drawDot(
            context,
            center,
            zoom,
            this.point,
            this.size, 
            this.options
        );
    }

    override drawAnimationFrame(context: CanvasRenderingContext2D, center: Vector2, zoom: number, steps: number, position:number, totalInstructions: number, onAnimationFinished?:CallableFunction){  
        steps = Math.min((steps * totalInstructions) - position, 1)

        if(!this.finishedAnimating){   
            this.finishedAnimating = drawAnimatedDotFrame(
                context,
                center,
                zoom, 
                steps,
                this.point,
                this.size, 
                this.options
            );
        }else{
            this.draw(context, center, zoom, false)
        }

        if(this.finishedAnimating && onAnimationFinished){
            onAnimationFinished()
        } 
    }
}

export class Arc extends DrawingObject {
    point!: Vector2;
    radius!: number;
    startAngle!: number;
    endAngle!: number;
    counterClockWise!: boolean;

    constructor(
        name: string,
        point: Vector2,
        radius: number,
        startAngle: number,
        endAngle: number,
        counterClockWise: boolean
    ) {
        super(name);
        this.point = point;
        this.radius = radius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.counterClockWise = counterClockWise;
    }

    override draw(context: CanvasRenderingContext2D, center: Vector2, zoom: number, isColliding = false) {
        drawArc(
            context,
            center,
            zoom, 
            this.point,
            this.radius,
            this.startAngle,
            this.endAngle,
            this.counterClockWise,
            this.options, 
            isColliding
        );
    }

    override drawCollition(context: CanvasRenderingContext2D, center: Vector2, zoom: number) {
        drawArc(
            context,
            center,
            zoom,
            this.point,
            this.radius,
            this.startAngle,
            this.endAngle,
            this.counterClockWise,
            this.options
        );
    }

    override drawAnimationFrame(context: CanvasRenderingContext2D, center: Vector2, zoom: number, steps: number, position:number, totalInstructions: number, onAnimationFinished?:CallableFunction){  
        steps = Math.min((steps * totalInstructions) - position, 1)
        if(!this.finishedAnimating){
            this.finishedAnimating = drawAnimatedArcFrame(
                context,
                center,
                zoom,
                steps,
                this.point,
                this.radius,
                this.startAngle,
                this.endAngle,
                this.counterClockWise,
                this.options
            )
        }else{
            this.draw(context, center, zoom, true)
        }

        if(this.finishedAnimating && onAnimationFinished){
            onAnimationFinished()
        } 
    }
}

export class Line extends DrawingObject {

    startPoint!: Vector2;
    endPoint!: Vector2;

    collitionwidth?: number = 3

    constructor(
        name: string,
        startPoint: Vector2,
        endPoint: Vector2
    ) {
        super(name);
        this.startPoint = startPoint;
        this.endPoint = endPoint;
    }

    override draw(context: CanvasRenderingContext2D, center: Vector2, zoom: number, isColliding = false) {
        drawLine(context, center, zoom, this.startPoint, this.endPoint, this.options, isColliding);
    }

    override drawCollition(context: CanvasRenderingContext2D, center: Vector2, zoom: number) {
        drawLine(context, center, zoom, this.startPoint, this.endPoint, this.options);
    }

    override drawAnimationFrame(context: CanvasRenderingContext2D, center: Vector2, zoom: number, steps: number, position:number, totalInstructions: number, onAnimationFinished?:CallableFunction){  

        steps = Math.min((steps * totalInstructions) - position, 1) 
        if(!this.finishedAnimating){
            this.finishedAnimating = drawAnimatedLineFrame(context, center, zoom, steps, this.startPoint, this.endPoint, this.options)
        }else{
            this.draw(context, center, zoom, true)
        }

        if(this.finishedAnimating && onAnimationFinished){
            onAnimationFinished()
        } 
    }
}

export class CanvasText extends DrawingObject{
    
    text!: string
    position!: Vector2
    rotation = 0
    fontSize = 18
    textAlign:CanvasTextAlign = "left"
    padding = 10
    baseline:CanvasTextBaseline = "top"
    fontFamily = "Arial"
    
    constructor(name:string, text: string, position: Vector2) {
        super(name)
        this.text = text
        this.position = position
        this.doesAnimate = false
    }

    SetRotation(rotation: number): CanvasText{
        this.rotation = rotation
        return this
    }

    SetFontSize(fontSize: number): CanvasText{
        this.fontSize = fontSize
        return this
    }

    SetTextAlign(textAlign: CanvasTextAlign): CanvasText{
        this.textAlign = textAlign
        return this
    }

    SetPadding(padding: number): CanvasText{
        this.padding = padding
        return this
    }

    SetFontFamily(fontFamily: string): CanvasText{
        this.fontFamily = fontFamily
        return this
    }

    override draw(context: CanvasRenderingContext2D, center: Vector2, zoom: number) {
        drawText(
            context,
            center,
            zoom, 
            this.position, 
            this.text, 
            this.rotation, 
            this.fontSize, 
            this.textAlign,
            this.padding,
            this.baseline,
            this.fontFamily,
            this.options
        );
    }

    GetTextWidth(context: CanvasRenderingContext2D,) : number{
		context.font = this.fontSize + "px " + this.fontFamily
		return context.measureText(this.text).width + this.padding
    }
}
