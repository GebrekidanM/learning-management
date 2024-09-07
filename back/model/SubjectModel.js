const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subject name is required'],
        trim: true, 
        validate: {
            validator: function(value) {
                return value.length === 1;
            },
            message: props => `${props.value} must be a single character`
        }
    },

    sectionId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Section', 
            required: [true, 'Section ID is required'],
            validate: {
                validator: function(value) {
                    return mongoose.Types.ObjectId.isValid(value);
                },
                message: props => `${props.value} is not a valid Section ID`
            }
    }
}, {
    timestamps: true 
});

SubjectSchema.index({ sectionId: 1 });
const Subject = mongoose.model('Subject', SubjectSchema);

module.exports = { Subject };