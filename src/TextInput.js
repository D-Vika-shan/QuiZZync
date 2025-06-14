import React from 'react';

const TextInput = ({ setFinalInput }) => {
    const handleChange = (event) => {
        setFinalInput(event.target.value);
    };

    return (
        <textarea
            rows="10"
            cols="50"
            placeholder="Enter text here or upload a file..."
            onChange={handleChange}
        />
    );
};

export default TextInput;
