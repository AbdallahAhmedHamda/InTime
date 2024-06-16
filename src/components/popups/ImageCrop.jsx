import { useSelector, useDispatch } from 'react-redux'
import { removePopup, setCroppedTaskImage, setCroppedProfilePic } from '../../features/navigation/navigationSlice'
import { useRef, useState, useEffect } from 'react'
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from 'react-image-crop'
import CloseIcon from '../../svg/others/CloseIcon'
import 'react-image-crop/dist/ReactCrop.css'
import '../../css/components/ImageCrop.css'



export default function ImageCrop({ popup, bestWidth, bestHeight, imageFor }) {
  const uncroppedImage = useSelector((state) => (
    imageFor === 'task'
      ? state.navigation.uncroppedTaskImage
      : imageFor === 'profilePic'
        ? state.navigation.uncroppedProfilePic
        : ''
  ))


  const dispatch = useDispatch()

  const [crop, setCrop] = useState()
  const [minWidth, setMinWidth] = useState()
  const [minHeight, setMinHeight] = useState()
  
  const imgRef = useRef()
  const previewCanvasRef = useRef()

  // adjust crop tool when window resizes
  useEffect(() => {
    const handleResize = () => {
      setMinWidth(bestWidth * imgRef.current?.width / imgRef.current?.naturalWidth)
      setMinHeight(bestHeight * imgRef.current?.height / imgRef.current?.naturalHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [bestWidth, bestHeight])

  // set crop tool when image loads
  const onImageLoad = (e) => {
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget
    const cropWidthInPercent = (bestWidth / width) * 100
    const cropHeightInPercent = (bestHeight / height) * 100

    const crop = makeAspectCrop(
      {
        unit: '%',
        width: cropWidthInPercent,
        height: cropHeightInPercent
      },
      bestWidth/bestHeight,
      width,
      height
    )
    setCrop(centerCrop(crop, width, height))
    setMinWidth(bestWidth * width / naturalWidth)
    setMinHeight(bestHeight * height / naturalHeight)
  }

  // get the cropped image
  const setCanvasPreview = (
    image,
    canvas,
    crop
  ) => {
    const ctx = canvas.getContext('2d')
    const pixelRatio = window.devicePixelRatio
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
  
    canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio)
  
    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = 'high'
    ctx.save()
  
    const cropX = crop.x * scaleX
    const cropY = crop.y * scaleY
  
    ctx.translate(-cropX, -cropY)
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    )
  
    ctx.restore()
  }

  return (
    <div className='task-cover-crop-popup'>
      <div className='task-cover-crop-heading'>
        <p>Crop Your Image</p>
        
        <CloseIcon
          className='close-task-cover-crop'
          onClick={() => dispatch(removePopup(popup))}
        />
      </div>

      <div className='task-cover-crop-container'>
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          keepSelection={true}
          aspect={bestWidth/bestHeight}
          minWidth={minWidth}
          minHeight={minHeight}
          className='task-cover-crop'
        >
          <img
            src={uncroppedImage}
            ref={imgRef}
            alt='Upload'
            onLoad={onImageLoad}
            className='no-select'
            style={{
              maxHeight: 'calc(80vh - 50px)',
              maxWidth: 'calc(80vw - 50px)',
            }}
          />
        </ReactCrop>
      </div>

      <button
        className='crop-image-button'
        onClick={() => {
          setCanvasPreview(
            imgRef.current,
            previewCanvasRef.current,
            convertToPixelCrop(
              crop,
              imgRef.current.width,
              imgRef.current.height
            )
          )

          if (imageFor === 'task') {
            dispatch(setCroppedTaskImage(previewCanvasRef.current.toDataURL()))
          } else if (imageFor === 'profilePic') {
            dispatch(setCroppedProfilePic(previewCanvasRef.current.toDataURL()))
          }

          dispatch(removePopup(popup))
        }}
      >
        Crop Image
      </button>

      <canvas
        ref={previewCanvasRef}
        style={{ display: 'none' }}
      />
    </div>
  )
}