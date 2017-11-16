/* global d3:true */
/* eslint no-undef: "error" */
const MAP_DATA = 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json'
const METEORITE_DATA = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json'

class Chart {
  constructor () {
    this.getData = this.getData.bind(this)
    this.renderData = this.renderData.bind(this)
  }

  // fetch the map data
  getData () {
    const mapData = fetch(MAP_DATA)
      .then((response) => {
        if (response.status !== 200) {
          console.log('There was an error with map fetch response.', response.status)
        } else {
          return response.json()
        }
      })

    // fetch the meteorite data
    const meteoriteData = fetch(METEORITE_DATA)
      .then((response) => {
        if (response.status !== 200) {
          console.log('There was a response error.', response.status)
        } else {
          return response.json()
        }
      })

    // once both fetch promises are resolved, combine data into single object and pass to renderData
    Promise.all([mapData, meteoriteData])
      .then((data) => this.renderData(data))
  }

  // render the data
  renderData (data) {
    const map = data[0]
    const meteor = data[1]

    console.log('map', map)
    console.log('features', meteor)

    // chart dimensions
    const width = window.innerWidth - 10
    const height = window.innerHeight - 10

    // create svg canvas
    const svg = d3.select('svg')
      .attr('width', width)
      .attr('height', height)
      .call(d3.zoom().on('zoom', () => {
        svg.attr('transform', d3.event.transform)
      }))
      .append('g')

    // tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')

    // map title
    svg.append('text')
      .attr('class', 'map-title')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', 0)
      .text(`Map of Global Meteorite Landings, By Mass`)

    // create projection and path
    const projection = d3.geoMercator()
      .scale(200)
      .translate([width / 2, height / 2 + 50])

    const path = d3.geoPath()
      .projection(projection)

    const land = svg.selectAll('path')
      .data(map.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', (d) => '#fff')

    const massMax = d3.max(meteor.features, d => parseFloat(d.properties.mass))
    const massMin = d3.min(meteor.features, d => parseFloat(d.properties.mass))

    const meteorScale = d3.scaleSqrt()
      .domain([massMin, massMax])
      .range([1, 30])

    function handleClick () {
      console.log(this)
      d3.select(this)
        .attr('class', 'hidden')
    }

    const meteors = svg.selectAll('circle')
      .data(meteor.features)
      .enter()
      .append('circle')
      .attr('class', 'circle')
      .attr('fill', 'rgba(32, 25, 143, 0.8)')
      .attr('stroke', '#000')
      .attr('stroke-width', '0.3')
      .attr('cx', (d) => projection([d.properties.reclong, d.properties.reclat])[0])
      .attr('cy', (d) => projection([d.properties.reclong, d.properties.reclat])[1])
      .attr('r', (d) => meteorScale(d.properties.mass))
      .on('click', handleClick)
      .on('mouseover', (d, i) => {
        tooltip
          .transition()
          .style('opacity', 1)
        tooltip
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY) + 'px')
          .html(`
            <p><b>Name: </b>${d.properties.name}</p>
            <p><b>Mass: </b>${(d.properties.mass * 0.00220462).toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} lbs</p>
            <p><b>Year: </b>${d.properties.year.split('-').splice(0, 1)}</p>
            `)
      })
      .on('mouseout', () => {
        tooltip
          .transition()
          .style('opacity', 0)
      })
  }
  // initialize the chart by executing fetch
  initialize () {
    this.getData()
  }
}

const chart = new Chart()
chart.initialize()
