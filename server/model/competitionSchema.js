const mongoose = require("mongoose");

const competitionSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
    },
    overview: {
      type: String,
      default: "Enter competition overview here"
    },
    evaluation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Evaluations",
      default: null
    },
    headerPhoto: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Team",
    },
    access: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
    public: {
      type: Boolean,
    },
    participantCount: {
      type: Number,
      default: 0,
    },
    submissionLimit: {
      type: Number,
      default: 1,
    },
    CompetitionStart: {
      type: Date,
    },
    CompetitionEnd: {
      type: Date,
    },
    publicDataSetPath: {
      type: String
    },
    publicDataSetUrl: {
      type: String
    },
    privateDataSetPath: {
      type: String
    },
    privateDataSetUrl: {
      type: String
    },
    sandBoxSubmissionPath: {
      type: String
    },
    sandBoxSubmissionUrl: {
      type: String
    },
    sandBoxPublicScore: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    },
    sandBoxPrivateScore: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    },
    sandBoxSubmissionLog: {
      type: String
    },
    DataSetTree: {
      type: String
    },
    SubmissionTree: {
      type: String
    },
    sandBoxSubmissionStatus: {
      type: Boolean,
      default: false
    },
    sandBoxStatus: {
      type: Boolean,
      default: false
    },
    publicStatus: {
      type: Boolean,
      default: false
    },
    privateStatus: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Competitions = mongoose.model("Competitions", competitionSchema);

module.exports = Competitions;
