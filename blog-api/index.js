const express = require("express")
const app = express();

app.use(express.json());

const blogData = [
  {
    id: 1,
    title: "First Blog Post",
    author: "elon",
    content: "This is the content of the first blog post."
  },
  {
    id: 2,
    title: "Second Blog Post",
    author: "trump",
    content: "This is the content of the second blog post."
  },
    {
    id: 3,
    title: "Third Blog Post",
    author: "vinay",
    content: "This is the content of the third blog post."
  }
];

// Route to fetch all blogs
app.get("/blogs", (req,res) => {
  res.json(blogData);
});

// Fetch the blog data by id
app.get("/blog/:id", (req,res) => {
  const blogId = parseInt(req.params.id);
  const blog = blogData.find(b => b.id === blogId);

  if(!blog){
    return res.status(404).json({ message: "Blog not found" });
  }

  res.json(blog);
});

// Fetch the blog data by author name
app.get("/blogs/author", (req, res) => {
  try{
    const authorName = req.query.author;
    const blogsByAuthor = blogData.filter(b => b.author.toLowerCase() === authorName.toLowerCase());

    if(blogsByAuthor.length === 0){
      return res.status(404).json({ message: "No blogs found for the specified author" });
    }

    res.json(blogsByAuthor);
  }catch(error){
    console.error("Error fetching blogs by author:", error);
    return res.status(500).json({ message: "Internal server error" });
  }

});

app.listen(5001, () => {
  console.log("Server is running on port 5001");
});