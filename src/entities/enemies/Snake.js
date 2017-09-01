const SNAKE_SEGMENTS = 20;
const SNAKE_WIDTH = 30;
const SNAKE_HEIGHT = 10;
const SNAKE_SPEED = 0.02;

export default class Snake {
  constructor(gl, basicShader, x, y) {
    this.vertices = new Float32Array(SNAKE_SEGMENTS * basicShader.vertexSize);

    this.vertexBuffer = gl.createBuffer();

    this.shader = basicShader;

    this.x = x;
    this.y = y;

    this.angle = Math.random() * 2.0 * Math.PI;
    this.angleChange = -0.0005 + Math.random() * 0.001;

    this.model = new Float32Array([
      Math.cos(this.angle), Math.sin(this.angle), 0.0, 0.0,
      -Math.sin(this.angle), Math.cos(this.angle), 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      x, y, 0.0, 1.0
    ]);

    this.phase = 0;
  }

  update(deltaTime, game) {
    const gl = game.gl;

    this.phase += deltaTime * 0.01;

    if (this.phase > Math.PI * 2) {
      this.phase -= Math.PI * 2;
    }

    let vertexIndex = 0;

    for (let i = 0; i < SNAKE_SEGMENTS; i++) {
      const snakeX = (SNAKE_WIDTH / SNAKE_SEGMENTS) * i - SNAKE_WIDTH;
      this.vertices[vertexIndex++] = snakeX;
      this.vertices[vertexIndex++] = Math.sin(i + this.phase) * (SNAKE_HEIGHT / 2.0);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

    const newX = this.x + Math.cos(this.angle) * deltaTime * SNAKE_SPEED;
    const newY = this.y + Math.sin(this.angle) * deltaTime * SNAKE_SPEED;

    this.angle += deltaTime * 0.0001;

    if (game.map.tileAt(newX, newY) === 0xFF) {
      this.x = newX;
      this.y = newY;
    } else {
      this.angle = this.angle - Math.PI;
      this.angleChange = -0.0005 + Math.random() * 0.001;

      this.x += Math.cos(this.angle) * SNAKE_WIDTH;
      this.y += Math.sin(this.angle) * SNAKE_WIDTH;
    }

    this.model[0] = Math.cos(this.angle);
    this.model[1] = Math.sin(this.angle);
    this.model[4] = -Math.sin(this.angle);
    this.model[5] = Math.cos(this.angle);

    this.model[12] = this.x;
    this.model[13] = this.y;
  }

  draw(gl, projection, view) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

    this.shader.use(gl);

    gl.uniformMatrix4fv(this.shader.projection, false, projection);
    gl.uniformMatrix4fv(this.shader.view, false, view);
    gl.uniformMatrix4fv(this.shader.model, false, this.model);
    gl.uniform4f(this.shader.color, 0.0, 1.0, 0.0, 1.0);

    gl.drawArrays(gl.LINE_STRIP, 0, SNAKE_SEGMENTS);
  }
}