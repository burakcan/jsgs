import Screen from './';
import crtlines from './crtlines.png';

export default class CRTScreen extends Screen {
  createCanvas(options) {
    const canvas = super.createCanvas(options);
    const glCanvas = this.glCanvas = fx.canvas();

    this.lines = new Image();
    this.lines.src = crtlines;
    this.srcctx = canvas.getContext('2d');

    glCanvas.width = glCanvas.height = 512;
    glCanvas.style.dispay = 'block';
    glCanvas.style.imageRendering = 'pixelated';

    return canvas;
  }

  mountCanvas(element) {
    element.appendChild(this.glCanvas);
  }

  update(ram) {
    super.update(ram);

    const halfSize = this.size / 2;

    this.srcctx.drawImage(this.lines, 0, 0, this.size, this.size);

    this.glCanvas
    .draw(this.glCanvas.texture(this.canvas))
    .bulgePinch(halfSize, halfSize, this.size * 0.75, 0.12)
    .vignette(0.15, 0.5)
    .update();
  }
}
