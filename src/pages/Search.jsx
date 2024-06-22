import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCurrentPage, removeAllPopups } from '../features/navigation/navigationSlice'
import { useEffect, useState } from 'react'
import { searchTasksApi } from '../apis/tasksApi'
import { showProjectsApi } from '../apis/projectsApi'
import useApi from '../hooks/useApi'
import TasksTask from '../components/tasks/TasksTask'
import ProjectsProject from '../components/projects/ProjectsProject'
import TasksShowMoreArrow from'../svg/tasks/TasksShowMoreArrow'
import TasksShowLessArrow from'../svg/tasks/TasksShowLessArrow'
import '../css/pages/Tasks.css'

export default function Search() {
  const { searchValue } = useParams()

  const dispatch = useDispatch()

  const [showMoreTasksHovered, setShowMoreTasksHovered] = useState(false)
  const [showLessTasksHovered, setShowLessTasksHovered] = useState(false)
  const [tasksToShow, setTasksToShow] = useState(12)
  const [tasks, setTasks] = useState([])
  const [showMoreProjectsHovered, setShowMoreProjectsHovered] = useState(false)
  const [showLessProjectsHovered, setShowLessProjectsHovered] = useState(false)
  const [projectsToShow, setProjectsToShow] = useState(12)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  const {
		fetchApi : fetchSearchTasksApi,
		apiData: searchTasksApiData,
		apiError: searchTasksApiError,
	} = useApi(searchTasksApi)

  const {
		fetchApi : fetchShowProjectsApi,
		apiData: showProjectsApiData,
		apiError: showProjectsApiError,
	} = useApi(showProjectsApi)

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('search'))
    dispatch(removeAllPopups())
  }, [dispatch])
  
  // load tasks
	useEffect(() => {
		const fetchApis = async () => {	
      await fetchSearchTasksApi(searchValue)

      await fetchShowProjectsApi()

      setProjectsToShow(12)
      setTasksToShow(12)

      setLoading(false)
		}
	
		fetchApis()
	}, [fetchSearchTasksApi, fetchShowProjectsApi, searchValue])

  // fetch tasks api data
	useEffect(() => {
    if (searchTasksApiData?.record) {
      setTasks(searchTasksApiData.record.slice().reverse())
    }

	}, [searchTasksApiData])

  // fetch projects api data
	useEffect(() => {
    if (showProjectsApiData) {
      setProjects(showProjectsApiData.slice().reverse().filter((project) => project.name.trim().toLowerCase().includes(searchValue.toLowerCase())))
    }

	}, [showProjectsApiData])

  // add tasks to the filters if there is space for them
  useEffect(() => {
    if (tasks.length !== 0 && (tasks.length <= 12 || tasksToShow % 4 !== 0 || tasksToShow > tasks.length)) {
      setTasksToShow(tasks.length)
    }
    // eslint-disable-next-line
  }, [tasks, searchTasksApiData])

  // add projects to the filters if there is space for them
  useEffect(() => {
    if (projects.length !== 0 && (projects.length <= 12 || projectsToShow % 3 !== 0 || projectsToShow > projects.length)) {
      setProjectsToShow(projects.length)
    }
    // eslint-disable-next-line
  }, [projects, showProjectsApiData])
  
  const showMoreTasks = () => {
    if (Math.floor(tasks.length / 12) === Math.floor(tasksToShow / 12)) {
      setTasksToShow(tasksToShow + (tasks.length - tasksToShow))
    } else {
      setTasksToShow(tasksToShow + 12)
    }

    setShowMoreTasksHovered(false)
  }

  const showMoreProjects = () => {
    if (Math.floor(projects.length / 12) === Math.floor(projectsToShow / 12)) {
      setProjectsToShow(projectsToShow + (projects.length - projectsToShow))
    } else {
      setProjectsToShow(projectsToShow + 12)
    }

    setShowMoreProjectsHovered(false)
  }

  const showLessTasks = () => {
    if (tasks.length === tasksToShow) {
      setTasksToShow(tasksToShow - (tasksToShow % 12 === 0 ? 12 : tasksToShow % 12 ))
    } else {
      setTasksToShow(tasksToShow - 12)
    }

    setShowLessTasksHovered(false)
  }

  const showLessProjects = () => {
    if (projects.length === projectsToShow) {
      setProjectsToShow(projectsToShow - (projectsToShow % 12 === 0 ? 12 : projectsToShow % 12 ))
    } else {
      setProjectsToShow(projectsToShow - 12)
    }

    setShowLessProjectsHovered(false)
  }

  if (loading) {
    return (
      <div />
    )
  }

  if (searchTasksApiError) {
    console.log(searchTasksApiError)
  }

  if (showProjectsApiError) {
    console.log(showProjectsApiError)
  }

  return (
    <div className='main-content'>
      <p className='page-name'>Search results</p>

      <p className='search-page-header'>{tasks.length === 0 ? 'No tasks found!' : 'Tasks'}</p>

      <div className='tasks-left-section  tasks-search-page'>
        <div className='tasks-left-section-tasks'>
          {
            tasks.length !== 0 && (
              tasks.slice(0, tasksToShow).map((task) => (
                <TasksTask task={task} key={task._id}/>
              ))
            )
          }
        </div>

        {
          tasks.length !== 0 && (
            <div className='tasks-show-container search-show'>
              {
                tasksToShow > 12 && (
                  <div 
                    className='tasks-show-less'
                    onClick={showLessTasks}
                    onMouseEnter={() => setShowLessTasksHovered(true)}
                    onMouseLeave={() => setShowLessTasksHovered(false)}
                  >
                    <p>Show less</p>

                    <TasksShowLessArrow isHovered={showLessTasksHovered}/>
                  </div>
                )
              }

              {
                (tasks.length > 12 && tasks.length !== tasksToShow) && (
                  <div 
                    className='tasks-show-more'
                    onClick={showMoreTasks}
                    onMouseEnter={() => setShowMoreTasksHovered(true)}
                    onMouseLeave={() => setShowMoreTasksHovered(false)}
                  >
                    <p>Show more</p>

                    <TasksShowMoreArrow isHovered={showMoreTasksHovered}/>
                  </div>
                )
              }
            </div>
          )
        }
      </div>

      <p className='search-page-header'>{projects.length === 0 ? 'No projects found!' : 'Projects'}</p>

      <div className='tasks-left-section projects-search-page'>
        <div className='projects-projects-container'>
          {
            projects.length !== 0 && (
              projects.slice(0, projectsToShow).map((project) => (
                <ProjectsProject project={project} key={project._id} />
              ))
            )
          }
        </div>

        {
          projects.length !== 0 && (
            <div className='tasks-show-container search-show'>
              {
                projectsToShow > 12 && (
                  <div 
                    className='tasks-show-less'
                    onClick={showLessProjects}
                    onMouseEnter={() => setShowLessProjectsHovered(true)}
                    onMouseLeave={() => setShowLessProjectsHovered(false)}
                  >
                    <p>Show less</p>

                    <TasksShowLessArrow isHovered={showLessProjectsHovered}/>
                  </div>
                )
              }

              {
                (projects.length > 12 && projects.length !== projectsToShow) && (
                  <div 
                    className='tasks-show-more'
                    onClick={showMoreProjects}
                    onMouseEnter={() => setShowMoreProjectsHovered(true)}
                    onMouseLeave={() => setShowMoreProjectsHovered(false)}
                  >
                    <p>Show more</p>

                    <TasksShowMoreArrow isHovered={showMoreProjectsHovered}/>
                  </div>
                )
              }
            </div>
          )
        }
      </div>
    </div>
  )
}