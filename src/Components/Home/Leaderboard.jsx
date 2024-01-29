import { useState, useRef, useEffect } from 'react'
import numeral from 'numeral'
import ShowMoreArrow from'../../SVG/Others/ShowMoreArrow'

export default function Leaderboard() {
  const [data, setData] = useState([{}, {}, {}, {}, {}])
  const [hovered, setHovered] = useState(false)
  const [rankWidth, setRankWidth] = useState('auto')
  const [nameWidth, setNameWidth] = useState('auto')
  const [tasksWidth, setTasksWidth] = useState('auto')
  const [pointsWidth, setPointsWidth] = useState('auto')

  const leaderboardRefs = useRef({
    ranks: [],
    names: [],
    tasks: [],
    points: [],
  })

  // calculate each leaderboard column width
  useEffect(() => {
    const rankWidthsArray = leaderboardRefs.current.ranks.map(ref => ref.clientWidth)
    setRankWidth(Math.max(...rankWidthsArray))

    const nameWidthsArray = leaderboardRefs.current.names.map(ref => ref.clientWidth)
    setNameWidth(Math.max(...nameWidthsArray))

    const tasksWidthsArray = leaderboardRefs.current.tasks.map(ref => ref.clientWidth)
    setTasksWidth(Math.max(...tasksWidthsArray))

    const pointsWidthsArray = leaderboardRefs.current.points.map(ref => ref.clientWidth)
    setPointsWidth(Math.max(...pointsWidthsArray))
  }, [data])

  // reset widths and add values when user show more ranks
  const showMore = () => {
    setData(prevState => [...prevState, {}, {}, {}, {}, {}])
    setRankWidth('auto')
    setNameWidth('auto')
    setTasksWidth('auto')
    setPointsWidth('auto')
  }

  return (
    <div className="leaderboard-container">
      <p>Leaderboard</p>

      <div className="leaderboard">
        {data.map((_, i) => (
          <div className="leaderboard-row" key={i}>
            <p 
              className='leaderboard-rank' 
              ref={el => (leaderboardRefs.current.ranks[i] = el)} style={{width: rankWidth}}
            >
              {i + 1}
            </p>

            <img 
              className="leaderboard-pic"
              src={require('../../Images/profile-pic.jpeg')} alt='profile-pic'
            />

            <p
              className="leaderboard-name"
              ref={el => (leaderboardRefs.current.names[i] = el)}
              style={{width: nameWidth}}
            >
              Jessica
            </p>

            <p 
              className="leaderboard-tasks" 
              ref={el => (leaderboardRefs.current.tasks[i] = el)}
              style={{width: tasksWidth}}
            >
              {numeral(50).format('0.[00]a')} Tasks
            </p>

            <p
              className="leaderboard-points"
              ref={el => (leaderboardRefs.current.points[i] = el)}
              style={{width: pointsWidth}}
            >
              {numeral(5000).format('0.[00]a')} Pts
            </p>
          </div>
        ))}
      </div>

      <div 
        className='leaderboard-more'
        onClick={showMore}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <p>Show more</p>

        <ShowMoreArrow isHovered={hovered}/>
      </div>
    </div>
  )
}