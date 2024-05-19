const WeeklyData = require('../models/weeklyData');

exports.getWeeklyData = async(req, res) => {
    try{
        const weeklyDatas = await WeeklyData.find();
        res.json(weeklyDatas);
    }catch (err){
        res.status(500).json({message: err.message});
    }
}

