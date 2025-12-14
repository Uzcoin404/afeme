import React, { useState, useEffect } from 'react';

const OptimizedImage = ({ src, alt, ...props }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setIsLoading(false);
    };

    img.src = src;
  }, [src]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      loading="lazy"
      {...props}
      className={isLoading ? 'image-loading' : 'image-loaded'}
    />
  );
};

export default OptimizedImage;
