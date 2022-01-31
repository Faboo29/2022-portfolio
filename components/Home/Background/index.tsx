import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';

const Background = () => {
  const refContainer = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { current: container } = refContainer;
  }, []);

  return (
    <div id={styles.appScene} ref={refContainer}>
      <img src="image-source" alt="an image" id="tile-image" />
    </div>
  );
};

export default Background;
