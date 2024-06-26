import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { bookRouter } from "./routes/bookRoute"; // ts style import
import { customerRouter } from "./routes/customerRoute";
import { bookRentRouter } from "./routes/bookRentRoute";
import { typeRouter } from "./routes/typeRouter";
import { bookReturnRouter } from "./routes/bookReturnRoute";
import "./services/reminderScheduler";



dotenv.config();
const app = express();
const cors = require("cors");

const corsOptions = {
  origin: process.env.FRONT_END_URL, // or your frontend URL
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json()); // store the result in req.body

const port = process.env.PORT || 3000;



const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
};


const dbUri: string =
  process.env.MONGODB_URI ??
  (function (): never {
    throw new Error("DB_URI is not defined in the environment variables");
  })();

mongoose
  .connect(dbUri, options)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection error:", err));



// routuers 
app.use("/api/books", bookRouter);
app.use("/api/books/search", bookRouter);
app.use("/api/books/searchByTitle", bookRouter);
app.use("/api/books/searchById", bookRouter);
app.use("/api/books/addBook", bookRouter);
app.use("/api/books/update", bookRouter);
app.use("/api/books/delete", bookRouter);

app.use("/api/customers", customerRouter);
app.use("/api/customers/search", customerRouter);
app.use("/api/customers/addCustomer", customerRouter);
app.use("/api/customers/update", customerRouter);
app.use("/api/customers/delete", customerRouter);


app.use("/api/types", typeRouter);
app.use("/api/types/search", typeRouter);
app.use("/api/types/addType", typeRouter);
app.use("/api/types/update", typeRouter);
app.use("/api/types/delete", typeRouter);



app.use("/api/bookRents", bookRentRouter);
app.use("/api/bookRents/searchByCustomer", bookRentRouter);
app.use("/api/bookRents/searchByBook", bookRentRouter); 
app.use("/api/bookRents/addBookRent", bookRentRouter);
app.use("/api/bookRents/update", bookRentRouter);
app.use("/api/bookRents/delete", bookRentRouter);

app.use("/api/bookReturns", bookReturnRouter);
app.use("/api/bookReturns/bookReturn", bookReturnRouter);




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
