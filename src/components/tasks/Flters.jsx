import { useSelector } from "react-redux"

export default function Filters() {

  return (
    <div className='filters-container'>
      <div className='single-filter-container'>
        <p>Tasks</p>

        <div className='single-filter-options'>
          <label className='container'>Personal
            <input type='checkbox' />
            <span className='checkmark' />
          </label>

          <label className='container'>Groups
              <input type='checkbox' />
              <span className='checkmark' />
          </label>
        </div>

      </div>
    </div>
  )
}