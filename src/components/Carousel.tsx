import React, { useState } from 'react'

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(1) // Starting index for active item
  const images = ['/descarga.jpeg', '/logo512.png']
  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    )
  }

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    )
  }

  return (
    <div
      id='controls-carousel'
      className='relative w-full'
      data-carousel='static'
    >
      {/* Carousel wrapper */}
      <div className='relative h-56 overflow-hidden rounded-lg md:h-96'>
        {/* Carousel items */}
        {images.map((image, index) => (
          <div
            key={image}
            className={`${
              index === activeIndex ? 'block' : 'hidden'
            } duration-700 ease-in-out`}
            data-carousel-item={index === activeIndex ? 'active' : undefined}
          >
            <img
              src={image}
              className='absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'
              alt={`Slide ${image}`}
            />
          </div>
        ))}
      </div>
      {/* Slider controls */}
      <button
        onClick={handlePrev}
        type='button'
        className='absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none'
        data-carousel-prev
      >
        <span className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none'>
          <svg
            className='w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 6 10'
          >
            <path
              stroke='currentColor'
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='2'
              d='M5 1 1 5l4 4'
            />
          </svg>
          <span className='sr-only'>Previous</span>
        </span>
      </button>
      <button
        onClick={handleNext}
        type='button'
        className='absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none'
        data-carousel-next
      >
        <span className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none'>
          <svg
            className='w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 6 10'
          >
            <path
              stroke='currentColor'
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='2'
              d='m1 9 4-4-4-4'
            />
          </svg>
          <span className='sr-only'>Next</span>
        </span>
      </button>
    </div>
  )
}

export default Carousel
