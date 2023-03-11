import UserModel from "../model/User.model.js";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import ENV from "../config.js";
import otpGenerator from "otp-generator"

/**middleware for verify user */
export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;

    //Check the user existance
    let exist = await UserModel.findOne({ username });
    if (!exist) return res.status(404).send({ error: "Can't find User!" });
    next();
  } catch (error) {
    return res.status(500).send({ error: "Authentication Error" });
  }
}


/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
export async function register(req, res) {
  try {
    const { username, password, profile, email } = req.body;

    //Check the existing user
    const existedUsername = new Promise((res, rej) => {
      UserModel.findOne({ username }).then((user, err) => {
        if (err) rej(new Error(err));
        if (user) rej({ error: "Please use unique username" });
        res();
      });
    });

    //Check for existing email
    const existEmail = new Promise((res, rej) => {
      UserModel.findOne({ email }).then((email, err) => {
        if (err) rej(new Error(err));
        if (email) rej({ error: "please use unique Email" });
        res();
      });
    });

    Promise.all([existedUsername, existEmail])
      .then(() => {
        if (password) {
          bcrypt.hash(password, 10).then((hashedPassword) => {
            const user = new UserModel({
              username,
              password: hashedPassword,
              profile: profile || "",
              email,
            });

            // return save result as a response
            user
              .save()
              .then((result) =>
                res.status(201).send({ msg: "User Register Succeesfuly" })
              )
              .catch((error) => res.status(500).send(error));
          });
        }
      })
      .catch((error) => {
        return res.status(500).send({
          error: "Enable to hased password",
        });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
}

/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req, res) {
  const { username, password } = req.body;

  try {
    UserModel.findOne({ username })
      .then((user) => {
        bcrypt.compare(password, user.password).then((passwordCheck) => {
          if (!passwordCheck)
            return res.status(400).send({ error: "Don't have password" });
          // create jwt token
          const token = jwt.sign(
            {
              userId: user._id,
              username: user.username,
            },
            ENV.JWT_SECRET,
            { expiresIn: "24h" }
          );

          return res.status(200).send({
            msg: "Login Successful...!",
            username: user.username,
            token,
          });
        });
      })
      .catch((error) => {
        return res.status(500).send({ error: "Password: does not match" });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
}

/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req, res) {
  const { username } = req.params;
  try {
    if (!username) return res.status(501).send({ error: "Invalid Username" });

    UserModel.findOne({ username })
      .then((user) => {
        if (!user)
          return res.status(501).send({ error: "Couldn't find the user" });

        /** remove password from user */
        // mongoose return unnecessary data with object so convert it into json
        const { password, ...rest } = Object.assign({}, user.toJSON());
        return res.status(201).send(rest);
      })
      .catch((err) => {
        if (err) return res.status(500).send({ err });
      });
  } catch (error) {
    return res.status(404).send({ error: "Can't find user Data" });
  }
}

/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export async function updateUser(req, res) {
  try {

    const {userId} = req.user;

    if (userId) {
        const body = req.body;
        //Upadte the data
        UserModel.updateOne({_id: userId}, body)
        .then((data)=> {return res.status(201).send({msg: "Record Updated...!"})}
        )
    } else {
        return res.status(401).send({error: "User not found...!"})
    }
  } catch (error) {
    return res.status(401).send({error})
  }
}

/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
    req.app.locals.OTP  = otpGenerator.generate(6, {lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
    res.status(201).send({code: req.app.locals.OTP})
}

/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
  const {code} = req.query;
  if(parseInt(req.app.locals.OTP) === parseInt(code)){
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    return res.status(201).send({msg: "Verify Successfully!"});
  }
  return res.status(400).send({error: "Invalid OTP"})
}


// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
    if(req.app.locals.resetSession){
        req.app.locals.resetsession = false; //Allow access to this only once
        return res.status(201).send({ msg: "access granted!"})
   }
   return res.status(440).send({error : "Session expired!"})
}

// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
  try {
    if(!req.app.locals.resetSession) return res.status(440).send({error: "Session expired!"});
    const {username, password} = req.body;

    try {
        UserModel.findOne({username})
        .then(user => {
            bcrypt.hash(password,10)
                .then(hashedPassword => {
                UserModel.updateOne({username: user.username},
                    {password: hashedPassword}).then((data)=>{
                        // if(err) throw err;
                        req.app.locals.resetSession = false; //reset session
                        return res.status(201).send({msg: "Record Updated...!"})
                    }).catch(err=> {return res.status(500).send(err)});
            }).catch(e=> {
                return res.status(500).send({
                    error: "Endabled to hashed password"
                })
            })
        }).catch(error =>{
            return res.status(404).send({error: "Username not found"});
        })
    } catch (error) {
        return res.status(500).send({error});
    }
  } catch (error) {
    return res.status(401).send({error})
  }
}
