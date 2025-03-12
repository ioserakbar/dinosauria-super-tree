import { Component, HostListener, ViewChild, Inject, PLATFORM_ID, ElementRef, Host } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { dummyCladeData, dummySpeciesData, Tree } from '../../../dataDummy'

@Component({
    selector: 'pt-round-phylogenetic-tree',
    imports: [],
    templateUrl: './round-phylogenetic-tree.component.html',
    styleUrl: './round-phylogenetic-tree.component.css'
})
export class RoundPhylogeneticTreeComponent {
    @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>

    //canvas variables
    center = { x: 0, y: 0 };
    offset = { x: 0, y: 0 };
    currentCenter = { x: 0, y: 0 }
    context?: CanvasRenderingContext2D | null;
    zoom = 1.2;
    lineWidth = this.zoom * 4;

    //tree variables
    treeRadius = 400;
    maxCladeDivisions = 4;
    tree?: Tree;

    //data variables
    dummyClade = dummyCladeData();
    dummySpecies = dummySpeciesData(
        this.dummyClade.find(x => x.name == "Triceratops")!.id,
        this.dummyClade.find(x => x.name == "Tyrannosaurus")!.id,
        this.dummyClade.find(x => x.name == "Diplodocus")!.id,
        this.dummyClade.find(x => x.name == "Megalosaurus")!.id
    )

    //Controls variables
    isDragging = false;
    SCROLL_SENSITIVITY = 0.0035;
    MAX_ZOOM = 10;
    MIN_ZOOM = 0.1;
    dragStart = { x: 0, y: 0 }

    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }
    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.context = this.canvas.nativeElement.getContext("2d")
            this.tree = new Tree(this.dummyClade)
            this.resizeCanvas()
            this.centerCanvas()
            this.draw()
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
    draw() {
        const context = this.context
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
                var distance = clade.totalSons == 0 ? this.treeRadius : clade.coords.distance
                const angle = clade.coords.angle
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
                    const sonsDistance = son.coords.distance
                    const sonsAngle = son.coords.angle
                    const startAngle = - angle * ( Math.PI / 180)
                    const endAngle =  - sonsAngle * ( Math.PI / 180)

                    context?.beginPath()
                    context?.moveTo(nextStep.x, nextStep.y)
                    context?.arc(center.x, center.y, sonsDistance * this.zoom, startAngle, endAngle, son.arcOrientation)
                    context?.stroke() 
                }

                //If its the last one we finish the line and print the species name
                if(clade.totalSons == 0){
                    const parentCoords = this.getCardinalCoordsFromPolar(family[i-1].coords.distance, family[i-1].coords.angle);
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
                        textAngle =  textAngle - 180;
                        
                    } 
                    else if(textAngle >= 180 && textAngle < 270){
                        // console.log(species.commonName, "textAngle >= 180 && textAngle < 270", textAngle)
                        context!.textAlign = "right"
                        textAngle =  textAngle - 180;
                        padding = padding * -1

                    }else if(textAngle >= 270){
                        // console.log(species.commonName, "textAngle >= 270", textAngle)
                        context!.textAlign = "right"
                        padding = padding * -1

                    }

                    context?.rotate( textAngle * ( Math.PI / 180) );
                    context!.font = 18 * this.zoom + "px Arial";
                    context?.fillText(species.binomialNomenglature, padding, 5 * this.zoom);
                    context?.restore();
                }
            })
        });

        ////Red dots with clade names
        // this.dummyClade.forEach(clade => {
        //     var distance = clade.totalSons == 0 ? this.treeRadius : clade.coords.distance
        //     const angle = clade.coords.angle
        //     const coords = this.getCardinalCoordsFromPolar(distance, angle)

        //     context?.beginPath();
        //     context?.moveTo(coords.x, coords.y)
        //     context?.arc(coords.x, coords.y, 6 * this.zoom, 0, 2 * Math.PI)
        //     context?.fill()
        //     context!.font = "18px Arial";
        //     context!.textAlign = 'center';
        //     context?.fillText(clade.name, coords.x, coords.y + 30)
        // })

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
        this.draw();
    }

    centerCanvas() {
        this.center.x = this.currentCenter.x = window.innerWidth / 2
        this.center.y = this.currentCenter.y = window.innerHeight / 2
    }
    //#endregion


    //#endregion
}
