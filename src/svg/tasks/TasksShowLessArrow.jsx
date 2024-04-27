export default function ShowLessArrow({ isHovered }) {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" transform="scale(1, -1)">
      <path d="M2 2L10 12L18 2" stroke={isHovered ? '#5468E7' : 'black'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg> 
  )
}