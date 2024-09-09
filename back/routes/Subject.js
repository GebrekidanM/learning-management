const router = require('express').Router()
const { default: mongoose } = require('mongoose');
const { Subject } = require('../model/SubjectModel');
const { Section } = require('../model/YearModel');

function capitalizeFirstLetter(str) {
    if (!str) return ''; // Handle empty or null strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
// geting subjects in one section
router.get('/subjects/:sectionId', async(req,res)=>{
    const {sectionId} = req.params
    if(!mongoose.Types.ObjectId.isValid(sectionId)) return res.status(400).json({error:`${sectionId} is not valid Id!`});

    try {
        const getSubject = await Subject.find({sectionId})
        if(getSubject.length>0){
            res.status(200).json(getSubject)
        }else{
            res.status(404).json({error: 'No subject by this id!'})
        }
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

router.post('/create', async (req, res) => {
    const { sectionId, name } = req.body;

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
        return res.status(400).json({ error: "Invalid Id!" });
    }

    const capitalizedNames = name.map(capitalizeFirstLetter);

    try {
        // Check if the section exists
        const findSection = await Section.findOne({ _id: sectionId });
        if (!findSection) {
            return res.status(404).json({ error: "No section with this Id!" });
        }

        // Check for existing subjects
        for (const sub of capitalizedNames) {
            const findSubject = await Subject.findOne({ name: sub, sectionId });
            if (findSubject) {
                return res.status(400).json({ error: `The subject "${sub}" already exists.` });
            }
        }

        // Insert new subjects with capitalized names
        const newSubjects = capitalizedNames.map(subjectName => ({
            name: subjectName,
            sectionId
        }));

        await Subject.insertMany(newSubjects);
        res.status(201).json({ message: 'Subjects created successfully!' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
  
    try {
      const subject = await Subject.findByIdAndUpdate(id, { name }, { new: true });
      
      if (!subject) {
        return res.status(404).json({ error: 'Subject not found' });
      }
  
      res.json(subject);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating the subject' });
    }
  });

  router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const subject = await Subject.findByIdAndDelete(id);
      
      if (!subject) {
        return res.status(404).json({ error: 'Subject not found' });
      }
  
      res.json({ message: 'Subject deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while deleting the subject' });
    }
  });

module.exports = router