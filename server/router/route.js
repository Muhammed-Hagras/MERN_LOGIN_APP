import { Router } from "express";
const router = Router();
import * as controller from "../controllers/appController.js" 
import { registerMail } from "../controllers/mailer.js";
import Auth, { localVariables} from "../middleware/auth.js"

/**Post Methods */
router.route("/register").post(controller.register); // register user
router.route("/registerMail").post(registerMail); //send the email
router.route("/authenticate").post(controller.verifyUser, (req, res)=> res.end()); // authenticate user
router.route("/login").post(controller.verifyUser, controller.login)//login app

/**Get Mehods */
router.route("/user/:username").get(controller.getUser) //user with username
router.route("/generateOTP").get(controller.verifyUser,localVariables,controller.generateOTP) //generate route OTP
router.route("/verifyOTP").get(controller.verifyOTP) //verify route OTP
router.route("/login").get(controller.login) //reset all the variables

/**Put Methods */
router.route("/updateUser").put(Auth ,controller.updateUser); //is use to update the user profile
router.route("/resetPassword").put(controller.verifyUser,controller.resetPassword); //use to reset password

export default router;