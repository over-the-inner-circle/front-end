interface Player {
  xPosition: number;
  yPosition: number;
  width: number;
  height: number;
  color: string;
}

interface Ball {
  xPosition: number;
  yPosition: number;
  radius: number;
  color: string;
}

interface Net {
  xPosition: number;
  yPosition: number;
  width: number;
  height: number;
  color: string;
}

export interface PongComponentsPositions {
  p1YPosition: number;
  p2YPosition: number;
  ballXPosition: number;
  ballYPosition: number;
}

export interface PongConfig {
  theme: {
    backgroundColor: string;
    playerColor: string;
    ballColor: string;
  }
  difficulty: string;
}

class Pong {

  protected canvasContext: CanvasRenderingContext2D;
  protected p1: Player;
  protected p2: Player;
  protected ball: Ball;
  protected net: Net;

  constructor(context: CanvasRenderingContext2D) {
    this.canvasContext = context;
    const canvasHeight = this.canvasContext.canvas.height;
    const canvasWidth = this.canvasContext.canvas.width;

    this.p1 = {
      xPosition: 0,
      yPosition: (canvasHeight - this.relativeYValue(100) ) / 2,
      width: this.relativeXValue(10),
      height: this.relativeYValue(100),
      color: 'white',
    }

    this.p2 = {
      xPosition: canvasWidth - this.relativeXValue(10),
      yPosition: (canvasHeight - this.relativeYValue(100)) / 2,
      width: this.relativeXValue(10),
      height: this.relativeYValue(100),
      color: 'white',
    }

    this.ball = {
      xPosition: canvasWidth / 2,
      yPosition: canvasHeight / 2,
      radius: this.relativeDiagonalValue(10),
      color: 'white'
    }

    this.net = {
      xPosition: (canvasWidth - 2) / 2,
      yPosition: 0,
      width: this.relativeXValue(4),
      height: this.relativeYValue(10),
      color: 'white'
    }

    this.render();
  }

  protected relativeXValue(value: number) {
    const originalCanvasWidth = 800;
    const currentCanvasWidth  = this.canvasContext.canvas.width;
    const ratio               = currentCanvasWidth / originalCanvasWidth;
    return value * ratio;
  }

  protected relativeYValue(value: number) {
    const originalCanvasHeight = 600;
    const currentCanvasHeight  = this.canvasContext.canvas.height;
    const ratio                = currentCanvasHeight / originalCanvasHeight;
    return value * ratio;
  }

  protected relativeDiagonalValue(value: number) {
    const originalDiagonal = Math.sqrt(800 * 800 + 600 * 600);
    const currentCanvasH = this.canvasContext.canvas.height;
    const currentCanvasW = this.canvasContext.canvas.width;
    const currentDiagonal = Math.sqrt(currentCanvasH * currentCanvasH + currentCanvasW * currentCanvasW);
    const ratio = currentDiagonal / originalDiagonal;
    return value * ratio;
  }

  protected drawRect(x: number,
           y: number,
           w: number,
           h: number,
           color: string) {
    this.canvasContext.fillStyle = color;
    this.canvasContext.fillRect(x, y, w, h);
  }

  //TODO: 위치 안맞으면 타원으로 변경 후  캔버스 너비와 높이 변화에 따라서 x,y값 변화하도록.
  protected drawCircle(x: number,
             y: number,
             r: number,
             color: string) {
    this.canvasContext.fillStyle = color;
    this.canvasContext.beginPath();
    this.canvasContext.arc(x, y, r, 0, Math.PI * 2, true);
    this.canvasContext.closePath();
    this.canvasContext.fill();
  }

  protected drawText(text: string,
           x: number,
           y: number,
           color: string) {
    this.canvasContext.fillStyle = color;
    this.canvasContext.font = '75px fantasy';
    this.canvasContext.fillText(text, x, y);
  }

  protected drawNet() {
    for (let i = 0; i <= this.canvasContext.canvas.height; i += this.relativeYValue(15)) {
      this.drawRect(this.net.xPosition, this.net.yPosition + i, this.net.width, this.net.height, this.net.color);
    }
  }

  public setContext(newContext: CanvasRenderingContext2D) {
    this.canvasContext = newContext;
  }

  public updateCurrentPositions(positions: PongComponentsPositions) {
    this.p1.yPosition = positions.p1YPosition;
    this.p2.yPosition = positions.p2YPosition;
    this.ball.xPosition = positions.ballXPosition;
    this.ball.yPosition = positions.ballYPosition;
  }

  public adjustAfterResize() {

    const canvasHeight = this.canvasContext.canvas.height;
    const canvasWidth = this.canvasContext.canvas.width;

    this.p1.width = this.relativeXValue(10);
    this.p1.height = this.relativeYValue(100);

    this.p2.width = this.relativeXValue(10);
    this.p2.height = this.relativeYValue(100);

    this.ball.radius = this.relativeDiagonalValue(10);

    this.net = {...this.net, 
      xPosition: (canvasWidth - 2) / 2,
      width: this.relativeXValue(4),
      height: this.relativeYValue(10),
    }
  }

  public render() {
    // clear the canvas
    this.drawRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height, 'black');

    // draw the net
    this.drawNet();

    // draw the players
    this.drawRect(
      this.p1.xPosition, 
      this.p1.yPosition, 
      this.p1.width, 
      this.p1.height, 
      this.p1.color
      );
    console.log(this.p1.width);
    console.log(this.p1.height);

    this.drawRect(
      this.p2.xPosition, 
      this.p2.yPosition, 
      this.p2.width, 
      this.p2.height, 
      this.p2.color
      );
    console.log(this.p1.width);
    console.log(this.p2.height);

    // draw the ball
    this.drawCircle(this.ball.xPosition, 
      this.ball.yPosition, 
      this.ball.radius, 
      this.ball.color
      );
  }
}

export default Pong;