const router = require('express').Router()
const {GradeModel} = require('../model/YearModel')

//create year

router.post('/create-year', async (req, res) => {
    const yearData = req.body;

    try {
        const existingYear = await YearModel.findOne({ yearName: yearData.yearName });

        if (!existingYear) {
            const year = await YearModel.create(yearData);
            const grades = Array.from({ length: 8 }, (_, i) => ({
                grade: i + 1,
                yearId: year._id
            }));

            await GradeModel.insertMany(grades);

            res.status(201).json({ message: 'Year and grades inserted successfully.' });
        } else {
            res.status(409).json({ error: 'Year already exists. No new grades were inserted.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error.' });
    }
});


// Change Gregorian Calander to Ethiopian calander 

function convertToEthiopianYear() {
    const today = new Date(); // Get today's date
    const gregorianYear = today.getFullYear(); // Extract the current Gregorian year
    const gregorianMonth = today.getMonth()
    const gregorianDay = today.getDate()


    // Determine if the current date is before or after Ethiopian New Year (September 11)
    const ethiopianNewYear = new Date(gregorianYear, 8, 11); // September 11 in the Gregorian year
    let ethiopianYear;

    if(gregorianMonth < 8){
        return ethiopianYear = gregorianYear - 8
    } 
    if (gregorianMonth > 8) {
        return ethiopianYear = gregorianYear - 7;
    }
    if(gregorianMonth = 8){
        if (gregorianDay >= 11) {
            return ethiopianYear = gregorianYear - 7;
        } else {
            return ethiopianYear = gregorianYear - 8
        }
    }

    return ethiopianYear;
}
// Example usage
const ethiopianYear = convertToEthiopianYear();

// check is the year exist or not

router.get('/check-academic-year', async (req, res) => {
    try {
        const yearExists = await YearModel.exists({});
        res.json({ yearExists }); // its reasult will be true or false
    } catch (error) {
        res.status(400).json({ error: "Not found" });
    }
});

module.exports = router