import { useState, useEffect } from 'react';

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resizedImage, setResizedImage] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (selectedFile) {
      uploadImage(selectedFile);
    }
  }, [selectedFile]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = (file) => {
    const formData = new FormData();
    formData.append('image', file);

    fetch('http://localhost:3300/api/resize-image', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.blob())
      .then((data) => {
        // Handle the resized image data here, e.g., display it or save it.
        // Set the image URL once it's ready

        console.log('image resized successfully ');
        const imageUrl = URL.createObjectURL(data);
        const parts = imageUrl.split('/');
        const uuid = parts[parts.length - 1];
        const resizedImage = {
          name: uuid,
          image: imageUrl,
        };
        setResizedImage(resizedImage);
      })
      .catch((error) => {
        console.error('Error uploading image', error);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-l from-blue-300 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 p-2 border border-gray-300 rounded-lg"
        />
        <div
          style={{
            width: '400px',
            transition: 'all 0.5s ease-in-out',
            transform: image ? 'scale(1)' : 'scale(0)',
          }}
          className={image ? 'wrapper' : ''}
        >
          {image && (
            <img
              src={image}
              alt="client"
              className="w-full h-full object-cover"
            />
          )}
          {resizedImage && (
            <a
              href={resizedImage?.image}
              download={resizedImage.name + '.jpg'}
              className="block text-center bg-gradient-to-r from-gray-900 via-gray-900 to-white text-white px-4 py-2  hover:bg-gray-900 hover:underline"
            >
              Download Resized Image
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
