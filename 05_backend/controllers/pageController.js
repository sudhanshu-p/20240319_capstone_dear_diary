// Model
const Page = require("../models/Page");
const User = require("../models/User");

// Validators
const pageValidator = require("../validators/Page");

// Helper
const { formatToTitle } = require("../helpers/helperFunctions");

// Get a page by title
async function getPageByTitle(req, res) {
  const { title } = req.params;

  try {
    const page = await Page.findOne({ title });

    // Check if the page exists and is public
    if (!page || page.visibility === "private") {
      return res.status(404).send("Page not found");
    }

    // Remove unrelevant fields



    res.status(200).send(page);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}

// Create a new page
async function createPage(req, res) {
  const { title, content, visibility } = req.body;

  // Validate the user input
  if (!pageValidator.validateTitle(title)) {
    return res.status(417).send("Invalid title");
  }

  if (!pageValidator.validateContent(content)) {
    return res.status(418).send("Invalid content");
  }

  if (!pageValidator.validateVisibility(visibility)) {
    return res.status(419).send("Invalid visibility");
  }

  // Get the author from the request
  const author = req.user;

  try {
    // Create a new page
    const page = new Page({
      title: formatToTitle(author.username, title),
      content,
      author_name: author.username,
      published: true,
      publish_time: Date.now(),
      last_updated_time: Date.now(),
      visibility,
      upvoted_by: [],
      downvoted_by: [],
      comments: [],
    });

    await page.save();

    res.status(201).send(page);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}

// Update a page
async function updatePage(req, res) {
  const { title } = req.params;
  const { content, visibility } = req.body;

  // Validate the user input
  if (content && !pageValidator.validateContent(content)) {
    return res.status(418).send("Invalid content");
  }

  if (visibility && !pageValidator.validateVisibility(visibility)) {
    return res.status(419).send("Invalid visibility");
  }

  try {
    const page = await Page.findOne({ title });

    if (!page) {
      return res.status(404).send("Page not found");
    }

    // Get the author
    const author = await User.findOne({ username: page.author_name });

    if (!author) {
      return res.status(405).send("Author not found");
    }

    // Check if the user is the author of the page
    if (author._id.toString() !== req.user.id.toString()) {
      return res.status(403).send("Unauthorized");
    }

    // Update the page
    page.content = content;
    page.last_updated_time = Date.now();
    page.visibility = visibility;

    await page.save();

    res.status(200).send(page);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}

// Delete a page
async function deletePage(req, res) {
  const { title } = req.params;

  try {
    const page = await Page.findOne({ title });

    // Check if the page exists
    if (!page) {
      return res.status(404).send("Page not found");
    }

    const author = await User.findOne({ username: page.author_name });

    // Check if the user is the author of the page
    if (author._id.toString() !== req.user.id.toString()) {
      return res.status(401).send("Unauthorized");
    }

    // Delete the page
    await Page.deleteOne({ title });
    res.status(200).send("Page deleted");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}

// Search for pages
async function searchPages(req, res) {
  const { search_query, recent, author } = req.query;

  try {
    let pages;

    // Considering only 1 query parameter can be applied at a time.
    if (search_query) {
      console.log("Searched")
      // Search for the search query in the title and content
      pages = await Page.find({
        $or: [
          { title: { $regex: search_query, $options: "i" } },
          { content: { $regex: search_query, $options: "i" } },
        ],
        visibility: "public",
      });
    }
    else if (recent) {
      // Get the most recent pages
      pages = await Page.find({ visibility: "public" })
        .sort({ publish_time: -1 })
        .limit(10); // Since for our specific use case, we only need max 10 pages
    }
    else if (author) {
      // Get the pages by the author
      const user = await User.findOne({ username: author });

      if (!user) {
        return res.status(405).send("User not found");
      }

      pages = await Page.find({ author_id: user._id, visibility: "public" });
    }
    else {
      // Return all public pages
      pages = await Page.find({ visibility: "public" });

      return res.status(200).send(pages);
    }

    if (pages.length === 0) {
      return res.status(404).send("No pages found");
    }

    res.status(200).send(pages);
  }
  catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}

// Export the functions
module.exports = {
  getPageByTitle,
  createPage,
  updatePage,
  deletePage,
  searchPages,
};
