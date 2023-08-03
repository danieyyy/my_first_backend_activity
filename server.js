const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

const cors = require("cors")

const secretKey = "ThisMySecreteKey";

app.use(
  cors({
    origin:"http://localhost:5000"
  })
)

const Books = [
    {
        id: 1,
        BookName: "PHP 8",
        YearPublished: "2023",
        Author: "VicS",
        Category: "Web",
        status: 1,
    },
    {
        id: 2,
        BookName: "React.js",
        YearPublished: "2000",
        Author: "Peter SMith",
        Category: "Web",
        status: 1,
    },
    {
        id: 3,
        BookName: "CSS framework",
        YearPublished: "2005",
        Author: "Jaguar",
        Category: "Web",
        status: 1,
    },
    {
        id: 4,
        BookName: "Data Science",
        YearPublished: "2023",
        Author: "Vic S",
        Category: "Data",
        status: 1,
    },
];

const LoginProfiles = [
    {
        id: 1,
        username: "admin",
        password: "passwd123",
        isAdmin: true,
    },
    {
        id: 2,
        username: "staff",
        password: "123456",
        isAdmin: false,
    },
    {
        id: 3,
        username: "vice",
        password: "abrakadabra",
        isAdmin: false,
    },
{
        id: 4,
        username: "super",
        password: "69843",
        isAdmin: true,
    },
{
        id: 5,
        username: "user",
        password: "123",
        isAdmin: false,
    }
];

//function to generate JWT tokens
const generateToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, secretKey, { expiresIn: "1h" });
};

// Middleware for verifying JWT tokens
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};


app.get("/books", (req, res) => {
    res.json(Books);
  });


  app.get("/books/:id", (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = Books.find((book) => book.id === bookId);
  
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  });


  app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = LoginProfiles.find((profile) => profile.username === username && profile.password === password);
  
    if (user) {
      const token = generateToken(user);
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  });


  app.get("/protected/books", verifyToken, (req, res) => {
    res.json(Books);
  });
  
  app.get("/protected/books/:id", verifyToken, (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = Books.find((book) => book.id === bookId);
  
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  });


  app.listen(5000)
    console.log("Server is running on port 5000");
  