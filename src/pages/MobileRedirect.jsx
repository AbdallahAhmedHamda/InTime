import '../css/pages/MobileRedirect.css'

export default function MobileRedirect() {
  const downloadLink = 'https://mega.nz/file/MjoSkYgQ#rYBs2-h3DTy218jpemxrKLhXqstqYQuM_G2jYLzd29c'

  const handleDownload = () => {
    window.location.href = downloadLink
  }

  return (
    <div className='mobile-redirect-page'>
      <div className='mobile-redirect-container'>
        <img 
          alt='logo'
          className='mobile-redirect-logo'
          src={require('../assets/images/logo.png')}
        />

        <button onClick={handleDownload} className='mobile-redirect-button'>
          Download Our App
        </button>
      </div>
    </div>
  )
}