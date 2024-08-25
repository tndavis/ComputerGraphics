// Computer Science
// CSCI 431 - Computer Graphics  
// Project 3
// Date: 2/9/2024
// Author: Taylor Davis


var gl;

var theta = 0.0;
var thetaLoc;

var speed = 100;
var direction = true;

var color = vec4(0.0, 1.0, 0.0, 1.0);
var colorLoc;

window.onload = function init()
{
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) alert("WebGL isn't available");

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram( program );

    var vertices = [
      vec2(0, 1/2),
      vec2(-1/2, -0.732/2), 
      vec2(1/2, -0.732/2)    
    ];


    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation(program, "theta");
    colorLoc = gl.getUniformLocation(program, "color");

    // Initialize event handlers

    document.getElementById("slider").onchange = function() {
        speed = 100 - event.srcElement.value;
    };
    document.getElementById("Direction").onclick = function () {
        direction = !direction;
    };

    document.getElementById("Controls").onclick = function( event) {
        switch(event.srcElement.index) {
          case 0:
            direction = !direction;
            break;

          case 1:
            speed /= 2.0;
            break;

          case 2:
            speed *= 2.0;
            break;
          
          case 3:
            color = vec4(1.0, 0.0, 0.0, 1.0);
            break;
          
          case 4:
            color = vec4(0.0, 1.0, 0.0, 1.0);
            break;
          
          case 5:
            color = vec4(0.0, 0.0, 1.0, 1.0);
            break;

          case 6:
            color = vec4(0.0, 0.0, 0.0, 1.0);
            break;
            
       }
    };

    window.onkeydown = function(event) {
        var key = String.fromCharCode(event.keyCode);
        switch( key ) {
          case '1':
            direction = !direction;
            break;

          case '2':
            speed /= 2.0;
            break;

          case '3':
            speed *= 2.0;
            break;

          case '4':
            color = vec4(1.0, 0.0, 0.0, 1.0);
            break;
          
          case '5':
            color = vec4(0.0, 1.0, 0.0, 1.0);
            break;
          
          case '6':
            color = vec4(0.0, 0.0, 1.0, 1.0);
            break;
          
          case '7':
            color = vec4(0.0, 0.0, 0.0, 1.0);
            break;
  
        }
    };


    render();
};

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );

    theta += (direction ? 0.1 : -0.1);
    gl.uniform1f(thetaLoc, theta);

    gl.uniform4fv(colorLoc, color);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    setTimeout(
        function () {requestAnimationFrame(render);},
        speed
    );
}
