import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/skills-02.jpg";
import styles from "../styles/username.module.css";
import {toast, Toaster} from "react-hot-toast";
import { useFormik } from "formik";
import { passwordValidate } from "../helpers/validate";
import { useAuthStore } from "../store/store"
import { generateOTP, verifyOTP } from "../helpers/helper";

export default function Recovery() {

  const { username } = useAuthStore(state=> state.auth);
  const [OTP, setOTP] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    generateOTP(username).then(OTP => {
      console.log(OTP)
      if(OTP) return toast.success("OTP has been send to your email!");
      return toast.error("Problem while genereating OTP!");
    })
  }, [username])
  
async function onSubmit(e){
  e.preventDefault();

  let { status } = await verifyOTP({username, code: OTP}); 

  if (status === 201){
    toast.success("verify Successfully!")
    return navigate("/reset");
  }

  return toast.error("Wrong OTP! Check email again@")

}  

// handler of resend OTP
function resendOTP(){
  let sendPromise = generateOTP(username);

  toast.promise(sendPromise, {
    loading: "sending...",
    success: <b>OTP has been send to your email!</b>,
    error: <b>Couldn't send it!</b>
  });
  sendPromise.then(OTP=> {
    console.log(OTP)
  })
  
}



  return (
    <div className="container mx-auto ">
      <Toaster position="top-center" 
      reverseOrder={false}
      >

      </Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass} style={{paddingTop: "2rem"}}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Recovery</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter OTP to recover password.
            </span>
            
            <form action="" className="pt-20" onSubmit={onSubmit}>
              
              <div className="textbox flex flex-col items-center gap-6">
              <div className="input text-center">
              <span className="py-4 text-sm text-left text-gray-500">
                Enter 6 digit OTP sent to your email address.
              </span>
              <input
                  onChange={(e)=> setOTP()}
                  className={styles.textbox}
                  type="text"
                  placeholder="OTP"
                />
              </div>
                
                <button className={styles.btn} type="submit">
                  Recover
                </button>
              </div>

              <div className="text-center py-4">
                <div className="text-gray-500">
                  Can't get OTP?
                  <button className="text-red-500">
                    Resend
                  </button>{" "}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
