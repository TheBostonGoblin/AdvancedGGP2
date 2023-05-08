const svgContainer = document.querySelector("#container");

async function loadArt(){
    const svgFile = await fetch("./svgs/piece.svg");
    const svgText  = await svgFile.text();
    // let svg = document.createElementNS("http://www.w3.org/2000/svg","g");
    // svg.innerHTML = svgText;
    // svg.setAttribute("transform",`translate(500,500) scale(0.01,-0.01)`);
    // svgContainer.appendChild(svg);
    // let svg2 = document.createElementNS("http://www.w3.org/2000/svg","g");
    // svg2.innerHTML = svgText;

    // svg2.setAttribute("transform",`translate(475,540) scale(0.02,-0.02)`);
    // svgContainer.appendChild(svg2);

    let lastXPos = 500;
    let lastyPos = 100;
    let lastScaleFactor = 0.02;
    for(let x = 0 ;x <= 5;x++){

        let xPos = lastXPos - 50;
        let yPos = lastyPos + 80;
        let scaleFactor = lastScaleFactor + 0.02;
        //let scaleFactor = x * 0.02 ;
        let svgAddition = document.createElementNS("http://www.w3.org/2000/svg","g");
        svgAddition.innerHTML = svgText;
        svgAddition.setAttribute("transform",`translate(${xPos*2},${yPos*2}) scale(${scaleFactor},${-scaleFactor}) rotate(0)`);
        svgAddition.setAttribute("fill","red")
        lastXPos = xPos;
        lastyPos = yPos;
        lastScaleFactor = scaleFactor;
        svgContainer.appendChild(svgAddition);
    }

    lastXPos = 600;
    lastyPos = 300;
    lastScaleFactor = 0.02;
    for(let x = 0 ;x <= 5;x++){

        let xPos = lastXPos - 50;
        let yPos = lastyPos + 80;
        let scaleFactor = lastScaleFactor + 0.02;
        //let scaleFactor = x * 0.02 ;
        //let svgAddition = document.createElementNS("http://www.w3.org/2000/svg","g");
        svgAddition.innerHTML = svgText;
        svgAddition.setAttribute("transform",`translate(${xPos*2},${yPos}) scale(${scaleFactor},${-scaleFactor}) rotate(30)`);
        svgAddition.setAttribute("fill","red")
        lastXPos = xPos;
        lastyPos = yPos;
        lastScaleFactor = scaleFactor;
        svgContainer.appendChild(svgAddition);
    }

    

    // let svg3 = document.createElementNS("http://www.w3.org/2000/svg","g");
    // svg3.innerHTML = svgText;

    // svg3.setAttribute("transform",`translate(425,620) scale(0.04,-0.04) rotate(0)`);
    // svgContainer.appendChild(svg3);

    // let svg4 = document.createElementNS("http://www.w3.org/2000/svg","g");
    // svg4.innerHTML = svgText;

    // svg4.setAttribute("transform",`translate(375,700) scale(0.06,-0.06) rotate(0)`);
    // svgContainer.appendChild(svg4);

    // let svg5 = document.createElementNS("http://www.w3.org/2000/svg","g");
    // svg5.innerHTML = svgText;

    // svg5.setAttribute("transform",`translate(325,780) scale(0.08,-0.08) rotate(0)`);
    // svgContainer.appendChild(svg5);
}

loadArt();
