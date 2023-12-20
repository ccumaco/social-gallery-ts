import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { login, register } from "../services/firebase/firebase";
import {
  AuthErrorInterface,
  AuthInterface,
  FormAuthPropsInterface,
} from "../typings/Auth.interfaces";

const FormAuth: React.FC<FormAuthPropsInterface> = ({ isRegister }) => {
  const navigate = useNavigate();
  const [errorsFirebase, setErrorsFirebase] =
    React.useState<AuthErrorInterface | null>(null);
  const formik = useFormik({
    initialValues: {
      email: "carloscumaco5@gmai.com",
      password: "123123",
      repPassword: "123123",
      displayedName: "Borking",
    },
    validationSchema: Yup.object({
      displayedName: isRegister
        ? Yup.string().required("Required")
        : Yup.string(),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
      repPassword: isRegister
        ? Yup.string()
            .oneOf([Yup.ref("password")], "Passwords must match")
            .required("Required")
        : Yup.string(),
    }),
    onSubmit: async (values: AuthInterface) => {
      if (isRegister) {
        const response = (await register(values)) as AuthErrorInterface;
        if (response.error) {
          setErrorsFirebase(response);
          return;
        }
        navigate("/");
      } else {
        const response = (await login(values)) as AuthErrorInterface;
        if (response.error) {
          setErrorsFirebase(response);
          return;
        }
        navigate("/");
      }
    },
  });

  const { values, handleChange, handleSubmit, errors, touched } = formik;

  return (
    <div className="w-full max-w-xs">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
        {isRegister && (
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="displayedName"
            >
              Nickname
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                touched.displayedName && errors.displayedName
                  ? "border-red-500"
                  : ""
              }`}
              id="displayedName"
              type="text"
              placeholder="displayedName"
              value={values.displayedName}
              onChange={handleChange}
            />
            {touched.displayedName && errors.displayedName && (
              <p className="text-red-500 text-xs italic">
                {errors.displayedName}
              </p>
            )}
          </div>
        )}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              touched.email && errors.email ? "border-red-500" : ""
            }`}
            id="email"
            type="text"
            placeholder="email"
            value={values.email}
            onChange={handleChange}
          />
          {touched.email && errors.email && (
            <p className="text-red-500 text-xs italic">{errors.email}</p>
          )}
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              touched.password && errors.password ? "border-red-500" : ""
            }`}
            id="password"
            type="password"
            placeholder="******************"
            value={values.password}
            onChange={handleChange}
          />
          {touched.password && errors.password && (
            <p className="text-red-500 text-xs italic">{errors.password}</p>
          )}
        </div>
        {isRegister && (
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="repPassword"
            >
              Repeat Password
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                touched.repPassword && errors.repPassword
                  ? "border-red-500"
                  : ""
              }`}
              id="repPassword"
              type="password"
              placeholder="******************"
              value={values.repPassword}
              onChange={handleChange}
            />
            {touched.repPassword && errors.repPassword && (
              <p className="text-red-500 text-xs italic">
                {errors.repPassword}
              </p>
            )}
          </div>
        )}
        {errorsFirebase && (
          <p className="text-red-500 text-xs italic mb-3">
            {errorsFirebase.error.message}
          </p>
        )}
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {formik.isSubmitting && (
              <i className="fas fa-circle-notch fa-spin"></i>
            )}
            {isRegister ? "Register" : "Login"}
          </button>
          <Link
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            to={"#"}
          >
            Forgot Password?
          </Link>
        </div>
      </form>
      <p className="text-center text-gray-500 text-xs">
        &copy;2020 Acme Corp. All rights reserved.
      </p>
    </div>
  );
};

export default FormAuth;
