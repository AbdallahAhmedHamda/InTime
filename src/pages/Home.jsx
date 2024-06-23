import { useDispatch, useSelector } from 'react-redux'
import { setRank, setTotalPoints, setLevel, setCompletedTasks, setInProgressTasks, setPoints, setTags } from '../features/user/userSlice'
import { setCurrentPage, removeAllPopups, addPopup, setActionDone, setAllRanks } from '../features/navigation/navigationSlice'
import { useEffect, useState } from 'react'
import { userDataApi, rankApi } from '../apis/userApi'
import { allTasksApi } from '../apis/tasksApi'
import useApi from '../hooks/useApi'
import { fillDaily, fillMonthly, fillYearly } from '../functions/pointsFunctions'
import ProgressGraph from '../components/home/ProgressGraph'
import Leaderboard from '../components/home/Leaderboard'
import ProgressBar from '../components/home/ProgressBar'
import Progress from '../components/home/Progress'
import HomeTask from '../components/home/HomeTask'
import PlusIcon from '../svg/home/PlusIcon'
import '../css/pages/Home.css'

export default function Home() {
  const actionDone = useSelector((state) => state.navigation.actionDone)

  const dispatch = useDispatch()

  const [orderedTasks, setOrderedTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const {
		fetchApi : fetchAllTasksApi,
		apiData: allTasksApiData,
		apiError: allTasksApiError,
	} = useApi(allTasksApi)

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
    dispatch(setCurrentPage('home'))
    dispatch(removeAllPopups())
    
    return () => {
      dispatch(setActionDone(''))
    }
  }, [dispatch])

  // change data when action is done
  useEffect(() => {
    const fetchApis = async () => {
      if (actionDone === 'add task' || actionDone === 'edit task' || actionDone === 'edit steps' || actionDone === 'complete task' || actionDone === 'remove task' || actionDone === 'member edit project task') {
        await fetchAllTasksApi({
          page: 1,
          size: 2,
          sortingType: -1,
          sortBy: 'createdAt',
          completed: false
        })

        if (actionDone === 'add task' || actionDone === 'complete task' || actionDone === 'remove task') {
          await fetchUserDataApi()
        }

        if (actionDone === 'add task' || actionDone === 'edit task' || actionDone === 'remove task' || actionDone === 'member edit project task') {
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
  }, [actionDone, fetchAllTasksApi, fetchRankApi, fetchTagsApi, fetchUserDataApi, dispatch])

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

  // load tasks
	useEffect(() => {
		const fetchApis = async () => {	
      await fetchAllTasksApi({
        page: 1,
        size: 2,
        sortingType: -1,
        sortBy: 'createdAt',
        completed: false
      })

			setLoading(false)
		}
	
		fetchApis()
	}, [fetchAllTasksApi])

  // fetch api data
	useEffect(() => {
    if (allTasksApiData?.record) {
      setOrderedTasks(allTasksApiData.record)
    }

	}, [allTasksApiData])

  if (loading) {
    return (
      <div />
    )
  }

  if (allTasksApiError) {
    console.log(allTasksApiError)
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

  return (
    <div className='main-content'>
      <p className='page-name'>Home</p>

      <div className='home-container'>
        <div className='home-left-section'>
          <Progress />
          
          <ProgressGraph />

          <p>Recent Tasks</p>

          <div className='home-bottom-section'>
            <div className='home-recent-tasks'>
              {
                orderedTasks.map((task) => (
                  <HomeTask task={task} key={task._id}/>
                ))
              }
            </div>

            <div className='home-button-wrapper'>
              <button
                className='home-add-task-button'
                onClick={() => dispatch(addPopup('add'))}
              >
                <PlusIcon color='#5468E7'/>

                Task
              </button>

              <button
                className='home-add-project-button'
                onClick={() => dispatch(addPopup('add project'))}
              >
                <PlusIcon color='#F48C06'/>

                Project
              </button>
            </div>
          </div>
        </div>

        <div className='home-right-section'>
          <ProgressBar />

          <Leaderboard />
        </div>
      </div>

    </div>
  )
}