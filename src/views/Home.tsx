import React, { useEffect, useState } from 'react'
import Carousel from '../components/Carousel'
import Gallery from '../components/Gallery'
import UploadFiles from '../components/UploadFiles'
import { PostInterface, CommentInterface } from '../typings/Post.interfaces'
import {
  collection,
  getFirestore,
  getDocs,
  DocumentData,
} from 'firebase/firestore'

const Home = () => {
  const [data, setData] = useState<PostInterface[]>([])
  const db = getFirestore()
  const postsCollection = collection(db, 'Posts')
  const commentsCollection = collection(db, 'Comments')

  // Función para obtener datos de la colección de Posts
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

  // Función para obtener datos de la colección de Comments
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

  // Función para combinar datos de Posts y Comments
  const combineData = (
    postsData: PostInterface[],
    commentsData: CommentInterface[],
  ) => {
    return postsData.map((post) => {
      const postComments = commentsData.filter(
        (comment) => comment.id === post.id,
      )
      return {
        ...post,
        comments: postComments,
      }
    })
  }

  // Uso de las funciones para obtener y combinar datos
  const fetchData = async () => {
    const postsData = await getPostsData()
    const commentsData = await getCommentsData()

    const combinedData = combineData(postsData, commentsData)

    // Actualiza el estado con los datos combinados
    setData(combinedData)

    // Puedes usar los datos combinados según tus necesidades
    console.log('Datos combinados:', combinedData)
  }

  // Llama a la función para obtener y combinar datos al montar el componente
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='px-4 mx-auto max-w-screen-xl'>
      <UploadFiles />
      <h2 className='text-3xl uppercase text-center mb-2 mt-0'>Photos</h2>
      <Gallery data={data} />
    </div>
  )
}

export default Home
