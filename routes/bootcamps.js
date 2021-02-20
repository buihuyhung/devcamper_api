const express = require("express");
const {
  getBootcamp,
  getBootcamps,
  updateBootcamp,
  deleteBootcamp,
  createBootcamp,
  getBootcampsInRadius,
  boocampPhotoUpload,
} = require("../controllers/bootcamps");

const { protect, authorize } = require("../middlewares/auth");

const Bootcamp = require("../models/Bootcamp");
const advancedResults = require("../middlewares/advancedResults");

const courseRouter = require("./courses");
const reviewRouter = require("./reviews");
const router = express.Router();

router.use("/:bootcampId/course", courseRouter);
router.use("/:bootcampId/review", reviewRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("admin", "publisher"), createBootcamp);

router
  .route("/:id/photo")
  .put(protect, authorize("admin", "publisher"), boocampPhotoUpload);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("admin", "publisher"), updateBootcamp)
  .delete(protect, authorize("admin", "publisher"), deleteBootcamp);

module.exports = router;
