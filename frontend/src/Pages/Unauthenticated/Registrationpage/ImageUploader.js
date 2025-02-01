import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function ImageUploader({ onImageUpload, initialImage }) {
  const [src, setSrc] = useState(initialImage || '');
  const [imagePreview, setImagePreview] = useState(initialImage || null);
  const [crop, setCrop] = useState({
    unit: '%',
    width: 50,
    aspect: 1,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState({ horizontal: false, vertical: false });
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const generatePreview = useCallback(() => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
      return;
    }

    const canvas = previewCanvasRef.current;
    const image = imgRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    ctx.filter = `brightness(${brightness}) contrast(${contrast})`;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    ctx.restore();
    ctx.filter = 'none';

    const previewUrl = canvas.toDataURL('image/jpeg');
    setImagePreview(previewUrl);

    canvas.toBlob((blob) => {
      const croppedImageUrl = blob ? URL.createObjectURL(blob) : null;
      onImageUpload({
        image: croppedImageUrl,
        crop_x: completedCrop.x,
        crop_y: completedCrop.y,
        crop_width: completedCrop.width,
        crop_height: completedCrop.height,
        aspect_ratio: completedCrop.width / completedCrop.height,
        brightness,
        contrast,
        zoom_level: zoomLevel,
        rotation,
        flip,
      });
    });
  }, [completedCrop, onImageUpload, brightness, contrast, zoomLevel, rotation, flip]);

  useEffect(() => {
    generatePreview();
  }, [generatePreview]);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setSrc(reader.result);
        setImagePreview(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    } else {
      onImageUpload({
        image: null,
        crop_x: 0,
        crop_y: 0,
        crop_width: 100,
        crop_height: 100,
        aspect_ratio: 1,
        brightness: 1,
        contrast: 1,
        zoom_level: 1,
        rotation: 0,
        flip: { horizontal: false, vertical: false },
      });
    }
  };

  const handleRotate = (rotation) => {
    setRotation(rotation);
  };

  const handleFlip = (axis) => {
    setFlip((prev) => ({
      ...prev,
      [axis]: !prev[axis],
    }));
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={onSelectFile} />
      {src && (
        <>
          <ReactCrop
            src={src}
            onImageLoaded={(img) => {
              imgRef.current = img;
            }}
            crop={crop}
            onChange={(newCrop) => setCrop(newCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            rotation={rotation}
            flip={flip}
          />
          <div>
            <label>
              Brightness:
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={brightness}
                onChange={(e) => setBrightness(parseFloat(e.target.value))}
              />
            </label>
            <label>
              Contrast:
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={contrast}
                onChange={(e) => setContrast(parseFloat(e.target.value))}
              />
            </label>
            <label>
              Zoom:
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
              />
            </label>
            <button onClick={() => handleRotate(rotation + 90)}>Rotate</button>
            <button onClick={() => handleFlip('horizontal')}>Flip Horizontally</button>
            <button onClick={() => handleFlip('vertical')}>Flip Vertically</button>
          </div>
          {imagePreview && (
            <div>
              <h4>Preview:</h4>
              <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
            </div>
          )}
          <canvas
            ref={previewCanvasRef}
            style={{
              width: Math.round(completedCrop?.width ?? 0),
              height: Math.round(completedCrop?.height ?? 0),
              display: 'none',
            }}
          />
        </>
      )}
    </div>
  );
}

export default ImageUploader;