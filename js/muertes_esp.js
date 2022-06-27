//D3 Selects
const grafica_muertes = d3.select("#grafica_muertes")

//const anchoTotal = +grafica_muertes.style("width").slice(0, -2)
const anchoTotal = 1116
const altoTotal = anchoTotal * 9 /16

//Margenes canvas
const margins = {
    top: 60,
    right: 20,
    bottom: 75,
    left: 100,
}

const ancho = anchoTotal - margins.left - margins.right
const alto = altoTotal - margins.top - margins.bottom

// Parser para columna Tiempo
const parseTime = d3.timeParse("%d-%b-%y")

//Escalador o Escalares
const x = d3.scaleTime().range([0, ancho])
const y = d3.scaleLinear().range([alto, 0])

// Lineas
const muertesTotales = d3.line()
    .x( (d) => x(d.Semana))
    .y( (d) => y(d.Muertes_Semanales_Todas_Causas))

const muertesCovid = d3.line()
    .x((d) => x(d.Semana))
    .y((d) => y(d.Muertes_Semanales_Covid))


// Elementos graficos
const svg = grafica_muertes.append("svg")
    .attr("width", anchoTotal)
    .attr("height", altoTotal)

const layer = svg
  .append("g")
    .attr("transform", `translate(${margins.left},${margins.top})`)

const g = svg
    .append("g")
    .attr("transform", `translate(${margins.left},${margins.top})`)

//Titulo
const titulo = 
    g.append('text')
    .attr('x', ancho/2)
    .attr('y',-15)
    .classed('titulo', true)

// Carga de datos

d3.csv("data/muertes_semanales_otras_causas_vs_covid.csv")
    .then( data => {

  // Formate de datos
  data.forEach((d) => {
      d.Semana = parseTime(d.Semana)
      d.Muertes_Semanales_Todas_Causas = +d.Muertes_Semanales_Todas_Causas
      d.Muertes_Semanales_Covid = +d.Muertes_Semanales_Covid
  })

  //Escalador de colores
  const color = d3.scaleOrdinal()
    .domain(Object.keys(data[0]).slice(3))
    .range(["blue","red"])


  // Escaladores
  x.domain(d3.extent(data, (d) => d.Semana))
  y.domain([0, d3.max(data, (d) => Math.max(d.Muertes_Semanales_Todas_Causas, d.Muertes_Semanales_Covid))])

  // Agregar Lineas
  layer.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", muertesTotales)

  layer.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "red")
      .attr("d", muertesCovid)

  //Titulos
  titulo.text("Muertes totales en España")

  //Etiquetas
  const xLabel = g.append("text")
    .attr("class", "x axisLabel")
    .attr("y", alto + 50)
    .attr("x", ancho / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Tiempo en Semanas (Enero 2021 a Junio 2022)")
  const yLabel = g.append("text")
    .attr("class", "y axisLabel")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", -170)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Total de Muertes")


  //Leyendas de colores
  const causas = ["Todos los casos (Muertes)", "Muertes por COVID"]
  const legend = g.append("g")
	.attr("transform", `translate(${ancho - 10}, ${alto - 480})`)

  causas.forEach((causa, i) => {
        const legendRow = legend.append("g")
            .attr("transform", `translate(0, ${i * 20})`)
    
        legendRow.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", color(causa))
    
        legendRow.append("text")
        .attr("x", -10)
        .attr("y", 10)
        .attr("text-anchor", "end")
        .style("text-transform", "capitalize")
        .text(causa)
    })

  // Ejes
  layer.append("g")
      .attr("transform", "translate(0," + alto + ")")
      .call(d3.axisBottom(x))

  layer.append("g")
      .call(d3.axisLeft(y))
    
})