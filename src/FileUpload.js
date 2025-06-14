import React from 'react';

const FileUpload = ({ setFinalInput }) => {
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFinalInput(e.target.result);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div>
            <input type="file" accept=".txt" onChange={handleFileChange} />
        </div>
    );
};

export default FileUpload;
