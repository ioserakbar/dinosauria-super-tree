import { Component, HostListener, ViewChild, Inject, PLATFORM_ID, ElementRef, Host } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { Tree } from '../../../shared/models/Tree'
import { CladeService } from '../../../services/clade/clade.service'
import { Clade } from '../../../shared/models/Clade'
import { SpeciesService } from '../../../services/species/species.service'
import { Species } from '../../../shared/models/Species'
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals'
import { forkJoin } from 'rxjs'
@Component({
    selector: 'pt-round-cladogram',
    imports: [],
    templateUrl: './round-cladogram.component.html',
    styleUrl: './round-cladogram.component.css'
})
export class RoundCladogram {
    @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>

    //canvas variables
    center = { x: 0, y: 0 };
    offset = { x: 0, y: 0 };
    currentCenter = { x: 0, y: 0 }
    context?: CanvasRenderingContext2D | null;
    zoom = 1;
    lineWidth = this.zoom * 4;

    //tree variables
    treeRadius = 400;
    maxCladeDivisions = 4;
    tree?: Tree;

    //data variables
    dummyClade: Clade[] = []
    dummySpecies: Species[] = []

    //Controls variables
    isDragging = false;
    SCROLL_SENSITIVITY = 0.0035;
    MAX_ZOOM = 10;
    MIN_ZOOM = 0.1;
    dragStart = { x: 0, y: 0 }

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object, 
        private cladeService: CladeService,
        private speciesService: SpeciesService
    ) { 

        const $species = this.speciesService.getAll()
        const $clades = this.cladeService.getAll()

        forkJoin([$species, $clades]).subscribe(results => {
            this.dummySpecies = results[0]
            this.dummyClade = results[1]
            this.tree = new Tree(this.dummyClade)
            this.draw()
        })
        
    }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.context = this.canvas.nativeElement.getContext("2d")
            this.resizeCanvas()
        }
    }

    // #region controls and listeners

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.resizeCanvas();
    }

    @HostListener('mousewheel', ['$event'])
    adjuztZoom(e: WheelEvent) {
        if (!this.isDragging) {
            var delta = e.deltaY * this.SCROLL_SENSITIVITY
            console.log()
            if (delta) {
                this.zoom -= delta
            }

            this.zoom = Math.min(this.zoom, this.MAX_ZOOM)
            this.zoom = Math.max(this.zoom, this.MIN_ZOOM)
            this.lineWidth = this.zoom * 4
            this.draw()
        }

    };

    @HostListener('mouseup', ['$event'])
    onPointerUp() {
        this.isDragging = false;
    }

    @HostListener('mousedown', ['$event'])
    onPointerDown(e: MouseEvent) {
        this.isDragging = true;
        this.dragStart.x = this.getEventLocation(e).x - this.offset.x
        this.dragStart.y = this.getEventLocation(e).y - this.offset.y
    }

    @HostListener('mousemove', ['$event'])
    onPointerMove(e: MouseEvent) {
        if (this.isDragging) {
            this.offset.x = this.getEventLocation(e).x - this.dragStart.x
            this.offset.y = this.getEventLocation(e).y - this.dragStart.y

            this.currentCenter.x = this.center.x + this.offset.x;
            this.currentCenter.y = this.center.y + this.offset.y;
            this.draw()
        }
    }

    getEventLocation(e: MouseEvent) {
        return { x: e.clientX, y: e.clientY }
    }
    // #endregion


    //#region functions

    //#region drawing functions
    draw(){
        //Find first clade
        var firstClade = this.dummyClade.find(c => c.tier == 0)?.id

        if(this.context === undefined || firstClade === undefined)
            return
        
        //Empties the canvas
        this.context?.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)

        this.renderElement(firstClade)

    }

    renderElement(cladeId: String){
        var ctx = this.context;

        const center = {
            x: this.currentCenter.x,
            y: this.currentCenter.y
        }

        var clade = this.dummyClade.find(c => c.id == cladeId)
        if(clade === undefined){
            console.error("Clade " + cladeId + " NOT found.")
            return
        }

        /*
            - Move to the next step ALWAYS (if there is one)
            - Check if we need to arch or we finished 
            - If we need to arch, send sons to render in respective coords
            - Else we just extend the species to the end of the circle if they are not already there
        */

        //If this is the last clade to draw whe make the "distnce" all the way to the end
        const distance = clade.drawHelper!.coords.distance
        const angle = clade.drawHelper!.coords.angle
        const coords = this.getCardinalCoordsFromPolar(distance, angle)
        const nextStep = this.getCardinalCoordsFromPolar(distance + 100, angle)

        //Here we set the sryle of the lines and circles for all the tree
        ctx!.fillStyle = "red";
        ctx!.strokeStyle = "red";
        ctx!.lineCap = "round";
        
        //Renders center of cladogram, only the first clade enters this if
        if(clade.tier === 0){
            ctx!.lineWidth = this.lineWidth;
            ctx?.beginPath();
            ctx?.moveTo(center.x, center.y)
            ctx?.arc(center.x, center.y, 6 * this.zoom, 0, 2 * Math.PI)
            ctx?.fill()
        }

        //This means the clade has at least a son, so there is a next step 
        if(clade.directSons?.length! > 0){
            if(clade.directSons?.length! == 1){
                const lastCoords = this.getCardinalCoordsFromPolar(this.treeRadius, angle)
                ctx?.beginPath()
                ctx?.moveTo(coords.x, coords.y)
                ctx?.lineTo(lastCoords.x, lastCoords.y)
                ctx?.stroke()
            }
            else{
                ctx?.beginPath()
                ctx?.moveTo(coords.x, coords.y)
                ctx?.lineTo(nextStep.x, nextStep.y)
                ctx?.stroke()
            }

            //If it has more than 1 sons, we ned to render an arch 
            if(clade.directSons?.length > 1){
                clade.directSons.forEach(sonId => {
                    var son = this.dummyClade.find(c => c.id == sonId)!;
                    const sonsDistance = son.drawHelper!.coords.distance
                    const sonsAngle = son.drawHelper!.coords.angle
                    const startAngle = - angle * ( Math.PI / 180)
                    const endAngle =  - sonsAngle * ( Math.PI / 180)

                    ctx?.beginPath()
                    ctx?.moveTo(nextStep.x, nextStep.y)
                    //The var arch orientation is a flag to know where is the arc drawing to
                    ctx?.arc(center.x, center.y, sonsDistance * this.zoom, startAngle, endAngle, son.drawHelper!.arcOrientation)
                    ctx?.stroke() 

                    this.renderElement(sonId)
                });
            }
            else if(clade.directSons?.length == 1){
                this.renderElement(clade?.directSons[0])
            }
        }


        //This is when the path has reached the end, this displays the name of the genus
        //BTW for some weird reason an emtpy array returns a length of 1
        if(clade.directSons.length == 0){
            let padding = 10 * this.zoom;

            const lastCoords = this.getCardinalCoordsFromPolar(this.treeRadius, angle)

            //We draw a line to the
            ctx?.beginPath()
            ctx?.moveTo(lastCoords.x, lastCoords.y)
            ctx?.lineTo(coords.x, coords.y)
            ctx?.stroke()
            
            //We sabe the canvas and prepare it to write and rotate the text
            ctx?.save()
            ctx?.translate(lastCoords.x, lastCoords.y);

            //We orient the text to follow the line but to also be somewhat readable
            let textAngle =  angle ;
            if(textAngle < 90){
                ctx!.textAlign = "left"

            }
            else if(textAngle >= 90 && textAngle < 180) {
                ctx!.textAlign = "left"
                textAngle = textAngle - 180;
                
            } 
            else if(textAngle >= 180 && textAngle < 270){
                ctx!.textAlign = "right"
                textAngle = textAngle - 180;
                padding = padding * -1

            }else if(textAngle >= 270){
                ctx!.textAlign = "right"
                padding = padding * -1

            }

            ctx?.rotate( textAngle * ( Math.PI / 180) );
            ctx!.font = 18 * this.zoom + "px Arial";
            console.log(clade.id, distance)
            var name = this.dummySpecies.find(s => s.genus == clade!.id)!.binomialNomenclature
            ctx?.fillText(name, padding, 5 * this.zoom);
            ctx?.restore();
        }



    }
    
    draw_old() {
        const context = this.context
        
        if(context === undefined)
            return
        
        context?.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)

        const center = {
            x: this.currentCenter.x,
            y: this.currentCenter.y
        }

        context?.beginPath()

        //Whole tree baby!
        this.dummySpecies.forEach(species => {

            const family = this.tree?.getSpeciesFamily(species)

            family?.forEach((clade, i) =>{
                var distance = clade.drawHelper.totalSons == 0 ? this.treeRadius : clade.drawHelper.coords.distance
                const angle = clade.drawHelper.coords.angle
                const coords = this.getCardinalCoordsFromPolar(distance, angle)
                const nextStep = this.getCardinalCoordsFromPolar(distance + 100, angle)
                
                //First we move to the next division if there is a next step
                context!.fillStyle = "red";
                context!.strokeStyle = "gray";
                context!.lineCap = "round";
                context!.lineWidth = this.lineWidth;
                if(family[i + 1]){
                    context?.beginPath()
                    context?.moveTo(coords.x, coords.y)
                    context?.lineTo(nextStep.x, nextStep.y)
                    context?.stroke()
                }
                //Then we draw an arch if theres a division
                if(family[i + 2]){
                    const son = family[i+1];
                    const sonsDistance = son.drawHelper.coords.distance
                    const sonsAngle = son.drawHelper.coords.angle
                    const startAngle = - angle * ( Math.PI / 180)
                    const endAngle =  - sonsAngle * ( Math.PI / 180)

                    context?.beginPath()
                    context?.moveTo(nextStep.x, nextStep.y)
                    context?.arc(center.x, center.y, sonsDistance * this.zoom, startAngle, endAngle, son.drawHelper.arcOrientation)
                    context?.stroke() 
                }

                //If its the last one we finish the line and print the species name
                if(clade.drawHelper.totalSons == 0){
                    const parentCoords = this.getCardinalCoordsFromPolar(family[i-1].drawHelper.coords.distance, family[i-1].drawHelper.coords.angle);
                    let padding = 10 * this.zoom;

                    context?.beginPath()
                    context?.moveTo(parentCoords.x, parentCoords.y)
                    context?.lineTo(coords.x, coords.y)
                    context?.stroke()

                    context?.beginPath();
                    context?.moveTo(coords.x, coords.y)
                    context?.arc(coords.x, coords.y, 6 * this.zoom, 0, 2 * Math.PI)
                    context?.fill()

                    context?.save()
                    context?.translate(coords.x, coords.y);

                    let textAngle =  angle ;
                    if(textAngle < 90){
                        // console.log(species.commonName, "< 90", textAngle)
                        context!.textAlign = "left"

                    }
                    else if(textAngle >= 90 && textAngle < 180) {
                        // console.log(species.commonName, "textAngle >= 90 && textAngle < 180", textAngle)
                        context!.textAlign = "left"
                        textAngle = textAngle - 180;
                        
                    } 
                    else if(textAngle >= 180 && textAngle < 270){
                        // console.log(species.commonName, "textAngle >= 180 && textAngle < 270", textAngle)
                        context!.textAlign = "right"
                        textAngle = textAngle - 180;
                        padding = padding * -1

                    }else if(textAngle >= 270){
                        // console.log(species.commonName, "textAngle >= 270", textAngle)
                        context!.textAlign = "right"
                        padding = padding * -1

                    }

                    context?.rotate( textAngle * ( Math.PI / 180) );
                    context!.font = 18 * this.zoom + "px Arial";
                    context?.fillText(species.binomialNomenclature, padding, 5 * this.zoom);
                    context?.restore();
                }
            })
        });
    }

    getCardinalCoordsFromPolar(distance: number, angle: number) {
        //0° siendo el este y 180° el oeste
        angle = -angle * (Math.PI / 180)
        var x = (this.center.x + (distance * Math.cos(angle)) * this.zoom) + this.offset.x
        var y = (this.center.y + (distance * Math.sin(angle)) * this.zoom) + this.offset.y

        return { x: x, y: y }
    }

    drawLineToPolarCoord(origin: {x: number, y: number}, distance: number, angle: number) {
        const context = this.context
        context?.moveTo(origin.x, origin.y)
        var coords = this.getCardinalCoordsFromPolar(distance, angle)
        context?.lineTo(coords.x, coords.y)
    }
    //#endregion


    //#region canvas functions
    resizeCanvas() {
        this.canvas.nativeElement.width = window.innerWidth;
        this.canvas.nativeElement.height = window.innerHeight;

        this.center.x = window.innerWidth / 2
        this.center.y = window.innerHeight / 2

        this.currentCenter.x = this.center.x + this.offset.x
        this.currentCenter.y = this.center.y + this.offset.y
        this.draw();
    }
    //#endregion


    //#endregion
}
