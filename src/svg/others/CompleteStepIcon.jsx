import { useState } from 'react'

export default function CompleteStepIcon({ toggleStep, isCompleted }) {
  const [isHovered, setIsHovered] = useState(false)

  const handleSvgClick = () => {
    toggleStep()

    setIsHovered(false)
  }

  const fill =
    isCompleted
      ? '#00FF29'
      : isHovered
        ? '#00FF29'
        : 'rgba(18, 18, 18, 0.65)'

  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' onClick={handleSvgClick} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className='complete-step'
    >
    <path d='M15.264 8.148L10.116 13.308L8.136 11.328C8.02843 11.2024 7.89604 11.1004 7.74717 11.0283C7.59829 10.9563 7.43613 10.9158 7.27087 10.9094C7.1056 10.9031 6.94081 10.9309 6.78682 10.9912C6.63282 11.0516 6.49297 11.1431 6.37602 11.26C6.25908 11.377 6.16757 11.5168 6.10724 11.6708C6.04691 11.8248 6.01906 11.9896 6.02544 12.1549C6.03183 12.3201 6.07231 12.4823 6.14433 12.6312C6.21636 12.78 6.31839 12.9124 6.444 13.02L9.264 15.852C9.37613 15.9632 9.50911 16.0512 9.65531 16.1109C9.80152 16.1706 9.95808 16.2009 10.116 16.2C10.4308 16.1987 10.7325 16.0737 10.956 15.852L16.956 9.852C17.0685 9.74044 17.1577 9.60772 17.2187 9.46149C17.2796 9.31526 17.311 9.15841 17.311 9C17.311 8.84158 17.2796 8.68474 17.2187 8.53851C17.1577 8.39227 17.0685 8.25955 16.956 8.148C16.7312 7.9245 16.427 7.79905 16.11 7.79905C15.793 7.79905 15.4888 7.9245 15.264 8.148ZM12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21508 0.913451 7.4078C0.0051994 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.807 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0865C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6934 24 14.3734 24 12C24 10.4241 23.6896 8.8637 23.0866 7.4078C22.4835 5.95189 21.5996 4.62902 20.4853 3.51472C19.371 2.40042 18.0481 1.5165 16.5922 0.913445C15.1363 0.310389 13.5759 0 12 0ZM12 21.6C10.1013 21.6 8.24524 21.037 6.66653 19.9821C5.08782 18.9272 3.85736 17.4279 3.13076 15.6738C2.40416 13.9196 2.21405 11.9893 2.58447 10.1271C2.95488 8.26491 3.86919 6.55436 5.21178 5.21177C6.55436 3.86919 8.26492 2.95488 10.1271 2.58446C11.9894 2.21404 13.9196 2.40415 15.6738 3.13076C17.4279 3.85736 18.9272 5.08781 19.9821 6.66652C21.037 8.24524 21.6 10.1013 21.6 12C21.6 14.5461 20.5886 16.9879 18.7882 18.7882C16.9879 20.5886 14.5461 21.6 12 21.6Z' fill={fill} fillOpacity='0.6'/>
    </svg>
  )
}