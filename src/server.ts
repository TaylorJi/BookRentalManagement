import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose, { Schema, Document } from "mongoose";
import { bookRouter } from "./routes/bookRoute"; // ts style import
import { customerRouter } from "./routes/customerRoute";
import { genreRouter } from "./routes/genreRoute";
// import { Genre } from "./models/genre"; // ts syle import

dotenv.config();
const app = express();
app.use(express.json()); // store the result in req.body

const port = process.env.PORT || 3000;

const dbUri: string =
  process.env.MONGODB_URI ??
  (function (): never {
    throw new Error("DB_URI is not defined in the environment variables");
  })();

mongoose
  .connect(dbUri)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection error:", err));



app.use("/api/books", bookRouter);
app.use("/api/books/search", bookRouter);
app.use("/api/books/addBook", bookRouter);
app.use("/api/books/update", bookRouter);
app.use("/api/books/delete", bookRouter);

app.use("/api/customers", customerRouter);
app.use("/api/customers/search", customerRouter);
app.use("/api/customers/addCustomer", customerRouter);
app.use("/api/customers/update", customerRouter);
app.use("/api/customers/delete", customerRouter);

app.use("/api/genres", genreRouter);
app.use("/api/genres/search", genreRouter);
app.use("/api/genres/addGenre", genreRouter);
app.use("/api/genres/update", genreRouter);




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
