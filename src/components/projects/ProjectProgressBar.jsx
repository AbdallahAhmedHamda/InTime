import { useState, useEffect, useRef } from 'react'
import { useTransition, animated } from 'react-spring'
import { select } from 'd3'

export default function ProjectProgressBar({ totalPoints }) {
  const [tooltipVisible, setTooltipVisible] = useState(false)

  const svgRef = useRef()
  const firstRender = useRef(true)
  const oldPercentage = useRef(null)

  // create and update the progress bar
  useEffect(() => {
    const projectPercentage = (100 - totalPoints) * 3.52 + 352
    const svg = select(svgRef.current)

    // resetting the bar
    svg
      .selectAll('*')
      .remove()
      
    // creating the default bar and adding tootltip to it
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

    // creating the user bar and adding tootltip to it
    const userProgressBar = svg
      .append('circle')
      .attr('class', 'user-progress-bar')
      .attr('cx', 123)
      .attr('cy', 123)
      .attr('r', 112)
      .attr('stroke-linecap', 'round')
      .attr('stroke', '#5468E7')
      .attr('stroke-dashoffset', firstRender.current ? '704' : oldPercentage.current)
      .on('mouseenter', () => setTooltipVisible(true))
      .on('mouseleave', () => setTooltipVisible(false))

    // animating the proggression
    userProgressBar
      .transition()
      .duration(500)
      .attr('stroke-dashoffset', projectPercentage)

    // ensuring that first rendered finished and setting old percentage for the next update
    firstRender.current = false
    oldPercentage.current = projectPercentage
  }, [totalPoints])

  const tooltipTransition = useTransition(tooltipVisible, {
    from: { opacity: 0, top: -30, pointerEvents: 'none' },
    enter: { opacity: 1, top: -35, pointerEvents: 'auto' },
    leave: { opacity: 0, top: -30, pointerEvents: 'none' },
    config: { duration: 300 }
  })

  return (
    <div className='progress-bar-container'>
      <svg className='default-progress-bar' width='246px' height='246px' ref={svgRef} />

      {
        tooltipTransition((style, item) => item && (
          <animated.div className='tooltip' style={style}>
            <div className='tooltip-text no-select'>{parseFloat(totalPoints.toFixed(2))}%</div>

            <div className='tooltip-arrow'/>
          </animated.div>
        ))
      }

      <p className='progress-bar-level'>Progress</p>
    </div>
  )
}