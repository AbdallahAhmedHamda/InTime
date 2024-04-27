export default function AddTaskIcon({ showPopup }) {
  return (
    <svg width="75" height="76" viewBox="0 0 75 76" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={showPopup} cursor='pointer'>
      <g filter="url(#filter0_d_107_272)">
      <ellipse cx="37.5" cy="34" rx="33.5" ry="33.75" fill="white"/>
      </g>
      <path fillRule="evenodd" clipRule="evenodd" d="M37.5 16.2812C39.1067 16.2812 40.4092 17.5219 40.4092 19.0523V31.0602H53.0157C54.6225 31.0602 55.9249 32.3008 55.9249 33.8312C55.9249 35.3616 54.6225 36.6023 53.0157 36.6023H40.4092V48.6102C40.4092 50.1406 39.1067 51.3812 37.5 51.3812C35.8932 51.3812 34.5907 50.1406 34.5907 48.6102V36.6023H21.9842C20.3774 36.6023 19.075 35.3616 19.075 33.8312C19.075 32.3008 20.3774 31.0602 21.9842 31.0602H34.5907V19.0523C34.5907 17.5219 35.8932 16.2812 37.5 16.2812Z" fill="#5468E7"/>
      <defs>
      <filter id="filter0_d_107_272" x="0" y="0.25" width="75" height="75.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="4"/>
      <feGaussianBlur stdDeviation="2"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_107_272"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_107_272" result="shape"/>
      </filter>
      </defs>
    </svg>
  )
}