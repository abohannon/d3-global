/* global d3:true */
/* eslint no-undef: "error" */
const MAP_DATA = 'https://d3js.org/world-50m.v1.json'
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
    const topology = data[0]
    const features = data[1]

    console.log(topology)
    console.log(features)

    // chart dimensions
    const width = '100%'
    const height = 900
    const padding = 24

    // create svg canvas

    const svg = d3.select('svg')
      .attr('width', width)
      .attr('height', height)
      .style('padding', padding)
      .style('background-color', 'lightgrey')
  }
  // initialize the chart by executing fetch
  initialize () {
    this.getData()
  }
}

const chart = new Chart()
chart.initialize()
