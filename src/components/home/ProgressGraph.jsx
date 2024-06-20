import { useSelector } from 'react-redux'
import { useState, useEffect, useRef } from 'react'
import {
  select,
  area,
  curveCardinal,
  axisTop,
  axisRight,
  axisLeft,
  scaleLinear
} from 'd3'

export default function ProgressGraph() {
  const points = useSelector((state) => state.user.points)
  
  const [currentGraph, setCurrentGraph] = useState('monthly')
  const svgRef = useRef()

  // create the graph
  useEffect (() => {
    const createGraph = (type) => {
      if (points[type]?.xAxis && points[type]?.points) {
        const svg = select(svgRef.current)
        // we are using on ('end') to ensure that the the code happens after the fade out completes
        svg
          .transition()
          .duration(300)
          .attr('opacity', 0)
          .on('end', () => {
            // resetting the graph
            svg
              .selectAll('*')
              .remove()

            // axis scales
            const xScale = scaleLinear([0, points[type].xAxis.length - 1], [50, 815])
            const yScale = scaleLinear([0, Math.max(...points[type].points)], [190, 30])

            // x-axis
            const xAxis = axisTop(xScale)
              .tickSize(0)
              .tickFormat(d => points[type].xAxis[d])
            svg
              .append('g')
              .attr('class', 'x-axis')
              .call(xAxis)
              .style('transform', 'translateY(220px)')

            // y-axis ticks
            const yAxis = axisRight(yScale)
              .ticks(4)
              .tickSize(0)
            svg
              .append('g')
              .attr('class', 'y-axis-ticks')
              .call(yAxis)

            // y-axis grid
            const yAxisGrid = axisLeft(yScale)
              .ticks(4)
              .tickSize(765)
            svg
              .append('g')
              .attr('class', 'y-axis-grid')
              .call(yAxisGrid)
              .style('transform', 'translateX(815px)')
              .selectAll('.tick')
              .style('font-size', '0px')
              .style('color', '#E7EBEC')

            // remove axis lines
            svg
              .selectAll('.x-axis > path, .y-axis-ticks > path, .y-axis-grid > path')
              .remove()

            // style ticks
            svg
              .selectAll('.x-axis > .tick, .y-axis-ticks > .tick')
              .style('color', '#768396')
              .style('font-family', 'DM Sans')
              .style('font-size', '12px')
              
            // create the gradiant area
            const areaGenerator = area()
              .x((_, i) => xScale(i))
              .y0(190)
              .y1(yScale)
              .curve(curveCardinal)

            // create the gradiant
            const gradient = svg
              .append('defs')
              .append('linearGradient')
              .attr('id', 'gradient')
              .attr('gradientUnits', 'userSpaceOnUse')
              .attr('x1', 387.243).attr('y1', -220.596)
              .attr('x2', 375.011).attr('y2', 226.355)
            gradient.selectAll('stop')
              .data([0, 100])
              .join('stop')
              .attr('offset', d => d)
              .attr('stop-color', '#5051F9')
              .attr('stop-opacity', d => d === 0 ? 0.35 : 0)

            // fill the area with the gradiant
            svg
              .selectAll('.filled-area')
              .data([points[type].points])
              .join('path')
              .attr('d', areaGenerator)
              .attr('fill', 'url(#gradient)')

            // area top stroke
            svg
              .selectAll('.stroke-area')
              .data([points[type].points])
              .join('path')
              .attr('class', 'stroke-area')
              .attr('d', areaGenerator.lineY1())
              .attr('fill', 'none')
              .attr('stroke', '#5468E7')
              .attr('stroke-width', 3)

            // points circles
            svg
              .selectAll('circle')
              .data(points[type].points)
              .join('circle')
              .attr('r', 5)
              .attr('cx', (_, i) => xScale(i))
              .attr('cy', yScale)
              .attr('fill', '#5468E7')
              .attr('stroke', 'white')
              .attr('stroke-width', '2')
              .attr('cursor', 'pointer')
              .on('mouseenter', (e, d) => {
                const i = svg.selectAll('circle').nodes().indexOf(e.target)
                const backgroundSize = calculateBackgroundSize(d)

                // remove tooltip if user is fast enough to go from one circle to another in the transition duration
                svg
                  .select('.tooltip-group')
                  .remove()

                // create tooltip and animate its appearance
                const tooltipGroup = svg
                  .append('g')
                  .attr('class', 'tooltip-group')
                tooltipGroup
                  .selectAll('.tooltip-background')
                  .data([d])
                  .join(enter => enter.append('rect').attr('y', yScale(d) - backgroundSize.height / 2 - 30))
                  .attr('class', 'tooltip-background')
                  .attr('x', xScale(i) - backgroundSize.width / 2)
                  .attr('width', backgroundSize.width)
                  .attr('height', backgroundSize.height)
                  .attr('rx', 5)
                  .attr('ry', 5)
                  .style('fill', '#768396')
                  .transition()
                  .duration(300)
                  .attr('y', d => yScale(d) - backgroundSize.height / 2 - 20)
                  .attr('opacity', 1)
                tooltipGroup
                  .selectAll('.tooltip-text')
                  .data([d])
                  .join(enter => enter.append('text').attr('y', yScale(d) - 25))
                  .text(d)
                  .attr('class', 'tooltip-text no-select')
                  .attr('x', xScale(i))
                  .attr('text-anchor', 'middle')
                  .style('font-size', '12')
                  .style('fill', 'white')
                  .transition()
                  .duration(300)
                  .attr('y', yScale(d) - 15)
                  .attr('opacity', 1)
              })
              .on('mouseleave', (_, d) => {
                const backgroundSize = calculateBackgroundSize(d)

                // animmate background disappearance
                svg
                  .selectAll('.tooltip-background, .tooltip-text')
                  .transition()
                  .duration(300)
                  .attr('y', yScale(d) - backgroundSize.height / 2 - 30)
                  .attr('opacity', 0)
                
                // animmate text disappearance
                svg
                  .select('.tooltip-text')
                  .transition()
                  .duration(300)
                  .attr('y', yScale(d) - 25)
                  .attr('opacity', 0)
                
                // remove tooltip group
                svg
                  .select('.tooltip-group')
                  .transition()
                  .duration(300)
                  .remove()
              })
              
            // fade in
            svg
              .transition()
              .duration(300)
              .attr('opacity', 1)
          })

        const calculateBackgroundSize = (text) => {
          const dummyText = svg.append('text').text(text)
          const textWidth = dummyText.node().getBBox().width
          const textHeight = dummyText.node().getBBox().height
          dummyText.remove()

          return {
            width: textWidth + 5,
            height: textHeight
          }
        }
      }
    }
    
    createGraph(currentGraph)
  }, [points, currentGraph])

  return (
    <div className='progress-graph-container'>
      <div className='graph-text-container'>
        <p>Points</p>
        
        <div className='visualization-choice'>
          <button>
            <span
              className={currentGraph === 'daily' ? 'show-line' : ''}
              style={{color: currentGraph === 'daily' ? '#5468E7' : ''}}
              onClick={() => setCurrentGraph('daily')}>
                Daily
            </span>
          </button>

          <button>
            <span
              className={currentGraph === 'monthly' ? 'show-line' : ''}
              style={{color: currentGraph === 'monthly' ? '#5468E7' : ''}}
              onClick={() => setCurrentGraph('monthly')}>
                Monthly
            </span>
          </button>

          <button>
            <span
              className={currentGraph === 'yearly' ? 'show-line' : ''}
              style={{color: currentGraph === 'yearly' ? '#5468E7' : ''}}
              onClick={() => setCurrentGraph('yearly')}>
                Yearly
            </span>
          </button>
        </div>
      </div>

      <svg className='graph' ref={svgRef} />
    </div>
  )
}