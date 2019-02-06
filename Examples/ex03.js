const canvas = document.createElement('canvas');
document.getElementById('d1').appendChild(canvas);

const image = new Image();
image.onload = main;
image.src = './tiger.jpg';


function main() {

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const gl = canvas.getContext('webgl');

    gl.clearColor(0.5, 0.5, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    const vsSource = `
    attribute vec2 position;
    attribute vec2 texPosition;
    varying vec2 texCoords;

    void main() {
        texCoords = (texPosition + 1.0) / 2.0;
        texCoords.x = 1.0 - texCoords.x; // flip horizontally
        gl_Position = vec4(position, 0.0, 1.0);
    }
    `;

    const fsSource = `
    precision highp float;
    varying vec2 texCoords;
    uniform sampler2D image; // by default looks in the buffer TEXTURE0
    void main() {
        vec4 color = texture2D(image, texCoords).rgba;
        // color.r = color.b = 0.0;
        gl_FragColor = color;
    }
    `;

    const vertexShader = getShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = getShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const program = getProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    // verticies for a rectangle covering the complete canvas
    const vertices = new Float32Array([
        -.5, -.5,
        -.5, .5,
        1, 1,
        -.5, -.5,
        1, 1,
        1, -1
    ]);
    const verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

    const texVertices = new Float32Array([
        -1, -1, 
        -1, 1,
        1, 1,
        -1, -1,
        1, 1,
        1, -1
    ]);
    const texVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texVerticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texVertices, gl.STATIC_DRAW);
    const texPositionLocation = gl.getAttribLocation(program, 'texPosition');
    gl.vertexAttribPointer(texPositionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texPositionLocation);

    // bind the 'image' to the TEXTURE0 and set some important properties
    const texture = gl.createTexture();
    
    // by default the texture is associated with TEXTURE0 buffer
    gl.activeTexture(gl.TEXTURE0); // this is by default
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // bind the 'texture' object with the buffer
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // push the image to the buffer (sampler2D)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // set the image parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, vertices.length/2);
}
