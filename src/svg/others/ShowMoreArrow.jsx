export default function ShowMoreArrow({ isHovered }) {
  return (
  <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 1.48242L5.5 6.48242L1 1.48242" stroke={isHovered ? "#5468E7" : "black"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>    
  )
}