import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../../context/AuthContext';
import LoadingIndicator from '../../../common/LoadingIndicator';
import ErrorMessage from '../../../common/ErrorMessage';
import URL from '../../../UI/URL';

function HomeClass() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const {loggedUser} = useContext(AuthContext)
    const [students, setStudents] = useState([]);
  
    useEffect(() => {
      const fetchScores = async () => {
        try {
          const response = await fetch(`${URL()}/teacher/class/home/${loggedUser._id}`);
          const data = await response.json();
  
          if (response.ok) {
            setStudents(data);
          } else {
            setError(data.message || 'Error fetching scores');
          }
        } catch (err) {
          setError('Failed to fetch scores');
        } finally {
          setLoading(false);
        }
      };
  
      fetchScores();
    }, [loggedUser]);
  
    if (loading) return <LoadingIndicator />;
    if (error) return <ErrorMessage error={error} />;
  
    // Collect all subject names for table headers
    const allSubjects = students.reduce((acc, student) => {
      student.subjects.forEach(subject => {
        if (!acc.includes(subject.subject)) {
          acc.push(subject.subject);
        }
      });
      return acc;
    }, []);
  
    // Function to determine analysis based on average score
    const getAnalysis = (average) => {
      if (average > 90) return 'Excellent';
      if (average > 80) return 'Best';
      if (average > 70) return 'Very Good';
      if (average > 60) return 'Good';
      if (average > 50) return 'Pass';
      return 'Fail';
    };
  
    return (
      <div className="class-scores">
        <h2>Scores for Class </h2>
  
        {students.length === 0 ? (
          <p>No results available for this class.</p>
        ) : (
          <>
            <table className="score-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  {allSubjects.map((subject, index) => (
                    <th key={index}>{subject}</th>
                  ))}
                  <th>Total Score</th>
                  <th>Average</th>
                  <th>Rank</th>
                  <th>Analysis</th>
                </tr>
              </thead>
              <tbody>
                {students.map((studentData) => {
                  const subjectScores = allSubjects.map((subjectName) => {
                    const subject = studentData.subjects.find(sub => sub.subject === subjectName);
                    return subject ? subject.score : 0;
                  });
  
                  // Calculate the average score
                  const averageScore = studentData.average.toFixed(2);
  
                  // Get the analysis based on the average score
                  const analysis = getAnalysis(averageScore);
  
                  return (
                    <tr key={studentData._id}>
                      <td>{studentData.name}</td>
                      {subjectScores.map((score, index) => (
                        <td key={index}>{score}</td>
                      ))}
                      <td>{studentData.totalScore}</td>
                      <td>{averageScore}</td>
                      <td>{studentData.rank}</td>
                      <td>{analysis}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    );
}

export default HomeClass
