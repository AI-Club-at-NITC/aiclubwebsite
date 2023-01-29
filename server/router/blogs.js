const express = require("express");
const router = express.Router();
const Blog = require("../model/BlogSchema");
const Team = require("../model/teamSchema");

router.route("/updateBlog/:url").put(async (req, res) => {
  try {
    const { url } = req.params;
    const updatedBlog = await Blog.findOneAndUpdate({ url: url }, req.body, {
      new: true,
    });
    console.log("Project Updated", updatedBlog);
    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(422).json(err);
  }
});

router.route("/updateblogPublicStatus/:url").put(async (req, res) => {
  try {
    const { url } = req.params;
    const updatedBlog = await Blog.findOne({ url: url });
    updatedBlog.public = req.body.public;
    updatedBlog.save();
    console.log("Project Updated", updatedBlog);
    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(422).json(err);
  }
});

router.route("/updateblogApprovalStatus/:url").put(async (req, res) => {
  try {
    const { url } = req.params;
    const updatedBlog = await Blog.findOne({ url: url });
    updatedBlog.approvalStatus = req.body.approvalStatus;
    updatedBlog.public = req.body.public;
    updatedBlog.save();
    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(422).json(err);
  }
});

router.route("/blogadd").post(async (req, res) => {
  const title = req.body.title;
  if (!title) {
    return res.status(400).json({ error: "Plz fill the field properly" });
  }
  console.log("Posting..");
  try {
    const blog = new Blog(req.body);
    await blog.save();

    console.log(`${blog.title} registered successfully`);
    res.status(201).json({ message: "Blog posting Successfully" });
  } catch (err) {
    console.log("err", err);
  }
});

router.route("/getBlogs").get(async (req, res) => {
  const blogData = await Blog.find({ public: true }).sort({createdAt:-1}).select(
    "-_id -content -authorAvatar -public -approvalStatus"
  );
  res.status(200).json(blogData);
});

router.route("/getsixBlogs").get(async (req, res) => {
  let blogData = await Blog.find({ public: true }).sort({createdAt:-1}).select(
    "-_id -content -authorAvatar -public -approvalStatus"
  );
  blogData = blogData.slice(0, 6);
  res.status(200).json(blogData);
});

router.route("/getpendingBlogApprovals").get(async (req, res) => {
  const blogData = await Blog.find({ approvalStatus: "pending" }).sort({createdAt:-1});
  res.status(200).json(blogData);
});

router.route("/getuserBlogs/:name").get(async (req, res) => {
  const {name} = req.params;
  try {
    const blogData = await Blog.find({ authorName: name }).sort({createdAt:-1});
    res.status(200).json(blogData);
  } catch (err) {
    console.log(err);
    res.status(422).send(`${username} not found`);
  }
});

router.route("/getBlog/:url").get(async (req, res) => {
  const { url } = req.params;
  try {
    const blog = await Blog.findOne({ url: url });
    if (blog) {
      const userdetails = await Team.findOne({
        username: blog.authorName,
      }).select(
        "-__v -_id -username -password -cpassword -canCreateCompetitions -projects -isadmin -ismember -tokens"
      );
      console.log("blog", blog);
      return res.status(200).json({ blog: blog, author: userdetails });
    } else {
      return res.status(201).json(null);
    }
  } catch (err) {
    console.log(err);
    res.status(422).send(`${url} not found`);
  }
});

router.route("/getBlogEdit/:url").get(async (req, res) => {
  const { url } = req.params;
  try {
    var blog = await Blog.findOne({ url: url });
    if (blog) {
      return res.status(200).json(blog);
    } else {
      return res.status(201).json(null);
    }
  } catch (err) {
    console.log(err);
    res.status(422).send(`${url} not found`);
  }
});

router.route("/deleteBlog/:url").post(async (req, res) => {
  const { url } = req.params;
  console.log(url);
  try {
    await Blog.deleteOne({ url: url });
    console.log("Deleted..");
    return res.status(200).json({ msg: "Project Deleted" });
  } catch (err) {
    console.log("Cannot Delete the Project");
    return res.status(422).json({ msg: "Cannot Delete the Project" });
  }
});

router.route("/getprofileblogs/:username").get(async (req,res)=>{
  try {
    const user = req.params.username;
    console.log("user: ",user);
    const blogs = await Blog.find({authorName:user}).sort({createdAt:-1}).select("title -_id").limit(5);
    console.log("blogs",blogs);
    res.status(200).json({blogs:blogs});
  } catch (error) {
    console.log(error);
    res.status(500).json({"msg":"Internal server Error"});
  }
})

module.exports = router;
