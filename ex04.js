const canvas = document.createElement('canvas');
document.getElementById('d1').appendChild(canvas);

const image = new Image();
image.onload = main;
image.src = './tiger.jpg';


function main() {

    document.getElementById("slider1").oninput = function(evt) {
        const brightness = evt.target.value / 100;
        drawWithBrigtness(brightness);
    };

    document.getElementById("slider2").oninput = function(evt) {
        const contrast = evt.target.value / 100;
        drawWithContrast(contrast);
    };

    document.getElementById("slider3").oninput = function(evt) {
        const scale = evt.target.value / 100;
        drawWithScale(scale);
    };
    canvas.width = 400;
    canvas.height = 300;
    const gl = canvas.getContext('webgl');

    gl.clearColor(0.5, 0.5, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    const vsSource = `
    attribute vec2 position;
    attribute vec2 texPosition;
    varying vec2 texCoords;
    uniform float scale;

    void main() {
        texCoords = (texPosition + 1.0) / 2.0;
        texCoords.x = 1.0 - texCoords.x; // flip horizontally
        gl_Position = vec4(position * (scale>0.0?scale:1.0), 0.0, 1.0);
    }
    `;

    const fsSource = `
    precision highp float;
    varying vec2 texCoords;
    uniform sampler2D image; // by default looks in the buffer TEXTURE0
    uniform float brightness;
    uniform float contrast;

    void main() {
        vec4 color = texture2D(image, texCoords).rgba;
        // color.r = color.b = 0.0; // remove red,blue components from the color
        
        // float brightness = -0.2;
        color.rgb += brightness;
        
        // float contrast = 0.2;
        if(contrast > 0.0) {
            color.rgb = ((color.rgb - 0.5) / (1.0-contrast)) + 0.5;
        }
        else {
            color.rgb = ((color.rgb - 0.5) * (1.0-contrast)) + 0.5;
        }

        // color.rgb = 1.0 - color.rgb;

        gl_FragColor = color;
    }
    `;

    const vertexShader = getShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = getShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const program = getProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    // verticies for a rectangle covering the complete canvas
    const vertices = new Float32Array([
        -1, -1, 
        -1, 1,
        1, 1,
        -1, -1,
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

    drawWithBrigtness(0.0);
    
    function drawWithBrigtness(brightness) {
        const brightnessLocation = gl.getUniformLocation(program, 'brightness');
        gl.uniform1f(brightnessLocation, brightness);
        gl.drawArrays(gl.TRIANGLES, 0, vertices.length/2);
    }

    function drawWithContrast(contrast) {
        const contrastLocation = gl.getUniformLocation(program, 'contrast');
        gl.uniform1f(contrastLocation, contrast);
        gl.drawArrays(gl.TRIANGLES, 0, vertices.length/2);
    }
    function drawWithScale(scale) {
        const scaleLocation = gl.getUniformLocation(program, 'scale');
        gl.uniform1f(scaleLocation, scale);
        gl.drawArrays(gl.TRIANGLES, 0, vertices.length/2);
    }
}
