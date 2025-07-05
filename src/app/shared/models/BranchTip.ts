import { lookupService } from "dns";
import { Vector2 } from "./Vector2";

export class BranchTip{

    cardinalCoords!: Vector2 
    name!: string
    cavasCoords!: Vector2
    transformation!: string
    rotation!: string
    hyperlink!: string
    color!: string

    constructor(name: string, cardinalCoords:Vector2, cavasCoords: Vector2, rotation: number, hyperlink: string, color: string){

        var transform = "rotate(" + -rotation + "deg) translateY(-50%)"

        if(rotation > 90 && rotation < 270){
            transform = "rotate(" + ( -rotation + 180 ) + "deg) translateX(-100%) translateY(-50%)"
        }

        this.name = name
        this.cardinalCoords = cardinalCoords
        this.cavasCoords = cavasCoords
        this.transformation = transform
        this.hyperlink = hyperlink
        this.color = color
    }

    SetCanvasCoords(cavasCoords: Vector2){
        this.cavasCoords = cavasCoords
    }
}