const graph = d3.select("#graph");
const metrica = d3.select("#metrica");

const anchoTotal = +graph.style("width").slice(0, -2)
const altoTotal = anchoTotal * 9 /16

//Margenes Barras
const margins = {
    top: 60,
    right: 20,
    bottom: 75,
    left: 100,
}

const ancho = anchoTotal - margins.left - margins.right
const alto = altoTotal - margins.top - margins.bottom

//Elementos Graficos
const svg = graph.append("svg")
    .attr("width", anchoTotal)
    .attr("height", altoTotal)
    .attr("class", "graph")


const layer = svg
    .append("g")
    .attr("transform", `translate(${margins.left},${margins.top})`)

layer.append('rect')
    .attr('height', alto)
    .attr('width', ancho)
    .attr('fill', '#98c1d9')

const g = svg
    .append("g")
    .attr("transform", `translate(${margins.left},${margins.top})`)


let data


//Carga de datos
const draw = async (variable = "clientes") => {
    //Carga de datos
    data = await d3.csv("barras.csv", d3.autoType)

    //console.log(data)
    //console.log(Object.keys(data[0]).slice(1))

    metrica.selectAll("options")
        .data(Object.keys(data[0]).slice(1))
        .enter()
        .append("option")
        .attr("values", d => d)
        .text(d => d)


    //Accesor
    const xAccessor = (d) => d.tienda

    //console.log(data) 
    //console.log(d3.map(data, xAccessor))

    //Escalador
    const y = d3.scaleLinear().range([alto,0])
    const color = d3.scaleOrdinal()
        .domain(Object.keys(data[0]).slice(1))
        .range(d3.schemeDark2 )
        //.range(["#000000", "#219ebc" ,"#0077b6", "#023047"])
        


    const x = d3.scaleBand()
        .range([0, ancho])
        .paddingOuter(0.2)
        .paddingInner(0.1)

    // Ejes
    const xAxisGroup = g.append('g')
        .attr('transform', `translate(0, ${alto})`)
        .classed('axis', true)
    
    const yAxisGroup = g.append('g')
        .classed('axis', true)
    
    //Titulo
    const titulo = 
        g.append('text')
        .attr('x', ancho/2)
        .attr('y',-15)
        .classed('titulo', true)
    
    const etiquetas = g.append('g')

    // Render
    const render = (variable) => {
        //Accesor
        const yAccessor = (d) => d[variable]
        data.sort((a,b) => yAccessor(b) - yAccessor(a))

        //Escalador
        y.domain([0, d3.max(data, yAccessor)])
        x.domain(d3.map(data, xAccessor))

        //Etiquetas
        const etiqueta = etiquetas.selectAll('text').data(data)
        etiqueta.enter()
            .append('text')
            .attr('x', d => x(xAccessor(d)) + x.bandwidth()/3)
            .attr('y', d => y(0))
            .merge(etiqueta)
            .transition()
            .duration(2500)
            .attr('x', d => x(xAccessor(d)) + x.bandwidth()/3)
            .attr('y', d => y(yAccessor(d)))
            .text(yAccessor)

        // Barras
        const rect = g.selectAll('rect').data(data, xAccessor)
            .data(data)

        rect
            .enter()
            .append('rect')
            .attr('x', d => x(xAccessor(d)))
            .attr('y', d => y(0))
            .attr('width', x.bandwidth())
            .attr('height', 0)
            .merge(rect)
            .transition()
            .duration(2500)
            //.ease(d3.easeElasticIn) 
            .attr('x', d => x(xAccessor(d)))
            .attr('y', d => y(yAccessor(d)))
            .attr('width', x.bandwidth())
            .attr('height', d => alto - y(yAccessor(d)))
            .attr('fill', (d) => (xAccessor(d) == "Satelite" ? "#f00" : color(variable)))

        //Titulos
        titulo.text(`${variable} de la Tienda`)

        //Ejes
        const xAxis = d3.axisBottom(x)
        const yAxis = d3.axisLeft(y)
        xAxisGroup.call(xAxis)
        yAxisGroup.call(yAxis)


    }

    //Eventos
    metrica.on("change", (e) => {   
        e.preventDefault()
        //console.log(e.target.value, metrica.node().value)
        render(e.target.value)
    })

    render(variable)


}

draw()