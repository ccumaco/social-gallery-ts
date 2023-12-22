export interface Comment {
  id: string
  content: string
  userId: string
  timestamp: string
}

export interface Post {
  id: string
  content: string
  userId: string
  timestamp: string
  comments: Comment[]
  likes: string[]
}
