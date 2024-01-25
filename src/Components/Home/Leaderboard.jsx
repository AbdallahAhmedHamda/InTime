import { useState } from 'react'
import ShowMoreArrow from'../../SVG/Others/ShowMoreArrow'

export default function Leaderboard() {
  const [data, setData] = useState([{}, {}, {}, {}, {}])
  const [hovered, setHovered] = useState(false)

  return (
    <div className="leaderboard-container">
      <p>Leaderboard</p>

      <div className="leaderboard">
        <div className="leaderboard-col">
          {data.map((_, i) => (
            <div className='leaderboard-col-item' key={i}>
              <p className='leaderboard-rank'>{i + 1}</p>
            </div>
          ))}
        </div>

        <div className="leaderboard-col">
          {data.map((_, i) => (
            <img className="leaderboard-pic" src={require('../../Images/profile-pic.jpeg')} alt='profile-pic' key={i}/>
          ))}
        </div>

        <div className="leaderboard-col">
          {data.map((_, i) => (
            <div className='leaderboard-col-item' key={i}>
              <p className="leaderboard-name">Jessica</p>
            </div>
          ))}
        </div>


        <div className="leaderboard-col">
          {data.map((_, i) => (
            <div className='leaderboard-col-item' key={i}>
              <p className="leaderboard-tasks">50 Tasks</p>
            </div>
          ))}
        </div>
        

        <div className="leaderboard-col">
          {data.map((_, i) => (
            <div className='leaderboard-col-item' key={i}>
               <p className="leaderboard-points">5000 Pts</p>
            </div>
          ))}
        </div>
      </div>

      <div 
        className='leaderboard-more'
        onClick={() => setData(prevState => [...prevState, {}, {}, {}, {}, {}])}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <p>Show more</p>

        <ShowMoreArrow isHovered={hovered}/>
      </div>
    </div>
  )
}