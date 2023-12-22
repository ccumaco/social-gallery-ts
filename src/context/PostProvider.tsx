// PostContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react'
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore'
import { PostInterface } from '../typings/Post.interfaces'

const db = getFirestore()

interface PostContextProps {
  posts: PostInterface[]
  addPost: (newPost: PostInterface) => void
}

const PostContext = createContext<PostContextProps | undefined>(undefined)

interface PostProviderProps {
  children: ReactNode
}

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<PostInterface[]>([])

  const addPost = async (newPost: PostInterface) => {
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
        })) as PostInterface[]
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
