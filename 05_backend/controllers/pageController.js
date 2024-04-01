const jwt = require("jsonwebtoken");

// Model
const Page = require("../models/Page");
const User = require("../models/User");

// Validators
const pageValidator = require("../validators/Page");

// Helper
const { formatToUrl, verifyToken } = require("../helpers/helperFunctions");

/** Get a page by title
 * @async
 * @param {Object} req - Request object. Mandatory fields: title
 * @param {Object} res - Response object
 * @returns {Object} - Returns the page if it exists and is public
 * @returns {Object} - Returns an error if the page does not exist or is private
 */
async function getPageByUrl(req, res) {
  const { url } = req.params;

  try {
    const page = await Page.findOne({ url });

    // Check if the page exists and is public
    if (!page) {
      return res.status(404).send("Page not found");
    }

    // For a private page, only the author can view it
    if (page.visibility === "private") {
      // Check if the user is the author of the page
      // const author = await User.findOne({ username: page.author_name });

      // if (!author) {
      return res.status(404).send("Page not found");
      // }

      // const token = req.headers.authorization.split(" ")[1];
      // if (!token) {
      //   return res.status(404).send("Page not found");
      // }
      // const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // if (decoded.id !== author._id.toString()) {
      //   return res.status(404).send("Page not found");
      // }

      // return res.status(200).send(page);
    }

    const full_page = await Page.aggregate(
      [
        {
          $match: { url: "Sudhanshu12-test-blog-029" },
        },
        {
          $lookup: {
            from: "comments",
            localField: "comments",
            foreignField: "_id",
            as: "comments",
          },
        }
      ]
    );

    return res.status(200).send(full_page[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}

/** Create a page
 * @async
 * @param {Object} req - Request object. Mandatory fields: title, content, visibility
 * @param {Object} res - Response object
 * @returns {Object} - Returns the created page
 * @returns {Object} - Returns an error if the page is not successfully created
 */
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
      title: title,
      url: formatToUrl(author.username, title),
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

/** Update a page
 * @async
 * @param {Object} req - Request object. Mandatory fields: title. Optional fields: content, visibility
 * @param {Object} res - Response object
 * @returns {Object} - Returns the updated page
 * @returns {Object} - Returns an error if the page is not successfully updated
 */
async function updatePage(req, res) {
  const { url } = req.params;
  const { content, visibility } = req.body;

  // Validate the user input
  if (content && !pageValidator.validateContent(content)) {
    return res.status(418).send("Invalid content");
  }

  if (visibility && !pageValidator.validateVisibility(visibility)) {
    return res.status(419).send("Invalid visibility");
  }

  try {
    const page = await Page.findOne({ url });

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
    if (content)
      page.content = content;
    if (visibility)
      page.visibility = visibility;

    page.last_updated_time = Date.now();

    await page.save();

    res.status(200).send(page);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}

/** Delete a page
 * @async
 * @param {Object} req - Request object. Mandatory fields: title
 * @param {Object} res - Response object
 * @returns {Object} - Returns a success message if the page is successfully deleted
 * @returns {Object} - Returns an error if the page is not successfully deleted
 */
async function deletePage(req, res) {
  const { url } = req.params;

  try {
    const page = await Page.findOne({ url });

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
    await Page.deleteOne({ url });
    res.status(200).send("Page deleted");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}

/** Search for pages
 * @async
 * @param {Object} req - Request object. Optional fields: search_query, recent, author
 * @param {Object} res - Response object
 * @returns {Object} - Returns the pages that match the search query
 * @returns {Object} - Returns an error if no pages are found
 */
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
  getPageByUrl,
  createPage,
  updatePage,
  deletePage,
  searchPages,
};
