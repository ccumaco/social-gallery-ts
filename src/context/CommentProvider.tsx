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
} from 'firebase/firestore'
import { CommentInterface } from '../typings/Post.interfaces'
import { uid } from 'uid'

const db = getFirestore()

interface CommentContextProps {
  comments: CommentInterface[]
  addComment: (newComment: CommentInterface, postId: string) => void
}

const CommentContext = createContext<CommentContextProps | undefined>(undefined)

interface CommentProviderProps {
  children: ReactNode
}

export const CommentProvider: React.FC<CommentProviderProps> = ({
  children,
}) => {
  const [comments, setComments] = useState<CommentInterface[]>([])

  const addComment = async (newComment: CommentInterface, postId: string) => {
    try {
      const docRef = await addDoc(collection(db, 'Comments'), newComment)

      // Update the 'comments' field in the corresponding post
      const postDocRef = doc(db, 'Posts', postId)
      const postDoc = await getDoc(postDocRef)

      if (postDoc.exists()) {
        const existingComments = postDoc.data()?.comments || []
        await updateDoc(postDocRef, {
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
    <CommentContext.Provider value={{ comments, addComment }}>
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
