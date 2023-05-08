const  axion = 'A';

const rules = {
    'A' : 'B-A-B',
    'B': 'A+B+A',
    '-': '-',
    '+':'+'
}

const numberOfIterations = 10;
let stringToExpand = axion;

for(let x = 0 ;x < numberOfIterations;x++)
{
    let newString = '';
    for(let x = 0; x< stringToExpand.length;x++){
        const letter = stringToExpand[x];
        let appliedRule = rules[letter];
        newString += appliedRule;
    }
    stringToExpand = newString;
}

let startingPoint = [700,100];
let currentAngle = 0;
let lineDisance = 2;
let points = [startingPoint];

const interpByLetter = {
    'A': () =>{
        const currentPosition = points.slice(-1)[0];
        const nextPoint = [
            currentPosition[0] + lineDisance * Math.sin(currentAngle * Math.PI /180),
            currentPosition[1] + lineDisance * Math.cos(currentAngle * Math.PI /180)
        ]
        points.push(nextPoint);
    },
    'B': () => {
        const currentPosition = points.slice(-1)[0];
        const nextPoint = [
            currentPosition[0] + lineDisance* Math.sin(currentAngle * Math.PI /180),
            currentPosition[1] + lineDisance * Math.cos(currentAngle * Math.PI /180)
        ]
        points.push(nextPoint);
    },
    '-': () =>{
        currentAngle += 60;
    },
    '+': () =>{
        currentAngle -= 60;
    }
}

for(let x = 0 ;x < stringToExpand.length;x++){
    const letter = stringToExpand[x];

    //check letter
    const interpret = interpByLetter[letter];
    interpret();
}
console.log(points);

const polyline = document.createElementNS("http://www.w3.org/2000/svg","polyline");
polyline.setAttribute("points",points.join(' '));
polyline.setAttribute("fill","none");
polyline.setAttribute("stroke","black");
polyline.setAttribute("stroke-width","2px");

const svg = document.querySelector("#mySVG2");
svg.appendChild(polyline);