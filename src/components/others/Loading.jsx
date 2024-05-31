import { useEffect, useRef } from 'react'
import '../../css/components/Loading.css'

export default function Loading() {
  const containerRef = useRef(null)

  //change the min-width for the page depending if there is a scroll or if there is not
  useEffect(() => {
    const adjustHeight = () => {
      if (containerRef.current) {
        const hasHorizontalScrollbar = document.body.scrollWidth > window.innerWidth
        if (hasHorizontalScrollbar) {
          containerRef.current.style.minHeight = `calc(100vh - 8px)`
        } else {
          containerRef.current.style.minHeight = '100vh'
        }
      }
    }

    adjustHeight()

    window.addEventListener('resize', adjustHeight)

    return () => {
      window.removeEventListener('resize', adjustHeight)
    }
  }, [containerRef])
    
  return (
    <div className='loading-page-container' ref={containerRef}>
      <img src={require('../../assets/images/logo.png')} alt='loading-hero-img' className='loading-hero-img' />
    </div>
  )
}