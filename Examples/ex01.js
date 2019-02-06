const canvas = document.createElement('canvas');
document.getElementById('d1').appendChild(canvas);

canvas.width = 400;
canvas.height = 300;

const gl = canvas.getContext('webgl');

// what color to apply when the color is cleared
gl.clearColor(0.5, 0.7, 0.5, 1.0);

// remove the color bit from the composition
gl.colorMask(true, true, true, true);

// clear the canvas
gl.clear(gl.COLOR_BUFFER_BIT);

// shaders
const vsSource = `
void main() {
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
    gl_PointSize = 10.0;
}
`;
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vsSource);
gl.compileShader(vertexShader);

if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.log('There is a problem with vertexShader');
    console.log(gl.getShaderInfoLog(vertexShader));
    gl.deleteShader(vertexShader);
}

const fsSource = `
void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fsSource);
gl.compileShader(fragmentShader);

// program
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);


gl.useProgram(program);

gl.drawArrays(gl.POINTS, 0, 1);