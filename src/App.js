import { useState, useRef } from 'react';
import ImageResize from 'image-resize';
import Logo from './Logo';

const params = {
  width: '',
  height: '',
};

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
    setIsLoading(true);
    try {
      const resizedImages = await Promise.all(
        files.map(async (file, index) => {
          const imageResize = new ImageResize();
          const imageUrl = await imageResize
            .updateOptions({
              format: 'jpg',
              width: sizes.width || 1290,
              height: sizes.height || 1920,
            })
            .play(file);
          return {
            imageUrl,
            id: index,
            name: file.name,
          };
        })
      );

      setResizedImages((prevImages) => [
        ...prevImages,
        ...resizedImages,
      ]);
      setAnimate(true);
    } catch (error) {
      console.error('Error resizing images:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-l from-blue-300 to-purple-600">
      <Logo />
      <div
        className="bg-white overflow-auto m-1 md:m-5 px-1 py-1 rounded-lg shadow-lg h-[90%] w-[90%] md:w-[70%]"
        ref={containerRef}
        style={{
          transition: 'height 0.5s ease-in-out',
          overflow: 'hidden',
          height: resizedImages.length ? 'auto' : '200px',
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
            resizedImages.map((image) => (
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
                    href={image.imageUrl}
                    download={image.name}
                    className="block text-center bg-gradient-to-r from-gray-900 via-gray-900 to-white text-white px-4 py-2 hover:bg-gray-900 hover:underline"
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
