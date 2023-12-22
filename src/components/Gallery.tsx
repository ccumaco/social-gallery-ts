import { PostInterface } from '../typings/Post.interfaces'
import Carousel from './Carousel'
import Comment from './Comment'

const Gallery = ({ data }: { data: PostInterface[] }) => {
  console.log(data, 'data')

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
      {data.map((item, index) => (
        <div key={index}>
          <Carousel imagesCarousel={item.imageUrls || []} />
          <Comment comments={item.comments || []} />
        </div>
      ))}
    </div>
  )
}
export default Gallery
