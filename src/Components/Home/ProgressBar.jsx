import { useState, useEffect, useRef } from 'react'
import { select } from 'd3'

export default function ProgressBar() {
  const svgRef = useRef()
  const firstRender = useRef(true)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [totalPoints, setTotalPoints] = useState(455)
  const [levelInfo, setLevelInfo] = useState(((100 - (totalPoints % 100))/100) * (352) + 352)

  useEffect (() => {
    setLevelInfo(((100 - (totalPoints % 100))/100) * (352) + 352)
  }, [totalPoints])

  useEffect(() => {
    const svg = select(svgRef.current)
    svg
    .selectAll('*')
    .remove()
    svg
      .append('circle')
      .attr('cx', 123)
      .attr('cy', 123)
      .attr('r', 112)
      .attr('stroke-linecap', 'round')
      .attr('stroke', '#D9D9D9')
      .attr('stroke-dashoffset', 352)
      .on('mouseenter', () => setTooltipVisible(true))
      .on('mouseleave', () => setTooltipVisible(false))

    const userProgressBar = svg
      .append('circle')
      .attr('class', 'user-progress-bar')
      .attr('cx', 123)
      .attr('cy', 123)
      .attr('r', 112)
      .attr('stroke-linecap', 'round')
      .attr('stroke', '#5468E7')
      .attr('stroke-dashoffset', firstRender.current ? '704' : '352')
      .on('mouseenter', () => setTooltipVisible(true))
      .on('mouseleave', () => setTooltipVisible(false))
    userProgressBar
      .transition()
      .duration(500)
      .attr('stroke-dashoffset', levelInfo)
    firstRender.current = false
  }, [levelInfo])

  const tooltipStyles = {
    pointerEvents: tooltipVisible ? 'auto' : 'none',
    visibility: tooltipVisible ? 'visible' : 'hidden',
    opacity: tooltipVisible ? 1 : 0,
    top: tooltipVisible? -35 : -30,
    transition: 'opacity 0.3s ease, visibility 0.3s ease, top 0.3s ease'
  }

  return (
    <div className="progress-bar-container">
      <svg className='default-progress-bar' width="246px" height="246px" ref={svgRef} />
      
      <div className="tooltip" style={tooltipStyles}>
        <div className="tooltip-text no-select">{totalPoints % 100}%</div>

        <div className="tooltip-arrow"/>
      </div>

      <p className="progress-bar-level">Level 3</p>

      <p className="progress-bar-text start">0</p>
      
      <p className="progress-bar-text end">100</p>
      <button onClick={() => setTotalPoints(prevState => prevState + 70)}></button>
    </div>
  )
}