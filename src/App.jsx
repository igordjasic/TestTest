import React, { useState, useEffect } from 'react';

function App() {
  const [dogs, setDogs] = useState([]);
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState(null);
  const [editingDogId, setEditingDogId] = useState(null);

  useEffect(() => {
    fetchDogs();
  }, []);

  const fetchDogs = async () => {
    try {
      const response = await fetch('http://localhost:3001/dogs');
      if (!response.ok) {
        throw new Error('Failed to fetch dogs');
      }
      const data = await response.json();
      setDogs(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (name) => {
    try {
      const response = await fetch(`http://localhost:3001/dogs/${name}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete dog');
      }
      setDogs(dogs.filter((dog) => dog.name !== name));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdate = async (id) => {
    const dogToUpdate = dogs.find((dog) => dog._id === id);
    const updatedName = prompt('Enter new name:', dogToUpdate.name);
    const updatedBreed = prompt('Enter new breed:', dogToUpdate.breed);
    const updatedAge = prompt('Enter new age:', dogToUpdate.age);
    console.log('Updating dog:', { id, updatedName, updatedBreed, updatedAge }); // Add this line for logging
    try {
      const response = await fetch(`http://localhost:3001/dogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: updatedName,
          breed: updatedBreed,
          age: updatedAge,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update dog');
      }
      fetchDogs();
    } catch (error) {
      setError(error.message);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/dogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, breed, age }),
      });
   
      setName('');
      setBreed('');
      setAge('');
      fetchDogs();
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Dog List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="text"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          placeholder="Breed"
        />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {dogs.map((dog) => (
          <li key={dog._id}>
            <strong>Name:</strong> {dog.name}, <strong>Breed:</strong>{' '}
            {dog.breed}, <strong>Age:</strong> {dog.age}
            <button onClick={() => handleDelete(dog.name)}>Remove</button>
            <button onClick={() => handleUpdate(dog._id)}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
