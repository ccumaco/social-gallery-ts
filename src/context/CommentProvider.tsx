// CommentContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react'
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore'
import { CommentInterface } from '../typings/Post.interfaces'
import { uid } from 'uid'

const db = getFirestore()

interface CommentContextProps {
  comments: CommentInterface[]
  likes: CommentInterface[]
  addComment: (newComment: CommentInterface, postId: string) => void
  addLike: (postId: string, userId: string) => void
}

const CommentContext = createContext<CommentContextProps | undefined>(undefined)

interface CommentProviderProps {
  children: ReactNode
}

export const CommentProvider: React.FC<CommentProviderProps> = ({
  children,
}) => {
  const [comments, setComments] = useState<CommentInterface[]>([])
  const [likes, setLikes] = useState<CommentInterface[]>([])

  const addLike = async (postId: string, userId: string) => {
    try {
      const postQuery = query(collection(db, 'Posts'), where('id', '==', postId))
      const postQuerySnapshot = await getDocs(postQuery)

      if (postQuerySnapshot.docs.length > 0) {
        const postDoc = postQuerySnapshot.docs[0]
        const existingLikes = postDoc.data().likes || []
        const userLikedIndex = existingLikes.findIndex(
          (like: any) => like.userId === userId,
        )

        if (userLikedIndex === -1) {
          await updateDoc(postDoc.ref, {
            likes: [...existingLikes, { userId }],
          })
        } else {
          existingLikes.splice(userLikedIndex, 1)
          await updateDoc(postDoc.ref, {
            likes: existingLikes,
          })
        }
        setLikes(existingLikes)
      } else {
        console.error('Post not found')
      }
    } catch (error) {
      console.error('Error adding like:', error)
    }
  }

  const addComment = async (newComment: CommentInterface, postId: string) => {
    try {
      const docRef = await addDoc(collection(db, 'Comments'), newComment)

      // Update the 'comments' field in the corresponding post
      const postQuery = query(collection(db, 'Posts'), where('id', '==', postId))
      const postQuerySnapshot = await getDocs(postQuery)

      if (postQuerySnapshot.docs.length > 0) {
        const postDoc = postQuerySnapshot.docs[0]
        const existingComments = postDoc.data().comments || []

        await updateDoc(postDoc.ref, {
          comments: [
            ...existingComments,
            { id: docRef.id, content: newComment.content },
          ],
        })
      } else {
        console.error('Post not found')
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Comments'), (snapshot) => {
      try {
        const commentsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as CommentInterface[]
        setComments(commentsData)
      } catch (error) {
        console.error('Error mapping snapshot data:', error)
      }
    })

    return () => unsubscribe()
  }, [db, setComments])

  return (
    <CommentContext.Provider value={{ comments, addComment, addLike, likes }}>
      {children}
    </CommentContext.Provider>
  )
}

export const useComment = (): CommentContextProps => {
  const context = useContext(CommentContext)
  if (!context) {
    throw new Error('useComment debe ser utilizado dentro de un CommentProvider')
  }
  return context
}
