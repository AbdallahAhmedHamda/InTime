export default function AddTaskIcon({ showPopup }) {
  return (
    <svg width='43' height='44' cursor='pointer' viewBox='0 0 43 44' fill='none' xmlns='http://www.w3.org/2000/svg' onClick={showPopup}>
      <circle cx='21.5' cy='22.2593' r='21.5' fill='#5468E7'/>
      <path fillRule='evenodd' clipRule='evenodd' d='M21.5 13.944C22.2412 13.944 22.8421 14.5095 22.8421 15.2071V20.6808H28.6579C29.3991 20.6808 30 21.2463 30 21.944C30 22.6416 29.3991 23.2071 28.6579 23.2071H22.8421V28.6808C22.8421 29.3784 22.2412 29.944 21.5 29.944C20.7588 29.944 20.1579 29.3784 20.1579 28.6808V23.2071H14.3421C13.6009 23.2071 13 22.6416 13 21.944C13 21.2463 13.6009 20.6808 14.3421 20.6808H20.1579V15.2071C20.1579 14.5095 20.7588 13.944 21.5 13.944Z' fill='white'/>
    </svg>
  )
}