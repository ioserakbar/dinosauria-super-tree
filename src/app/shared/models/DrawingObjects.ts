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
    type = ""
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

    GetLength():number{ return 0 }

    GetId():string{ return ""}

    draw(context: CanvasRenderingContext2D, center: Vector2, zoom: number, isColliding?: boolean){}

    drawCollition(context: CanvasRenderingContext2D, center: Vector2, zoom: number) {}

    olddrawAnimationFrame(context: CanvasRenderingContext2D, center: Vector2, zoom: number, step: number, position:number, totalInstructions: number, onAnimationFinished?:CallableFunction, isFinished = false){}

    drawAnimationFrame(context: CanvasRenderingContext2D, center: Vector2, zoom: number, step: number, onAnimationFinished?:CallableFunction, isFinished = false){}

    resetAnimation(){
        this.initialDeltaTime = 0
        this.finishedAnimating = false
    }
}

export class Dot extends DrawingObject {
    point!: Vector2;
    size!: number;
    override type = "Dot"

    constructor(
        name: string,
        point: Vector2,
        size: number
    ) {
        super(name);
        this.point = point;
        this.size = size;
    }

    override GetLength(): number {
        return this.size * 2
    }

    override GetId(): string {
        return this.point.x.toString() + this.point.y.toString() + this.size.toString()
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

    override olddrawAnimationFrame(context: CanvasRenderingContext2D, center: Vector2, zoom: number, steps: number, position:number, totalInstructions: number, onAnimationFinished?:CallableFunction){  
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

    override drawAnimationFrame(context: CanvasRenderingContext2D, center: Vector2, zoom: number, steps: number, onAnimationFinished?:CallableFunction){  
        
    }
}

export class Arc extends DrawingObject {
    point!: Vector2;
    radius!: number;
    startAngle!: number;
    endAngle!: number;
    counterClockWise!: boolean;
    override type = "Arc"

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

    override GetLength(): number {
        return Math.abs(this.endAngle - this.startAngle) * this.radius
    }

    override GetId(): string {
        return this.point.x.toString() + this.point.y.toString() + this.radius.toString() + this.startAngle.toString() + this.endAngle.toString() + this.counterClockWise.toString()
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

    override olddrawAnimationFrame(context: CanvasRenderingContext2D, center: Vector2, zoom: number, steps: number, position:number, totalInstructions: number, onAnimationFinished?:CallableFunction){  
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

    override drawAnimationFrame(context: CanvasRenderingContext2D, center: Vector2, zoom: number, steps: number, onAnimationFinished?:CallableFunction){  
        
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
        

        if(this.finishedAnimating && onAnimationFinished){
            onAnimationFinished()
        } 
    }
}

export class Line extends DrawingObject {

    startPoint!: Vector2;
    endPoint!: Vector2;
    override type = "Line"
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

    override GetLength(): number {
        return Math.sqrt(Math.pow(this.endPoint.x - this.startPoint.x, 2) + Math.pow(this.endPoint.y - this.startPoint.y, 2))
    }

    override GetId(): string {
        return this.startPoint.x.toString() + this.startPoint.y.toString() + this.endPoint.x.toString() + this.endPoint.y.toString()
    }

    override draw(context: CanvasRenderingContext2D, center: Vector2, zoom: number, isColliding = false) {
        drawLine(context, center, zoom, this.startPoint, this.endPoint, this.options, isColliding);
    }

    override drawCollition(context: CanvasRenderingContext2D, center: Vector2, zoom: number) {
        drawLine(context, center, zoom, this.startPoint, this.endPoint, this.options);
    }

    override olddrawAnimationFrame(context: CanvasRenderingContext2D, center: Vector2, zoom: number, steps: number, position:number, totalInstructions: number, onAnimationFinished?:CallableFunction){  

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

    override drawAnimationFrame(context: CanvasRenderingContext2D, center: Vector2, zoom: number, steps: number, onAnimationFinished?:CallableFunction){  

        this.finishedAnimating = drawAnimatedLineFrame(context, center, zoom, steps, this.startPoint, this.endPoint, this.options)
    
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

    override type="Text"
    
    constructor(name:string, text: string, position: Vector2) {
        super(name)
        this.text = text
        this.position = position
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

    override GetId(): string {
        return this.text + this.position.x.toString() + this.position.x.toString() + this.rotation.toString()
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
    
    override drawAnimationFrame(context: CanvasRenderingContext2D, center: Vector2, zoom: number, step: number, onAnimationFinished?: CallableFunction, isFinished?: boolean): void {
        this.draw(context, center, zoom)
        this.finishedAnimating = true
    }

    GetTextWidth(context: CanvasRenderingContext2D,) : number{
		context.font = this.fontSize + "px " + this.fontFamily
		return context.measureText(this.text).width + this.padding
    }
}
