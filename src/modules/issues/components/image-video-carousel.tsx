import videoPlaceholder from '@assets/images/videoplaceholder.png';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-video.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lightgallery.css';
import lgVideo from 'lightgallery/plugins/video';
import lgZoom from 'lightgallery/plugins/zoom';
import LightGallery from 'lightgallery/react';
import type React from 'react';

interface ImageVideoCarouselProps {
  files: {
    image?: string[];
    video?: string[];
  };
}

export const ImageVideoCarousel: React.FC<ImageVideoCarouselProps> = ({
  files,
}) => {
  return (
    <LightGallery plugins={[lgZoom, lgVideo]} mode="lg-fade">
      {(files.image ?? []).map((src, index) => (
        // biome-ignore lint/a11y/useValidAnchor: <explanation>
        <a
          key={`image-${
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            index
          }`}
          data-src={src}
          className="gallery-item"
          style={{ margin: '5px', display: 'inline-block' }}
        >
          <img
            src={src}
            // biome-ignore lint/a11y/noRedundantAlt: <explanation>
            alt={`Image ${index + 1}`}
            className="h-40 w-40 object-cover"
            // style={{ height: '100px', width: '100px', objectFit: 'cover' }}
          />
        </a>
      ))}
      {(files.video ?? []).map((src, index) => (
        // biome-ignore lint/a11y/useValidAnchor: <explanation>
        <a
          key={`video-${
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            index
          }`}
          data-src={src}
          className="gallery-item"
          style={{ margin: '5px', display: 'inline-block' }}
          data-sub-html={`<h4>Video ${index + 1}</h4>`}
        >
          <img
            src={videoPlaceholder}
            alt={`Video ${index + 1}`}
            className="h-40 w-40 object-cover"
            // style={{ height: '100px', width: '100px', objectFit: 'cover' }}
          />
        </a>
      ))}
    </LightGallery>
  );
};
