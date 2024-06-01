const WeeklyData = require('../models/weeklyData');

// This will store the occupied spots in last 7 days + average of the occupied spots per hour of the day
exports.getWeeklyData = async(req, res) => {
    try{
        const weeklyDatas = await WeeklyData.find();
        res.json(weeklyDatas);
    }catch (err){
        res.status(500).json({message: err.message});
    }
}

