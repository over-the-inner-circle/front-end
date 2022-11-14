interface Player {
  xPosition: number;
  yPosition: number;
  width: number;
  height: number;
  color: string;
  score: number;
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

export interface PongCongif {
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
      yPosition: (canvasHeight - 100) / 2,
      width: 10,
      height: 100,
      color: 'white',
      score: 0
    }

    this.p2 = {
      xPosition: canvasWidth - 10,
      yPosition: (canvasHeight - 100) / 2,
      width: 10,
      height: 100,
      color: 'white',
      score: 0
    }

    this.ball = {
      xPosition: canvasWidth / 2,
      yPosition: canvasHeight / 2,
      radius: 10,
      color: 'white'
    }

    this.net = {
      xPosition: (canvasWidth - 2) / 2,
      yPosition: 0,
      width: 2,
      height: 10,
      color: 'white'
    }

    this.render();
  }

  protected drawRect(x: number,
           y: number,
           w: number,
           h: number,
           color: string) {
    this.canvasContext.fillStyle = color;
    this.canvasContext.fillRect(x, y, w, h);
  }

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
    for (let i = 0; i <= this.canvasContext.canvas.height; i += 15) {
      this.drawRect(this.net.xPosition, this.net.yPosition + i, this.net.width, this.net.height, this.net.color);
    }
  }

  public updateCurrentPositions(positions: PongComponentsPositions) {
    this.p1.yPosition = positions.p1YPosition;
    this.p2.yPosition = positions.p2YPosition;
    this.ball.xPosition = positions.ballXPosition;
    this.ball.yPosition = positions.ballYPosition;
  }

  public render() {
    // clear the canvas
    this.drawRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height, 'black');

    // draw the net
    this.drawNet();

    // draw the players
    this.drawRect(this.p1.xPosition, this.p1.yPosition, this.p1.width, this.p1.height, this.p1.color);
    this.drawRect(this.p2.xPosition, this.p2.yPosition, this.p2.width, this.p2.height, this.p2.color);

    // draw the ball
    this.drawCircle(this.ball.xPosition, this.ball.yPosition, this.ball.radius, this.ball.color);
  }
}

export default Pong;