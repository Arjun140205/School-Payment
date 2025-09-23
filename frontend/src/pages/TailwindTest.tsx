// Testing Tailwind
import React from 'react';

const TailwindTest: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold underline text-blue-600">
        Hello world!
      </h1>
      <div className="mt-4">
        <div className="bg-blue-500 text-white p-4 rounded-lg">
          This is a blue box
        </div>
        <div className="bg-red-500 text-white p-4 rounded-lg mt-2">
          This is a red box
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg mt-2">
          This is a green box
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded-lg mt-2">
          This is a yellow box
        </div>
      </div>
      <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Click me
      </button>
    </div>
  );
};

export default TailwindTest;