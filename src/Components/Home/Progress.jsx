import { useState, useEffect } from 'react'
import CompletedIcon from '../../SVG/Home/CompletedIcon'
import InProgressIcon from '../../SVG/Home/InProgressIcon'
import TotalIcon from '../../SVG/Home/TotalIcon'

export default function Progess() {
  const [userProgress, setUserProgress] = useState(
    {
      completed:
        {
          overall: 27,
          thisMonth: 20,
          lastMonth: 16
        },
      inProgress:
        {
          overall: 8,
          thisMonth: 7,
          lastMonth: 7
        },
      points:
        {
          overall: 270,
          thisMonth: 27,
          lastMonth: 30
        }
    }
  )
  const [percentages, setPercentages] = useState(
    {
      completed: parseFloat((userProgress.completed.thisMonth / userProgress.completed.lastMonth * 100 - 100).toFixed(2)),
      inProgress: parseFloat((userProgress.inProgress.thisMonth / userProgress.inProgress.lastMonth * 100 - 100).toFixed(2)),
      points: parseFloat((userProgress.points.thisMonth / userProgress.points.lastMonth * 100 - 100).toFixed(2))
    }
  )
      
  // update the percentages of user progress whenever the numbers of this or last month changes
  useEffect(() => {
    const updatePercentage = (thisMonth, lastMonth,  percentageName) => {
      setPercentages(prevState => ({
        ...prevState,
        [percentageName]: parseFloat((thisMonth / lastMonth * 100 - 100).toFixed(2))
      }))
    }

    updatePercentage(userProgress.completed.thisMonth, userProgress.completed.lastMonth, 'completed')

    updatePercentage(userProgress.inProgress.thisMonth, userProgress.inProgress.lastMonth, 'inProgress')

    updatePercentage(userProgress.points.thisMonth, userProgress.points.lastMonth, 'points')
  }, [userProgress])

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

          <p className='progress-number'>{userProgress.completed.overall}</p>

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

          <p className='progress-number'>{userProgress.inProgress.overall}</p>

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

          <p className='progress-number'>{userProgress.points.overall}</p>

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