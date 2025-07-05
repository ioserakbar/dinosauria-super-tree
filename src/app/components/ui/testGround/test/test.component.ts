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
import { BranchTip } from '../../../../shared/models/BranchTip';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';

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

	//Data
	branches: Branch[] = []
	branchesTips: BranchTip[] = []
	allClades: Clade[] = []

	//Animation controls
	fps = 60;
	lastUpdate = Date.now()
	private intervalId: any;
	deltaTime = 0
	steps = 0
	animationSpeed = 2;

	//Tree data
	maxDivisions = 0
	maxTreeRadius = 0
	divisionStep = 0;
	fontSize = 30
	padding = this.divisionStep / 10

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
				this.startRender()
				this.setUpTree()
			})
		}
		
	}	

	startRender(){
		this.ngZone.runOutsideAngular(() => {
			this.intervalId = setInterval(async () => {
				if(this.context  !== undefined && this.allClades.length > 0){
					this.tick();
				}
			}, (1000/this.fps));
		})
	}
	
	setUpTree(){
		
		var textArea = this.getMaxTextWidth() + 10
		this.maxDivisions = this.getMaxTier()

		this.maxTreeRadius = this.canvas.nativeElement.height / 2 - 80 - textArea
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

				const cladeCardinalCoords = getCardinalCoordsFromPolarDegrees(cladeDistance, cladeAngle , new Vector2(0, 0))
				const cladeNextDivisionCoord = getCardinalCoordsFromPolarDegrees(cladeDistance + this.divisionStep, cladeAngle, new Vector2(0, 0))
				const branchTipCoords = getCardinalCoordsFromPolarDegrees(this.maxTreeRadius, cladeAngle, new Vector2(0,0))
				const isLastOnFamily = familyClades.length == index + 1

				// branchInstructions.push(new Dot(member.name, cladeCardinalCoords, 4))
				// branchInstructions.push(new CanvasText(member.name, member.name, cladeCardinalCoords))
				if(!isLastOnFamily)
					branchInstructions.push(new Line(member.name, cladeCardinalCoords, cladeNextDivisionCoord))

				if(cladeChildren > 1){

					const nextMember = familyClades[index + 1]
					const nextMemberPolarCoords = nextMember.drawHelper!.coords
					const nextMemberDistance = nextMemberPolarCoords.distance / 100 * this.divisionStep
					const nextMemberAngle = nextMemberPolarCoords.angle
					const nextMemberArcOrientation = nextMember.drawHelper!.arcOrientation
					const startAngle = cladeAngle * ( Math.PI / 180 )
					const endAngle = nextMemberAngle * ( Math.PI / 180 )

					branchInstructions.push(new Arc(member.name, new Vector2 (0, 0), nextMemberDistance, startAngle, endAngle, nextMemberArcOrientation))
				} 
				else if(isLastOnFamily){
					branchInstructions.push(new Line(member.name, cladeCardinalCoords, branchTipCoords))

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

					var collisionLineLength = cladeTextDisplay.GetTextWidth(this.context)
					const branchEndCollisionLonePoint = getCardinalCoordsFromPolarDegrees(this.maxTreeRadius + collisionLineLength, cladeAngle , new Vector2(0,0))

					var textCollisionBoxColor = this.debugMode ? "#FFC0CB50" : "#FFC0CB00"
					if(this.debugMode){
						branchInstructions.push(
							new Line(member.name, branchTipCoords, branchEndCollisionLonePoint)
							.SetOptions(new DrawingOptions()
								.SetColor("red")
								.SetLineWidth(1)
								.SetLineCap('square')
							)
						)
					}

					branchInstructions.push(
							new Line(member.name, branchTipCoords, branchEndCollisionLonePoint)
							.SetOptions(new DrawingOptions()
								.SetColor(textCollisionBoxColor)
								.SetLineWidth(cladeTextDisplay.fontSize)
								.SetLineCap('square')
							)
							.ActivateCollition()
						)
					
					// this.branchesTips.push(
					// 	new BranchTip(member.name, branchTipCoords, getTrueCardinalPoint(branchTipCoords, this.center), cladeAngle, "", "white")
					// )
				}
			})
			this.branches.push(new Branch(clade.name, branchInstructions))
		});


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

    @HostListener('mousedown', ['$event'])
    onPointerDown(e: MouseEvent) {

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
           
            this.render()
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

		//Render all Branches
		this.branches.forEach(branch => {			
			branch.drawingInstructions.forEach(instruction => {
				instruction.resetAnimation()
				instruction.draw(this.context, this.center)
			});	

			if(branch.isActive){
				collitionedBranches.push(branch)
			}else{
				branch.resetAnimation();
				branch.drawingInstructions.forEach(instruction => {
					instruction.resetAnimation()
				});	
				branch.animationSteps = 1;
			}
		});

		collitionedBranches.forEach(branch => {
			branch.animateFrame(this.context, this.center, this.deltaTime)
			branch.animationSteps = branch.animationSteps + (1/this.animationSpeed)
		});
		
	}

	checkCollision(){
		var didCollitionOnce = false;
		this.branches.forEach((branch, index) => {
			branch.drawingInstructions.filter(i => i.hasCollition).forEach(instruction => {
				instruction.drawCollition(this.context, this.center)
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



