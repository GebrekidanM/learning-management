import React, { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import URL from '../../../UI/URL';

function UpdateTeacherSubject({ teacherId, yearId, setToggle }) {
    const [groupedAssignments, setGroupedAssignments] = useState(null);
    const [selectedSections, setSelectedSections] = useState({}); // Store selected sections per grade
    const [selectedSubjects, setSelectedSubjects] = useState({}); // Store selected subjects per section
    const [subjectLists, setSubjectLists] = useState({}); // Store subjects per section
    const [newSubject, setNewSubject] = useState(''); // Store selected new subject ID

    // Fetch grouped assignments for the teacher
    useEffect(() => {
        const fetchGroupedAssignments = async () => {
            try {
                const response = await fetch(`${URL()}/medium/teacher/sections/${teacherId}`);
                if (!response.ok) throw new Error("Error fetching assignments");
                const data = await response.json();
                setGroupedAssignments(data);
            } catch (error) {
                toast.error(error.message);
            }
        };

        if (teacherId) {
            fetchGroupedAssignments();
        }
    }, [teacherId]);

    useEffect(() => {
        const fetchSubjects = async (sectionId, grade) => {
            try {
                const response = await fetch(`${URL()}/class/subjects/${sectionId}`);
                const json = await response.json();
                if (response.ok) {
                    setSubjectLists((prev) => ({
                        ...prev,
                        [grade]: json,
                    }));
                } else {
                    throw new Error('Error fetching subjects');
                }
            } catch (error) {
                toast.error(error.message);
            }
        };

        Object.entries(selectedSections).forEach(([grade, section]) => {
            if (section) {
                fetchSubjects(section._id, grade);
            }
        });
    }, [selectedSections]); // Run effect whenever selectedSections changes

    const handleSectionChange = (grade, sectionValue, gradeGroup) => {
        const sectionData = gradeGroup.sections.find(sectionInfo => sectionInfo.section.section === sectionValue);
        
        setSelectedSections((prev) => ({
            ...prev,
            [grade]: sectionData ? sectionData.section : null,
        }));

        setSelectedSubjects((prev) => ({
            ...prev,
            [grade]: null,
        }));
    };

    const handleSubjectChange = (grade, subjectId) => {
        setSelectedSubjects((prev) => ({
            ...prev,
            [grade]: subjectId,
        }));
    };

    // Handle form submission to update the subject assignment
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Collect all selected sections and subjects
        const selectedSection = Object.values(selectedSections).find(section => section !== null);
        const selectedSubject = Object.values(selectedSubjects).find(subject => subject !== null);

        if (!selectedSection || !selectedSubject || !newSubject) {
            toast.error("Please select a section, current subject, and new subject.");
            return;
        }

        try {
            const response = await fetch(`${URL()}/medium/update/${selectedSection._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    teacherId,
                    sectionId: selectedSection._id,
                    oldSubjectId: selectedSubject, // Use selectedSubjects directly
                    newSubjectId: newSubject, // Use newSubject (which is just the ID)
                    yearId
                }),
                credentials: "include"
            });

            if (!response.ok) throw new Error("Error updating assignment");
            toast.success("Assignment updated successfully");
            setTimeout(() => {
                setToggle(true);
            }, 3000);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="p-3 w-15rem">
            <ToastContainer />
            <h3 className="mb-3 font-bold text-lg">Update Assignment</h3>
            <form onSubmit={handleSubmit}>
                {groupedAssignments && groupedAssignments.map((gradeGroup) => (
                    <div key={gradeGroup.grade}>
                        <h4>Grade: {gradeGroup.grade}</h4>
                        <Dropdown
                            value={selectedSections[gradeGroup.grade] ? selectedSections[gradeGroup.grade].section : null} 
                            options={gradeGroup.sections.map(sectionData => ({
                                label: sectionData.section.section, value: sectionData.section.section
                            }))}
                            onChange={(e) => handleSectionChange(gradeGroup.grade, e.value, gradeGroup)}
                            placeholder="Select section"
                            className="w-full mb-3 mt-3 p-2"
                        />

                        {/* Show current subject dropdown after section is selected */}
                        {selectedSections[gradeGroup.grade] && groupedAssignments.find(
                            group => group.grade === gradeGroup.grade
                        )?.sections.find(
                            sec => sec.section.section === selectedSections[gradeGroup.grade].section
                        )?.subjects.length > 0 && (
                            <Dropdown
                                value={selectedSubjects[gradeGroup.grade] || null} 
                                options={groupedAssignments.find(
                                    group => group.grade === gradeGroup.grade
                                )?.sections.find(
                                    sec => sec.section.section === selectedSections[gradeGroup.grade].section
                                )?.subjects.map(subject => ({
                                    label: subject.name, value: subject._id
                                }))}
                                onChange={(e) => handleSubjectChange(gradeGroup.grade, e.value)}
                                placeholder="Select current subject"
                                className="w-full mb-3 p-2"
                            />
                        )}

                        {/* Show new subject dropdown after section is selected */}
                        {selectedSections[gradeGroup.grade] && subjectLists[gradeGroup.grade]?.length > 0 && (
                            <Dropdown
                                value={newSubject || null}
                                options={subjectLists[gradeGroup.grade].map(subject => ({
                                    label: subject.name, value: subject._id
                                }))}
                                onChange={(e) => setNewSubject(e.value)}
                                placeholder="Select new subject"
                                className="w-full p-2 mb-4"
                            />
                        )}
                    </div>
                ))}
                <button
                    type="submit"
                    className="button w-full"
                >
                    Change Assignment
                </button>
            </form>
        </div>
    );
}

export default UpdateTeacherSubject;
