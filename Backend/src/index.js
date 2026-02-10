import connectToDatabase from "./config/database.config.js";
import {app} from "./app.js";


connectToDatabase()
.then( () => { 
    const PORT = 4000;
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
});