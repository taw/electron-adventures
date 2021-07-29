function displayFreeDiskSpace(data) {
  let info = d3.select("#info")

  for (let row of data) {
    let total = parseInt(row[1])
    let used = parseInt(row[2])
    let free = total - used
    let path = row[5]

    let data = { free, used }

    let div = info.append("div")
    div.append("h3").text(path)

    let svg = div
      .append("svg")
      .attr("width", "100px")
      .attr("height", "100px")
    let g = svg
      .append("g")
      .attr("transform", "translate(50,50)")

    let pie = d3.pie().value(d => d[1])
    let pieData = pie(Object.entries(data))
    let color = d3
      .scaleOrdinal()
      .domain(["used", "free"])
      .range(["red", "green"])

    g
      .selectAll("path")
      .data(pieData)
      .enter()
      .append("path")
      .attr("d", d3.arc()
        .innerRadius(0)
        .outerRadius(45)
      )
      .attr("fill", d => color(d.data[0]))
      .attr("stroke", "black")
      .style("stroke-width", "2px")
      .style("opacity", 0.7)
  }
}
