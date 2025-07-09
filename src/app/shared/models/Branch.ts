import { DrawingObject } from "./DrawingObjects"
import { Vector2 } from "./Vector2"

export class Branch{
    name!: string
    drawingInstructions!: DrawingObject[]
    animationSteps = 0
    animationDuration = 0
    isAnimating = false
    doesAnimate = true
    isActive = false
    totalLength = 0

    hasAnimationStarted = false
    deltaSteps = 0

    constructor(name: string, drawingInstrictions:any[]){
        this.name = name
        this.drawingInstructions = drawingInstrictions

        this.drawingInstructions.forEach(i => {
            this.totalLength = this.totalLength + i.GetLength()             
        });
    }

    SetDoesAnimate(doesAnimate: boolean) : Branch{
        this.doesAnimate = doesAnimate
        return this
    }

    UpdateDeltaSteps(delta: number){
        this.deltaSteps = this.animationSteps * delta
    }

    animateFrame(context: CanvasRenderingContext2D, center: Vector2, zoom: number, initialIndex = 0){
        
        var instruction = this.drawingInstructions[initialIndex]
        var totalInstructions = this.drawingInstructions.filter(d => d.doesAnimate).length
        
        if(initialIndex >= totalInstructions || !instruction.doesAnimate){
            return
        }
        
        var stepsForInstruction = this.deltaSteps / totalInstructions
        //Smooth animation formula
        stepsForInstruction = 1 - Math.pow(1 - stepsForInstruction, 51)       
        instruction.drawAnimationFrame(context, center, zoom, stepsForInstruction, initialIndex, totalInstructions,  () => {
            var newIndex = initialIndex + 1
            
            this.animateFrame(context, center, zoom, newIndex)
        })

        this.hasAnimationStarted = true
    }

    resetAnimation(){
    }

}