const svgContainer = document.querySelector("#container");

async function feching(){
    const svg = await fetch("./img/tile2.svg");
    const svgText  = await svg.text();

    const simplexLib = await import("https://unpkg.com/simplex-noise@4.0.1/dist/esm/simplex-noise.js?module");

    const noise2D = simplexLib.createNoise2D();

    console.log(noise2D);


    let totalText;
    let totalDisturbacne;
    for(let x = 0; x < 8;x++){
        for(let y = 0; y<30;y++)
        {
            // debugger;
            let svg = document.createElementNS("http://www.w3.org/2000/svg","g");
            svg.innerHTML = svgText;

            if(x <= 6){//deform left
                let disturbance = noise2D(x,y*.1);
                let levelOfDisturbacne = y*1.5;
                totalDisturbacne = disturbance * levelOfDisturbacne + levelOfDisturbacne;

                totalDisturbacne = Math.abs(totalDisturbacne);
                //console.log(totalDisturbacne);

                svg.setAttribute("transform",`translate(${(x*64 - totalDisturbacne)+100},${y*64}) rotate(${totalDisturbacne}) scale(${1+totalDisturbacne*0.01}) skewX(${totalDisturbacne}) skewY(${totalDisturbacne})`);//position
            }
            else{//deform right
                let disturbance = noise2D(x,y*.1);
                let levelOfDisturbacne = y*1.5
                totalDisturbacne = disturbance * levelOfDisturbacne + levelOfDisturbacne;
                totalDisturbacne = Math.abs(totalDisturbacne);
                //console.log(totalDisturbacne);

                svg.setAttribute("transform",`translate(${(x*64 + totalDisturbacne)+100},${y*64}) rotate(${-totalDisturbacne}) scale(${1+totalDisturbacne*-0.01}) skewX(${-totalDisturbacne}) skewY(${-totalDisturbacne})`);//position
            }
            
            //rotation
            //scale
            svgContainer.appendChild(svg);
        }
    }
    console.log("Hello");
}

feching();


