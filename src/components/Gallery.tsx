import Carousel from './Carousel'

const Gallery = ({ images }: { images: string[] }) => {
  console.log(images, 'images')

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
