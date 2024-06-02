import { Router } from "express";
import { Request, Response } from "express";
import { BookReturn } from "../models/bookReturn";
import { BookRent } from "../models/bookRent";
import mongoose from "mongoose";
import { Book } from "../models/book";

// interface BookType {
//     _id: mongoose.Types.ObjectId;
//     name: string;
//     late_fee: number;
// }

// interface BorrowedBook {
//     _id: mongoose.Types.ObjectId;
//     id_str: string;
//     title: string;
//     book_type: BookType | mongoose.Types.ObjectId;
//     fee: number;
//     duration: number;
//     return_date: Date;
//     is_available: Boolean;
// }

// interface BookRentDocument extends mongoose.Document {
//     _id: mongoose.Types.ObjectId;
//     customer_ID: mongoose.Types.ObjectId;
//     borrowed_books: BorrowedBook[];
//     borrow_date: Date;
//     total_rent_fee?: number;
//     late_fee?: number;
//     status: "Borrowed" | "Returned" | "Overdue";
//     note?: string;
// }

// interface Book {
//     _id: string;
//     book_type: BookType;
//     return_date: Date;
//     is_available: boolean;
// }

interface BookType {
  _id: mongoose.Types.ObjectId;
  name: string;
  late_fee: number;
}

interface BorrowedBook {
  _id: mongoose.Types.ObjectId;
  id_str: string;
  title: string;
  book_type: BookType | mongoose.Types.ObjectId;
  fee: number;
  duration: number;
  return_date: Date;
  is_available: Boolean;
}

interface BookRentDocument extends mongoose.Document {
  customer_ID: mongoose.Types.ObjectId;
  borrowed_books: BorrowedBook[];
  borrow_date: Date;
  total_rent_fee?: number;
  late_fee?: number;
  status: "Borrowed" | "Returned" | "Overdue" | string;
  note?: string;
}

interface Book {
  _id: string;
  book_type: BookType;
  return_date: Date;
  is_available: boolean;
}

export const bookReturnRouter = Router();
const moment = require("moment-timezone");

bookReturnRouter.get("/", async (req: Request, res: Response) => {
  res.status(200).json({ message: "Book return route is working" });
});

bookReturnRouter.post("/bookReturn", async (req: Request, res: Response) => {
  console.log("Processing book return...");
  const { rentalID, bookIDs } = req.body;
  let totalLateFee = 0;
  let status = "Completed";
  const bookRent = await BookRent.findById(rentalID).populate(
    "borrowed_books.book_type"
  );
  console.log("bookRent is + " + bookRent);
  const customer_ID = bookRent?.customer_ID;
  const currentDate = moment().tz("America/Vancouver").toDate();

  if (!bookRent) {
    return res.status(404).json({
        message: "Original book rent not found from rental ID: " + rentalID,
      });
  }
  if (bookIDs.length != bookRent.borrowed_books.length) {
    status = "Partial";
  }

  try {
    for (let bookId of bookIDs) {
        const book = await Book.findById(bookId);
        console.log("book is + " + book);
      const bookToReturn = bookRent.borrowed_books.find(
        (book) => book._id?.toString() === bookId
      );
      console.log(bookToReturn);
      if (!bookToReturn) {
        return res.status(404).json({ message: "Book not found from book ID: " + bookId });
      }
      if (status === "Completed") {
        return res.status(400).json({
          message: "Book return already processed for rental ID: " + rentalID,
        });
      }
      const returnDate = moment(bookToReturn.return_date);
      const overdueDays = moment(currentDate).diff(returnDate, "days");
      const bookType = bookToReturn.book_type as unknown as BookType; // Type assertion here
      if (overdueDays > 0) {
        totalLateFee += bookType.late_fee * overdueDays;
        status = "Overdue";
      }
        // Update book availability status to true
      const returnedBook = await Book.findByIdAndUpdate(bookToReturn.id, 
        { is_available: true },
        { new: true }
      );
    
   
    }
    bookRent.status = status === "Overdue" ? "Overdue" : "Returned";
    bookRent.late_fee = totalLateFee;
    await bookRent.save();

    const bookReturn = new BookReturn({
      customer_ID,
      returned_books: bookRent.borrowed_books,
      return_date: currentDate,
      late_fee: totalLateFee,
      status,
      note: "",
    });

    await bookReturn.save();
    res.status(201).json({ message: "Book return processed successfully", bookReturn });

  } catch (error) {
    if (error instanceof Error) {
      console.error("Error processing book return:", error.message);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    } else {
      console.error("Error processing book return:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
});
