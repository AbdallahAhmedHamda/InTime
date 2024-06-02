import { useSelector, useDispatch } from 'react-redux'
import { setFilters } from '../../features/navigation/navigationSlice'
import { useState, useEffect, useMemo } from 'react'
import ShowMoreArrow from'../../svg/others/ShowMoreArrow'
import ShowLessArrow from'../../svg/others/ShowLessArrow'
import FlagIcon from '../../svg/others/FlagIcon'

export default function Filters() {
  const filters = useSelector((state) => state.navigation.filters)
  const tasks = useSelector((state) => state.user.tasks)
  const reduxTags = useSelector((state) => state.user.tags)
  
  const dispatch = useDispatch()

  const tags = useMemo(() => reduxTags.filter((tag) => tag !== null), [reduxTags])
  
  const [showMoreHovered, setShowMoreHovered] = useState(false)
  const [showLessHovered, setShowLessHovered] = useState(false)
  const [tagsSearchValue, setTagsSearchValue] = useState('')
  const [displayedTags, setDisplayedTags] = useState(tags)
  const [tagsToShow, setTagsToShow] = useState(6)
  
  // updated shown tags whenever the real tags change
  useEffect(() => {
    if (tagsSearchValue.trim() !== '') {
      setDisplayedTags(tags.filter(tag => tag.includes(tagsSearchValue.trim())))
    } else {
      setDisplayedTags(tags)
    }
    // eslint-disable-next-line
  }, [tags])

  // updated shown tags whenever the search changes
  useEffect(() => {
    if (tagsSearchValue.trim() !== '') {
      setDisplayedTags(tags.filter(tag => tag.includes(tagsSearchValue.trim())))
      setTagsToShow(6)
    } else {
      setDisplayedTags(tags)
      setTagsToShow(6)
    }
    // eslint-disable-next-line
  }, [tagsSearchValue])

  // add tags to the filters if there is space for them
  useEffect(() => {
    if (displayedTags.length <= 6 || tagsToShow % 3 !== 0 || tagsToShow > displayedTags.length) {
      setTagsToShow(displayedTags.length)
    }
    // eslint-disable-next-line
  }, [displayedTags])
  
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

    dispatch(setFilters(newFilters))
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

  const allCompletedTasks = tasks.filter((task) => task.isCompleted).length
  const allInProgressTasks = tasks.filter((task) => !task.isCompleted && !task.backlog).length
  const allBacklogTasks = tasks.filter((task) => task.backlog).length

  const sortedTags = [...displayedTags].sort()

  return (
    <div className='filters-container'>
      <div className='single-filter-container'>
        <p>Tasks</p>

        <div className='single-filter-options'>
          <label className='filter-option-container'>
            <input
              type='checkbox'
              name='creator'
              onChange={(e) => handleCheckboxChange(e, 'personal')}
              checked={checkboxChecked('creator', 'personal')}
            />

            <span className='filter-checkmark' style={checkmarkStyles('creator', 'personal')}/>

            <p style={filterNameStyles('creator', 'personal')}>
              Personal <span>(36)</span>
            </p>
          </label>

          <label className='filter-option-container'>
            <input
              type='checkbox'
              name='creator'
              onChange={(e) => handleCheckboxChange(e, 'groups')}
              checked={checkboxChecked('creator', 'groups')}
            />

            <span className='filter-checkmark' style={checkmarkStyles('creator', 'groups')}/>

            <p style={filterNameStyles('creator', 'groups')}>
              Groups <span>(10)</span>
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
              name='status'
              onChange={(e) => handleCheckboxChange(e, 'completed')}
              checked={checkboxChecked('status', 'completed')}
            />

            <span className='filter-checkmark' style={checkmarkStyles('status', 'completed')}/>

            <p style={filterNameStyles('status', 'completed')}>
              Completed <span>({allCompletedTasks})</span>
            </p>
          </label>

          <label className='filter-option-container'>
            <input
              type='checkbox'
              name='status'
              onChange={(e) => handleCheckboxChange(e, 'in progress')}
              checked={checkboxChecked('status', 'in progress')}
            />

            <span className='filter-checkmark' style={checkmarkStyles('status', 'in progress')}/>

            <p style={filterNameStyles('status', 'in progress')}>
              In Progress <span>({allInProgressTasks})</span>
            </p>
          </label>

          <label className='filter-option-container'>
            <input
              type='checkbox'
              name='status'
              onChange={(e) => handleCheckboxChange(e, 'backlog')}
              checked={checkboxChecked('status', 'backlog')}
            />

            <span className='filter-checkmark' style={checkmarkStyles('status', 'backlog')}/>

            <p style={filterNameStyles('status', 'backlog')}>
              Backlog <span>({allBacklogTasks})</span>
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
              onChange={(e) => handleCheckboxChange(e, '1')}
              checked={checkboxChecked('priority', '1')}
            />

            <span className='filter-checkmark' style={checkmarkStyles('priority', '1')}/>

            <FlagIcon priority={1} />
          </label>

          <label className='filter-option-container'>
            <input
              type='checkbox'
              name='priority'
              onChange={(e) => handleCheckboxChange(e, '2')}
              checked={checkboxChecked('priority', '2')}
            />

            <span className='filter-checkmark' style={checkmarkStyles('priority', '2')}/>

            <FlagIcon priority={2} />
          </label>

          <label className='filter-option-container'>
            <input
              type='checkbox'
              name='priority'
              onChange={(e) => handleCheckboxChange(e, '3')}
              checked={checkboxChecked('priority', '3')}
            />

            <span className='filter-checkmark' style={checkmarkStyles('priority', '3')}/>

            <FlagIcon priority={3} />
          </label>

          <label className='filter-option-container'>
            <input
              type='checkbox'
              name='priority'
              onChange={(e) => handleCheckboxChange(e, '4')}
              checked={checkboxChecked('priority', '4')}
            />

            <span className='filter-checkmark' style={checkmarkStyles('priority', '4')}/>

            <FlagIcon priority={3} />
          </label>
        </div>
      </div>

      {
        tags.length !== 0 && (
          <div className='single-filter-container'>
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
                  placeholder='search tags...'
                />
            </div>

            <div className='single-filter-options  tags-filter-options'>
              {
                sortedTags.slice(0, tagsToShow).map((tag) => (
                  <label className='filter-option-container' key={tag}>
                    <input
                      type='checkbox'
                      name='tags'
                      onChange={(e) => handleCheckboxChange(e, tag)}
                      checked={checkboxChecked('tags', tag)}
                    />

                    <span className='filter-checkmark' style={checkmarkStyles('tags', tag)}/>

                    <p style={filterNameStyles('tags', tag)}>
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </p>
                  </label>
                ))
              }
            </div>
          </div>
        )
      }

      {
        tags.length !== 0 && (
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
        )
      }
    </div>
  )
}