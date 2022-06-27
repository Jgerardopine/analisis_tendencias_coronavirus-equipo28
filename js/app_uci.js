//Constants
var data = {}
var data2 = {}
var yearArr = {}
var monthArr = {}

// Selecciones
const graf = d3.select("#graf")
const cboYear = d3.select("#cboYear")
const cboMes = d3.select("#cboMes")

// Dimensiones
const anchoTotal = +graf.style("width").slice(0, -2)
const altoTotal = (anchoTotal * 9) / 16

const margins = {
  top: 60,
  right: 20,
  bottom: 75,
  left: 100,
}
const ancho = anchoTotal - margins.left - margins.right
const alto = altoTotal - margins.top - margins.bottom

// Elementos gráficos (layers)
const svg = graf
  .append("svg")
  .attr("width", anchoTotal)
  .attr("height", altoTotal)
  .attr("class", "graf")

// svg.selectAll("svg .tick text")    
//     .style("text-anchor", "end")
//     .attr("dx", "-.8em")
//     .attr("dy", "-.5em")
//     .attr("transform", "rotate(-90)");

const layer = svg
  .append("g")
  .attr("transform", `translate(${margins.left}, ${margins.top})`)

layer
  .append("rect")
  .attr("height", alto)
  .attr("width", ancho)
  .attr("fill", "white")

const g = svg
  .append("g")
  .attr("transform", `translate(${margins.left}, ${margins.top})`)

//!!-----------------------------------------------------

const start = async () => {
  data = await d3.csv("uci.csv", d3.autoType)

  yearArr = await [...new Set(data.map((obj) => { return obj["ano"] }))];
  
  let month_tmp = data.map( (o) => { return {["ano"]:o.ano, ["mes"]: o.mes}; });
  yearArr.forEach( e => {
    monthArr[e] = [...new Set(month_tmp.filter( o => o.ano == e).map((o) => {return o["mes"]}) )];
  });
  
  draw()
}

const draw = () => {

  cboYear
    .selectAll("option")
    .data(yearArr)
    .enter()
    .append("option")
    .attr("value", (d) => d)
    .text((d) => d)

  cboMes
    .selectAll("option")
    .data(monthArr[yearArr[0]])
    .enter()
    .append("option")
    .attr("value", (d) => d)
    .text((d) => d)


  let yeartmp = cboYear.node().value;
  let mestmp = cboMes.node().value;

  let datatmp = data.filter( o => o.ano == yeartmp && o.mes == mestmp)

  // Accessor
  const xAccessor = (d) => d.provincia

  // Escaladores
  const y = d3.scaleLinear().range([alto, 0])
  const color = d3
    .scaleOrdinal()
    .domain(Object.keys(datatmp[0]).slice(1))
    .range(d3.schemeTableau10)

  const x = d3.scaleBand().range([0, ancho]).paddingOuter(0.2).paddingInner(0.1)

  const titulo = g
    .append("text")
    .attr("x", ancho / 2)
    .attr("y", -15)
    .classed("titulo", true)

  const etiquetas = g.append("g")

  const xAxisGroup = g
    .append("g")
    .attr("transform", `translate(0, ${alto})`)
    .classed("axis", true)
    .classed("axis-y", true)

  const yAxisGroup = g.append("g").classed("axis", true)

  const updateMes = () => {
    
    cboMes.selectAll("#cboMes > *").remove();
    cboMes
      .selectAll("option")
      .data(monthArr[cboYear.node().value])
      .enter()
      .append("option")
      .attr("value", (d) => d)
      .text((d) => d)

  }

  const render = () => {

    let yeartmp = cboYear.node().value;
    let mestmp = cboMes.node().value;

    let datatmp = data.filter( o => o.ano == yeartmp && o.mes == mestmp)

    console.log(datatmp)

    // Accesores
    const yAccessor = (d) => d["porcentaje"]
    datatmp.sort((a, b) => yAccessor(b) - yAccessor(a))

    
    // Escaladores
    y.domain([0, 100])
    x.domain(d3.map(datatmp, xAccessor))

    // Rectángulos (Elementos)
    const rect = g.selectAll("rect").data(datatmp, xAccessor)

    rect
      .enter()
      .append("rect")
      .attr("x", (d) => x(xAccessor(d)))
      .attr("y", (d) => y(0))
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", "green")
      .merge(rect)
      .transition()
      .duration(2500)
      .ease(d3.easeBounce)
      .attr("x", (d) => x(xAccessor(d)))
      .attr("y", (d) => y(yAccessor(d)))
      .attr("width", x.bandwidth())
      .attr("height", (d) => alto - y(yAccessor(d)))
      .attr("fill", (d) =>
        xAccessor(d) == "Satélite" ? "#f00" : color("porcentaje")
      )

    const et = etiquetas.selectAll("text").data(datatmp)
    et.enter()
      .append("text")
      .attr("x", (d) => x(xAccessor(d)) + x.bandwidth() / 2)
      .attr("y", (d) => y(0))
      .merge(et)
      .transition()
      .duration(2500)
      .attr("x", (d) => x(xAccessor(d)) + x.bandwidth() / 2)
      .attr("y", (d) => y(yAccessor(d)))
      .text(yAccessor)

    // Títulos
    titulo.text(`Porcentaje de camas UCI utilizado en ${mestmp.toUpperCase()} del ${yeartmp}`)

    // Ejes
    const xAxis = d3.axisBottom(x)
    const yAxis = d3.axisLeft(y).ticks(8)
    xAxisGroup.transition().duration(2500).call(xAxis)
    yAxisGroup.transition().duration(2500).call(yAxis)
  }

  // Eventos
  cboYear.on("change", (e) => {
    e.preventDefault()
    updateMes();
    render()
  })

  cboMes.on("change", (e) => {
    e.preventDefault()
    render()
  })

  render()
}

start()