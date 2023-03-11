import express  from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./conn.js";
import router from "./router/route.js";

const app = express();

/** middleware */
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by"); //Less hackers know about our socket 

const port = 8080;

/** HTTP GET Request */
app.get("/", (req,res) => {
    res.status(201).json("Home Get request");
})

/**api routes */
app.use("/api", router);

/** Start server only when we valid connection */


connect().then(()=> {
    try {
        app.listen(port, ()=> {
            console.log(`Server connected to http://localhost:${port}`)
        })
    } catch (error) {
        console.log("cannot connect to the server aand the error is" +error )
    }
}).catch(error=> {
    console.log(error)
    console.log("Invalid database connection...!")
})