import React from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/skills-02.jpg";
import styles from "../styles/username.module.css";
import {Toaster} from "react-hot-toast";
import { useFormik } from "formik";
import { usernameValidate } from "../helpers/validate";
import { useAuthStore } from "../store/store";

export default function Username() {
  const setUsername =useAuthStore(state => state.setUsername);
  const state = useAuthStore(state=> state)
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "mohamed123",
    },
    validate: usernameValidate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      setUsername(values.username)
      navigate("/password");

    },
  });


  return (
    <div className="container mx-auto ">
      <Toaster position="top-center" 
      reverseOrder={false}
      >

      </Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass} style={{paddingTop: "2rem"}}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Hello Again!</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Explore More by connecting with us.
            </span>
            <form action="" className="py-1" onSubmit={formik.handleSubmit}>
              <div className="profile flex justify-center py-4">
                <img src={avatar} className={styles.profile_img} alt="avatar" />
              </div>

              <div className="textbox flex flex-col items-center gap-6">
                <input
                  {...formik.getFieldProps("username")}
                  className={styles.textbox}
                  type="text"
                  placeholder="username"
                />
                <button className={styles.btn}  type="submit">
                  Let's Go
                </button>
              </div>

              <div className="text-center py-4">
                <div className="text-gray-500">
                  Not a Member{" "}
                  <Link to="/register" className="text-red-500">
                    Register
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
