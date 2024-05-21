import { Router } from "express";
import { Request, Response } from "express";
import { Book } from "../models/book";

export const bookRouter = Router();

// get all book
bookRouter.get("/", async (req: Request, res: Response) => {
  console.log("Fetching books from the database");
  try {
    Book.find({})
    .populate("book_type")
      .exec()
      .then((books) => {
        console.log(books);
        console.log(`Found ${books.length} books`);
        res.status(200).json(books);
      })
      .catch((error) => {
        console.error("Error while fetching listings:", error);
      });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error while fetching listings:", error);
      res.status(500).send("Error while fetching listings" + error);
    } else {
      console.error("Error while fetching listings:", error);
      res.status(500).send("Error while fetching listings");
    }
  }
});

// search by title
bookRouter.get("/searchByTitle", async (req: Request, res: Response) => {
  const { title } = req.query; // get the title from the query
  console.log("Searching for book by title");
  console.log(title);
  if (title === undefined || title === "" || typeof title !== "string") {
    res.status(400).send("Invalid title");
    return;
  }
  try {
    const books = await Book.find({ title: { $regex: title, $options: "i" } });
    console.log(`Found ${books.length} books`);
    if (books.length === 0) {
      res.status(404).send("Book not found");
      return;
    }
    res.status(200).json({
      message: `Found ${books.length} books`,
      books,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error while fetching listings:", error);
      res.status(500).send("Error while fetching listings" + error);
    } else {
      console.error("Error while fetching listings:", error);
      res.status(500).send("Error while fetching listings");
    }
  }
});

// search by id
bookRouter.get("/searchById", async (req: Request, res: Response) => {
  const { id } = req.query;
  if (id === undefined || id === "" || typeof id !== "string") {
    res.status(400).send("Invalid id");
    return;
  }
  try {
    const books = await Book.aggregate([
      {
        $project: {
          stringId: { $toString: "$_id" }, // Convert ObjectId to string
          title: 1, // Include other fields you might need
          author: 1,
          book_type: 1,
          is_available: 1,
          borrow_count: 1,
        }
      },
      {
        $match: {
          stringId: { $regex: new RegExp(id + '$') } // Apply regex on the string representation of the ObjectId
        }
      }
    ]);

    if (!books.length) {
      res.status(404).send("Book not found");
      return;
    }

    res.status(200).json({
      message: `Found books matching ID pattern ${id}`,
      books,
    });
  } catch (error) {
    console.error("Error while fetching listings:", error);
    res.status(500).send("Error while fetching listings" + (error instanceof Error ? error.message : ""));
  }
});


// add a book
bookRouter.post("/addBook", async (req: Request, res: Response) => {
  try {
    const { title, book_type, price} = req.body;
    const book = new Book({
      title,
      book_type,
      is_available: true,
      price
    });

    const savedBook = await book.save();

    console.log("Book added successfully");
    res.status(201).json({
      message: `${savedBook.title} has been added successfully`,
      book: savedBook,
    });
  } catch (error) {
    console.error("Error while adding genre:", error);
    res.status(500).send("Error while adding genre" + error);
  }
});

// update a book
bookRouter.put("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
  const { title, book_type, is_available } = req.body;
  console.log("Updating book from the database");
  if (id === undefined || id === "" || typeof id !== "string") {
    res.status(400).send("Invalid id");
    return;
  }
  try {
    const book = await Book.findById(id);
    if (book === null) {
      res.status(404).send("Book not found");
      return;
    }
    book.title = title;
    book.book_type = book_type;
    book.is_available = is_available;
    const updatedBook = await book.save();
    console.log("Book updated successfully");
    res.status(200).json({
      message: `${updatedBook.title} has been updated successfully`,
      book: updatedBook,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error while fetching listings:", error);
      res.status(500).send("Error while fetching listings" + error);
    } else {
      console.error("Error while fetching listings:", error);
      res.status(500).send("Error while fetching listings");
    }
  }
});

// delete a book
bookRouter.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("Deleting book from the database");
  if (id === undefined || id === "" || typeof id !== "string") {
    res.status(400).send("Invalid id");
    return;
  }
  try {
    const book = await Book.findByIdAndDelete(id);
    if (book === null) {
      res.status(404).send("Book not found");
      return;
    }
    console.log("Book deleted successfully");
    res.status(200).json({
      message: `${book.title} has been deleted successfully`,
      book,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error while fetching listings:", error);
      res.status(500).send("Error while fetching listings" + error);
    } else {
      console.error("Error while fetching listings:", error);
      res.status(500).send("Error while fetching listings");
    }
  }
});
