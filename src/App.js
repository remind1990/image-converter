import { useState, useEffect, useRef } from 'react';
import Logo from './Logo';

const params = {
  width: '',
  height: '',
};
const apiUrl =
  process.env.NODE_ENV === 'production'
    ? 'http://localhost:3300'
    : 'https://sunrise-image-converter.herokuapp.com';
export default function App() {
  const [resizedImages, setResizedImages] = useState([]);
  const [sizes, setSizes] = useState(params);
  const [isLoading, setIsLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  const containerRef = useRef(null);
  const childRef = useRef(null);

  const handleSizesChange = (e) => {
    const { name, value } = e.target;
    setSizes({ ...sizes, [name]: value });
  };
  const handleFilesChange = async (event) => {
    const files = Array.from(event.target.files);
    const formData = new FormData();
    try {
      await Promise.all(
        files.map(async (file, index) => {
          await formData.append(`image${index}`, file);
        })
      );

      const formDataIsEmpty = formData.get('image0') === null;

      if (formDataIsEmpty) {
        console.log('formData is empty');
        return;
      } else {
        uploadMultiplyImages(formData);
      }
    } catch (error) {
      console.error('Error while populating formData:', error);
    }
  };

  const uploadMultiplyImages = async (formData) => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (sizes?.width !== '' && sizes?.height !== '') {
        queryParams.append('width', sizes.width);
        queryParams.append('height', sizes.height);
        queryParams.append('keys', JSON.stringify(sizes.keys));
      }
      const testUrl = 'http://localhost:3300';
      const url = `https://sunrise-image-converter.herokuapp.com/api/resize-images`;
      console.log('hardcoded link');
      console.log(url);
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      const resizedImagesArray = responseData.resizedImages;
      const images = [];
      resizedImagesArray.forEach((image) => {
        const uint8Array = new Uint8Array(image.data.data);
        const imageBlob = new Blob([uint8Array], {
          type: 'image/jpeg',
        });
        const imageUrl = URL.createObjectURL(imageBlob);
        const imageObject = {
          imageUrl,
          id: image.id,
          name: image.name,
        };

        images.push(imageObject);
      });
      setResizedImages(images);
      setAnimate(true);
    } catch (error) {
      console.error('Error uploading image', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-l from-blue-300 to-purple-600">
      <Logo />
      <div
        className="bg-white overflow-auto  m-1 md:m-5 px-1 py-1 rounded-lg shadow-lg h-[90%] w-[90%] md:w-[70%]"
        ref={containerRef}
        style={{
          transition: 'height 0.5s ease-in-out',
          overflow: 'hidden',
          height: resizedImages ? 'auto' : '200px',
        }}
      >
        <form className="flex flex-wrap gap-10">
          <input
            type="file"
            accept="image/*"
            name="images"
            onChange={handleFilesChange}
            className="mb-4 p-2 border border-gray-300 rounded-lg"
            multiple
          />
          <div className="flex justify-center items-baseline">
            <label htmlFor="width" className="mr-5">
              Width
            </label>
            <input
              type="number"
              name="width"
              value={sizes.width}
              onChange={handleSizesChange}
              className="mb-4 p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex justify-center items-baseline">
            <label htmlFor="height" className="mr-5">
              Height
            </label>
            <input
              type="number"
              name="height"
              value={sizes.height}
              onChange={handleSizesChange}
              className="mb-4 p-2 border border-gray-300 rounded-lg"
            />
          </div>
          {isLoading && <Loader />}
        </form>
        <div className="flex flex-wrap gap-5" ref={childRef}>
          {resizedImages.length > 0 &&
            resizedImages.map((image, index) => (
              <div
                key={image.id}
                style={{
                  maxWidth: '300px',
                  transition: 'all 0.5s ease-in-out',
                  transform: animate ? 'scale(1)' : 'scale(0)',
                }}
                className={animate ? 'wrapper borderAnimated' : ''}
              >
                <span className="flex flex-col h-[100%]">
                  <img
                    src={image.imageUrl}
                    alt={image.name}
                    data-id={image.id}
                    data-name={image.name}
                    className="w-full h-full object-cover"
                  />
                  <a
                    href={image?.imageUrl}
                    download={image.name}
                    className="block text-center bg-gradient-to-r from-gray-900 via-gray-900 to-white text-white px-4 py-2  hover:bg-gray-900 hover:underline"
                  >
                    Download Resized Image
                  </a>
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function Loader() {
  return <span className="loader"></span>;
}
