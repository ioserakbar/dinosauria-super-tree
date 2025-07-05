import { DrawingObject } from "./DrawingObjects"
import { Vector2 } from "./Vector2"

export class Branch{
    name!: string
    drawingInstructions!: DrawingObject[]
    initialDelta = 0
    animationSteps = 0
    isAnimating = false;
    doesAnimate = true
    isActive = false

    constructor(name: string, drawingInstrictions:any[]){
        this.name = name
        this.drawingInstructions = drawingInstrictions
    }

    SetDoesAnimate(doesAnimate: boolean) : Branch{
        this.doesAnimate = doesAnimate
        return this
    }


    animateFrame(context: CanvasRenderingContext2D, center: Vector2, delta: number, initialIndex = 0){
        
        var instruction = this.drawingInstructions[initialIndex]
        var totalInstructions = this.drawingInstructions.filter(d => d.doesAnimate).length
        
        if(initialIndex >= totalInstructions || !instruction.doesAnimate){
            return
        }
        
        var deltaSteps = this.animationSteps * delta;
        var stepsForInstruction = deltaSteps / totalInstructions

        //Smooth animation formula
        stepsForInstruction = 1 - Math.pow(1 - stepsForInstruction, 51)       
        instruction.drawAnimationFrame(context, center, stepsForInstruction, initialIndex, totalInstructions,  () => {
            var newIndex = initialIndex + 1
            
            this.animateFrame(context, center, delta, newIndex)
        })
    }

    resetAnimation(){
        this.initialDelta = 0
    }

}