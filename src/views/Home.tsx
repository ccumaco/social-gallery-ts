import { useEffect, useState } from 'react'
import {
  getFirestore,
  collection,
  getDocs,
  DocumentData,
  where,
  query,
} from 'firebase/firestore'
import { usePost } from '../context/PostProvider'
import { PostInterface, CommentInterface } from '../typings/Post.interfaces'
import Gallery from '../components/Gallery'
import UploadFiles from '../components/UploadFiles'

const Home = () => {
  const { posts } = usePost()
  const [data, setData] = useState<PostInterface[]>([])
  const db = getFirestore()
  const postsCollection = collection(db, 'Posts')
  const commentsCollection = collection(db, 'Comments')

  const getPostsData = async () => {
    try {
      const snapshot = await getDocs(postsCollection)
      const postsData: PostInterface[] = snapshot.docs.map(
        (doc: DocumentData) => ({
          id: doc.id,
          ...doc.data(),
        }),
      )
      return postsData
    } catch (error) {
      console.error('Error obteniendo datos de Posts:', error)
      return []
    }
  }

  const getCommentsData = async () => {
    try {
      const snapshot = await getDocs(commentsCollection)
      const commentsData: CommentInterface[] = snapshot.docs.map(
        (doc: DocumentData) => ({
          id: doc.id,
          ...doc.data(),
        }),
      )
      return commentsData
    } catch (error) {
      console.error('Error obteniendo datos de Comments:', error)
      return []
    }
  }

  const getAuthUserData = async (
    userId: string,
  ): Promise<{ displayName: string | null }> => {
    const db = getFirestore()
    const usersCollection = collection(db, 'Users')

    try {
      const querySnapshot = await getDocs(
        query(usersCollection, where('uid', '==', userId)),
      )

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data()

        return {
          displayName: userData?.displayName || null,
        }
      } else {
        return { displayName: null }
      }
    } catch (error) {
      console.error('Error obteniendo datos de usuario:', error)
      return { displayName: null }
    }
  }

  const combineData = async (
    postsData: PostInterface[],
    commentsData: CommentInterface[],
  ): Promise<PostInterface[]> => {
    try {
      const combinedPosts: PostInterface[] = await Promise.all(
        postsData.map(async (post) => {
          const authData = await getAuthUserData(post?.userId)
          const postComments = commentsData.filter(
            (comment) => comment.postId === post.id,
          )

          return {
            ...post,
            comments: postComments,
            displayName: authData?.displayName || 'Anónimo',
          }
        }),
      )

      return combinedPosts
    } catch (error) {
      console.error('Error combinando datos:', error)
      return []
    }
  }

  const fetchData = async () => {
    try {
      const postsData = await getPostsData()
      const commentsData = await getCommentsData()
      const combinedData = await combineData(postsData, commentsData)
      setData(combinedData.reverse())
    } catch (error) {
      console.error('Error al cargar datos:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
  useEffect(() => {
    fetchData()
  }, [posts])

  return (
    <div className='px-4 mx-auto max-w-screen-xl'>
      <UploadFiles />
      <div className='my-10'></div>
      <Gallery data={data} />
    </div>
  )
}

export default Home
