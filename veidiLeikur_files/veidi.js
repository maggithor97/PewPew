/////////////////////////////////////////////////////////////////
//    Skotleikur
//    Ef þú nærð að skjóta 5 fugla þá vinnuru.
//    Magnús Þór Valdimarsson febrúar 2020
/////////////////////////////////////////////////////////////////
var canvas;
var gl;
let vertices;   // Fylkið sem geymir alla punktana

//  Skrefastærð kúlu og fugla
var skrefKula = 0.03;
var skrefFugl = 0.0071;

/*** **********************************************
* Global breytur fyrir hversu margir punktar eru  
* fyrir byssukúluna, fuglana og stigaskorið.
* Nota þetta líka til að vita hversu margir/ar
* fuglar, kúlur eða skor eru í gangi í leiknum    
***************************************************/
var punktarKula = 0;  // 6 f. hverja kúlu
var punktarFuglar = 0;  // 6 f. hvern fugl
var punktarStigaskor = 0;


window.onload = function init() {

    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0.8, 1, 1.0);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Fylkið sem geymir alla punktana
    vertices = [
        // Byssan
        vec2(-0.05, -1),
        vec2(0, -0.7),
        vec2(0.05, -1),
        //  Pláss fyrir 5 kúlur
        vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1),
        vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1),
        vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1),
        vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1),
        vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1),
        // Fuglinn
        vec2(1.1, 0.8), vec2(1.1, 0.7), vec2(1.2, 0.8), vec2(1.1, 0.7), vec2(1.2, 0.8), vec2(1.2, 0.7),
        //  Pláss fyrir 5 stigaskor
        vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1),
        vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1),
        vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1),
        vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1),
        vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1), vec2(1.1, 1.1)
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
                //  Ef x=1.1 í kúlu þá er ekki verið að nota það pláss í vertices[]
                if (vertices[i][0] === 1.1) {
                    var xAs = 2 * e.offsetX / canvas.width - 1;
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

    //  Byssan
    canvas.addEventListener("mousemove", function (e) {
        vertices[1][0] = 2 * (e.offsetX) / canvas.width - 1;
        vertices[0][0] = vertices[1][0] - 0.05;
        vertices[2][0] = vertices[1][0] + 0.05;
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
    });
    render();
}

//  Færir hvern punkt í kúlunum um 'skrefKula'
function faerakulu() {
    for (let i = 3; i < 33; i++) {
        vertices[i][1] += skrefKula;
        if (vertices[i][1] > 1.05) {
            punktarKula--;
            // Ef x eða y == 1.1, þá er ekki verið að nota það pláss í vertices[]
            vertices[i][0] = 1.1;
            vertices[i][1] = 1.1;
        }
    }
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
}

//  Færir fuglinn um 'skrefFugl'
function fuglinnFlygur() {
    for (let i = 33; i < 39; i++) {
        vertices[i][0] -= skrefFugl; // Færir fuglinn á x-ás
        if (vertices[i][0] > 0) {
            vertices[i][1] -= skrefFugl / 4;  // Færir fuglinn á y-ás
        } else {
            vertices[i][1] += skrefFugl / 4  // Færir fuglinn á y-ás
        }
        if (vertices[i][0] < -1.2) {
            geraNyjanFugl();
            break;
        }
    }
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
}

//  Býr til nýjan fugl
function geraNyjanFugl() {
    let j = 33;
    vertices[j][0] = 1.1;
    vertices[j++][1] = 0.8;
    vertices[j][0] = 1.1;
    vertices[j++][1] = 0.7;
    vertices[j][0] = 1.2;
    vertices[j++][1] = 0.8;
    vertices[j][0] = 1.1;
    vertices[j++][1] = 0.7;
    vertices[j][0] = 1.2;
    vertices[j++][1] = 0.8;
    vertices[j][0] = 1.2;
    vertices[j++][1] = 0.7;
    skrefFugl = 0.0071 * (Math.random() * 2.5 + 1);
}

//  Fall sem býr til stigin uppi í vinstra horni
function baetaVidStigi() {
    if (punktarStigaskor === 0) {
        var i = 39;
        vertices[i][0] = -0.95;     //A
        vertices[i++][1] = 0.98;    //A
        vertices[i][0] = -0.95;     //B
        vertices[i++][1] = 0.85;    //B
        vertices[i][0] = -0.91;     //C
        vertices[i++][1] = 0.98;    //C
        vertices[i][0] = -0.95;     //B
        vertices[i++][1] = 0.85;    //B
        vertices[i][0] = -0.91;     //C
        vertices[i++][1] = 0.98;    //C
        vertices[i][0] = -0.91;     //D
        vertices[i][1] = 0.85;      //D
        punktarStigaskor += 6;
    } else if (punktarStigaskor < (5 * 6)) {
        var i = 39 + punktarStigaskor;
        vertices[i][0] = vertices[i - 6][0] + 0.06;   //A
        vertices[i][1] = vertices[i - 6][1];          //A
        i++;
        vertices[i][0] = vertices[i - 6][0] + 0.06;   //B
        vertices[i][1] = vertices[i - 6][1];          //B
        i++;
        vertices[i][0] = vertices[i - 6][0] + 0.06;   //C
        vertices[i][1] = vertices[i - 6][1];          //C
        i++;
        vertices[i][0] = vertices[i - 6][0] + 0.06;   //B
        vertices[i][1] = vertices[i - 6][1];          //B
        i++;
        vertices[i][0] = vertices[i - 6][0] + 0.06;   //C
        vertices[i][1] = vertices[i - 6][1];          //C
        i++;
        vertices[i][0] = vertices[i - 6][0] + 0.06;   //D
        vertices[i][1] = vertices[i - 6][1];          //D
        i++;
        punktarStigaskor += 6;
        //  Textinn og gif'ið sem kemur þegar maður vinnur
        if (punktarStigaskor >= (5 * 6)) {
            var node2 = document.getElementsByTagName('canvas')[0];
            node2.setAttribute("width", "0");
            node2.setAttribute("height", "0");
            var node = document.createElement("h1");
            node.setAttribute("onclick", "location.reload()")
            node.innerHTML = 'Til hamingju þú vannst!!! (Ýttu á mig til að spila aftur.)';
            document.getElementById('body').appendChild(node);
            var mynd = document.createElement("img");
            mynd.setAttribute("src", "https://media.giphy.com/media/idFxmiV2dayJEqzXaW/giphy.gif")
            mynd.setAttribute("width", "1000");
            mynd.setAttribute("height", "600");
            document.getElementById('body').appendChild(mynd);


        }
    }
}

//  Tékkar hvort kúlan hittir fuglinn
function erArektur() {
    for (let i = 3; i < 33; i++) {
        if (vertices[i][0] > vertices[33][0] &&
            vertices[i][0] < vertices[35][0] &&
            vertices[i][1] < vertices[33][1] &&
            vertices[i][1] > vertices[34][1]) {

            baetaVidStigi();
            geraNyjanFugl();
        }
    }
}


function render() {
    setTimeout(function () {
        faerakulu();
        fuglinnFlygur();
        erArektur();

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 69);

        window.requestAnimFrame(render);
    }, 20);
}