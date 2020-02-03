/////////////////////////////////////////////////////////////////
//    S�nid�mi � T�lvugraf�k
//     S�nir notkun � "mousedown" og "mousemove" atbur�um
//
//    Hj�lmt�r Hafsteinsson, jan�ar 2020
/////////////////////////////////////////////////////////////////
var canvas;
var gl;
let vertices;

//  Skrefastærð kúlu og fugla
var skrefKula = 0.0071;
var skrefFugl = 0.071;

//  Global breytur fyrir hversu margir punktar eru
//  fyrir byssukúluna og fuglana
var punktarKula = 6;  // 6 f. hverja kúlu
var punktarFuglar = 0;  // 6 f. hvern fugl

//  Fjöldi byssukúla og fugla í loftinu
var fjFugla = 0;
var fjKula = 0;


window.onload = function init() {

    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);


    vertices = [
        // Byssan
        vec2(-0.05, -1),
        vec2(0, -0.7),
        vec2(0.05, -1),
        // Kúlan 1
        /*
        vec2(-0.01, -0.65), //A
        vec2(-0.01, -0.7), //B
        vec2(0.01, -0.65), //C
        vec2(-0.01, -0.7), //B
        vec2(0.01, -0.65), //C
        vec2(0.01, -0.7), //D
        */
       vec2(1.1, 1.1),
       vec2(1.1, 1.1),
       vec2(1.1, 1.1),
       vec2(1.1, 1.1),
       vec2(1.1, 1.1),
       vec2(1.1, 1.1),
        //  Pláss fyrir 5 kúlur
        vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1),
        vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1),
        vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1),
        vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1),
        vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1),
        vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1)


        // Fuglinn
    ];


    // Load the data into the GPU
    var bufferIdByssa = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdByssa);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW);


    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);


    // Event listeners fyrir að skjóta
    canvas.addEventListener("mousedown", function (e) {
        //  Ef færri en 5 kúlur í loftinu
        if (punktarKula < (5 * 6)) {
            for (let i = 3; i < 33; i++) {
                if (vertices[i][0] === 1.1) {
                    var xAs = 2*e.offsetX/canvas.width-1;
                    console.log(2*e.offsetX/canvas.width-1)
                    //debugger
                    vertices[i][0] = xAs - 0.01;
                    vertices[i++][1] = -0.65;
                    vertices[i][0] = xAs - 0.01;
                    vertices[i++][1] = -0.7;
                    vertices[i][0] = xAs + 0.01;
                    vertices[i++][1] = -0.65;
                    vertices[i][0] = xAs - 0.01;
                    vertices[i++][1] = -0.7;
                    vertices[i][0] = xAs + 0.01;
                    vertices[i++][1] = -0.65;
                    vertices[i][0] = xAs + 0.01;
                    vertices[i++][1] = -0.7;
                    punktarKula += 6;
                    break;
                }
            }

        }

    });



    /**********************************
     * ******* BYSSAN ****************
     * *******************************/
    canvas.addEventListener("mousemove", function (e) {
        vertices[1][0] = 2 * (e.offsetX) / canvas.width - 1;
        vertices[0][0] = vertices[1][0] - 0.05;
        vertices[2][0] = vertices[1][0] + 0.05;
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));

    });

    render();
}


function byssukula(xPos) {
    console.log(xPos)
}

function faerakulu() {
    for (let i = 3; i < 3 + punktarKula; i++) {
        vertices[i][1] += skrefKula;
        if (vertices[i][1] > 1.05) {
            punktarKula--;
            console.log(punktarKula)
            vertices[i][0] = 1.1;
            vertices[i][1] = 1.1;
        }
    }
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));

}

function render() {
    setTimeout(function () {
        faerakulu();


        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 33);
        //gl.drawArrays(gl.TRIANGLES, byrjar í minni, hversu margir punktar);

        window.requestAnimFrame(render);
    }, 20);
}


/***************************
 * Global breyta sem segir hversu margir punktar eru fyrir kúlur
 * Global breyta sem segir hversu margir punktar eru fyrir fugla
 * Notað þessar breytur í drawArrays
 */