import { PostInterface } from '../typings/Post.interfaces'
import Carousel from './Carousel'
import Comment from './Comment'

const Gallery = ({ data }: { data: PostInterface[] }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
      {data.map((item, index) => (
        <div key={index}>
          <Carousel imagesCarousel={item.imageUrls || []} />
          <h2>
            <strong>Created by:</strong> {item.displayName}
          </h2>
          <Comment
            comments={item.comments || []}
            postId={item.id}
          />
        </div>
      ))}
    </div>
  )
}
export default Gallery
