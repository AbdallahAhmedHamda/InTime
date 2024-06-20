import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import InProgressIcon from '../../svg/home/InProgressIcon'
import CompletedIcon from '../../svg/home/CompletedIcon'
import TotalIcon from '../../svg/home/TotalIcon'

const calculatePercentageDifference = (thisMonth, lastMonth) => {
  // handle division by zero
  if (lastMonth === 0) {
    return thisMonth * 100
  } else if (thisMonth === 0) {
    return lastMonth * -100
  }

  return (
    lastMonth === 0 ? thisMonth * 100 :
    thisMonth === 0 ? lastMonth * -100 :
    parseFloat(
      ((thisMonth - lastMonth / lastMonth) * 100)
      .toFixed(2)
    )
  )
}

export default function Progess() {
  const completedTasks = useSelector((state) => state.user.completedTasks)
  const inProgressTasks = useSelector((state) => state.user.inProgressTasks)
  const totalPoints = useSelector((state) => state.user.totalPoints)
  
  const [percentage, setPercentage] = useState({
      points: calculatePercentageDifference(
      totalPoints.thisMonth,
      totalPoints.lastMonth
    )
  })
      
  // update the percentage of user progress whenever the numbers of this or last month changes
  useEffect(() => {
    const updatePercentage = (thisMonth, lastMonth) => {
      setPercentage({
        points:
          lastMonth === 0
            ? thisMonth
            : thisMonth === 0 
              ? lastMonth * -1
              : parseFloat(
                  ((thisMonth - lastMonth) / lastMonth * 100)
                  .toFixed(2)
                )
      })
    }

    updatePercentage(
      totalPoints.thisMonth,
      totalPoints.lastMonth,
    )
  }, [totalPoints])

  const percentageStyles = (percentage) => {
    const style = {
      color: percentage > 0
        ? '#41D23F'
        : percentage < 0
          ? '#BE1622'
          : '#F48C06'
    }
    return style
  }
  
  return (
    <div className='user-progress-container'>
      <div className='user-progress-child'>
        <CompletedIcon />

        <div>
          <p className='progress-title'>Completed Tasks</p>

          <p className='progress-number'>{completedTasks}</p>

          <p className='progress-classification'>Task{completedTasks !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className='user-progress-child'>
        <InProgressIcon />
        
        <div className='progress-text-container'>
          <p className='progress-title'>In Progress</p>

          <p className='progress-number'>{inProgressTasks}</p>

          <p className='progress-classification'>Task{inProgressTasks !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className='user-progress-child total-box'>
        <TotalIcon />
        
        <div className='progress-text-container'>
          <p className='progress-title'>Total Score</p>

          <p className='progress-number'>{totalPoints.overall}</p>

          <p className='progress-classification'>Points</p>
        </div>

        <p className='user-monthly-percentage'>
          <span className='percentage' style={percentageStyles(percentage.points)}>
            {
              percentage.points > 0 && '+'
            }
            {percentage.points}
            %
          </span>
          This Month
        </p>
      </div>
    </div>
  )
}