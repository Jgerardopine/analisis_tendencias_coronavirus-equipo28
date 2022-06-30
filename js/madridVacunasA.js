//D3 codigo para generar la una grafica que muestra el progreso de la vacuna COVID en la ciudad de Madrid

//------------------Declaramos nuestros formatos y nuestra constantes para la manipulacion de los componentes de nuestro index.html --| Tab "Vacunas"---------------//
// Nuestra grafica requiere de dos componentes HTML - myTable(div) , metricamV (dropdown)

const grafmV = d3.select("#myTable")
const metricamV = d3.select("#selectButton")

// Ajustamos el formato de la grafica en cuestion de margenes y tamaño
// Dimensiones
const anchoTotalmV = 1000 //+graf.style("width").slice(0, -2)
const altoTotalmV = 460

const marginsmV = {
  top: 25,
  right: 20,
  bottom: 60,
  left: 70,
}
const anchomV = anchoTotalmV - marginsmV.left - marginsmV.right
const altomV = altoTotalmV - marginsmV.top - marginsmV.bottom

// Declaramos nuestras constantes (componentes) que seran utilizados para dibujar la grafica
const svgmV = grafmV
  .append("svg")
    .attr("width", anchoTotalmV)
    .attr("height",altoTotalmV)
  .append("g")
  .attr("transform", `translate(${marginsmV.left},${marginsmV.top})`);

const gmV = svgmV
  .append("g")
  .attr("transform", `translate(0, ${altomV})`)


  
//-----------------------------------------------------------------------------------------------------------------------//

const readData = async () => {
  const data = await d3.csv("data/vacunas_madrid_final.csv", d3.autoType).then((data) => {
    debugger;
  processData(data);
  console.log("read data")
}) 
  
}
//Read the data
const processData =  (data) => {
  // add the options to the button
  console.log("read data1")
  metricamV
  .selectAll("option")
  .data(Object.keys(data[0]).slice(1))
  .enter()
  .append("option")
  .attr("value", (d) => d)
    .text((d) => d)

  
  // A color scale: one color for each group
const myColor = d3.scaleOrdinal()
  .domain(Object.keys(data[0]).slice(3))
  .range(["blue","red","yellow","pink"])


// Add X axis --> it is a date format
const x = d3.scaleTime()
  .domain(d3.extent(data, function(d) { return d3.timeParse("%m/%d/%Y")(d.date); }))
.range([0, anchomV]);
  
  gmV.call(d3.axisBottom(x));
  svgmV.append("text")
    .attr("font-size", "20px")
    .attr("x",anchomV / 2)
    .attr("y", altomV + marginsmV.top + 20)
        .attr("text-anchor", "middle")
    .text("Año 2021 a 2022");
  

  // Add Y axis
  const y = d3.scaleLinear()
    .domain( [0,20])
    .range([altomV, 0]); 
  svgmV.append("g")
    .call(d3.axisLeft(y));
  
  svgmV.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", -190)
    .text("Total de Dosis")

  
  // Initialize line with group a
  const linemV = svgmV
    .append('g')
    .append("path")
      .datum(data)
      .attr("d", d3.line()
        .x(function(d) { return x(+d3.timeParse("%m/%d/%Y")(d.date)) })
        .y(function(d) { return y(+d.Dosis_recibidas) })
      )
      .attr("stroke", function(d){ return myColor("Dosis_recibidas") })
      .style("stroke-width", 4)
      .style("fill", "none")
console.log("read data end")
  // A function that update the chart
  const renderData = (selectedGroup) => {
    // Create new data with the selection?
    const dataFilter = data.map(function(d){return {date: d3.timeParse("%m/%d/%Y")(d.date), value:d[selectedGroup]} })

    // Give these new data to update line
    linemV
        .datum(dataFilter)
        .transition()
        .duration(1000)
        .attr("d", d3.line()
          .x(function(d) { return x(d.date) })
          .y(function(d) { return y(+d.value) })
        )
        .attr("stroke", function(d){ return myColor(selectedGroup) })
  }

  metricamV.on("change", (e) => {
    e.preventDefault()
  renderData(e.target.value)
})

}

readData()
