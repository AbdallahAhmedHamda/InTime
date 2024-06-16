import { useSelector } from 'react-redux'

export default function ProfileIcon() {
  const currentPage = useSelector((state) => state.navigation.currentPage)
  const color = currentPage === 'profile' ? '#5468E7' : 'black'
  
  return (
    <svg width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>{`.cls-1{fill:none;stroke:${color};stroke-miterlimit:10;stroke-width:1.91px;}`}</style>
    </defs>
    <circle className="cls-1" cx="12" cy="7.25" r="5.73" />
    <path className="cls-1" d="M1.5,23.48l.37-2.05A10.3,10.3,0,0,1,12,13h0a10.3,10.3,0,0,1,10.13,8.45l.37,2.05" />
  </svg>
)
}