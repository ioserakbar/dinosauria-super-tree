import { CLIENT_RENEG_LIMIT } from 'node:tls';
import { DrawingOptions } from '../models/DrawingOptions';
import { Vector2 } from '../models/Vector2';


export function drawArc(
	ctx: CanvasRenderingContext2D,
	center: Vector2,
	initialCoords: Vector2,
	radius: number,
	startAngle: number,
	endAngle: number,
	counterclockwise = false,
	options: DrawingOptions,
	isColliding  = false
) {
	var centerPoint = getTrueCardinalPoint(initialCoords, center);
	var startingPoint = getCardinalCoordsFromPolar(radius, startAngle, initialCoords)
	startingPoint = getTrueCardinalPoint(startingPoint, center)

	startAngle = -startAngle
	endAngle = -endAngle

	ctx = setContextSettings(ctx, options, isColliding)
	ctx.beginPath()
	ctx.moveTo(startingPoint.x, startingPoint.y )
	ctx.arc(centerPoint.x, centerPoint.y, radius, startAngle, endAngle, counterclockwise)
	ctx.stroke()
	ctx.moveTo(center.x, center.y)

}

export function drawDot(
	ctx: CanvasRenderingContext2D,
	center: Vector2,
	initialCoords: Vector2,
	size: number,
	options: DrawingOptions,
	isColliding  = false
) {
	var point = getTrueCardinalPoint(initialCoords, center)

	ctx = setContextSettings(ctx, options, isColliding)
	
	ctx.beginPath()
	ctx.moveTo(point.x + size, point.y)
	ctx.arc(point.x, point.y, size, 0, 2 * Math.PI)
	ctx.fill()
	ctx.moveTo(center.x, center.y)
}

export function drawLine(
	ctx: CanvasRenderingContext2D,
	center: Vector2,
	initialCoords1: Vector2,
	initialCoords2: Vector2,
	options: DrawingOptions,
	isColliding = false
) {
	var point1 = getTrueCardinalPoint(initialCoords1, center);
	var point2 = getTrueCardinalPoint(initialCoords2, center);

	ctx = setContextSettings(ctx, options, isColliding)
	ctx.beginPath();
	ctx.moveTo(point1.x, point1.y)
	ctx.lineTo(point2.x, point2.y)
	ctx.stroke()
	ctx.moveTo(center.x, center.y)
}

export function drawAnimatedDotFrame(
	ctx: CanvasRenderingContext2D,
	center: Vector2,
	step:number, 
	initialCoords: Vector2,
	size: number,
	options: DrawingOptions
){

	var actualSize = size * step

	if(step >=1 ){
		drawDot(ctx, center, initialCoords, size, options, true)
		return true
	}else{
		drawDot(ctx, center, initialCoords, actualSize, options, true)
		return false
	}
}

export function drawAnimatedArcFrame(
	ctx: CanvasRenderingContext2D,
	center: Vector2,
	step: number, 
	initialCoords: Vector2,
	radius: number,
	startAngle: number,
	endAngle: number,
	counterclockwise = false,
	options: DrawingOptions
){

	var distance = endAngle - startAngle

	if(distance < 0 ){
		distance = (2 * Math.PI) + distance 
	}
	var actualStep = step
	if(!counterclockwise){
		actualStep = step * -1
		distance = (2 * Math.PI) - distance 
	}
	
	var angleStep = distance * actualStep
	var currentAngle = startAngle + angleStep
	
	if(step >= 1){
		drawArc(ctx, center, initialCoords, radius, startAngle, endAngle, counterclockwise, options, true)
		return true
	}else{
		drawArc(ctx, center, initialCoords, radius, startAngle, currentAngle, counterclockwise, options, true)
		return false
	}
}

export function drawAnimatedLineFrame(
	ctx: CanvasRenderingContext2D,
	center: Vector2,
	step:number,
	p1: Vector2,
	p2: Vector2,
	options: DrawingOptions
) {
	if(step >= 1){

		drawLine(ctx, center, p1, p2, options, true)
		return true

	}else{
		var vector = getVectorFromTwoPoints(p1, p2)
		vector = getVectorPosition(p1, vector, step)
		drawLine(ctx, center, p1, vector, options, true)
		return false
	}
}

export function drawText(
	ctx: CanvasRenderingContext2D,
	center: Vector2,
	position: Vector2,
	text: string,
	rotation: number, 
	fontSize: number, 
	textAlign: CanvasTextAlign,
	padding: number,
	baseline: CanvasTextBaseline,
	fontFamily: string, 
	options: DrawingOptions
){
	position = getTrueCardinalPoint(position, center)

	ctx = setContextSettings(ctx, options)

	var angleDirectionVector = getVectorFromTwoPoints(center, position)
	var topVector = new Vector2(-angleDirectionVector.y, angleDirectionVector.x)

	var size = textAlign == 'right' ? 1 : -1;
	//We add 8 to fontsize bc it seems it has a padding of 4 px (if that makes sense)
	size = ((fontSize + 8) / GetDistanceBetween2Points (center, position))/2  * size
	var nowOrigin = getVectorPosition(position, topVector, size) 

	ctx.save()
	ctx.textAlign = textAlign
	ctx.textBaseline = baseline
	ctx.translate(nowOrigin.x, nowOrigin.y);
	ctx.rotate( rotation * (Math.PI / 180));
	ctx.font = fontSize + "px " + fontFamily;
	ctx.fillText(text, padding, 5);
	ctx.restore();


}

function setContextSettings(ctx: CanvasRenderingContext2D, options: DrawingOptions, isColliding = false): CanvasRenderingContext2D{

	ctx.fillStyle = isColliding ? options.activeColor: options.color
	ctx.strokeStyle = isColliding ? options.activeColor: options.color
	ctx.lineCap = options.lineCap 
	ctx.lineWidth = options.lineWidth 
	ctx.setLineDash(options.dashedStyle)

	return ctx
}

function getVectorFromTwoPoints(point1: Vector2, point2: Vector2) {
	return {
		x: point2.x - point1.x,
		y: point2.y - point1.y,
	};
}

export function getTrueCardinalPoint(point: Vector2, center: Vector2): Vector2 {
	return new Vector2(point.x + center.x, point.y * -1 + center.y);
}

function getVectorPosition(firstPoint: Vector2, vector: Vector2, speed: number){
	return new Vector2(
		vector.x * speed + firstPoint.x, 
		vector.y * speed + firstPoint.y
	)
}

function getCardinalCoordsFromPolar(distance: number, angle: number, center: Vector2) {

	var x = distance * Math.cos(angle) + center.x 
    var y = distance * Math.sin(angle) + center.y

	return new Vector2(x, y)
}

function GetDistanceBetween2Points(p1: Vector2, p2: Vector2){
	return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

export function getCardinalCoordsFromPolarDegrees(distance: number, angle: number, center: Vector2) {

	angle = angle * (Math.PI / 180)

	var x = distance * Math.cos(angle) + center.x 
    var y = distance * Math.sin(angle) + center.y

	return new Vector2(x, y)
}
