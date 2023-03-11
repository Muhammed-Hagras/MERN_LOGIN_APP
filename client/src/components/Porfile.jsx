import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/skills-02.jpg";
import styles from "../styles/username.module.css";
import extend from "../styles/profile.module.css"
import { toast, Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import convertToBase6 from "../helpers/convert";
import profileValidation from "../helpers/validate";
import useFetch from "../hooks/fetch.hook";
import { updateUser } from "../helpers/helper";

export default function Profile() {
  const [file, setfile] = useState();
  const [{isLoading, apiData, serverError} ] = useFetch();
  
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      firstname: apiData?.firstName || "",
      lastname: apiData?.lastname || "",
      email: apiData?.email || "",
      mobile: apiData?.mobile || "",
      address: apiData?.address || "",
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, {profile: file || apiData?.profile || ""})
      let updatePromise = updateUser(values);
      toast.promise(updatePromise, {
        loading: "checking...",
        success: <b>Update Successfully...!</b>,
        error: <b>Couldn't update!</b>
      });
    },
  });

  /**Formik doesn't support upload file so we need to create this handler */
  const onUpload = async e => {
    const base64 = await convertToBase6(e.target.files[0]);
    setfile(base64);
  }

  // Logout handler
  function userLogOut(){
    localStorage.removeItem("token");
    navigate("/")
  }

  if(isLoading) return <h1 className="text-2xl font-bold">isLoading</h1>;
  if(serverError) return <h1 className="text-2xl text-red-500">{serverError.message}</h1>


  return (
    <div className="container mx-auto ">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div
          className={`${styles.glass} ${extend.glass}`}
          style={{ paddingTop: "3em", width: "45%" }}
        >
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Profile</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              You can upload deails.
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img src= {apiData?.profile || file || avatar} className={`${styles.profile_img} ${extend.profile_img}`} alt="avatar" />
                <input onChange={onUpload} type="file" id="profile" name="profile" />
              </label>
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <div className="name flex w-3/4 gap-10">
              <input
                type="text"
                className={`${styles.textbox} ${extend.textbox}`}
                {...formik.getFieldProps("firstname")}
                placeholder="Firstname*"
              />
              <input
                type="text"
                className={`${styles.textbox} ${extend.textbox}`}
                {...formik.getFieldProps("lastname")}
                placeholder="Lastname*"
              />
              </div>
              <div className="name flex w-3/4 gap-10">
              <input
                type="text"
                className={`${styles.textbox} ${extend.textbox}`}
                {...formik.getFieldProps("mobile")}
                placeholder="Mobile No.*"
              />
              <input
                type="text"
                className={`${styles.textbox} ${extend.textbox}`}
                {...formik.getFieldProps("email")}
                placeholder="Email*"
              />
              </div>
              <input
                type="text"
                className={`${styles.textbox} ${extend.textbox}`}
                {...formik.getFieldProps("address")}
                placeholder="Address*"
              />
              <button className={styles.btn} type="submit">
                Update
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Come back Later?
                <button onClick={userLogOut}  className="text-red-500">
                  LogOut
                </button>{" "}
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
