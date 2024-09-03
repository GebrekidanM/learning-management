import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';

function GradeDropdown({ grades, activeGradeId, fetchSections }) {
    const [selectedGrade, setSelectedGrade] = useState(null);

    // Transform the grades array into a format that the Dropdown component expects
    const gradeOptions = grades.map(grade => ({
        label: `Grade ${grade.grade}`,
        value: grade._id,
    }));

    // Handle changes when a new grade is selected
    const handleChange = (e) => {
        const selectedGradeId = e.value; // Get the selected grade's ID
        setSelectedGrade(selectedGradeId); // Update the state with the selected grade
        fetchSections(selectedGradeId); // Call fetchSections with the selected grade ID
    };

    return (
        <Dropdown
            value={selectedGrade} // Controlled component with state
            options={gradeOptions} // Array of options for the dropdown
            onChange={handleChange} // Handle the change event
            placeholder="Select a Grade" // Placeholder text when nothing is selected
            className="w-full md:w-14rem" // Example styling classes
            optionLabel="label" // Defines which field to display in the dropdown
        />
    );
}

export default GradeDropdown;
