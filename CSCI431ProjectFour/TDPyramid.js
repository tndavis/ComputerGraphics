// Computer Science
// CSCI 431 - Computer Graphics  
// Project 4
// Date: 2/25/2024
// Author: Taylor Davis

var canvas;
var gl;

var NumVertices  = 12; // six faces, sixe squares, total 12 triangles to draw, so 36 vertices
// for project four, you only have four faces, four triangles to draw so 12 vertices

var points = [];  // hold all vertices of 12 triangles
var colors = [];  // hold the color for all vertices

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;     // default rotate with respect to x-axis
var theta = [ 0, 0, 0 ];  // three angles of roation w.r.t x, y ,z axies respectively

var thetaLoc;     // where in the GPU memory that uniform variable theta is located

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorPyramid();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );


    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta");

    //event listeners for buttons

    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };

    render();
}

function colorPyramid()
{
    triple( 1, 0, 3);  // vertex 1, 0, 3, 2 form one face, triple draw this face
    triple( 3, 2, 1);
    triple( 2, 0, 1);
    triple( 0, 3, 2);
    // project four - only need to call triple function four times
    // and triple function shall only have 3 parameters, since each face is 3 vertices
}

function triple(a, b, c)  // only 3 parameters and four vertices
{
    var vertices = [
        vec4( 0.5, -0.2722,  0.2886),
        vec4( 0.0, -0.2722, -0.5773 ),
        vec4( -0.5, -0.2722,  0.2886 ),
        vec4(  0.0, 0.5443,  0.0 ),
    ];

    var vertexColors = [  // for project four, only need 4 colors
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
    ];

    // We need to parition the triple into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the triple indices

    //vertex color assigned by the index of the vertex

    var indices = [ a, b, c];
    // vertices a, b, c, d form a face a, b, c is one triangle, a, c, d is second triangle
    // for project four, only 3 indices

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        //colors.push( vertexColors[indices[i]] );

        // for solid colored faces use
        colors.push(vertexColors[a]);  // only one vertex color is used

    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);  // update theta

    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    requestAnimFrame( render );
}
