// CARGA DE ARCHIVOS
Promise.all([d3.json("../data/spain.json"), d3.json("../data/data.json")]).then((resolve) => {
    createMap1(resolve[0],resolve[1]);
  });
  
  // FUNCIÓN PARA CREAR EL MAPA
  function createMap1(comunidades,data_vacunados) {
  
    // EFECTO DE RATON
    var hover = function (d) {
      console.log("d", d, "event", event);
      var div = document.getElementById("tooltip");
      var contenido =
        '<div class="card" style="width: 100%; height: 100%;"><h4 class="card-header text-center" id="titulo">' +
        d.target.__data__.properties.NAME_1 +
        '</h4><div class="card-body"><h5 class="card-title text-center" id="dato">Vacunaciones: <strong>' +
        d.target.__data__.properties.CANTIDAD +
        "</strong></h5></div></div>";
      div.style.left = event.pageX + "px";
      div.style.top = event.pageY + "px";
      div.innerHTML = contenido; //d.target.__data__.properties.NAME_1
    };
  
    // MEDIDAS Y VARIABLES
    var height = 500;
    var width = 860;
    var projection = d3.geoMercator();
    var map = void 0;
    var spain = void 0;
  
    // PATH
    var path = d3.geoPath().projection(projection);
  
    // CREAR SVG DENTRO DEL DIV
    var svg = d3
      .select("#map")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
    // MAPEO DE DATOS
    var states = topojson.feature(comunidades, comunidades.objects.ESP_adm1);
  
    // MEDIDAS Y PROYECCIÓN
    var b, s, t;
    projection.scale(1).translate([0, 0]);
    var b = path.bounds(states);
    var s =
      0.9 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
    var t = [
      (width - s * (b[1][0] + b[0][0])) / 2,
      (height - s * (b[1][1] + b[0][1])) / 2,
    ];
    projection.scale(s).translate(t);
  
    // DATA
    const poblacion = data_vacunados;
  
    // AÑADIR DATOS DE POBLACIÓN VACUNADA
    const realFeactureSize = d3.extent(poblacion, function (d) {
      return +d.cantidad;
    });
  
    // ESCALA DE COLORES
    const newFeactureColor = d3
      .scaleQuantize()
      .domain(realFeactureSize)
      .range(colorbrewer.BuPu[7]);
  
    // GRAFICADO DEL MAPA
    map = svg.append("g");
    spain = map.selectAll("path").data(states.features);
    spain
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", (d) => {
        // COLOREADORO POR CANTIDAD
        let poblacionEntrada;
        poblacion.forEach(function (e) {
          if (e.comunidad === d.properties.NAME_1) {
            poblacionEntrada = e.cantidad;
          }
        });
        return newFeactureColor(poblacionEntrada);
      })
      .style("stroke", (d) => d3.rgb(newFeactureColor(d3.geoArea(d))).darker())
      .on("mouseover", hover);
    spain.exit().remove();
    
  }  