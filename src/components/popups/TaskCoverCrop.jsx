import { useSelector, useDispatch } from 'react-redux'
import { removePopup, setCroppedImage } from '../../features/navigation/navigationSlice'
import { useRef, useState, useEffect } from 'react'
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from 'react-image-crop'
import CloseIcon from '../../svg/others/CloseIcon'
import 'react-image-crop/dist/ReactCrop.css'
import '../../css/components/ImageCrop.css'



export default function TaskCoverCrop() {
  const uncroppedImage = useSelector((state) => state.navigation.uncroppedImage)

  const dispatch = useDispatch()

  const [crop, setCrop] = useState()
  const [minWidth, setMinWidth] = useState()
  const [minHeight, setMinHeight] = useState()
  
  const imgRef = useRef()
  const previewCanvasRef = useRef()

  // adjust crop tool when window resizes
  useEffect(() => {
    const handleResize = () => {
      setMinWidth(240 * imgRef.current?.width / imgRef.current?.naturalWidth)
      setMinHeight(128 * imgRef.current?.height / imgRef.current?.naturalHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // set crop tool when image loads
  const onImageLoad = (e) => {
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget
    const cropWidthInPercent = (240 / width) * 100
    const cropHeightInPercent = (128 / height) * 100

    const crop = makeAspectCrop(
      {
        unit: '%',
        width: cropWidthInPercent,
        height: cropHeightInPercent
      },
      240/128,
      width,
      height
    )
    setCrop(centerCrop(crop, width, height))
    setMinWidth(240 * width / naturalWidth)
    setMinHeight(128 * height / naturalHeight)
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
          onClick={() => dispatch(removePopup('crop task cover'))}
        />
      </div>

      <div className='task-cover-crop-container'>
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          keepSelection={true}
          aspect={240/128}
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
          dispatch(setCroppedImage(previewCanvasRef.current.toDataURL()))
          dispatch(removePopup('crop task cover'))
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