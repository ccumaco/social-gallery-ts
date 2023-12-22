import { useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { ReactComponent as CamaraIcon } from './../icons/camara-icon.svg'

const UploadFiles = () => {
  const [comment, setComment] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [showCamera, setShowCamera] = useState(false)
  const [errorCamera, setErrorCamera] = useState(false)

  const webcamRef = useRef(null) as any

  const handleImageUpload = (e: any) => {
    if (e.target.files) {
      const selectedImages: string[] = []
      const selectedImagePreviews: string[] = []

      for (let i = 0; i < e.target.files.length; i++) {
        const imageObject = URL.createObjectURL(e.target.files[i])
        selectedImages.push(imageObject)
        selectedImagePreviews.push(URL.createObjectURL(e.target.files[i]))
      }

      setImages((prevImages) => [...prevImages, ...selectedImages])
      setImagePreviews((prevPreviews) => [
        ...prevPreviews,
        ...selectedImagePreviews,
      ])
    }
  }

  const handlePostComment = (e: any) => {
    e.preventDefault()
    console.log('Comment:', comment)
    console.log('Images:', images)
    setComment('')
    setImages([])
    setImagePreviews([])
  }

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove),
    )
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, index) => index !== indexToRemove),
    )
  }
  const handleCapturePhoto = async () => {
    try {
      // Solicitar permisos para acceder a la cámara
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })

      setShowCamera(true)

      if (webcamRef.current) {
        webcamRef.current.video.srcObject = stream
        const photo = webcamRef.current.getScreenshot?.()

        if (photo) {
          setImages((prevImages) => [...prevImages, photo])
          setImagePreviews((prevPreviews) => [...prevPreviews, photo])
          setShowCamera(false)
          stream.getTracks().forEach((track) => track.stop())
        }
      }
      setErrorCamera(false)
    } catch (error) {
      console.error('Error al acceder a la cámara:', error)
      setErrorCamera(true)
    }
  }
  const handleCaptureComplete = () => {
    if (webcamRef.current) {
      const photo = webcamRef.current.getScreenshot?.()

      if (photo) {
        setImages((prevImages) => [...prevImages, photo])
        setImagePreviews((prevPreviews) => [...prevPreviews, photo])
        setShowCamera(false)
      }
    }
  }

  return (
    <div className='mb-4'>
      <form onSubmit={handlePostComment}>
        <div className='w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600'>
          <div className='px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800'>
            <label
              htmlFor='comment'
              className='sr-only'
            >
              Your comment
            </label>
            <textarea
              id='comment'
              rows={4}
              className='w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400'
              placeholder='Write a comment...'
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
          <div className='flex items-center justify-between px-3 py-2 border-t dark:border-gray-600'>
            <button
              type='submit'
              className='inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800'
            >
              Post comment
            </button>
            <div className='flex ps-0 space-x-1 rtl:space-x-reverse sm:ps-2'>
              <label
                htmlFor='upload'
                className='sr-only'
              >
                Upload image
              </label>
              <input
                type='file'
                id='upload'
                accept='image/*'
                multiple
                onChange={handleImageUpload}
                className='hidden'
              />
              <label
                htmlFor='upload'
                className='inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600'
              >
                <svg
                  className='w-4 h-4'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 20 18'
                >
                  <path d='M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z' />
                </svg>
                <span className='sr-only'>Upload image</span>
              </label>
              <button
                type='button'
                onClick={handleCapturePhoto}
                className='inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600'
              >
                <CamaraIcon className='w-4 h-4' />

                <span className='sr-only'>Capture photo</span>
              </button>
            </div>
          </div>
        </div>
      </form>
      {showCamera && (
        <div className='relative'>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat='image/jpeg'
            className='w-full h-full'
            onUserMedia={() => handleCaptureComplete()}
          />
          <button
            className='absolute bottom-3 left-0 right-0'
            onClick={handleCapturePhoto}
          >
            <svg
              className='w-12 h-12 mx-auto'
              xmlns='http://www.w3.org/2000/svg'
              fill='gray'
              viewBox='0 0 24 24'
              stroke='currentColor'
              aria-hidden='true'
            >
              <circle
                cx='12'
                cy='12'
                r='10'
              />
            </svg>
          </button>
        </div>
      )}
      {errorCamera && (
        <p className='text-sm text-red-500 dark:text-red-400'>
          Error al acceder a la cámara
        </p>
      )}
      <div className='flex space-x-2 mb-4'>
        {imagePreviews.map((preview, index) => (
          <div
            key={index}
            className='relative'
          >
            <img
              src={preview}
              alt={`Preview ${index}`}
              className='w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600'
            />
            <button
              type='button'
              onClick={() => handleRemoveImage(index)}
              className='absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            >
              <svg
                className='w-4 h-4'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M2 5a2 2 0 012-2h12a2 2 0 012 2V6a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2 0v12h12V5H4zm2 2h8v8H6V7zm2 2v4h4V9H8z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='sr-only'>Remove image</span>
            </button>
          </div>
        ))}
      </div>

      <p className='ms-auto text-xs text-gray-500 dark:text-gray-400'>
        Remember, contributions to this topic should follow our{' '}
        <a
          href='#'
          className='text-blue-600 dark:text-blue-500 hover:underline'
        >
          Community Guidelines
        </a>
        .
      </p>
    </div>
  )
}

export default UploadFiles
