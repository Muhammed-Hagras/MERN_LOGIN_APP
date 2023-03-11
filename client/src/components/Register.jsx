import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/skills-02.jpg";
import styles from "../styles/username.module.css";
import { toast, Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { registerValidation } from "../helpers/validate";
import convertToBase6 from "../helpers/convert";
import { registerUser } from "../helpers/helper";

export default function Register() {

  const [file, setfile] = useState();
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      email: "mohamed2023@dev.com",
      username: "mohamed123",
      password: "mohamed@123",
    },
    validate: registerValidation,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, {profile: file || ""})
      let registerPromise = registerUser(values);
      toast.promise(registerPromise, {
        loading: "Creating...",
        success: <b>Register successfully...!</b>,
        error: <b>Couldn't not Register</b>
      })
      registerPromise.then(function(){navigate("/")})
    },
  });

  /**Formik doesn't support upload file so we need to create this handler */
  const onUpload = async e => {
    const base64 = await convertToBase6(e.target.files[0]);
    setfile(base64);
  }
  return (
    <div className="container mx-auto ">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div
          className={styles.glass}
          style={{ paddingTop: "3em", width: "45%" }}
        >
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Regiter</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Happy to join you!
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img src= {file || avatar} className={styles.profile_img} alt="avatar" />
                <input onChange={onUpload} type="file" id="profile" name="profile" />
              </label>
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input
                type="text"
                className={styles.textbox}
                {...formik.getFieldProps("email")}
                placeholder="Email*"
              />
              <input
                type="text"
                className={styles.textbox}
                {...formik.getFieldProps("username")}
                placeholder="Username*"
              />
              <input
                type="text"
                className={styles.textbox}
                {...formik.getFieldProps("password")}
                placeholder="Password*"
              />
              <button className={styles.btn} type="submit">
                Register
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Already Regiter?
                <Link to="/" className="text-red-500">
                  Login Now
                </Link>{" "}
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
