const tooltipHTML = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .attr("class", "tooltipHTML")
    .style("opacity", 0)
    .style("background-color", "#aacbcf")
    .style("border", "solid 3px black")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("viibility", "hidden")
    .style("text-align", "center")
    .style("display", "none")
    .html(`
        `)
    .style("font-size", "15px");

let parseTime = d3.timeParse("%Y-%m-%d");
const rowConverter = (row) => {

    let daysBefExp = null;
    if(parseTime(row.date_collected) === null || parseTime(row.label_date) === null){
        daysBefExp = null;
    }
    else{
        daysBefExp = Math.round((new Date(parseTime(row.date_collected)).getTime() - new Date(parseTime(row.label_date)).getTime())/ (1000*3600*24));

        if(daysBefExp === -365){
            daysBefExp = 0;
        }
    }
    row = {
        id: row.id,
        date: parseTime(row.date_collected),
        retailType: row.retailer_type,
        foodType: row.food_type,
        foodDetail: row.food_detail,
        labelType: row.label_type,
        labelLang: row.label_language,
        labelDate: parseTime(row.label_date),
        value: row.approximate_dollar_value,
        imgID: row.image_id,
        latitudeCollected: row.collection_lat,
        longitudeCollected: row.collection_long,
        labelExplained: row.label_explanation,
        daysBeforeExp: daysBefExp
    }
    return { ...row };
};

const dataset = await d3.csv("./data/brooklyn.csv", rowConverter);


const w = 800;
const h = 800;
let globalExpData = null;

const counterData = dataset.filter(data => data.retailType.includes("counter service"));
const healthFoodGrocerData = dataset.filter(data => data.retailType.includes("health food grocer"));
const drugStoreData = dataset.filter(data => data.retailType.includes("drugstore"));
const coffeeShopData = dataset.filter(data => data.retailType.includes("coffeeshop"));
const bakeryDeliData = dataset.filter(data => data.retailType.includes("bakery/deli"));
const chainGrocerData = dataset.filter(data => data.retailType.includes("chain grocer"));

// const allValueArray = dataset.map(data => parseFloat(data.value))
// console.log(allValueArray);

const allValueSum = dataset.reduce((accumulator, value) => {
    return accumulator + parseFloat(value.value);
  }, 0);

  const counterValueSum = counterData.reduce((accumulator, value) => {
    return accumulator + parseFloat(value.value);
  }, 0);

  const healthValueSum = healthFoodGrocerData.reduce((accumulator, value) => {
    return accumulator + parseFloat(value.value);
  }, 0);

  const drugValueSum = drugStoreData.reduce((accumulator, value) => {
    return accumulator + parseFloat(value.value);
  }, 0);

  const coffeeValueSum = coffeeShopData.reduce((accumulator, value) => {
    return accumulator + parseFloat(value.value);
  }, 0);

  const bakeValueSum = bakeryDeliData.reduce((accumulator, value) => {
    return accumulator + parseFloat(value.value);
  }, 0);

  const chainValueSum = chainGrocerData.reduce((accumulator, value) => {
    return accumulator + parseFloat(value.value);
  }, 0);

  const dollarsWastedData = [
    { name: "All Services", value: allValueSum.toFixed(2) },
    { name: "Counter Services", value: counterValueSum.toFixed(2) },
    { name: "Health Food Grocers", value: healthValueSum.toFixed(2) },
    { name: "Drug Stores", value: drugValueSum.toFixed(2) },
    { name: "Coffee Shops", value: coffeeValueSum.toFixed(2) },
    { name: "Bakery Delis", value: bakeValueSum.toFixed(2) },
    { name: "Chain Grocers", value: chainValueSum.toFixed(2)},
]

console.log(dollarsWastedData);

const totalWasteNum = dataset.length;
const counterNum = counterData.length;
const healthNum = healthFoodGrocerData.length;
const drugNum = drugStoreData.length;
const coffeeNum = coffeeShopData.length;
const bakeryNum = bakeryDeliData.length;
const chainNum = chainGrocerData.length;

console.log(totalWasteNum);
console.log(counterNum);
console.log(drugStoreData);

let days = [];
dataset.forEach(element => {
    
});




//drugstore.filter(data => data.foodDetail.includes("yogurt"))

let pieData = [
    { name: "Counter Services", value: counterNum },
    { name: "Health Food Grocers", value: healthNum },
    { name: "Drug Stores", value: drugNum },
    { name: "Coffee Shops", value: coffeeNum },
    { name: "Bakery Delis", value: bakeryNum },
    { name: "Chain Grocers", value: chainNum },
]

const pieColors = d3.scaleOrdinal()
    .domain(dataset)
    .range([
        "#da908b",
        "#87a9cc",
        "#d3dc39",
        "#59057a",
        "#16cd0c",
        "#eb77c5"
    ]);

const svg = d3.select(".pieGraph1")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .style("-moz-user-select", "none")
    .style("-khtml-user-select", "none")
    .style("-webkit-user-select", "none")
    .style("user-select", "none");

function drawPieChart(_pieData){

    d3.select(".pieGraph").remove();

    const pie = d3.pie().value(function (d) {
        return d.value;
    });
    
    const radius = 350;
    
    const arc = d3.arc()
        .innerRadius(30)
        .outerRadius(radius);
    
    
    const arcs = svg
        .selectAll('path')
        .data(pie(_pieData))
    .join(
        enter => enter.append('g')
            .attr('class', function (d, i) { return `pieArcs${i}` })
            .attr("transform", `translate(${w / 2},${h / 2})`)
    )

    
    arcs.append("path")
    .attr("fill", function (_, i) {
        return pieColors(i);
    })
    .attr("stroke", "black")
    .attr("d", arc);


    arcs.append("text")
    .attr("transform", function (d) {
        let midAngle = d.endAngle < Math.PI ? d.startAngle / 2 + d.endAngle / 2 : d.startAngle / 2 + d.endAngle / 2 + Math.PI;

        return `translate(${arc.centroid(d)[0]},${arc.centroid(d)[1]}) rotate(-270) rotate(${(midAngle * 180 / Math.PI)})`;
    })
    .attr("dy", "5px")

}
const pie = d3.pie().value(function (d) {
    return d.value;
});

const radius = 350;

const arc = d3.arc()
    .innerRadius(30)
    .outerRadius(radius);

console.log(pieData);

const arcs = svg
    .selectAll('path')
    .data(pie(pieData))
    .join(
        enter => enter.append('g')
            .attr('class', function (d, i) { return `pieArcs${i}` })
            .attr("transform", `translate(${w / 2},${h / 2})`)
            .on("mouseover", function (mouseEvent, d) {

                console.log("Start Angle" + d.startAngle * (180 / Math.PI) + "End Angle" + d.endAngle * (180 / Math.PI));

                console.log(this.className.baseVal.toString());
                tooltipHTML
                .style("background-color", "#aacbcf")
                    .style("display", "block")
                    .style("opacity", 1)
                    .html(`
                <h2>Of the ${totalWasteNum} waste items found, ${d.data.value} of them came from ${d.data.name}</h2>
            `);


            })
            .on("mousemove", function (mouseEvent, d) {

                let thisClassName = this.className.baseVal.toString();

                switch (thisClassName) {
                    case "pieArcs0":
                        d3.select(`.${thisClassName}`)
                            .transition()
                            .duration(400)
                            .attr("transform", "translate(395,380)");

                        break;

                    case "pieArcs1":
                        d3.select(`.${thisClassName}`)
                            .transition()
                            .duration(400)
                            .attr("transform", "translate(410,420)");

                        break;

                    case "pieArcs2":
                        d3.select(`.${thisClassName}`)
                            .transition()
                            .duration(400)
                            .attr("transform", "translate(420,380)");

                        break;

                    case "pieArcs3":
                        d3.select(`.${thisClassName}`)
                            .transition()
                            .duration(400)
                            .attr("transform", "translate(399.2,380)");

                        break;

                    case "pieArcs4":
                        d3.select(`.${thisClassName}`)
                            .transition()
                            .duration(400)
                            .attr("transform", "translate(380,420)");

                        break;

                    case "pieArcs5":
                        d3.select(`.${thisClassName}`)
                            .transition()
                            .duration(400)
                            .attr("transform", "translate(380,385)");

                        break;
                        default:
                            break;
                }

                let tooltipBB = document.querySelector(".tooltipHTML").getBoundingClientRect();
                let x = mouseEvent.pageX - (tooltipBB.width / 2);
                let y = mouseEvent.pageY - tooltipBB.height - 80;
                tooltipHTML
                    .style("top", `${y}px`)
                    .style("left", `${x}px`);
            })
            .on("mouseout", function (mouseEvent) {

                let thisClassName = this.className.baseVal.toString();

                d3.select(`.${thisClassName}`)
                    .transition()
                    .duration(400)
                    .attr("transform", "translate(400,400)");

                d3.select(`.${thisClassName}`).attr("transform", `translate(400,400)`);
                tooltipHTML
                    .style("display", "block")
                    .style("opacity", 0);


            })
            .on("click",function (){
                let thisClassName = this.className.baseVal.toString();

                switch (thisClassName) {
                    case "pieArcs0":
                            updateBarChart1(counterData,counterData.length,"Counter Services");
                            updatePieChart(globalExpData,counterData.length,"Counter Services");
                        break;

                    case "pieArcs1":
                            updateBarChart1(healthFoodGrocerData,healthFoodGrocerData.length,"Health Food Grocers");
                            updatePieChart(globalExpData,healthFoodGrocerData.length,"Health Food Grocers");
                        break;

                    case "pieArcs2":
                            updateBarChart1(drugStoreData,drugStoreData.length,"Drug Stores");
                            updatePieChart(globalExpData,drugStoreData.length,"Drug Stores");
                        break;

                    case "pieArcs3":
                            updateBarChart1(coffeeShopData,coffeeShopData.length,"Coffee Shops");
                            updatePieChart(globalExpData,coffeeShopData.length,"Coffee Shops");
                        break;

                    case "pieArcs4":
                            updateBarChart1(bakeryDeliData,bakeryDeliData.length,"Bakery Deli's");
                            updatePieChart(globalExpData,bakeryDeliData.length,"Bakery Deli's");
                        break;

                    case "pieArcs5":
                            updateBarChart1(chainGrocerData,chainGrocerData.length,"Grocery Store Chains");
                            updatePieChart(globalExpData,chainGrocerData.length,"Grocery Store Chains");
                        break;
                        default:
                            break;
                }
            })

    );

    svg.append("circle")
    .attr('cx',w/2 )
        .attr('cy', w/2 )
        .attr('r','30px')
        .attr("class","reset")
        .style('fill', 'red');
d3.select(".reset")
.on("mousemove", function (mouseEvent, d) {

    
    let tooltipBB = document.querySelector(".tooltipHTML").getBoundingClientRect();
                let x = mouseEvent.pageX - (tooltipBB.width / 2);
                let y = mouseEvent.pageY - tooltipBB.height - 80;
                tooltipHTML
                .style("display", "block")
                    .style("opacity", 1)
                    .style("top", `${y}px`)
                    .style("left", `${x}px`)
                    .html(`
                <h2>Click Here To Reset The Bar Chart To Original Values</h2>
            `);


})
.on("mouseout", function (mouseEvent) {
    tooltipHTML
        .style("display", "block")
        .style("opacity", 0);
})
.on("click",function(){updateBarChart1(dataset,dataset.length,"All Locations");});
function updateBarChart1(_dataset,total,arcName){

    drawBarChart(_dataset,total,arcName);
    updatePieChart(globalExpData,171,arcName);
}
function updatePieChart (_dataset,total,arcName){
    updatePie2(_dataset,total,arcName);
}
arcs.append("path")
    .attr("fill", function (_, i) {
        return pieColors(i);
    })
    .attr("stroke", "black")
    .attr("d", arc);


arcs.append("text")
    .attr("transform", function (d) {
        let midAngle = d.endAngle < Math.PI ? d.startAngle / 2 + d.endAngle / 2 : d.startAngle / 2 + d.endAngle / 2 + Math.PI;

        if (d.data.name === "Drug Stores" || d.data.name === "Bakery Delis" || d.data.name === "Chain Grocers") {
            return `translate(${arc.centroid(d)[0]},${arc.centroid(d)[1]}) rotate(270) rotate(${(midAngle * 180 / Math.PI)})`;
        }
        return `translate(${arc.centroid(d)[0]},${arc.centroid(d)[1]}) rotate(-270) rotate(${(midAngle * 180 / Math.PI)})`;
    })
    .attr("dy", "5px")
    .attr("dx", function (d) {
        const name = d.data.name;
        switch (name) {
            case "Drug Stores":
                return "-80px";

            case "Health Food Grocers":
                return "-120px";

            case "Bakery Delis":
                return "-80px";

            case "Chain Grocers":
                return "-100px";

            case "Counter Services":
                return "-60px";

            case "Coffee Shops":
                return "-20px";
        }
    })
    .text(function (d) { return d.data.name + ` ${parseFloat(d.data.value / totalWasteNum * 100).toFixed(2)}%`; })
    .style("font-family", "arial")
    .style("font-size", function (d) { return 16 + 16 * parseFloat(d.data.value / totalWasteNum * 100).toFixed(2) / 100 })
    .style("font-weight", "bold")
    .raise();

const title = svg.append("text").text("What Businesses Produces The Most Food Waste In Brookyln").attr("x", w / 4).attr("y", 20).style("font-weight", "bold");
    


let unknownNum = 0;
let veryExpNum = 0;
let expNum = 0;
let lastDayGood = 0;
let goodForOverDay = 0;
let goodForOverWeek = 0;
let goodForOverMonth = 0;
let goodForOverYear = 0;
for(let x=  0 ;x< dataset.length;x++){
    if(dataset[x].daysBeforeExp === null){
        unknownNum++;
    }
    else if(dataset[x].daysBeforeExp >= 7 ){
        veryExpNum++;
    }
    else if(dataset[x].daysBeforeExp >= 1 && dataset[x].daysBeforeExp < 7){
        expNum++;
    }
    else if(dataset[x].daysBeforeExp === 0 ){
        lastDayGood++;
    }
    else if(dataset[x].daysBeforeExp < 0 && dataset[x].daysBeforeExp > -7 ){
        goodForOverDay++;
    }
    else if(dataset[x].daysBeforeExp <= -7 && dataset[x].daysBeforeExp > -30 ){
        goodForOverWeek++;
    }
    else if(dataset[x].daysBeforeExp <= -30 && dataset[x].daysBeforeExp > -365 ){
        goodForOverMonth++;
    }
    else if(dataset[x].daysBeforeExp <= -365 ){
        goodForOverYear++;
    }
}
const expData = [
    { name: "Unknown", value: unknownNum },
    { name: "Expired_Over_A_Week", value: veryExpNum },//expired for more than a week
    { name: "Expired_For_Days", value: expNum },//has expired between 1-7 days ago
    { name: "Good_For_A Day", value: lastDayGood },//last day the product will be good for
    { name: "Good_For_Over_A_Day", value: goodForOverDay },//Produce should be good for multiple days
    { name: "Good_For_Over_A_Week", value: goodForOverWeek },//Produce should be good for over 7 days
    { name: "Good_For_Over_A_Month", value: goodForOverMonth }, // prodcue will stay good past a month
    { name: "Good_For_Over_A_Year", value: goodForOverYear }, //produce will stay good over a year
];
const margin = {
    left: 30,
    right: 80,
    top: 60,
    bottom: 60
};

//updatePieChart (expData);


const width = 800 - margin.left - margin.right;
const height = 800 - margin.left - margin.right;


const adjustingY = 20;
const svg2 = d3.select(".barGraph1")
    .append("svg")
    .attr("width", width+ margin.left + margin.right)
    .attr("height", height+ margin.top + margin.bottom)
    .style("-moz-user-select", "none")
    .style("-khtml-user-select", "none")
    .style("-webkit-user-select", "none")
    .style("user-select", "none")
    //.attr("transform",`translate(${margin.left},${margin.top}")`);
    const xScale = d3.scaleBand()
    .range([ 0, width ])
    .domain(expData.map(function(d) { return d.name; }))
    .padding(0.2);
    svg2.append("g")
    .attr("transform", `translate(${margin.left}, ${height+adjustingY})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");
    const yScale = d3.scaleLinear()
        .domain([0, 60])
        .range([height, 0]);
    svg2.append("g")
    .attr("transform", `translate(${margin.left}, ${adjustingY})`)
        .call(d3.axisLeft(yScale));




    const myColor = d3.scaleOrdinal().domain(expData)
      .range(["#D3D3D3","#ff0000","#fb5600","#ee8200","#d7a700", "#b6c700", "#86e400","#00ff00"])
      svg2.selectAll("mybar")
      .data(expData)
      .join(
        enter => enter.append("rect")
        .attr("x", d => xScale(d.name)+margin.left)
        .attr("y", d => yScale(d.value)+adjustingY)
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.value))
        .attr("opacity",0.9)
        .attr("class","bar1")
        .attr("fill",d => myColor(d))
        .on("mouseover", function (mouseEvent, d) {

            tooltipHTML
            .style("display", "block")
            .style("opacity", 1)
            .html(`<h2>Of the 171 food Products found ${d.value} were ${d.name}</h2>`);

        })
        .on("mousemove", function (mouseEvent, d) {

            console.log(d);
            let tooltipBB = document.querySelector(".tooltipHTML").getBoundingClientRect();
            let x = mouseEvent.pageX - (tooltipBB.width / 2);
            let y = mouseEvent.pageY - tooltipBB.height - 20;
            tooltipHTML
                .style("top", `${y}px`)
                .style("left", `${x}px`)
                .style("background-color",function(_){return myColor(d)});
        })
        .on("mouseout", function (mouseEvent) {

            tooltipHTML
                .style("display", "none")
                .style("opacity", 0);

        })
        ,
        update => update
            .transition()
            .duration(750)
            .attr("y", d => yScale(d.value)+adjustingY)
            .attr("height", d => height - yScale(d.value))
            .selection()
        ,
        exit => exit.remove()
    )
    const title2 = svg2.append("text").text(`Food Item Quanity & Condition Thrown Out In All Locations`).attr("x", width / 4).attr("y", 20).attr("class","barTitle").style("font-weight", "bold");
function drawBarChart(_dataset,total,arcName){

    

    let unknownNum = 0;
let veryExpNum = 0;
let expNum = 0;
let lastDayGood = 0;
let goodForOverDay = 0;
let goodForOverWeek = 0;
let goodForOverMonth = 0;
let goodForOverYear = 0;
for(let x=  0 ;x< _dataset.length;x++){
    if(_dataset[x].daysBeforeExp === null){
        unknownNum++;
    }
    else if(_dataset[x].daysBeforeExp >= 7 ){
        veryExpNum++;
    }
    else if(_dataset[x].daysBeforeExp >= 1 && _dataset[x].daysBeforeExp < 7){
        expNum++;
    }
    else if(_dataset[x].daysBeforeExp === 0 ){
        lastDayGood++;
    }
    else if(_dataset[x].daysBeforeExp < 0 && _dataset[x].daysBeforeExp > -7 ){
        goodForOverDay++;
    }
    else if(_dataset[x].daysBeforeExp <= -7 && _dataset[x].daysBeforeExp > -30 ){
        goodForOverWeek++;
    }
    else if(_dataset[x].daysBeforeExp <= -30 && _dataset[x].daysBeforeExp > -365 ){
        goodForOverMonth++;
    }
    else if(_dataset[x].daysBeforeExp <= -365 ){
        goodForOverYear++;
    }
}
const expData = [
    { name: "Unknown", value: unknownNum },
    { name: "Expired_Over_A_Week", value: veryExpNum },//expired for more than a week
    { name: "Expired_For_Days", value: expNum },//has expired between 1-7 days ago
    { name: "Good_For_A Day", value: lastDayGood },//last day the product will be good for
    { name: "Good_For_Over_A_Day", value: goodForOverDay },//Produce should be good for multiple days
    { name: "Good_For_Over_A_Week", value: goodForOverWeek },//Produce should be good for over 7 days
    { name: "Good_For_Over_A_Month", value: goodForOverMonth }, // prodcue will stay good past a month
    { name: "Good_For_Over_A_Year", value: goodForOverYear }, //produce will stay good over a year
];
globalExpData = expData;

d3.select(".barTitle").remove();

//updateBarChart1(expData);

const myColor = d3.scaleOrdinal().domain(expData)
      .range(["#D3D3D3","#ff0000","#fb5600","#ee8200","#d7a700", "#b6c700", "#86e400","#00ff00"])

const title2 = svg2.append("text").text(`Food Item Quanity & Condition Thrown Out In ${arcName}`).attr("x", width / 4).attr("y", 20).attr("class","barTitle").style("font-weight", "bold");
svg2.selectAll("rect")
.data(expData)
    .transition()
    .duration(2000)
    .attr("y", d => yScale(d.value)+adjustingY)
    .attr("height", d => height - yScale(d.value))
    .on("end",onhover)


    function onhover(){
        svg2.selectAll("rect")
        .data(expData)
        .on("mouseover", function (mouseEvent, d) {

            tooltipHTML
            .style("display", "block")
            .style("opacity", 1)
            .html(`<h2>Of the ${total} food Products found in ${arcName}, ${d.value} were ${d.name}</h2>`);
    
        })
        .on("mousemove", function (mouseEvent, d) {
    
            console.log(d);
            let tooltipBB = document.querySelector(".tooltipHTML").getBoundingClientRect();
            let x = mouseEvent.pageX - (tooltipBB.width / 2);
            let y = mouseEvent.pageY - tooltipBB.height - 20;
            tooltipHTML
                .style("top", `${y}px`)
                .style("left", `${x}px`)
                .style("background-color",function(_){return myColor(d)});
        })
        .on("mouseout", function (mouseEvent) {
    
            tooltipHTML
                .style("display", "none")
                .style("opacity", 0);
    
        });
    }
    

    //updateBarChart1(expData);

}

const width3 = 700,
    height3 = 700,
    margin3 = {top:20,bottom:20,left:20,right:20},
    radius3 = width/2 - margin.top;

const svg3 = d3.select(".pieChart2")
.append("svg")
.attr("width",width3)
.attr("height",height3)
.append("g")
    .attr("transform", `translate(${width3/2}, ${height3/2})`);


const myColor2 = d3.scaleOrdinal().domain(expData)
      .range(["#D3D3D3","#ff0000","#fb5600","#ee8200","#d7a700", "#b6c700", "#86e400","#00ff00"])


const pie2 = d3.pie().value(function (d) {
    return d.value;
})
.sort(d3.ascending).value(function (d) { d.name });


const arc2 = d3.arc()
    .innerRadius(0)
    .outerRadius(radius3);

function updatePie2(_dataset,total,arcName){

    d3.select(`.pie2Title`).remove();
        const title2 = svg3.append("text").text(`Percentage of Food Products Thrown Away at ${arcName}`).attr("x", -200).attr("y", -300).attr("class","pie2Title").style("font-weight", "bold");
    
    
const pie = d3.pie()
.value(function(d) {return d[1].value; })
.sort(function(a, b) { return d3.ascending(a.key, b.key);} )
const arcData = pie(Object.entries(_dataset));

const arcs2 = svg3.selectAll(".path2")
.data(arcData)

arcs2
.join('path')
.transition()
.duration(1000)
.attr("class","path2")
.attr('d', d3.arc()
  .innerRadius(0)
  .outerRadius(radius3)
)
.attr('fill', function(d){ return(myColor2(d.data[0])) })
.attr("stroke", "black")
.style("stroke-width", "2px")
.style("opacity", 1)


const texts = svg3.selectAll(".pie2Text").data(arcData);

texts
.join('text')
.transition()
.duration(1000)
.attr("class","pie2Text")
.attr("transform", function (d) {
    let midAngle = d.endAngle < Math.PI ? d.startAngle / 2 + d.endAngle / 2 : d.startAngle / 2 + d.endAngle / 2 + Math.PI;
    // if(d.startAngle* 180 / Math.PI > 90 ){
    //     return `translate(${arc2.centroid(d)[0]},${arc2.centroid(d)[1]}) rotate(-270) rotate(${(midAngle * 180 / Math.PI)})`;
    // }
    return `translate(${arc2.centroid(d)[0]},${arc2.centroid(d)[1]}) rotate(270) rotate(${(midAngle * 180 / Math.PI)})`;
})
.attr("dy", "5px")
.attr("dx", function (d) {return "0px" })
.text(function (d,i) { 
    if(parseInt(d.data[1].value / total * 100) === 0){
    }
    else{
        return ` ${parseFloat(d.data[1].value / total * 100).toFixed(2)}%`; 
    }
    
})
.style("font-family", "arial")
.style("font-size", function (d) { return 16 + 16 * parseFloat(d.data[1].value / total * 100).toFixed(2) / 100 })
.style("font-weight", "bold")
.on("end",hoverOver)

function hoverOver(){
    d3.selectAll(".path2").on("mouseover", function (mouseEvent, d) {
        tooltipHTML
        .style("display", "block")
        .style("opacity", 1)
        .html(`<h2>Percentage of ${d.data[1].name} is ${parseFloat(d.data[1].value / total * 100).toFixed(2)}%</h2>`);
    
    })
    .on("mousemove", function (mouseEvent, d) {
    
        let tooltipBB = document.querySelector(".tooltipHTML").getBoundingClientRect();
        let x = mouseEvent.pageX - (tooltipBB.width / 2);
        let y = mouseEvent.pageY - tooltipBB.height - 20;
        tooltipHTML
            .style("top", `${y}px`)
            .style("left", `${x}px`)
            .style("background-color","skyblue");
    })
    .on("mouseout", function (mouseEvent) {
    
        tooltipHTML
            .style("display", "none")
            .style("opacity", 0);
    })
    .on("click",function(mouseEvent,d){

        const completeTotal = arcData[0].value+arcData[1].value+arcData[2].value + arcData[3].value+arcData[4].value+arcData[5].value+arcData[6].value+arcData[7].value;
        const expData = [
            { name: "Unspoiled Food Thrown Away", value: arcData[3].value+arcData[4].value+arcData[5].value+arcData[6].value+arcData[7].value },
            { name: "Spoiled Food thrown Away", value: arcData[1].value+arcData[2].value },
            { name: "Uknown", value: arcData[0].value }
        ];
        console.log(arcData)
        updatePie2(expData,completeTotal);

        d3.select(".pie2Title").remove();
        const title2 = svg3.append("text").text(`Percentage of Wasted Consumable Foods at ${arcName}`).attr("x", -200).attr("y", -300).attr("class","pie2Title").style("font-weight", "bold");
    })
}
}
updatePie2(expData,171,"All Locations");

const width4 = 800
const height4 = 800

const svg4 = d3.select(".circPack1")
  .append("svg")
    .attr("width", width4)
    .attr("height", height4)


/*PLEASE NOTE:
    I referenced d3 Graph Galleries example on Circular Packing. 
    when creating the data Visualiztion below: https://d3-graph-gallery.com/graph/circularpacking_template.html
*/
const data = dollarsWastedData;

const circColors = d3.scaleOrdinal()
    .domain(dataset)
    .range([
        
        "#da908b",
        "#87a9cc",
        "#d3dc39",
        "#FF0000",
        "#59057a",
        "#16cd0c",
        "#eb77c5"
    ]);


  const sizeScale = d3.scaleLinear()
    .domain([0, 1000])
    .range([15,100])  

  const mouseover = function(event, d) {
  }
  const mousemove = function(event, d) {
  }
  var mouseleave = function(event, d) {
  }

  var node = svg4.append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("class", "node")
      .attr("r", d => sizeScale(d.value))
      .attr("cx", width4 / 2)
      .attr("cy", height4 / 2)
      .style("fill", d => circColors(d.name))
      .attr("stroke", "black")
      .style("stroke-width", 1)
      .on("mouseover", function(d){
        tooltipHTML
        .style("display", "block")
        .style("opacity", 1)
        
      }) 
      .on("mousemove", function(mouseEvent,d){

        console.log(d);
        let tooltipBB = document.querySelector(".tooltipHTML").getBoundingClientRect();
        let x = mouseEvent.pageX - (tooltipBB.width / 2);
        let y = mouseEvent.pageY - tooltipBB.height - 20;
        tooltipHTML
            .style("top", `${y}px`)
            .style("left", `${x}px`)
            .style("background-color","skyblue")
            .html(`<h2>In total ${d.name} in Brookyln disposed of $${d.value} worth of Food</h2>`);
      })
      .on("mouseout", function(d){
        tooltipHTML
            .style("display", "none")
            .style("opacity", 0);
      })
      .call(d3.drag() 
           .on("start", dragstarted)
           .on("drag", dragged)
           .on("end", dragended));

  const simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(width / 2).y(height / 2)) 
      .force("charge", d3.forceManyBody().strength(.1))
      .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (sizeScale(d.value)+3) }).iterations(1)) 

 
  simulation
      .nodes(data)
      .on("tick", function(d){
        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
      });

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(.03).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(.03);
    d.fx = null;
    d.fy = null;
  }

  const title4 = svg4.append("text").text("Total Dollars Lost In Brookyln").attr("x", width4 / 4).attr("y", 20).style("font-weight", "bold");


//attempted to use LONG LAT data to get a map dataset functioning but was unable to due to other exams and projects
// let bosNeighborhoods;

// const loadData = async () => {
//     bosNeighborhoods = await d3.json('https://gist.githubusercontent.com/jdev42092/5c285c4a3608eb9f9864f5da27db4e49/raw/a1c33b1432ca2948f14f656cc14c7c7335f78d95/boston_neighborhoods.json');
//     const test = await d3.json("http://data.beta.nyc//dataset/0ff93d2d-90ba-457c-9f7e-39e47bf2ac5f/resource/35dd04fb-81b3-479b-a074-a27a37888ce7/download/d085e2f8d0b54d4590b1e7d1f35594c1pediacitiesnycneighborhoods.geojson");
//     const rodentData = await d3.json('https://gist.githubusercontent.com/jdev42092/ee94f6d469d7084e8dca4e8533817e0e/raw/7cfd6c34c974d3a86ff19c6180cfa22ee9ce3946/boston_rodents.json');

    

//     const dataset2 = bosNeighborhoods;
//     const geoHeight = 600
//     const geoWidth = 700;
//     let svg2 = d3.select(".geo")
//         .append("svg")
//         .attr("width", geoWidth)
//         .attr("height", geoHeight);

//     // Append empty placeholder g element to the SVG
//     // g will contain geometry elements
//     let g = svg2.append("g");
//     let rodents = svg2.append( "g" );

//     const bosProjection = d3.geoAlbers()
//         .fitSize([geoWidth,geoHeight],dataset2)

//     const bos_geoPath = d3.geoPath()
//         .projection(bosProjection);

        
//     g.selectAll("path")
//         .data(dataset2.features)
//         .enter()
//         .append("path")
//         .attr("class","map")
//         .attr("fill", "#ccc")
//         .attr("stroke", "#333")
//         .attr("d", bos_geoPath);

//     rodents.selectAll("path")
//         .data(rodentData.features)
//         .enter()
//         .append("path")
//         .attr("class","dot")
//         .attr("fill", "#900")
//         .attr("stroke", "#999")
//         .attr("d", bos_geoPath);

//         console.log(d3.select(".map"));
//     return false;
// }
// loadData();

