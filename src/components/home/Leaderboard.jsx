import { useState, useRef, useEffect } from 'react'
import numeral from 'numeral'
import ShowMoreArrow from'../../svg/others/ShowMoreArrow'
import ShowLessArrow from'../../svg/others/ShowLessArrow'

export default function Leaderboard() {
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

  const data = new Array(18).fill({})

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
      setDataArraySlice(data.length)
    }
    // eslint-disable-next-line
  }, [])

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
          data.slice(0, dataArraySlice).map((_, i) => (
            <div className='leaderboard-row' key={i}>
              <p 
                className='leaderboard-rank' 
                ref={el => (leaderboardRefs.current.ranks[i] = el)} style={{width: rankWidth}}
              >
                {i + 1}
              </p>

              <img 
                className='leaderboard-pic'
                src={require('../../assets/images/profile-pic.jpeg')} alt='profile-pic'
              />

              <p
                className='leaderboard-name'
                ref={el => (leaderboardRefs.current.names[i] = el)}
                style={{width: nameWidth}}
              >
                Jessica
              </p>

              <p 
                className='leaderboard-tasks' 
                ref={el => (leaderboardRefs.current.tasks[i] = el)}
                style={{width: tasksWidth}}
              >
                {numeral(50).format('0.[00]a')} Tasks
              </p>

              <p
                className='leaderboard-points'
                ref={el => (leaderboardRefs.current.points[i] = el)}
                style={{width: pointsWidth}}
              >
                {numeral(5000).format('0.[00]a')} Pts
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
          (data.length !== dataArraySlice) && (
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