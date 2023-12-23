export interface CommentInterface {
  id: string
  content: string
  timestamp: string
  userId: string
  postId: string
}

export interface PostInterface {
  id: string
  title?: string
  imageUrls?: string[]
  comments?: CommentInterface[]
  likes?: string[]
  userId: string
  timestamp: string
  content?: string
  displayName?: string
}
