import { useSelector } from 'react-redux'

export default function SideCalendar() {
  const currentPage = useSelector((state) => state.navigation.currentPage)
  const color = (currentPage === 'calendar') ? "#5468E7" : "black"
  
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="2.75061" width="22" height="20.3077" rx="5" stroke={color} strokeWidth="1.5"/>
      <path d="M1 8.39149H23" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M17.5 1.05823L17.5 4.44284" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.50003 1.05823L6.50003 4.44284" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.27777 12.9044H6.49999" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11.3889 12.9044H12.6111" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17.5 12.9044H18.7222" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.27777 17.4172H6.49999" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11.3889 17.4172H12.6111" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17.5 17.4172H18.7222" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}