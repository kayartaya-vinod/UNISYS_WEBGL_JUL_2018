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

const vSource = getShaderSource('vertexSource');
const fSource = getShaderSource('fragmentSource');

const vShader = getShader(gl, gl.VERTEX_SHADER, vSource);
const fShader = getShader(gl, gl.FRAGMENT_SHADER, fSource);
const program = getProgram(gl, vShader, fShader);

gl.useProgram(program);

const colorLocation = gl.getUniformLocation(program, 'uColor');
// gl.uniform3f(colorLocation, 1.0, 1.0, 0.0);
gl.uniform3fv(colorLocation, new Float32Array([1.0, 1.0, 0.0]));

// values for point locations (vertices)
const vertices = [
];

// create a buffer that will be read by the attribute in the 
// vertex-shader called 'position'
const verticesBuffer = gl.createBuffer();

// bind the javascript variable to the named buffer in the GPU
gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);

function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // supply the data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // get the attribute position (reference) from the vertex shader
    const positionLocation = gl.getAttribLocation(program, 'position');

    // tell the GLSL to pull a pair of values from the buffer (which
    // contains 8 float numbers at this time) into the 'position'
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // enable reading of vertex data from an array
    gl.enableVertexAttribArray(positionLocation);

    gl.drawArrays(gl.POINTS, 0, vertices.length / 2);
    // gl.drawArrays(gl.LINES, 0, vertices.length / 2);
    // gl.drawArrays(gl.LINE_STRIP, 0, vertices.length / 2);
    // gl.drawArrays(gl.LINE_LOOP, 0, vertices.length / 2);
    // gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
}

canvas.onmousedown = function (evt) {
    var x = evt.clientX,
        y = evt.clientY,
        midX = canvas.width / 2,
        midY = canvas.height / 2,
        rect = evt.target.getBoundingClientRect();

    x = ((x - rect.left) - midX) / midX;
    y = (midY - (y - rect.top)) / midY;

    vertices.push(x, y);
    draw();
};