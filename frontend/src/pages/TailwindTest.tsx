// Testing Tailwind
import React, { useEffect, useState } from 'react';

// Fallback styles in case Tailwind isn't working
const styles = {
  container: { padding: '1.5rem' },
  heading: { 
    fontSize: '1.875rem', 
    fontWeight: 'bold', 
    textDecoration: 'underline',
    color: '#2563eb',
    marginBottom: '1rem'
  },
  blueBox: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginTop: '0.5rem'
  },
  redBox: {
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginTop: '0.5rem'
  },
  greenBox: {
    backgroundColor: '#22c55e',
    color: 'white',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginTop: '0.5rem'
  },
  yellowBox: {
    backgroundColor: '#eab308',
    color: 'white',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginTop: '0.5rem'
  },
  button: {
    marginTop: '1rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    fontWeight: 'bold',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    cursor: 'pointer'
  }
};

const TailwindTest: React.FC = () => {
  const [isTailwindWorking, setIsTailwindWorking] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Simple check if Tailwind is working
    const testElement = document.createElement('div');
    testElement.className = 'bg-blue-500';
    document.body.appendChild(testElement);
    const style = window.getComputedStyle(testElement);
    setIsTailwindWorking(style.backgroundColor !== 'rgba(0, 0, 0, 0)');
    document.body.removeChild(testElement);
  }, []);
  
  return (
    <div style={styles.container} className="p-6">
      <h1 style={styles.heading} className="text-3xl font-bold underline text-blue-600">
        School Payment System - Style Test
      </h1>
      
      {isTailwindWorking !== null && (
        <div className={`p-4 rounded-lg mb-4 ${isTailwindWorking ? 'bg-green-100' : 'bg-red-100'}`}
             style={isTailwindWorking ? {backgroundColor: '#dcfce7'} : {backgroundColor: '#fee2e2'}}>
          Tailwind CSS is {isTailwindWorking ? 'working' : 'not working'}!
        </div>
      )}
      
      <div className="mt-4">
        <div style={styles.blueBox} className="bg-blue-500 text-white p-4 rounded-lg">
          This is a blue box
        </div>
        <div style={styles.redBox} className="bg-red-500 text-white p-4 rounded-lg mt-2">
          This is a red box
        </div>
        <div style={styles.greenBox} className="bg-green-500 text-white p-4 rounded-lg mt-2">
          This is a green box
        </div>
        <div style={styles.yellowBox} className="bg-yellow-500 text-white p-4 rounded-lg mt-2">
          This is a yellow box
        </div>
      </div>
      
      <button 
        style={styles.button} 
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Click me
      </button>
    </div>
  );
};

export default TailwindTest;