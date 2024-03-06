import { useSelector } from 'react-redux'

export default function TasksIcon() {
  const currentPage = useSelector((state) => state.navigation.currentPage)
  const color = (currentPage === 'tasks') ? "#5468E7" : "black"

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1.05823" width="22" height="22" rx="4" stroke={color} strokeWidth="1.5"/>
      <path d="M6.5 6.55823H17.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6.5 12.0582H17.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6.5 17.5582H12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}