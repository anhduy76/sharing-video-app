import React from 'react';

const YouTubeEmbed = ({ embedId }) => (
  <div className="video-responsive">
    <iframe
      className="video-web"
      width="560"
      height="315"
      src={`https://www.youtube.com/embed/${embedId}`}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
     <iframe
      className="video-mobile"
      width="318"
      height="180"
      src={`https://www.youtube.com/embed/${embedId}`}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
);

export default YouTubeEmbed;