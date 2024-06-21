import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import ShowMoreArrow from'../../svg/others/ShowMoreArrow'
import ShowLessArrow from'../../svg/others/ShowLessArrow'
import FlagIcon from '../../svg/others/FlagIcon'

export default function Filters({ applyFilters, disabled, filters, setFilters }) {
  const completedTasks = useSelector((state) => state.user.completedTasks)
  const inProgressTasks = useSelector((state) => state.user.inProgressTasks)
  const tags = useSelector((state) => state.user.tags)
    
  const [showMoreHovered, setShowMoreHovered] = useState(false)
  const [showLessHovered, setShowLessHovered] = useState(false)
  const [tagsSearchValue, setTagsSearchValue] = useState('')
  const [displayedTags, setDisplayedTags] = useState(tags)
  const [tagsToShow, setTagsToShow] = useState(6)

  // updated shown tags whenever the search changes
  useEffect(() => {
    if (tagsSearchValue.trim() !== '') {
      setDisplayedTags(tags.filter(tag => tag.name.toLowerCase().includes(tagsSearchValue.toLowerCase().trim())))
      setTagsToShow(6)
    } else {
      setDisplayedTags(tags)
      setTagsToShow(6)
    }
    // eslint-disable-next-line
  }, [tagsSearchValue])

  // add tags to the filters if there is space for them
  useEffect(() => {
    if (tags.length !== 0 && (displayedTags.length <= 6 || tagsToShow % 3 !== 0 || tagsToShow > displayedTags.length)) {
      setTagsToShow(displayedTags.length)
    }
    // eslint-disable-next-line
  }, [displayedTags, tags])
  
  const checkboxChecked = (filter, filterOption) => {
    return filters[filter].includes(filterOption)
  }

  const handleCheckboxChange = (e, filterOption) => {
    const key = e.target.name
    const newFilters = { ...filters }

    if (!filters[key].includes(filterOption)) {
      newFilters[key] = [...newFilters[key], filterOption]
    } else {
      newFilters[key] = newFilters[key].filter((filter) => filter !== filterOption)
    }

    setFilters(newFilters)
  }

  const showMore = () => {
    if (Math.floor(displayedTags.length / 6) === Math.floor(tagsToShow / 6)) {
      setTagsToShow(tagsToShow + (displayedTags.length - tagsToShow))
    } else {
      setTagsToShow(tagsToShow + 6)
    }

    setShowMoreHovered(false)
  }

  const showLess = () => {
    if (displayedTags.length === tagsToShow) {
      setTagsToShow(tagsToShow - (tagsToShow % 6 === 0 ? 6 : tagsToShow % 6))
    } else {
      setTagsToShow(tagsToShow - 6)
    }

    setShowLessHovered(false)
  }

  const checkmarkStyles = (filter, filterOption) => (
    {
      boxShadow: filters[filter].includes(filterOption) ? '0 0 0 0.5px #5468E7' : '0 0 0 0.5px rgba(0, 0, 0, 0.60)'
    }
  )

  const filterNameStyles = (filter, filterOption) => (
    {
      color: filters[filter].includes(filterOption) ? '#5468E7' : ''
    }
  )

  const sortedTags = [...displayedTags].sort((a, b) => {
    const tagA = a.name.toLowerCase()
    const tagB = b.name.toLowerCase()
  
    if (tagA < tagB) {
      return -1
    }
    if (tagA > tagB) {
      return 1
    }
    return 0
  })

  return (
    <div className='filters-container'>
      <div className='single-filter-container'>
        <p>Tasks</p>

        <div className='single-filter-options'>
          <label className='filter-option-container'>
            <input
              type='checkbox'
              name='projectTask'
              onChange={(e) => handleCheckboxChange(e, false)}
              checked={checkboxChecked('projectTask', false)}
            />

            <span className='filter-checkmark' style={checkmarkStyles('projectTask', false)}/>

            <p style={filterNameStyles('projectTask', false)}>
              Personal
            </p>
          </label>

          <label className='filter-option-container'>
            <input
              type='checkbox'
              name='projectTask'
              onChange={(e) => handleCheckboxChange(e, true)}
              checked={checkboxChecked('projectTask', true)}
            />

            <span className='filter-checkmark' style={checkmarkStyles('projectTask', true)}/>

            <p style={filterNameStyles('projectTask', true)}>
              Projects
            </p>
          </label>
        </div>
      </div>

      <div className='single-filter-container'>
        <p>Status</p>

        <div className='single-filter-options'>
          <label className='filter-option-container'>
            <input
              type='checkbox'
              name='completed'
              onChange={(e) => handleCheckboxChange(e, true)}
              checked={checkboxChecked('completed', true)}
            />

            <span className='filter-checkmark' style={checkmarkStyles('completed', true)}/>

            <p style={filterNameStyles('completed', true)}>
              Completed <span>({completedTasks})</span>
            </p>
          </label>

          <label className='filter-option-container'>
            <input
              type='checkbox'
              name='completed'
              onChange={(e) => handleCheckboxChange(e, false)}
              checked={checkboxChecked('completed', false)}
            />

            <span className='filter-checkmark' style={checkmarkStyles('completed', false)}/>

            <p style={filterNameStyles('completed', false)}>
              In Progress <span>({inProgressTasks})</span>
            </p>
          </label>
        </div>
      </div>

      <div className='single-filter-container'>
        <p>Priority</p>

        <div className='single-filter-options  priority-filter-options'>
          <label className='filter-option-container'>
            <input
              type='checkbox'
              name='priority'
              onChange={(e) => handleCheckboxChange(e, 3)}
              checked={checkboxChecked('priority', 3)}
            />

            <span className='filter-checkmark' style={checkmarkStyles('priority', 3)}/>

            <FlagIcon priority={3} />
          </label>

          <label className='filter-option-container'>
            <input
              type='checkbox'
              name='priority'
              onChange={(e) => handleCheckboxChange(e, 2)}
              checked={checkboxChecked('priority', 2)}
            />

            <span className='filter-checkmark' style={checkmarkStyles('priority', 2)}/>

            <FlagIcon priority={2} />
          </label>

          <label className='filter-option-container'>
            <input
              type='checkbox'
              name='priority'
              onChange={(e) => handleCheckboxChange(e, 1)}
              checked={checkboxChecked('priority', 1)}
            />

            <span className='filter-checkmark' style={checkmarkStyles('priority', 1)}/>

            <FlagIcon priority={1} />
          </label>

          <label className='filter-option-container'>
            <input
              type='checkbox'
              name='priority'
              onChange={(e) => handleCheckboxChange(e, 0)}
              checked={checkboxChecked('priority', 0)}
            />

            <span className='filter-checkmark' style={checkmarkStyles('priority', 0)}/>

            <FlagIcon priority={0} />
          </label>
        </div>
      </div>

      {
        tags.length !== 0 && (
          <div className='single-filter-container tags-filter-container'>
            <div className='tag-header-container'>
              <p>Tags</p>

              <input
                className='tags-search'
                type='text'
                id='tagsSearch'
                autoComplete='on'
                spellCheck='false'
                value={tagsSearchValue}
                onChange={(e) => {
                  setTagsSearchValue(e.target.value)
                }}
                placeholder='Search tags...'
              />
            </div>

            <div className='single-filter-options  tags-filter-options'>
              {
                sortedTags.slice(0, tagsToShow).map((tag) => (
                  <label className='filter-option-container' key={tag.name}>
                    <input
                      type='checkbox'
                      name='tag'
                      onChange={(e) => handleCheckboxChange(e, tag)}
                      checked={checkboxChecked('tag', tag)}
                    />

                    <span className='filter-checkmark' style={checkmarkStyles('tag', tag)}/>

                    <p style={filterNameStyles('tag', tag)}>
                      {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
                    </p>
                  </label>
                ))
              }
            </div>

            <div className='tags-show-container'>
              {
                tagsToShow > 6 && (
                  <div 
                    className='tags-show-less'
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
                (displayedTags.length > 6 && displayedTags.length !== tagsToShow) && (
                  <div 
                    className='tags-show-more'
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

      <button className='apply-filters-button' onClick={applyFilters} disabled={disabled}>Apply Filters</button>
    </div>
  )
}