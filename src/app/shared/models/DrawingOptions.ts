import { cp } from "fs"

export class DrawingOptions {
	color = "black"
	activeColor = "red"
	lineWidth = 3
	lineCap: CanvasLineCap = "round"
	dashedStyle = [0, 0]

	SetColor(color: string) : DrawingOptions{
		this.color = color
		return this
	}

	SetActiveColor(activeColor: string) : DrawingOptions{
		this.activeColor = activeColor
		return this
	}

	SetLineWidth(lineWidth : number ) : DrawingOptions{
		this.lineWidth = lineWidth
		return this
	}

	SetLineCap(lineCap : CanvasLineCap ) : DrawingOptions{
		this.lineCap = lineCap
		return this
	}

	SetDashedStyle(dashedStyle: number[]): DrawingOptions{
		this.dashedStyle = dashedStyle
		return this
	}
}
