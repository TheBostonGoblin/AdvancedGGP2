const svgContainer = document.querySelector("#container");
let svgCopy;
let seconds = 0;
const d = new Date();
d.getSeconds

const simplexLib = await import("https://unpkg.com/simplex-noise@4.0.1/dist/esm/simplex-noise.js?module");
const noise2D = simplexLib.createNoise2D();
// const svgImage1 = await fetch("./svgs/circleTileColor1.svg");
// const svgText = await svgImage1.text();
// let svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
// svg.innerHTML = svgText;
// svg.setAttribute("transform", `translate(${(1 * 64) },${(1 * 64 )  }) rotate(${0})`);
// svgContainer.appendChild(svg);

async function loadArt() {
    const simplexLib = await import("https://unpkg.com/simplex-noise@4.0.1/dist/esm/simplex-noise.js?module");
    const noise2D = simplexLib.createNoise2D();
    // const svgImage1 = await fetch("./svgs/circleTileColor1.svg");
    // const svgText = await svgImage1.text();
    // let svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    // svg.innerHTML = svgText;
    // svg.setAttribute("transform", `translate(${(0 * 64) },${(0 * 64 )  }) rotate(${0})`);
    // svgContainer.appendChild(svg);

    for (let x = 0; x < 5; x += 1) {
        for (let y = 1; y < 5; y += 1) {
            let loadedImage;

            let random = Math.floor(Math.random() * 10);
            let random2 = Math.floor(Math.random() * 10);
            seconds += d.getMinutes();

            const svgImage1 = await fetch("./svgs/circleTile1_2.svg");
            const svgImage2 = await fetch("./svgs/circleTile2_2.svg");
            const svgImage3 = await fetch("./svgs/circleTile3-2.svg");
            const svgImage4 = await fetch("./svgs/circleTile4-2.svg");
            const svgImage5 = await fetch("./svgs/circleTile5.svg");

            let noise = Math.abs(noise2D(x * .1 * seconds * random, y * .1 * seconds * random));
            if (noise <= 0.25) {
                loadedImage = svgImage1;
            }
            else if (noise <= 0.5 && noise > 0.25) {
                loadedImage = svgImage2;
            }
            else if (noise <= 0.75 && noise > 0.5) {
                loadedImage = svgImage3;
            }
            else {
                loadedImage = svgImage4;
            }

            const svgText = await loadedImage.text();
            let svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
            svg.innerHTML = svgText;

            const tileWidth = 64;
            const tileHeight = 64;
            let noise2 = Math.abs(noise2D(x * .1 * random2, y * .1 * random2));

            let rotation = 0;
            let rotationAdjustmentX = 0;
            let rotationAdjustmentY = 0;
            //if 90 y is -64
            //if 180 x is + 64
            //if 270 x is + 64 y is +64

            if (noise2 <= 0.25) {
                rotation = 0;
            }
            else if (noise2 <= 0.5 && noise2 > 0.25) {
                rotation = 90;
                rotationAdjustmentX = 0;
                rotationAdjustmentY = -64;
            }
            else if (noise2 <= 0.75 && noise2 > 0.5) {
                rotation = 180;
                rotationAdjustmentX = 64;
                rotationAdjustmentY = -64;
            }
            else if (noise2 > 0.75) {
                rotation = 270;
                rotationAdjustmentX = 64;
                rotationAdjustmentY = 0;
            }

            console.log(noise2);
            //translate(0.000000,64.000000) scale(0.100000,-0.100000)
            svg.setAttribute("transform", `translate(${(x * tileWidth) +rotationAdjustmentX},${(y * tileWidth) + rotationAdjustmentY}) rotate(${rotation}) scale(0.100000,-0.100000)`);
            svgContainer.appendChild(svg);

        }
    }
    //console.log(svgContainer.innerHTML);
}

//loadArt();

async function loadArtColor() {
    const simplexLib = await import("https://unpkg.com/simplex-noise@4.0.1/dist/esm/simplex-noise.js?module");
    const noise2D = simplexLib.createNoise2D();
    // const svgImage1 = await fetch("./svgs/circleTile1_2.svg");
    // const svgText = await svgImage1.text();
    // let svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    // svg.innerHTML = svgText;
    // svg.setAttribute("transform", `translate(${(1 * 64) + 64 },${(1 * 64 )  }) rotate(${270}) scale(0.100000,-0.100000)`);
    // svgContainer.appendChild(svg);

    for (let x = 0; x < 10; x += 1) {
        for (let y = 0; y < 10; y += 1) {
            let loadedImage;

            let random = Math.floor(Math.random() * 10);
            let random2 = Math.floor(Math.random() * 10);
            seconds += d.getMinutes();

            const svgImage1 = await fetch("./svgs/circleTileColor1.svg");
            const svgImage2 = await fetch("./svgs/circleTileColor2.svg");
            const svgImage3 = await fetch("./svgs/circleTileColor3.svg");
            const svgImage4 = await fetch("./svgs/circleTileColor4.svg");

            let noise = Math.abs(noise2D(x * .1 * seconds , y * .1 * seconds ));
            if (noise <= 0.25) {
                loadedImage = svgImage1;
            }
            else if (noise <= 0.5 && noise > 0.25) {
                loadedImage = svgImage2;
            }
            else if (noise <= 0.75 && noise > 0.5) {
                loadedImage = svgImage3;
            }
            else {
                loadedImage = svgImage4;
            }

            const svgText = await loadedImage.text();
            let svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
            svg.innerHTML = svgText;

            const tileWidth = 64;
            const tileHeight = 64;
            let noise2 = Math.abs(noise2D(x * .1 * random2, y * .1 * random2));

            let rotation = 0;
            let rotationAdjustmentX = 0;
            let rotationAdjustmentY = 0;
            //if 90 y is +64
            //if 180 x is - 64 y is -64
            //if 270 y is +64

            if (noise2 <= 0.25) {
                rotation = 0;
            }
            else if (noise2 <= 0.5 && noise2 > 0.25) {
                rotation = 90;
                rotationAdjustmentX = 64;
                rotationAdjustmentY = 0;
            }
            else if (noise2 <= 0.75 && noise2 > 0.5) {
                rotation = 180;
                rotationAdjustmentX = 64;
                rotationAdjustmentY = 64;
            }
            else if (noise2 > 0.75) {
                rotation = 270;
                rotationAdjustmentX = 0;
                rotationAdjustmentY = 64;
            }

            console.log(noise2);
            //translate(0.000000,64.000000) scale(0.100000,-0.100000)
            svg.setAttribute("transform", `translate(${(x * tileWidth) + rotationAdjustmentX},${(y * tileWidth) +rotationAdjustmentY}) rotate(${rotation})`);
            svgContainer.appendChild(svg);

        }
    }
    //console.log(svgContainer.innerHTML);
}
loadArtColor();

