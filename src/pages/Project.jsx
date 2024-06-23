import { useNavigate, useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setRank, setTotalPoints, setLevel, setCompletedTasks, setInProgressTasks, setPoints, setTags } from '../features/user/userSlice'
import { setCurrentPage, removeAllPopups, setCurrentInviteLink, addPopup, setCurrentMember, setCurrentProject, setActionDone, setAllRanks } from '../features/navigation/navigationSlice'
import { useEffect, useState } from 'react'
import { getProjectMembersApi, getProjectTasksApi, getProjectByIdApi, inviteLinkApi } from '../apis/projectsApi'
import { userDataApi, rankApi } from '../apis/userApi'
import { allTasksApi } from '../apis/tasksApi'
import useApi from '../hooks/useApi'
import ProjectProgressBar from '../components/projects/ProjectProgressBar'
import { fillDaily, fillMonthly, fillYearly } from '../functions/pointsFunctions'
import ProjectTask from '../components/projects/ProjectTask'
import AssignTaskIcon from '../svg/projects/AssignTaskIcon'
import RemoveMember from '../svg/projects/RemoveMember'
import ArrowIcon from '../svg/projects/ArrowIcon'
import PlusIcon from '../svg/projects/PlusIcon'
import ChatIcon from '../svg/projects/ChatIcon'
import '../css/pages/Project.css'


export default function Project() {
  const actionDone = useSelector((state) => state.navigation.actionDone)

  const { projectId } = useParams()

  const navigate = useNavigate()

  const myId = useSelector((state) => state.user.id)
  
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState({})
  const [members, setMembers] = useState([])
  const [displayedMembers, setDisplayedMembers] = useState([])
  const [tasks, setTasks] = useState([])
  const [membersSearchValue, setMembersSearchValue] = useState('')

  const {
		fetchApi : fetchGetProjectByIdApi,
		apiData: getProjectByIdApiData,
		apiError: getProjectByIdApiError,
	} = useApi(getProjectByIdApi)

  const {
		fetchApi : fetchGetProjectTasksApi,
		apiData: getProjectTasksApiData,
		apiError: getProjectTasksApiError,
	} = useApi(getProjectTasksApi)


  const {
		fetchApi : fetchGetProjectMembersApi,
		apiData: getProjectMembersApiData,
		apiError: getProjectMembersApiError,
	} = useApi(getProjectMembersApi)

  const {
		fetchApi : fetchInviteLinkApi,
		apiData: inviteLinkApiData,
		apiError: inviteLinkApiError,
		apiLoading: inviteLinkApiLoading,
	} = useApi(inviteLinkApi)

  const {
    fetchApi : fetchUserDataApi,
    apiData: userDataApiData,
    apiError: userDataApiError,
  } = useApi(userDataApi)
  
  const {
    fetchApi : fetchRankApi,
    apiData: rankApiData,
    apiError: rankApiError,
  } = useApi(rankApi)
  
  const {
    fetchApi : fetchTagsApi,
    apiData: tagsApiData,
    apiError: tagsApiError,
  } = useApi(allTasksApi)

  // change the current page so the app can rerender and update sidenav active icon and remove all popups
  useEffect(() => {
    dispatch(setCurrentPage('project'))
    dispatch(removeAllPopups())
    
    return () => {
      dispatch(setActionDone(''))
    }
  }, [dispatch])

  // change data when action is done
  useEffect(() => {
    const fetchApis = async () => {
      if (actionDone === 'edit steps' || actionDone === 'complete task' || actionDone === 'remove project task' || actionDone === 'member edit project task' || actionDone === 'assign task' || actionDone === 'remove member' || actionDone === 'admin edit project task') {
        await fetchGetProjectByIdApi(projectId)

        await fetchGetProjectMembersApi(projectId)
  
        await fetchGetProjectTasksApi(projectId)

        if (actionDone === 'complete task' || actionDone === 'remove project task' || actionDone === 'assign task') {
          await fetchUserDataApi()
        }

        if (actionDone === 'remove project task' || actionDone === 'member edit project task') {
          await fetchTagsApi({
            page: 1,
            size: 0,
            sortingType: 1
          })
        }

        if (actionDone === 'complete task') {
          await fetchRankApi()
        }

        dispatch(setActionDone(''))
      }
    }
  
    fetchApis()
  }, [actionDone, projectId, fetchRankApi, fetchTagsApi, fetchUserDataApi, fetchGetProjectByIdApi, fetchGetProjectMembersApi, fetchGetProjectTasksApi, dispatch])

  // change the account data when the api loads
  useEffect(() => {
    if (userDataApiData?.success) {
      const filledDaily = fillDaily(userDataApiData.record.points.daily)
      const filledMonthly = fillMonthly(userDataApiData.record.points.monthly)
      const filledYearly = fillYearly(userDataApiData.record.points.yearly)
      dispatch(setTotalPoints(
        {
          overall: userDataApiData.record.points.totalPoints,
          thisMonth: filledMonthly.points[filledMonthly.points.length - 1],
          lastMonth: filledMonthly.points[filledMonthly.points.length - 2]
        }
      ))
      dispatch(setPoints(
        {
          daily: filledDaily,
          monthly: filledMonthly,
          yearly: filledYearly
        }
      ))
      dispatch(setLevel(Math.floor(userDataApiData.record.points.totalPoints / 100) + 1))
      dispatch(setCompletedTasks(userDataApiData.record.tasks.completedTasks))
      dispatch(setInProgressTasks(userDataApiData.record.tasks.onGoingTasks))
    }
  }, [userDataApiData, dispatch]) 

  // change the ranks data when the api loads
  useEffect(() => {
    if (rankApiData) {
      dispatch(setRank(rankApiData.myRank + 1))
      dispatch(setAllRanks(rankApiData.rankedUser))
    }
  }, [rankApiData, dispatch])

  // change the tags data when the api loads
  useEffect(() => {
    if (tagsApiData) {
      dispatch(setTags(
        tagsApiData.tags
          .filter((item) => item.name.trim() !== '')
          .filter((item, index, self) =>
            index === self.findIndex((t) => (
              t.name.trim().toLowerCase() === item.name.trim().toLowerCase()
            ))
          )
      ))
    }
  }, [tagsApiData, dispatch])

  // updated shown members whenever the search changes
  useEffect(() => {
    if (membersSearchValue.trim() !== '') {
      setDisplayedMembers(members.filter((member) => member.name.toLowerCase().includes(membersSearchValue.toLowerCase().trim())))
    } else {
      setDisplayedMembers(members)
    }
  }, [membersSearchValue, members])
  
  // load project
  useEffect(() => {
    const fetchApis = async () => {	
      await fetchGetProjectByIdApi(projectId)

      await fetchGetProjectMembersApi(projectId)

      await fetchGetProjectTasksApi(projectId)

      setLoading(false)
    }

    fetchApis()
  }, [fetchGetProjectByIdApi, fetchGetProjectMembersApi, fetchGetProjectTasksApi, projectId])

  // fetch project api data
	useEffect(() => {
    if (getProjectByIdApiData?.record) {
      setProject(getProjectByIdApiData.record)
    }
	}, [getProjectByIdApiData])

  // fetch members api data
	useEffect(() => {
    if (getProjectMembersApiData?.record) {
      setMembers(getProjectMembersApiData.record)
    }
	}, [getProjectMembersApiData])

  // fetch tasks api data
	useEffect(() => {
    if (getProjectTasksApiData?.record) {
      setTasks((getProjectTasksApiData.record).reverse())
    }
	}, [getProjectTasksApiData])

  // load link when its generated
	useEffect(() => {
    if (inviteLinkApiData) {
      dispatch(setCurrentInviteLink(inviteLinkApiData.link))

      dispatch(addPopup('invite link'))
    }
	}, [inviteLinkApiData, dispatch])

  // handel errors
  useEffect(() => {
    if (getProjectByIdApiError || getProjectMembersApiError || getProjectTasksApiError) {
      navigate('/projects')
    }
  }, [getProjectByIdApiError, getProjectMembersApiError, getProjectTasksApiError, navigate])

  const openInvite = async () => {
    await fetchInviteLinkApi(project._id)
  }

  const confirmRemoval = (member) => {
    dispatch(addPopup('confirm member removal'))
    dispatch(setCurrentMember(member))
    dispatch(setCurrentProject(project))
  }

  const openAssignTask = (member) => {
    dispatch(addPopup('assign task'))
    dispatch(setCurrentMember(member))
    dispatch(setCurrentProject(project))
  }

  if (loading) {
    return (
      <div />
    )
  }

  if (inviteLinkApiError) {
    console.log(inviteLinkApiError)
  }
  
  if (userDataApiError) {
    console.log(userDataApiError)
  }
  
  if (rankApiError) {
    console.log(rankApiError)
  }
  
  if (tagsApiError) {
    console.log(tagsApiError)
  }

  const adminId = project.members.find((projectMember) => projectMember.role === 'admin')?.memberId

  const projectAdmin = members.find((member) => member._id === adminId)

  const projectMembers = displayedMembers.filter((member) => member._id !== adminId)

  return (
    <div className='main-content'>
      <div className="project-page-header">
        <p className='page-name'>Project</p>

        <ArrowIcon />

        <p className='page-name'>{project.name}</p>
      </div>

      <div className='project-page-container'>
        <div className='project-page-left-section'>
          {
            tasks.map((task) => (
              <ProjectTask task={task} project={project} key={task._id} user={members.find((member) => member._id === task.userId)}/>
            ))
          }
        </div>

        <div className='project-page-right-section'>
          <div className='project-page-right-top-section'>
            {
              tasks.length !== 0 && (
                <ProjectProgressBar 
                  totalPoints={
                  (tasks.filter((task) => task.completed).length / tasks.length) * 100
                  } 
                />
              )
            }
          </div>

          <Link to={`/projects/${project._id}/chat`} className='project-page-right-mid-section'>
            <div>
              <div>Group Chat</div>

              <ChatIcon />
            </div>
          </Link>

          <div className='project-page-right-bottom-section'>
            <p className='project-page-right-header'>Admin</p>

            <div className='project-page-right-member'>
              <div className='project-page-right-member-left'>
                <Link to={`/profile/${projectAdmin._id}`}>
                  <img
                    src={`https://intime-9hga.onrender.com/api/v1/images/${projectAdmin.avatar}`}
                    alt='profile-pic'
                    className='project-page-right-member-profile-pic'
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = require('../assets/images/profile-pic.jpeg')
                    }}
                  />
                </Link>

                <p className='project-page-right-member-name'>{projectAdmin.name}</p>
              </div>

              {
                myId === adminId && (
                  <AssignTaskIcon openAssignTask={() => openAssignTask(projectAdmin)}/>
                )
              }
            </div>

            <p className='project-page-right-header'>Members</p>

            <div className='project-page-right-members-nav'>
              <p className='project-page-right-members-count'>{projectMembers.length} member{projectMembers.length === 1 ? '' : 's'}
              </p>

              <input
                className='project-page-right-members-search'
                type='text'
                id='membersSearch'
                autoComplete='on'
                spellCheck='false'
                value={membersSearchValue}
                onChange={(e) => {
                  setMembersSearchValue(e.target.value)
                }}
                placeholder='Search...'
              />

              {
                myId === adminId && (
                  <div
                    className='project-page-right-invite-members-button'
                    onClick={openInvite}
                    style={{ pointerEvents: inviteLinkApiLoading ? 'none' : '', cursor: inviteLinkApiLoading ? 'auto' : 'pointer' }}
                  >
                    <PlusIcon />

                    <p>Invite</p>
                  </div>  
                )
              }
            </div>

            <div className='project-page-right-members-container'>
              {
                projectMembers.map((member) => (
                  <div className='project-page-right-member' key={member._id}>
                    <div className='project-page-right-member-left'>
                      <Link to={`/profile/${member._id}`}>
                        <img
                          src={`https://intime-9hga.onrender.com/api/v1/images/${member.avatar}`}
                          alt='profile-pic'
                          className='project-page-right-member-profile-pic'
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = require('../assets/images/profile-pic.jpeg')
                          }}
                        />
                      </Link>

                      <p className='project-page-right-member-name'>{member.name}</p>
                    </div>

                    {
                      myId === adminId && (
                        <div className='project-page-right-member-control'>
                          <AssignTaskIcon openAssignTask={() => openAssignTask(member)}/>

                          <RemoveMember confirmRemoval={() => confirmRemoval(member)} />
                        </div>
                      )
                    }
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}