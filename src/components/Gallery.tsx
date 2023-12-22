import Carousel from './Carousel'

const Gallery = ({ images }: { images: string[] }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
      {images.map((image, index) => (
        <Carousel
          key={index}
          imagesCarousel={images}
        />
      ))}
    </div>
  )
}
export default Gallery
