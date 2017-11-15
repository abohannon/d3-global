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
    console.log(meteor.features[0].properties)

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

    const projection = d3.geoMercator()
      .scale(200)
      .translate([width / 2, height / 2])

    const path = d3.geoPath()
      .projection(projection)

    const land = svg.selectAll('path')
      .data(map.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', (d) => 'rgb(155, 249, 136)')

    const meteors = svg.selectAll('circle')
      .data(meteor.features)
      .enter()
      .append('circle')
      .attr('fill', 'blue')
      .attr('cx', (d) => projection([d.properties.reclong, d.properties.reclat])[0])
      .attr('cy', (d) => projection([d.properties.reclong, d.properties.reclat])[1])
      .attr('r', (d) => d.properties.mass / 100000)
  }
  // initialize the chart by executing fetch
  initialize () {
    this.getData()
  }
}

const chart = new Chart()
chart.initialize()
