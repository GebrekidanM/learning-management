import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';

function SectionDropdown({ sections, fetchStudents }) {
    const [selectedSection, setSelectedSection] = useState(null);
    
    const handleSectionChange = (e) => {
        setSelectedSection(e.value);  
        fetchStudents(e.value._id);  
    };

    const sectionOptions = sections.map((section) => ({
        label: `Section ${section.section}`, 
        value: section  
    }));

    return (
        <div>
            <Dropdown
                value={selectedSection}  
                options={sectionOptions} 
                onChange={handleSectionChange} 
                optionLabel="label" 
                placeholder="Select a Section"  
                className="w-full md:w-14rem p-2 text-center"
            />
        </div>
    );
}

export default SectionDropdown;
