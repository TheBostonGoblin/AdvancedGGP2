const svgContainer = document.querySelector("#container");
let svgCopy;
async function loadArt() {
    const simplexLib = await import("https://unpkg.com/simplex-noise@4.0.1/dist/esm/simplex-noise.js?module");
    const noise2D = simplexLib.createNoise2D();



    for (let x = 0; x < 10; x += 1) {
        for (let y = 0; y < 30; y += 1) {

            const svgImage1 = await fetch("./img/AngerTile2.svg");
            const svgImage2 = await fetch("./img/HappyTile.svg");
            const svgImage3 = await fetch("./img/ShockTile.svg");
            let loadedImage;

            let noise = Math.abs(noise2D(x, y));
            if (noise <= 0.3) {
                loadedImage = svgImage1;
            }
            else if (noise <= 0.6 && noise > 0.3) {
                loadedImage = svgImage2;
            }
            else {
                loadedImage = svgImage3;
            }

            const svgText = await loadedImage.text();



            let svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
            svg.innerHTML = svgText;
            let totalDisturbacne;
            let disturbance = noise2D(x, y * .1);
            let levelOfDisturbacne = y * 1.5
            totalDisturbacne = disturbance * levelOfDisturbacne + levelOfDisturbacne + 10;
            totalDisturbacne = Math.abs(totalDisturbacne);

            let tileWidth = 64;
            let tileHeight = 64;

            let DisturbanceScale = 4;

            if(y < 20){
                svg.setAttribute("transform", 
                `translate(${(x * tileWidth + totalDisturbacne*DisturbanceScale) + 100},${y * tileHeight})
                 rotate(${-totalDisturbacne*DisturbanceScale}) 
                 scale(${1 + totalDisturbacne * -0.01 *DisturbanceScale}) 
                 skewX(${-totalDisturbacne}) 
                 skewY(${-totalDisturbacne})`);//position
            }

            svg.setAttribute("transform", 
            `translate(${(x * tileWidth + totalDisturbacne*DisturbanceScale) + 100},${y * tileHeight}) 
            rotate(${totalDisturbacne*DisturbanceScale})
            scale(${1 + totalDisturbacne * -0.01*1.4})
            skewX(${totalDisturbacne})
            skewY(${-totalDisturbacne})`);//position



            
            //rotation
            //scale
            svgContainer.appendChild(svg);

           
        }
    }
    console.log(svgContainer.innerHTML);
}

loadArt();



