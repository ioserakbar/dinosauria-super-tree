import { isPlatformBrowser } from '@angular/common';
import {
	Component,
	ElementRef,
	HostListener,
	Inject,
	NgZone,
	PLATFORM_ID,
	ViewChild
} from '@angular/core';
import { Vector2 } from '../../../../shared/models/Vector2';
import { Branch } from '../../../../shared/models/Branch';
import { DrawingObject, Arc, Line, Dot, CanvasText } from '../../../../shared/models/DrawingObjects';
import { CladeService } from '../../../../services/clade/clade.service';
import { forkJoin, max } from 'rxjs';
import { Clade } from '../../../../shared/models/Clade';
import { getCardinalCoordsFromPolarDegrees, getTrueCardinalPoint } from '../../../../shared/functions/canvasTools';
import { DrawingOptions } from '../../../../shared/models/DrawingOptions';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
import { INSPECT_MAX_BYTES } from 'buffer';

@Component({
	selector: 'pt-test',
	imports: [],
	templateUrl: './test.component.html',
	styleUrl: './test.component.css',
})
export class TestComponent {

	//Html elements
	@ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>
	context!: CanvasRenderingContext2D

	//Controls
	isDragging = false
	dragActivated = false
	dragStart = new Vector2(0, 0)
	offset = new Vector2(0, 0)
	canvasCenter = new Vector2(0, 0)
	center = new Vector2(0, 0)
	mousePosition = new Vector2(0, 0)
	debugMode = false
	zoom = 1;
	SCROLL_SENSITIVITY = 0.001;

	//Data
	displayTree: Branch = new Branch("Display tree", [])
	branches: Branch[] = []
	allClades: Clade[] = []

	//Animation controls
	fps = 60;
	lastUpdate = Date.now()
	private intervalId: any;
	deltaTime = 0
	steps = 0
	animationDuration = 1;

	//Tree data
	maxDivisions = 0
	maxTreeRadius = 0
	divisionStep = 0;
	fontSize = 10
	padding = 0
	numberOfSpecies = 0
	

	//Collition data
	CollidedBranchIndex = 0
	isMouseColliding = false

	constructor(
		@Inject(PLATFORM_ID) private platformId: Object, 
		private ngZone: NgZone, 
		private cladeService: CladeService,
	) {}

	ngOnDestroy() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}
	}

	ngAfterViewInit() { 
		if (isPlatformBrowser(this.platformId)) {
			this.context = this.canvas.nativeElement.getContext('2d')!;
			this.resizeCanvas();
			this.deltaTime = 1  / this.fps
			this.render()

			const $clades = this.cladeService.getAll()
			forkJoin([$clades]).subscribe(results => {
				this.allClades = results[0]
				this.setUpTree()
				this.startRender()
			})
		}
		
	}	

	startRender(){
		this.ngZone.runOutsideAngular(() => {
			this.intervalId = setInterval(async () => {
				if(this.context  !== undefined && this.allClades.length > 0){
					this.tick()
				}
			}, (1000/this.fps));
		})
	}
	
	setUpTree(){

		this.allClades.filter(c => c.directSons.length == 0).forEach(tip => {
			this.numberOfSpecies++
		})
		this.fontSize = Math.min(360/this.numberOfSpecies, 20)
		this.padding = this.divisionStep / 10		
		var textArea = this.getMaxTextWidth() + 10
		this.maxDivisions = this.getMaxTier()
		this.maxTreeRadius = (this.canvas.nativeElement.height / 2) - 80 - textArea
		this.divisionStep  = this.maxTreeRadius / (this.maxDivisions + 1)
		this.generateBranches()

		if(this.debugMode){
			//Debug "branch"
			var instructions : DrawingObject[] = [
				new Arc("Max Width Circle", new Vector2(0, 0), this.maxTreeRadius, 0, 2 * Math.PI, false).SetOptions(new DrawingOptions().SetColor("blue").SetDashedStyle([10, 10])),
				new Arc("Max Width Circle With Text Area", new Vector2(0, 0), this.maxTreeRadius + textArea , 0, 2 * Math.PI, false).SetOptions(new DrawingOptions().SetColor("blue")),
				new Dot("Center", new Vector2(0, 0), 10).SetOptions(new DrawingOptions().SetColor("red"))
			]

			for (let i = 0; i < this.maxDivisions + 1; i++) {
				instructions.push(new Arc("Max Width Circle", new Vector2(0, 0), this.divisionStep * i, 0, 2 * Math.PI, false).SetOptions(new DrawingOptions().SetColor("rgba(255, 0, 0, 0.27)").SetDashedStyle([10, 10])))		
			}

			this.branches.push(
				new Branch("Debug branch", instructions).SetDoesAnimate(false)
			)
		}
	}

	getMaxTier(){
        var maxTier = 0;
        this.allClades.forEach(clade => {
            maxTier = clade.tier > maxTier ? clade.tier : maxTier
        });
        return maxTier
    }

	getMaxTextWidth(){
		var maxWidth = 0
		var canvas = document.createElement("canvas")
		var context = canvas.getContext("2d")!
		context.font = this.fontSize + "px Arial"
		this.allClades.filter(c => c.directSons.length == 0).forEach(tip => {
			var tipWidth = context.measureText(tip.name).width
			maxWidth = tipWidth > maxWidth ? tipWidth : maxWidth
		})
		return maxWidth + this.padding
	}

	generateBranches(){
		var allClades = this.allClades
		var branchesTips = allClades.filter(c => c.directSons.length == 0 )
		branchesTips.forEach(clade => {

			var branchInstructions: DrawingObject[] = []
			var familyClades = this.getCladeFamily(clade)

			familyClades.forEach((member: Clade, index) => {

				const cladePolarCoords = member.drawHelper!.coords
				const cladeDistance = cladePolarCoords.distance / 100 * this.divisionStep
				const cladeAngle = cladePolarCoords.angle
				const cladeChildren = member.directSons!.length

				const cladeCardinalCoords = getCardinalCoordsFromPolarDegrees(cladeDistance, cladeAngle , new Vector2(0, 0), this.zoom)
				const cladeNextDivisionCoord = getCardinalCoordsFromPolarDegrees(cladeDistance + this.divisionStep, cladeAngle, new Vector2(0, 0), this.zoom)
				const branchTipCoords = getCardinalCoordsFromPolarDegrees(this.maxTreeRadius, cladeAngle, new Vector2(0,0), this.zoom)
				const isLastOnFamily = familyClades.length == index + 1

				//branchInstructions.push(new Dot(member.name, cladeCardinalCoords, 4))
				//branchInstructions.push(new CanvasText(member.name, member.name, cladeCardinalCoords))
				if(!isLastOnFamily){
					var line = new Line(member.name, cladeCardinalCoords, cladeNextDivisionCoord)
					branchInstructions.push(line)			
					this.AddInstructionToDisplayTree(line)
				}
							

				if(cladeChildren > 1){

					const nextMember = familyClades[index + 1]
					const nextMemberPolarCoords = nextMember.drawHelper!.coords
					const nextMemberDistance = nextMemberPolarCoords.distance / 100 * this.divisionStep
					const nextMemberAngle = nextMemberPolarCoords.angle
					const nextMemberArcOrientation = nextMember.drawHelper!.arcOrientation
					const startAngle = cladeAngle * ( Math.PI / 180 )
					const endAngle = nextMemberAngle * ( Math.PI / 180 )

					let arc = new Arc(member.name, new Vector2 (0, 0), nextMemberDistance, startAngle, endAngle, nextMemberArcOrientation)
					let arcLength = arc.GetLength();
					if(arcLength > .00000000001){
						branchInstructions.push(arc)
						this.AddInstructionToDisplayTree(arc)
					}
				} 
				else if(isLastOnFamily){
					
					var lastLine = new Line(member.name, cladeCardinalCoords, branchTipCoords)
					branchInstructions.push(lastLine)
					this.AddInstructionToDisplayTree(lastLine)

					var textAngle = cladeAngle
					var textAlign:CanvasTextAlign = 'left'
					var padding = this.divisionStep / 10

					if(textAngle < 90 || textAngle >= 270 ){
						textAlign = "left"

					}
					else if(textAngle >= 90 && textAngle < 270) {
						textAlign = "right"
						textAngle = textAngle + 180
						padding = padding * -1
					}

					var cladeTextDisplay = new CanvasText(member.name, member.name, branchTipCoords)
						.SetFontSize(this.fontSize)
						.SetRotation(-textAngle)
						.SetTextAlign(textAlign)
						.SetPadding(padding)
						

					branchInstructions.push(cladeTextDisplay)
					this.AddInstructionToDisplayTree(cladeTextDisplay)

					var collisionLineLength = cladeTextDisplay.GetTextWidth(this.context)
					const branchEndCollisionLonePoint = getCardinalCoordsFromPolarDegrees(this.maxTreeRadius + collisionLineLength, cladeAngle , new Vector2(0,0), this.zoom)

					var textCollisionBoxColor = this.debugMode ? "#FFC0CB50" : "#FFC0CB00"
					if(this.debugMode){
						this.AddInstructionToDisplayTree(
							new Line(member.name, branchTipCoords, branchEndCollisionLonePoint)
							.SetOptions(new DrawingOptions()
								.SetColor("red")
								.SetLineWidth(1)
								.SetLineCap('square')
							)
						)
					}

					var textCollition = new Line(member.name, branchTipCoords, branchEndCollisionLonePoint)
						.SetOptions(new DrawingOptions()
							.SetColor(textCollisionBoxColor)
							.SetLineWidth(cladeTextDisplay.fontSize)
							.SetLineCap('square')
						)
						.ActivateCollition()
					branchInstructions.push(textCollition)
					this.AddInstructionToDisplayTree(textCollition)
				}
			})
			this.branches.push(new Branch(clade.name, branchInstructions))
		});
	}

	AddInstructionToDisplayTree(pInstruction: DrawingObject){

		var isInstructionRepeated = false

		this.displayTree.drawingInstructions.forEach( instruction => {
			if(pInstruction.GetId() == instruction.GetId()){
				isInstructionRepeated = true
			}
		})

		if(!isInstructionRepeated)
			this.displayTree.drawingInstructions.push(pInstruction)
	}

	getRandomColor() {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	getCladeFamily(clade: Clade){
		
		var family = new Array();
		var currentCladeId = clade.id!
		var searchFinished = false;
		
		do{
			var currentClade = this.allClades.find(x=>x.id == currentCladeId);
			if(currentCladeId == currentClade?.parentClade) {
				console.error('Clade has self reference parent', currentClade)
				searchFinished = true;
			}
			if(currentClade!.isFirst){
				family.push(currentClade);
				searchFinished = true;
			} else {
				family.push(currentClade);
				currentCladeId = currentClade!.parentClade;
			}
		}while(!searchFinished)

		return family.reverse();
	}
	
	//#region Host Listeners

	@HostListener('window:resize', ['$event'])
	onResize() {
		this.resizeCanvas();
	}

	@HostListener('mouseup', ['$event'])
    onPointerUp() {
        this.isDragging = false;
    }

	@HostListener('mousewheel', ['$event'])
    adjuztZoom(e: WheelEvent) {
        if (!this.isDragging) {
            var delta = e.deltaY * this.SCROLL_SENSITIVITY
            if (delta) {
                this.zoom -= delta
            }
            // this.zoom = Math.min(this.zoom, this.MAX_ZOOM)
            this.zoom = Math.max(this.zoom, .1)
        }

    };

    @HostListener('mousedown', ['$event'])
    onPointerDown() {

		//Dragging logic
		if(this.dragActivated){
			this.isDragging = true;
			this.dragStart.x = this.mousePosition.x - this.offset.x
			this.dragStart.y = this.mousePosition.y - this.offset.y
		}

		//Click logic
		if(this.isMouseColliding){
			var activeBranch = this.branches[this.CollidedBranchIndex]
			this.activateBranch(activeBranch)
		}else{
			this.resetSelections()
		}
    }

    @HostListener('mousemove', ['$event'])
    onPointerMove(e: MouseEvent) {
		
		this.mousePosition.x = e.clientX
		this.mousePosition.y = e.clientY

        if (this.isDragging) {
            this.offset.x = this.mousePosition.x - this.dragStart.x
            this.offset.y = this.mousePosition.y - this.dragStart.y
			
			this.center.x = this.canvasCenter.x + this.offset.x;
			this.center.y = this.canvasCenter.y + this.offset.y;
        }
    }

	@HostListener('document:keydown.space', ['$event']) 
	onKeydownHandler() {
		this.dragActivated = true
	}

	@HostListener('document:keyup.space', ['$event']) 
	onKeyupHandler() {
		this.dragActivated = false
	}

	activateBranch(branch: Branch) {
		var activeBranch = this.branches.find(f => f.isActive)
		if(activeBranch){
			activeBranch.isActive = false
		}
		branch.isActive = true
	}

	resetSelections(){
		var activeBranch = this.branches.find(f => f.isActive)
		if(activeBranch && !this.dragActivated){
			activeBranch.isActive = false
		}
	}

	//#endregion

	//#region Utility functions

	getEventLocation(e: MouseEvent) {
        return new Vector2(e.clientX, e.clientY)
    }
 
	resizeCanvas() {

		this.canvas.nativeElement.width = window.innerWidth
		this.canvas.nativeElement.height = window.innerHeight
		this.canvasCenter.x = window.innerWidth / 2
		this.canvasCenter.y = window.innerHeight / 2

		this.center.x = this.canvasCenter.x + this.offset.x
		this.center.y = this.canvasCenter.y + this.offset.y
	}

	//#endregion

	//#region main render funcitons
	render() {
	
		this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
		var collitionedBranches: Branch[] = []

		this.displayTree.drawingInstructions.forEach(instruction => {
			instruction.draw(this.context, this.center, this.zoom)
		});

		//Render all Branches
		this.branches.forEach(branch => {			
			branch.drawingInstructions.forEach(instruction => {
				instruction.resetAnimation()
				//instruction.draw(this.context, this.center, this.zoom)
			});	

			if(branch.isActive){
				collitionedBranches.push(branch)
			}else{
				branch.resetAnimation();
				branch.drawingInstructions.forEach(instruction => {
					instruction.resetAnimation()
				});	
				branch.animationSteps = 0;
			}
		});

		collitionedBranches.forEach(branch => {
			branch.animateFrame(this.context, this.center, this.zoom)
			branch.UpdateDeltaSteps(this.deltaTime)
			branch.animationSteps = branch.animationSteps + this.animationDuration
		});
		
	}

	checkCollision(){
		var didCollitionOnce = false;
		this.branches.forEach((branch, index) => {
			branch.drawingInstructions.filter(i => i.hasCollition).forEach(instruction => {
				instruction.drawCollition(this.context, this.center, this.zoom)
				if(this.context.isPointInStroke(this.mousePosition.x, this.mousePosition.y) && branch.doesAnimate){
					instruction.isCollitioningWithMouse = true
					didCollitionOnce = true
					this.CollidedBranchIndex = index
				}else{
					instruction.isCollitioningWithMouse = false
				}
			})
		});

		if(didCollitionOnce){
			this.setCursorToPointer()
		}else{
			this.setCursorToDefault()
		}

		this.isMouseColliding = didCollitionOnce
	}

	setCursorToPointer(){
		this.canvas.nativeElement.classList.remove('cursor-default')
		this.canvas.nativeElement.classList.add('cursor-pointer')
	}

	setCursorToDefault(){
		this.canvas.nativeElement.classList.remove('cursor-pointer')
		this.canvas.nativeElement.classList.add('cursor-default')
	}

	tick() {
		this.checkCollision()
		this.render()
	} 
	
	//#endregion

}



