import { DrawingObject } from "./DrawingObjects"
import { Vector2 } from "./Vector2"

export class Branch{
    name!: string
    drawingInstructions!: DrawingObject[]
    animationSteps = 0
    isAnimating = false
    doesAnimate = true
    isActive = false

    hasAnimationStarted = false
    delta = 0
    deltaSteps = 0
    animatedInstructions = 0

    //In seconds
    animationDuration = 1



    constructor(name: string, drawingInstructions:any[]){
        this.name = name
        this.drawingInstructions = drawingInstructions

        this.animatedInstructions = this.drawingInstructions.filter(d => d.doesAnimate && d.type != "Text").length
    }

    SetDoesAnimate(doesAnimate: boolean) : Branch{
        this.doesAnimate = doesAnimate
        return this
    }

    UpdateDelta(delta: number){
        this.delta = delta
        var constant = (1/this.animationDuration) * this.animatedInstructions
        this.animationSteps = this.animationSteps + constant
        this.deltaSteps = this.animationSteps * this.delta 
    }
    
    animateFrame(context: CanvasRenderingContext2D, center: Vector2, zoom: number, currentInstructionIndex = 0){


        var instruction = this.drawingInstructions.filter(d => d.doesAnimate)[currentInstructionIndex]

        if(currentInstructionIndex >= this.animatedInstructions + 1){
            return
        }

        if(instruction.type =="Text"){
            var a = "debugin"
        }

        if(instruction.finishedAnimating){
            this.animateFrame(context, center, zoom, currentInstructionIndex + 1)
        }

        var stepsForInstruction = this.deltaSteps / this.animatedInstructions
        stepsForInstruction = 1 - Math.pow(1 - stepsForInstruction, 3)       
        var currentStep = Math.min((stepsForInstruction * this.animatedInstructions) - currentInstructionIndex, 1)
        instruction.drawAnimationFrame(context, center, zoom, currentStep)
    }

    resetAnimation(){
        this.delta = 0
        this.animationSteps = 0
        this.deltaSteps = 0
    }

    oldAnimateFrame(context: CanvasRenderingContext2D, center: Vector2, zoom: number, initialIndex = 0){
        
        var instruction = this.drawingInstructions.filter(d => d.doesAnimate)[initialIndex]
        var totalInstructions = this.drawingInstructions.filter(d => d.doesAnimate).length
        
        if(initialIndex >= totalInstructions || !instruction.doesAnimate){
            return
        }
        
        var deltaSteps = this.animationSteps * this.delta
        var stepsForInstruction = deltaSteps / totalInstructions
        //Smooth animation formula
        stepsForInstruction = 1 - Math.pow(1 - stepsForInstruction, 35)       
        instruction.olddrawAnimationFrame(context, center, zoom, stepsForInstruction, initialIndex, totalInstructions,  () => {
            var newIndex = initialIndex + 1
            
            this.oldAnimateFrame(context, center, zoom, newIndex)
        })
    }


}