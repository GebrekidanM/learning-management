const {Family, Student} = require('../model/Student_Family.model')

const DeleteFamilyAndStudent = async (req, res) => {
    const { id } = req.params;

    // Check if the ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid ID!' });
    }

    try {
        // Try to delete from Family
        const deletedFamily = await Family.findByIdAndDelete(id);
        if (deletedFamily) {
            return res.status(200).json(deletedFamily);
        }

        // Try to delete from Student if Family not found
        const deletedStudent = await Student.findByIdAndDelete(id);
        if (deletedStudent) {
            return res.status(200).json(deletedStudent);
        }
      
        // If none were deleted
        return res.status(404).json({ error: "No document found with this ID!" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {
    DeleteFamilyAndStudent
}