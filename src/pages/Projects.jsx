import { useDispatch } from 'react-redux'
import { setCurrentPage, removeAllPopups, addPopup } from '../features/navigation/navigationSlice'
import { useEffect, useState } from 'react'
import { showProjectsApi } from '../apis/projectsApi'
import useApi from '../hooks/useApi'
import AddTaskIcon from '../svg/board/AddTaskIcon'
import ProjectsProject from '../components/projects/ProjectsProject'
import ProjectsFilters from '../components/projects/ProjectsFilters'
import '../css/pages/Projects.css'


export default function Projects() {
  const dispatch = useDispatch()
  
  const [role, setRole] = useState('')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  const {
		fetchApi : fetchShowProjectsApi,
		apiData: showProjectsApiData,
		apiError: showProjectsApiError,
    apiLoading: showProjectsApiLoading
	} = useApi(showProjectsApi)

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('projects'))
    dispatch(removeAllPopups())
  }, [dispatch])

  // load projects
	useEffect(() => {
		const fetchApis = async () => {	
      await fetchShowProjectsApi(role)

      setLoading(false)
		}
	
		fetchApis()
	}, [fetchShowProjectsApi, role])

  console.log(projects)

  // fetch api data
	useEffect(() => {
    if (showProjectsApiData) {
      setProjects(showProjectsApiData.slice().reverse())
    }

	}, [showProjectsApiData])
 

  if (loading || showProjectsApiLoading) {
    return (
      <div />
    )
  }

  if (showProjectsApiError) {
    console.log(showProjectsApiError)
  }

  return (
    <div className='main-content'>
      <div className='projects-page-wrapper'>
        <div className="projects-header">
          <p className='page-name'>Projects</p>

          <p className='projects-join-project-button' onClick={() => dispatch(addPopup('join project'))}>Join Project</p>
          
          <ProjectsFilters role={role} setRole={setRole}/>
        </div>

        <div className='projects-projects-container'>
          {
            (projects.length !== 0) ?
            projects.map((project) => (
              <ProjectsProject project={project} key={project._id} />
            )) : (role === '') ?
            <p>There is no Projects</p> :
            ''
          }

          {
            (role !== 'member') ?
            <div className='projects-svg-container'>
              <AddTaskIcon showPopup={() => dispatch(addPopup('add project'))}/>
            </div> :
            ''
          }
        </div>
      </div>
    </div>
  )
}