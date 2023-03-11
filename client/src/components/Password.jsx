import React from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/skills-02.jpg";
import styles from "../styles/username.module.css";
import {toast, Toaster} from "react-hot-toast";
import { useFormik } from "formik";
import {useAuthStore} from "../store/store"
import { passwordValidate } from "../helpers/validate";
import useFetch from "../hooks/fetch.hook";
import { verifyPassword } from "../helpers/helper";

export default function Password() {

  let { username }= useAuthStore(state=> state.auth); 

  const [{isLoading, apiData, serverError}] = useFetch(`user/${username}`);
  const navigate = useNavigate();


  const formik = useFormik({
    initialValues: {
      password: "mohamed@123",
    },
    validate: passwordValidate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {

      let loginPromise = verifyPassword({username, password: values.password});
      toast.promise(loginPromise, {
        loading: "checking...",
        success: <b>Login Successfully...!</b>,
        error: <b>Password does not match!</b>
      });
      loginPromise.then(res => {
        let { token } = res.data;
        localStorage.setItem("token", token);
        navigate("/profile")
      })
    },
  });

  if(isLoading) return <h1 className="text-2xl font-bold">isLoading</h1>;
  if(serverError) return <h1 className="text-xl text-red-500">{serverError.message}</h1>

  return (
    <div className="container mx-auto ">
      <Toaster position="top-center" 
      reverseOrder={false}
      >

      </Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass} style={{paddingTop: "2rem"}}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Hello {apiData?.firstName || apiData?.username}</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Explore More by connecting with us.
            </span>
            <form action="" className="py-1" onSubmit={formik.handleSubmit}>
              <div className="profile flex justify-center py-4">
                <img src={apiData?.profile || avatar} className={styles.profile_img} alt="avatar" />
              </div>

              <div className="textbox flex flex-col items-center gap-6">
                <input
                  {...formik.getFieldProps("password")}
                  className={styles.textbox}
                  type="password"
                  placeholder="password"
                />
                <button className={styles.btn}  type="submit">
                  Sign In
                </button>
              </div>

              <div className="text-center py-4">
                <div className="text-gray-500">
                  Forgot Password?
                  <Link to="/recovery" className="text-red-500">
                    Recover Now
                  </Link>{" "}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
