// Model
const Page = require("../models/Page");
const User = require("../models/User");

// Validators
const pageValidator = require("../validators/Page");

// Get a page by title
async function getPageByTitle(req, res) {
  const { title } = req.params;

  try {
    const page = await Page.findOne({ title });

    if (!page || page.visibility === "private") {
      return res.status(404).send("Page not found");
    }

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
      title,
      content,
      author_id: author._id,
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

    // Check if the user is the author of the page
    if (page.author_id.toString() !== req.user._id.toString()) {
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

    if (!page) {
      return res.status(404).send("Page not found");
    }

    // Check if the user is the author of the page
    if (page.author_id.toString() !== req.user._id.toString()) {
      return res.status(401).send("Unauthorized");
    }

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

    if (search_query) {
      // Search for the search query in the title and content
      pages = await Page.find({
        $or: [
          { title: { $regex: search_query, $options: "i" } },
          { content: { $regex: search_query, $options: "i" } },
        ],
        visibility: "public",
      });
    } else if (recent) {
      // Get the most recent pages
      pages = await Page.find({ visibility: "public" })
        .sort({ publish_time: -1 })
        .limit(10);
    } else if (author) {
      // Get the pages by the author
      const user = await User.findOne({ username: author });

      if (!user) {
        return res.status(405).send("User not found");
      }

      pages = await Page.find({ author_id: user._id, visibility: "public" });
    } else {
      return res.status(400).send("Invalid query");
    }

    if (pages.length === 0) {
      return res.status(404).send("No pages found");
    }

    res.status(200).send(pages);
  } catch (error) {
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
