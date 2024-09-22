import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';

function GradeDropdown({ grades, fetchSections }) {
    const [selectedGrade, setSelectedGrade] = useState(null);

    // Transform the grades array into a format that the Dropdown component expects
    const gradeOptions = grades.map(grade => ({
        label: `Grade ${grade.grade}`,
        value: grade._id,
    }));

    // Handle changes when a new grade is selected
    const handleChange = (e) => {
        const selectedGradeId = e.value;
        setSelectedGrade(selectedGradeId);
        fetchSections(selectedGradeId);
    };

    return (
        <Dropdown
            value={selectedGrade} 
            options={gradeOptions} 
            onChange={handleChange}
            placeholder="Select a Grade"
            className="w-full md:w-14rem text-center p-2"
            optionLabel="label"
        />
    );
}

export default GradeDropdown;
