import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState, useRef, useEffect } from 'react'
import numeral from 'numeral'
import ShowMoreArrow from'../../svg/others/ShowMoreArrow'
import ShowLessArrow from'../../svg/others/ShowLessArrow'

export default function Leaderboard() {
  const ranks = useSelector((state) => state.navigation.allRanks)

  const [dataArraySlice, setDataArraySlice] = useState(5)

  const [rankWidth, setRankWidth] = useState('auto')
  const [nameWidth, setNameWidth] = useState('auto')
  const [tasksWidth, setTasksWidth] = useState('auto')
  const [pointsWidth, setPointsWidth] = useState('auto')
  const [showMoreHovered, setShowMoreHovered] = useState(false)
  const [showLessHovered, setShowLessHovered] = useState(false)

  const leaderboardRefs = useRef({
    ranks: [],
    names: [],
    tasks: [],
    points: [],
  })
  
  const data = ranks.map((user, i) => ({
    id: user._id,
    rank: i + 1,
    ProfilePic: `https://intime-9hga.onrender.com/api/v1/images/${user.avatar}`,
    name: user.name,
    completedTasks: user.tasks.completedTasks,
    points: user.points.totalPoints
  }))
    
  // calculate each leaderboard column width
  useEffect(() => {
    document.fonts.ready.then(() => {
      const filteredRankArray = leaderboardRefs.current.ranks.filter((rank) => rank !== null)
      const rankWidthsArray = filteredRankArray.map(ref => ref.clientWidth)
      setRankWidth(Math.max(...rankWidthsArray))

      const filteredNameArray = leaderboardRefs.current.names.filter((name) => name !== null)
      const nameWidthsArray = filteredNameArray.map(ref => ref.clientWidth)
      setNameWidth(Math.max(...nameWidthsArray))

      const filteredTasksArray = leaderboardRefs.current.tasks.filter((tasks) => tasks !== null)
      const tasksWidthsArray = filteredTasksArray.map(ref => ref.clientWidth)
      setTasksWidth(Math.max(...tasksWidthsArray))

      const filteredPointsArray = leaderboardRefs.current.points.filter((points) => points !== null)
      const pointsWidthsArray = filteredPointsArray.map(ref => ref.clientWidth)
      setPointsWidth(Math.max(...pointsWidthsArray))
    })
  }, [dataArraySlice])

  // set data to the number that the array holds if its less than 5
  useEffect(() => {
    if (dataArraySlice < 5) {
      setDataArraySlice()
    }
  }, [dataArraySlice, data.length])

  // reset widths and add values when user show more ranks
  const showMore = () => {
    const dataToShow =
    (dataArraySlice % 5 === 0 && data.length - dataArraySlice >= 5)
      ? dataArraySlice + 5
      : dataArraySlice + (data.length % 5)

    setDataArraySlice(dataToShow)
    setRankWidth('auto')
    setNameWidth('auto')
    setTasksWidth('auto')
    setPointsWidth('auto')
    
    setShowMoreHovered(false)
  }

  const showLess = () => {
    const dataToShow =
      dataArraySlice % 5 === 0
        ? dataArraySlice - 5
        : dataArraySlice - (data.length % 5)

    setDataArraySlice(dataToShow)
    setRankWidth('auto')
    setNameWidth('auto')
    setTasksWidth('auto')
    setPointsWidth('auto')

    leaderboardRefs.current.ranks = leaderboardRefs.current.ranks.slice(0, dataToShow)
    leaderboardRefs.current.names = leaderboardRefs.current.names.slice(0, dataToShow)
    leaderboardRefs.current.tasks = leaderboardRefs.current.tasks.slice(0, dataToShow)
    leaderboardRefs.current.points = leaderboardRefs.current.points.slice(0, dataToShow)

    setShowLessHovered(false)
  }

  return (
    <div className='leaderboard-container'>
      <p>Leaderboard</p>

      <div className='leaderboard'>
        {
          data.slice(0, dataArraySlice).map((user, i) => (
            <div className='leaderboard-row' key={i}>
              <p 
                className='leaderboard-rank' 
                ref={el => (leaderboardRefs.current.ranks[i] = el)} style={{width: rankWidth}}
              >
                {user.rank}
              </p>

              <Link to={`/profile/${user.id}`}>
                <img 
                  className='leaderboard-pic'
                  src={user.ProfilePic}
                  alt='profile-pic'
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = require('../../assets/images/profile-pic.jpeg')
                  }}
                />
              </Link>

              <p
                className='leaderboard-name'
                ref={el => (leaderboardRefs.current.names[i] = el)}
                style={{width: nameWidth}}
              >
                {user.name}
              </p>

              <p 
                className='leaderboard-tasks' 
                ref={el => (leaderboardRefs.current.tasks[i] = el)}
                style={{width: tasksWidth}}
              >
                {numeral(user.completedTasks).format('0.[00]a')} Task{user.completedTasks !== 1 ? 's' : ''}
              </p>

              <p
                className='leaderboard-points'
                ref={el => (leaderboardRefs.current.points[i] = el)}
                style={{width: pointsWidth}}
              >
                {numeral(user.points).format('0.[00]a')} Pts
              </p>
            </div>
          ))
        }
      </div>

      <div className='leaderboard-show-container'>
        {
          dataArraySlice > 5 && (
            <div 
              className='leaderboard-show-less'
              onClick={showLess}
              onMouseEnter={() => setShowLessHovered(true)}
              onMouseLeave={() => setShowLessHovered(false)}
            >
              <p>Show less</p>

              <ShowLessArrow isHovered={showLessHovered}/>
            </div>
          )
        }
        
        {
          (data.length > 5 && data.length !== dataArraySlice) && (
            <div 
              className='leaderboard-show-more'
              onClick={showMore}
              onMouseEnter={() => setShowMoreHovered(true)}
              onMouseLeave={() => setShowMoreHovered(false)}
            >
              <p>Show more</p>

              <ShowMoreArrow isHovered={showMoreHovered}/>
            </div>
          )
        }
      </div>
    </div>
  )
}