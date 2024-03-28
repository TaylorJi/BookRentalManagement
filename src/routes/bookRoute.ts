import { Router } from "express";
import { Request, Response } from "express";
import { Book } from "../models/book";

export const bookRouter = Router();

// get all books
// bookRouter.get('/books', async (req, res) => {
//     try {
//         const books = await Book.find({}).populate('genre', 'genre'); // 'name' is the field you want from the Genre model
//         res.json(books);
//     } catch (error) {
//         console.error('Error fetching books:', error);
//         res.status(500).send('Error fetching books');
//     }
// });
bookRouter.get("/", async (req: Request, res: Response) => {
  console.log("Fetching books from the database");
  try {
    Book.find({})
      .populate("genre", "genre")
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
bookRouter.get("/search", async (req: Request, res: Response) => {
  const { title } = req.query; // get the title from the query
  console.log("Fetching books from the database");
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

// add a book
bookRouter.post("/addBook", async (req: Request, res: Response) => {
  try {
    const { title, genre } = req.body;
    const book = new Book({
      title,
      genre,
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
bookRouter.put("/update/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, genre, rental_duration, is_available } = req.body;
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
    book.genre = genre;
    book.rental_duration = rental_duration;
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
