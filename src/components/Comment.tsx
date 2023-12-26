import React, { useState } from 'react'
import { useComment } from './../context/CommentProvider'
import { CommentInterface } from '../typings/Post.interfaces'
import { useUser } from '../context/UserProvider'
import { uid } from 'uid'

const Comment = ({
  comments,
  postId,
}: {
  comments: CommentInterface[]
  postId: string
}) => {
  const [newComment, setNewComment] = useState('')
  const { user } = useUser()
  const { addComment, addLike } = useComment()
  const [showComments, setShowComments] = useState(false)
  const handleCommentSubmit = (e: any) => {
    e.preventDefault()

    if (newComment.trim() === '') {
      return
    }

    const commentData: CommentInterface = {
      content: newComment,
      id: uid(),
      timestamp: String(new Date()),
      userId: String(user?.uid),
      postId,
    }
    console.log(postId, 'postId')

    addComment(commentData, postId)

    setNewComment('')
  }

  return (
    <div className='m5'>
      {/* like button */}
      <button
        type='button'
        onClick={() => addLike(postId, String(user?.uid))}
        className='text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500'
      >
        <svg
          className='w-2 h-2'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='currentColor'
          viewBox='0 0 18 18'
        >
          <path d='M3 7H1a1 1 0 0 0-1 1v8a2 2 0 0 0 4 0V8a1 1 0 0 0-1-1Zm12.954 0H12l1.558-4.5a1.778 1.778 0 0 0-3.331-1.06A24.859 24.859 0 0 1 6 6.8v9.586h.114C8.223 16.969 11.015 18 13.6 18c1.4 0 1.592-.526 1.88-1.317l2.354-7A2 2 0 0 0 15.954 7Z' />
        </svg>
        <span className='sr-only'>Icon description</span>
      </button>

      <button
        className='text-blue-600 hover:underline ml-2 my-2'
        onClick={() => setShowComments(!showComments)}
      >
        {showComments ? 'Hide' : 'Show'} comments ({comments.length})
      </button>
      {showComments && (
        <div>
          <h2>Comments:</h2>
          <ul>
            {comments.map((comment: CommentInterface, index) => (
              <li key={index}>{comment.content}</li>
            ))}
          </ul>

          <form onSubmit={handleCommentSubmit}>
            <label
              htmlFor='chat'
              className='sr-only'
            >
              Your comment
            </label>
            <div className='flex items-center px-3 py-2 rounded-b-lg bg-gray-50 dark:bg-gray-700'>
              <textarea
                id='chat'
                rows={1}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className='block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                placeholder='Your comment...'
              ></textarea>
              <button
                type='submit'
                className='inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600'
              >
                <svg
                  className='w-5 h-5 rotate-90 rtl:-rotate-90'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 18 20'
                >
                  <path d='m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z' />
                </svg>
                <span className='sr-only'>Send message</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default Comment
