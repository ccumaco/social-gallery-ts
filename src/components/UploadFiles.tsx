import { useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { ReactComponent as CameraIcon } from './../icons/camara-icon.svg'
import { usePost } from '../context/PostProvider'
import { useUser } from '../context/UserProvider'
import { uid } from 'uid'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'

const UploadFiles = () => {
  const [comment, setComment] = useState('')
  const [images, setImages] = useState<object[]>([{}])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [showCamera, setShowCamera] = useState(false)
  const [blobImages, setBlobImages] = useState<Blob[]>([])
  const { addPost } = usePost()
  const { user } = useUser()
  const webcamRef = useRef(null) as any
  const uidStatic = uid()
  const uploadImage = async (blob: Blob): Promise<string> => {
    const storage = getStorage()
    const timestamp = new Date().getTime()
    const extension = blob.type.split('/')?.pop() || 'jpg'

    const storageRef = ref(
      storage,
      `${user?.uid}/${uidStatic}/image-${uid()}.${extension}`,
    )
    await uploadBytes(storageRef, blob)
    const downloadURL = await getDownloadURL(storageRef)
    return downloadURL
  }

  const handleImageUpload = (e: any) => {
    if (e.target.files) {
      const selectedImages: Blob[] = [] // Cambiar de object a Blob
      const selectedImagePreviews: string[] = []

      for (let i = 0; i < e.target.files.length; i++) {
        const item = e.target.files[i]

        const blob = new Blob([item], {
          type: item.type,
        })
        setBlobImages((prevBlobImages) => [...prevBlobImages, blob])

        const imageObject = URL.createObjectURL(blob)
        selectedImages.push(blob)
        selectedImagePreviews.push(imageObject)
      }

      setImages((prevImages) => [...prevImages, ...selectedImages])

      setImagePreviews((prevPreviews) => [
        ...prevPreviews,
        ...selectedImagePreviews,
      ])
    }
  }

  const handlePostComment = async (e: any) => {
    e.preventDefault()

    const timestamp = new Date().getTime()

    const imageUrls = await Promise.all(blobImages.map(uploadImage))

    const newPost = {
      id: Math.random().toString(36).substr(2, 18),
      content: comment,
      userId: String(user?.uid),
      timestamp: String(Date.now()),
      comments: [],
      likes: [],
      imageUrls: imageUrls,
    }

    addPost(newPost)
    setComment('')
    setImages([])
    setImagePreviews([])
    setBlobImages([])
  }

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove),
    )
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, index) => index !== indexToRemove),
    )
  }
  const handleCapturePhoto = (close: boolean) => {
    if (close) {
      setShowCamera(close)
    }
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
    <div>
      <form onSubmit={handlePostComment}>
        <div className='w-full mb-2 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600'>
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
                onClick={() => handleCapturePhoto(true)}
                className='inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600'
              >
                <CameraIcon className='w-4 h-4' />

                <span className='sr-only'>Capture photo</span>
              </button>
            </div>
          </div>
        </div>
      </form>
      {showCamera && (
        <div className='relative rounded-md overflow-hidden mb-2 w-full'>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat='image/jpeg'
            className='w-full h-full'
            onUserMedia={() => handleCapturePhoto(false)}
          />
          <button
            className='absolute bottom-3 left-0 right-0'
            onClick={() => handleCapturePhoto(false)}
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
      {imagePreviews.length > 0 && (
        <div className='flex space-x-2 mb-2'>
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
      )}
    </div>
  )
}

export default UploadFiles
