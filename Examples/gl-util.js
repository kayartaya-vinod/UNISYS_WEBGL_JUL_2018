function getShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log('There is a problem with shader: ', gl.SHADER_TYPE);
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function getProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // use gl.getProgramParameter with gl.LINK_STATUS to 
    // check if the program linking was successful.
    // to be done later

    return program;
}

function getShaderSource(id) {
    return document.getElementById(id).text;
}