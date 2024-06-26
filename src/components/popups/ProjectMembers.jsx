import { useDispatch, useSelector } from 'react-redux'
import { addPopup, removePopup, setCurrentMember, setCurrentInviteLink } from '../../features/navigation/navigationSlice'
import { useEffect, useState } from 'react'
import { inviteLinkApi } from '../../apis/projectsApi'
import useApi from '../../hooks/useApi'
import RemoveMember from '../../svg/projects/RemoveMember'
import CloseIcon from '../../svg/others/CloseIcon'
import PlusIcon from '../../svg/projects/PlusIcon'
import '../../css/components/ProjectMembers.css'

export default function TaskPreview({ currentProject, currentMembers }) {
  const myId = useSelector((state) => state.user.id)

  const dispatch = useDispatch()

  const [membersSearchValue, setMembersSearchValue] = useState('')
  const [displayedMembers, setDisplayedMembers] = useState(currentMembers)

  const {
		fetchApi : fetchInviteLinkApi,
		apiData: inviteLinkApiData,
		apiError: inviteLinkApiError,
		apiLoading: inviteLinkApiLoading,
	} = useApi(inviteLinkApi)

  // updated shown members whenever the search changes
  useEffect(() => {
    if (membersSearchValue.trim() !== '') {
      setDisplayedMembers(currentMembers.filter((member) => member.name.toLowerCase().includes(membersSearchValue.toLowerCase().trim())))
    } else {
      setDisplayedMembers(currentMembers)
    }
  }, [membersSearchValue, currentMembers])

  // load link when its generated
	useEffect(() => {
    if (inviteLinkApiData) {
      dispatch(setCurrentInviteLink(inviteLinkApiData.link))

      dispatch(addPopup('invite link'))
    }
	}, [inviteLinkApiData, dispatch])

  const openInvite = async () => {
    await fetchInviteLinkApi(currentProject._id)
  }

  const confirmRemoval = (member) => {
    dispatch(addPopup('confirm member removal'))
    dispatch(setCurrentMember(member))
  }

  if (inviteLinkApiError) {
    console.log(inviteLinkApiError)
  }

  return (
    <div className='project-members-popup'>
      <div  className='project-members-heading'>
        <p>{currentProject.name}</p>
        
        <CloseIcon
          className='close-project-members'
          onClick={() => {
            dispatch(removePopup('project members'))
          }}
        />
      </div>

      <div className='project-members-upper-section'>
        <p className='project-members-count'>{currentProject.members.length} member{currentProject.members.length === 1 ? '' : 's'}
        </p>

        <input
          className='members-search'
          type='text'
          id='membersSearch'
          autoComplete='on'
          spellCheck='false'
          value={membersSearchValue}
          onChange={(e) => {
            setMembersSearchValue(e.target.value)
          }}
          placeholder='Search members...'
        />

        <div
          className='invite-members-button'
          onClick={openInvite}
          style={{ pointerEvents: inviteLinkApiLoading ? 'none' : '', cursor: inviteLinkApiLoading ? 'auto' : 'pointer' }}
        >
          <PlusIcon />

          <p>Invite Members</p>
        </div>
      </div>

      <div className='all-memebers-container'>
          {
            displayedMembers.length !== 0 && (
              <div className="horizontal-dashed-line"></div>
            )
          }

          {
            displayedMembers.map((member) => (
              <div className='single-member-container' key={member._id}>
                <div className='single-member-data'>
                  <div>
                    <img
                      src={`https://intime-9hga.onrender.com/api/v1/images/${member.avatar}`}
                      alt='profile-pic'
                      className='single-member-profile-pic'
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = require('../../assets/images/profile-pic.jpeg')
                      }}
                    />
                    
                    <p className='single-member-name'>{member.name}</p>

                    <p className='single-member-email'>{member.email}</p>
                  </div>

                  <div>
                    <p className='single-member-role'>{currentProject.members.find((projectMember) => projectMember.memberId === member._id)?.role === 'admin' ? 'admin' : 'member'}</p>

                    {
                    currentProject.members.find((projectMember) => projectMember.memberId === myId)?.role === 'admin'  ?
                    currentProject.members.find((projectMember) => projectMember.memberId === member._id)?.role !== 'admin' ?
                    <RemoveMember confirmRemoval={() => confirmRemoval(member)} /> :
                    '' :
                    ''
                    }

                  </div>
                </div>

                <div className="horizontal-dashed-line"></div>
              </div>
            ))
          }
        </div>
    </div>
  )
}