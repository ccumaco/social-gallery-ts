// PostContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react'
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore'
import { Post } from '../typings/Post.interfaces'

const db = getFirestore()

interface PostContextProps {
  posts: Post[]
  addPost: (newPost: Post) => void
}

const PostContext = createContext<PostContextProps | undefined>(undefined)

interface PostProviderProps {
  children: ReactNode
}

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([])

  const addPost = async (newPost: Post) => {
    try {
      const docRef = await addDoc(collection(db, 'Posts'), newPost)
      setPosts((prevPosts) => [...prevPosts, { ...newPost, id: docRef.id }])
    } catch (error) {
      console.error('Error adding post:', error)
    }
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Posts'), (snapshot) => {
      try {
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[]
        setPosts(postsData)
      } catch (error) {
        console.error('Error mapping snapshot data:', error)
      }
    })

    return () => unsubscribe()
  }, [db, setPosts])

  return (
    <PostContext.Provider value={{ posts, addPost }}>
      {children}
    </PostContext.Provider>
  )
}

export const usePost = (): PostContextProps => {
  const context = useContext(PostContext)
  if (!context) {
    throw new Error('usePost debe ser utilizado dentro de un PostProvider')
  }
  return context
}
