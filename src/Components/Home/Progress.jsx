import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import CompletedIcon from '../../SVG/Home/CompletedIcon'
import InProgressIcon from '../../SVG/Home/InProgressIcon'
import TotalIcon from '../../SVG/Home/TotalIcon'

const calculatePercentageDifference = (thisMonth, lastMonth) => {
  if (lastMonth === 0) {
    // Handle division by zero
    return 0
  }

  return parseFloat(((thisMonth / lastMonth) * 100 - 100).toFixed(2))
}

export default function Progess() {
  const tasks = useSelector((state) => state.user.tasks)
  const totalPoints = useSelector((state) => state.user.totalPoints)
  
  const [percentages, setPercentages] = useState({
    completed: calculatePercentageDifference(
      tasks.completed.thisMonth,
      tasks.completed.lastMonth
    ),
    inProgress: calculatePercentageDifference(
      tasks.inProgress.thisMonth,
      tasks.inProgress.lastMonth
    ),
    points: calculatePercentageDifference(
      totalPoints.thisMonth,
      totalPoints.lastMonth
    ),
  })
      
  // update the percentages of user progress whenever the numbers of this or last month changes
  useEffect(() => {
    const updatePercentage = (thisMonth, lastMonth,  percentageName) => {
      setPercentages(prevState => ({
        ...prevState,
        [percentageName]: parseFloat((thisMonth / lastMonth * 100 - 100).toFixed(2))
      }))
    }

    updatePercentage(tasks.completed.thisMonth, tasks.completed.lastMonth, 'completed')

    updatePercentage(tasks.inProgress.thisMonth, tasks.inProgress.lastMonth, 'inProgress')

    updatePercentage(totalPoints.thisMonth, totalPoints.lastMonth, 'points')
  }, [tasks, totalPoints])

  const percentageStyles = (percentage) => {
    const style = {
      color: percentage > 0 ? '#41D23F' : percentage < 0 ? '#BE1622' : '#F48C06'
    }
    return style
  }
  
  return (
    <div className='user-progress-container'>
      <div className='user-progress-child'>
        <CompletedIcon />

        <div>
          <p className='progress-title'>Completed Tasks</p>

          <p className='progress-number'>{tasks.completed.overall}</p>

          <p className='progress-classification'>Tasks</p>
        </div>

        <p className='user-monthly-percentage'>
          <span className='percentage' style={percentageStyles(percentages.completed)}>
            {(percentages.completed > 0) && '+'}
            {percentages.completed}%
          </span>

          This Month
        </p>
      </div>

      <div className='user-progress-child'>
        <InProgressIcon />
        
        <div className='progress-text-container'>
          <p className='progress-title'>In Progress</p>

          <p className='progress-number'>{tasks.inProgress.overall}</p>

          <p className='progress-classification'>Tasks</p>
        </div>

        <p className='user-monthly-percentage'>
          <span className='percentage' style={percentageStyles(percentages.inProgress)}>
            {(percentages.inProgress > 0) && '+'}
            {percentages.inProgress}%
          </span>

          This Month
        </p>
      </div>

      <div className='user-progress-child total-box'>
        <TotalIcon />
        
        <div className='progress-text-container'>
          <p className='progress-title'>Total Score</p>

          <p className='progress-number'>{totalPoints.overall}</p>

          <p className='progress-classification'>Points</p>
        </div>

        <p className='user-monthly-percentage'>
          <span className='percentage' style={percentageStyles(percentages.points)}>
            {(percentages.points > 0) && '+'}
            {percentages.points}%
          </span>
          
          This Month
        </p>
      </div>
    </div>
  )
}