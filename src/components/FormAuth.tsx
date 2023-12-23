import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserProvider'
import {
  AuthErrorInterface,
  AuthInterface,
  FormAuthPropsInterface,
} from '../typings/Auth.interfaces'

const FormAuth: React.FC<FormAuthPropsInterface> = ({ isRegister }) => {
  const { login, register, registerAndSignIn, signInWithGoogle } = useUser()
  const navigate = useNavigate()
  const [errorsFirebase, setErrorsFirebase] =
    useState<AuthErrorInterface | null>(null)
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      repPassword: '',
      displayedName: '',
    },
    validationSchema: Yup.object({
      displayedName: isRegister
        ? Yup.string().required('Required')
        : Yup.string(),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
      repPassword: isRegister
        ? Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Required')
        : Yup.string(),
    }),
    onSubmit: async (values: AuthInterface) => {
      if (isRegister) {
        const response = (await register(values)) as AuthErrorInterface
        if (response.error) {
          setErrorsFirebase(response)
          return
        }
      } else {
        const response = (await login(values)) as AuthErrorInterface
        if (response.error) {
          setErrorsFirebase(response)
          return
        }
      }
    },
  })
  const { values, handleChange, handleSubmit, errors, touched } = formik

  const handlerGoogleSignIn = async () => {
    if (isRegister) {
      console.log({
        email: values.email,
        password: values.password,
        displayedName: values.displayedName,
      })

      const response = await registerAndSignIn({
        email: values.email,
        password: values.password,
        displayedName: values.displayedName,
      })
      if (response.error) {
        setErrorsFirebase(response)
        return
      }
    } else {
      const response = await signInWithGoogle({
        email: values.email,
        password: values.password,
        displayedName: values.displayedName,
      })
      if (response.error) {
        setErrorsFirebase(response)
        return
      }
      navigate('/')
    }
  }

  return (
    <div className='w-full max-w-xs'>
      <form
        className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'
        onSubmit={handleSubmit}
      >
        <h1 className='block text-gray-700 text-2xl mb-3 uppercase font-bold text-center'>
          {isRegister ? 'Register' : 'Login'}
        </h1>
        <button
          type='button'
          onClick={handlerGoogleSignIn}
          className='w-full justify-center text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2'
        >
          <svg
            className='w-4 h-4 me-2'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='currentColor'
            viewBox='0 0 18 19'
          >
            <path
              fillRule='evenodd'
              d='M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z'
              clipRule='evenodd'
            />
          </svg>
          Sign in with Google
        </button>
        <div className='inline-flex items-center justify-center w-full'>
          <hr className='w-64 h-[2px] my-8 bg-gray-200 border-0 rounded dark:bg-gray-700' />
          <div className='absolute px-4 -translate-x-1/2 bg-white left-1/2 text-slate-950 text-3xl'>
            <span className='mb-2 block'>o</span>
          </div>
        </div>

        {isRegister && (
          <div className='mb-4'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='displayedName'
            >
              Nickname
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                touched.displayedName && errors.displayedName
                  ? 'border-red-500'
                  : ''
              }`}
              id='displayedName'
              type='text'
              placeholder='Nickname'
              value={values.displayedName}
              onChange={handleChange}
            />
            {touched.displayedName && errors.displayedName && (
              <p className='text-red-500 text-xs italic'>
                {errors.displayedName}
              </p>
            )}
          </div>
        )}
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='email'
          >
            Email
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              touched.email && errors.email ? 'border-red-500' : ''
            }`}
            id='email'
            type='text'
            placeholder='Email'
            value={values.email}
            onChange={handleChange}
          />
          {touched.email && errors.email && (
            <p className='text-red-500 text-xs italic'>{errors.email}</p>
          )}
        </div>
        <div className='mb-6'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='password'
          >
            Password
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              touched.password && errors.password ? 'border-red-500' : ''
            }`}
            id='password'
            type='password'
            placeholder='******************'
            value={values.password}
            onChange={handleChange}
          />
          {touched.password && errors.password && (
            <p className='text-red-500 text-xs italic'>{errors.password}</p>
          )}
        </div>
        {isRegister && (
          <div className='mb-6'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='repPassword'
            >
              Repeat Password
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                touched.repPassword && errors.repPassword ? 'border-red-500' : ''
              }`}
              id='repPassword'
              type='password'
              placeholder='******************'
              value={values.repPassword}
              onChange={handleChange}
            />
            {touched.repPassword && errors.repPassword && (
              <p className='text-red-500 text-xs italic'>{errors.repPassword}</p>
            )}
          </div>
        )}
        {errorsFirebase && (
          <p className='text-red-500 text-xs italic mb-3'>
            {errorsFirebase.error.message}
          </p>
        )}
        <div className='flex items-center justify-between'>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            type='submit'
          >
            {formik.isSubmitting && (
              <i className='fas fa-circle-notch fa-spin'></i>
            )}
            {isRegister ? 'Register' : 'Login'}
          </button>
        </div>
      </form>
      <p className='text-center text-gray-500 text-xs'>
        &copy;2020 Acme Corp. All rights reserved.
      </p>
    </div>
  )
}

export default FormAuth
