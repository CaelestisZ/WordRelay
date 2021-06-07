const Score = require("./../models/scoreModel");
const catchAsync = require("./../utils/catchAsync");

// Fetches top 10 plays
exports.getLeaderboard = catchAsync(async (req, res, next) => {
    const scores = await Score.find({})
        .sort({
            scores: -1,
        })
        .limit(10);

    res.status(200).json({
        status: "success",
        data: {
            scores,
        },
    });
});

// Get Scores
exports.getScoresForUser = catchAsync(async (req, res, next) => {
    const newPlayer = await Score.findOne({
        username: req.params.id,
    });
    res.status(200).json({
        status: "success",
        data: {
            newPlayer,
        },
    });
});

// Update Score
exports.updateUser = catchAsync(async (req, res, next) => {
    const newPlayer = await Score.findOneAndUpdate(
        {
            username: req.body.username,
        },
        {
            $push: {
                scores: req.body.score,
            },
        }
    );

    res.status(200).json({
        status: "success",
        data: {
            newPlayer,
        },
    });
});
