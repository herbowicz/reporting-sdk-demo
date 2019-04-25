$(document).ready(function() {
  var w = 960;
  var h = 410;

  let populationDraw = [],
    gdpDraw = [],
    capitaDraw = [];

  var projection = d3.geo.equirectangular(); // albers, stereographic, orthographic, mercator, azimuthalEquidistant

  var path = d3.geo.path().projection(projection);

  var svg = d3
    .select(".main")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  svg
    .append("rect")
    .attr("width", w)
    .attr("height", h)
    .attr("fill", "white");

  var g = svg.append("g");

  d3.json("https://d3js.org/world-50m.v1.json", function(error, data) {
    if (error) console.error(error);
    g.append("path")
      .datum(topojson.feature(data, data.objects.countries))
      .attr("d", path);

    //create the zoom effect
    var zoom = d3.behavior.zoom().on("zoom", function() {
      g.attr(
        "transform",
        "translate(" +
          d3.event.translate.join(",") +
          ")scale(" +
          d3.event.scale +
          ")"
      );
      g.selectAll("path").attr("d", path.projection(projection));
    });
    svg.call(zoom);

    // Load the data from the json file
    d3.json("./dataByContinents.json", function(error, data) {
      if (error) console.error(error);

      var features = data.features;
      console.log("dashboard data", features);

      var hue = Math.floor(Math.random() * 360);
      features.map(function(d) {
        hue += 30;
        d.color = "hsla(" + hue + ", 50%, 50%, .75)";
        d.colorFull = "hsla(" + hue + ", 50%, 50%, 1)";
      });

      // CHARTS
      var svg = d3
        .select("article")
        .append("svg")
        .attr("width", 1000)
        .attr("height", 300);
      svg.append("g").attr("id", "populationDonut");
      svg.append("g").attr("id", "gdpDonut");
      svg.append("g").attr("id", "capitaDonut");

      features.map(el => {
        populationDraw.push({
          value: el.properties.population,
          color: el.color
        });
        gdpDraw.push({
          value: el.properties.GDP,
          color: el.color
        });
        capitaDraw.push({
          value: el.properties.GDP / el.properties.population,
          color: el.color
        });
      });

      let cont = features.map(el => el.properties.name);
      let pop = populationDraw.map(({ value }) => value);
      let gdp = gdpDraw.map(({ value }) => value);
      console.log("cont", cont, "pop", pop, "gdp", gdp);
      console.log("max pop", d3.max(pop), "max gdp", d3.max(gdp));

      Donut3D.draw(
        "populationDonut",
        populationDraw,
        150,
        150,
        130,
        100,
        30,
        0.4
      );
      Donut3D.draw("gdpDonut", gdpDraw, 500, 150, 130, 100, 30, 0.3);
      Donut3D.draw("capitaDonut", capitaDraw, 850, 150, 130, 100, 30, 0);

      // LEGEND
      let popSum = 0;

      features.map(el => {
        $(".legend").append(
          `<span>${
            el.properties.name
          }:</span> ${el.properties.population.toLocaleString()}<br>`
        );
        popSum += el.properties.population;
      });
      $(".legend").append(`<span>Total:</span> ${popSum.toLocaleString()}`);

      //BARS
      var svgWidth = 200;
      var svgHeight = 100;
      var barWidth = svgWidth / pop.length;

      var yScale = d3
        .scaleLinear()
        .domain([0, d3.max(pop)])
        .range([0, svgHeight]);

      var y_axis = d3.axisRight().scale(yScale);

      d3.select(".bars")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("fill", "darkslategrey")
        .selectAll("rect")
        .data(pop)
        .enter()
        .append("rect")
        .attr("height", function(d) {
          return yScale(d);
        })
        .attr("width", barWidth - 1)
        .attr("transform", function(d, i) {
          let trans = [i * barWidth, svgHeight - yScale(d)];
          return "translate(" + trans + ")";
        });

      // MAP
      g.selectAll("circle")
        .data(features)
        .enter()
        .append("circle") //show the circles
        .attr("cx", function(d) {
          if (d.geometry) {
            return projection([
              d.geometry.coordinates[0],
              d.geometry.coordinates[1]
            ])[0];
          }
        })
        .attr("cy", function(d) {
          if (d.geometry) {
            return projection([
              d.geometry.coordinates[0],
              d.geometry.coordinates[1]
            ])[1];
          }
        })
        .attr("r", function(d) {
          if (d.properties.population) {
            // because population area = PI times the Radius (r) squred
            return Math.sqrt(d.properties.population / 400000 / Math.PI);
          }
        })
        .style("fill", function(d) {
          //Use the Color Function to set the Fill Value for each circle
          return d.color;
        })

        //Add Event Listeners | mouseover
        .on("mouseover", function(d) {
          let lat =
            d.geometry.coordinates[0] < 0
              ? "°0'0\"W"
              : d.geometry.coordinates[0] > 0
              ? "°0'0\"E"
              : "°0'0\"";
          let long =
            d.geometry.coordinates[1] < 0
              ? "°0'0\"S"
              : d.geometry.coordinates[1] > 0
              ? "°0'0\"N"
              : "°0'0\"";

          d3.select(this).style("fill", d.colorFull);
          d3.select(this).style("cursor", "pointer");

          d3.select("#total-population").text(
            d.properties.population.toLocaleString()
          );

          d3.select("#name").text(d.properties.name);
          d3.select("#population").text(
            d.properties.population.toLocaleString()
          );
          d3.select("#GDP").text((d.properties.GDP * 1000000).toLocaleString());
          d3.select("#GDP-per-capita").text(
            (
              (1000000 * d.properties.GDP) /
              d.properties.population
            ).toLocaleString("en-US", {
              maximumFractionDigits: 2
            })
          );
          d3.select("#reclat").text(Math.abs(d.geometry.coordinates[0]) + lat);
          d3.select("#reclong").text(
            Math.abs(d.geometry.coordinates[1]) + long
          );
          d3.select("#tooltip")
            .style("left", d3.event.pageX + 20 + "px")
            .style("top", d3.event.pageY - 80 + "px")
            .style("display", "block")
            .style("opacity", 0.8);
        })
        //Add Event Listeners | mouseout
        .on("mouseout", function(d) {
          d3.select(this).style("fill", d.color);
          d3.select("#tip").style("display", "none");
        });
    });
  });
});
