import vertexShaderSource from '../../shaders/texture.vert';
import fragmentShaderSource from '../../shaders/texture.frag';
import Shader from './Shader';

export default class TextureShader extends Shader {
  constructor(gl) {
    const uniforms = ['projection', 'view', 'sampler'];
    const attributes = ['vertexPosition', 'vertexTexCoord'];

    super(gl, vertexShaderSource, fragmentShaderSource, uniforms, attributes,
      4);
  }

  use(gl) {
    super.use(gl);

    gl.vertexAttribPointer(this.vertexPosition, 2, gl.FLOAT, false, 16, 0);
    gl.vertexAttribPointer(this.vertexTexCoord, 2, gl.FLOAT, false, 16, 8);
  }
}
