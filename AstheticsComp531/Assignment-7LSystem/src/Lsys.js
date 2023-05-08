///F -> F+F

//FGF
// F + FGF + F
/// F + F + F + FGF + F + F + F

//Alphabet
//axion (exist without proof) starting string
//production rule

//starting string 
const axion =  'X';

//prodcution rules
const rules = {
    'X': 'F+[[X]-X]-F[-FX]+X',
    'F': 'FF',
    '+': '+',
    '-': '-', //controlled by applied rule if undefined just use the character
    '[': '[',
    ']': ']',
}
const iterNum = 6;
let stringToExpand = axion;
for(let i = 0 ; i < iterNum;i++){
    let newString = '';
    for(let x = 0; x< stringToExpand.length;x++){

        const letter = stringToExpand[x];
        let appliedRule = rules[letter];
        // if(appliedRule === undefined){
        //     appliedRule = letter;
        // }
        newString += appliedRule;
    }
    stringToExpand = newString;
}
console.log(stringToExpand);



let startingPoint = [330,700];
let currentAngle = 0;
let lineDisance = 10;
let points = [startingPoint];
let stateStack = [];

/*
Here, F means "draw forward", − means "turn right 25°", and + means "turn left 25°". X does not correspond to any drawing action and is used to control the evolution of the curve. The square bracket "[" corresponds to saving the current values for position and angle, which are restored when the corresponding "]" is executed.
*/
const interpretByLetter = {
    'F': () => {
        const currentPosition = points.slice(-1)[0];
        const nextPoint = [
            currentPosition[0] + lineDisance * Math.cos(currentAngle * Math.PI /180),
            currentPosition[1] + lineDisance * Math.sin(currentAngle * Math.PI /180)
        ]
        points.push(nextPoint);
    },
    'X': () => {
        const currentPosition = points.slice(-1)[0];
        const nextPoint = [
            currentPosition[0] + lineDisance * Math.sin(currentAngle * Math.PI /180),
            currentPosition[1] + lineDisance * Math.sin(currentAngle * Math.PI /180)
        ]
        points.push(nextPoint);
    },
    '+': () => {
        currentAngle *= 45;
    },
    '-': () => {
        currentAngle -= 90;
    },
    '[': () => {
        stateStack.push({
            position: points.slice(-1)[0],
            angle: currentAngle
        });
    },
    ']': () => {
        const lastState = stateStack.pop();
        points.push(lastState.position);
        currentAngle = lastState.angle;
    },
}

for(let x = 0 ;x < stringToExpand.length;x++){
    const letter = stringToExpand[x];

    //check letter
    const interpret = interpretByLetter[letter];
    interpret();
}
console.log(points);

const polyline = document.createElementNS("http://www.w3.org/2000/svg","polyline");
polyline.setAttribute("points",points.join(' '));
polyline.setAttribute("fill","none");
polyline.setAttribute("stroke","black");
polyline.setAttribute("stroke-width","2px");

const svg = document.querySelector("#mySVG");
svg.appendChild(polyline);