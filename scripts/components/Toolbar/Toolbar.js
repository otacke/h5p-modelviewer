import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
import { H5PContext } from '../../context/H5PContext';
import './Toolbar.scss';

const ToolBar = (props) => {
  const { animations, modelViewerInstance } = props;
  // buttonstate
  const [buttonState, setButtonState] = useState(false);
  const context = useContext(H5PContext);

  const playLabel = context.params.l10n?.play;
  const pauseLabel = context.params.l10n?.pause;

  const handlePlayPause = () => {
    setButtonState(!buttonState);

    if (modelViewerInstance) {
      modelViewerInstance.availableAnimations.length && modelViewerInstance.paused
        ? modelViewerInstance.play()
        : modelViewerInstance.pause();
    }
  };

  return (
    <div className='tool-bar'>
      <div>
        {animations.length > 0 && (
          <button
            className='toolbar-btn'
            aria-label={buttonState ? pauseLabel : playLabel}
            onClick={handlePlayPause}
          >
            {buttonState ? pauseLabel : playLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default ToolBar;

ToolBar.propTypes = {
  animations: PropTypes.arrayOf(PropTypes.object).isRequired,
  modelViewerInstance: PropTypes.shape({
    availableAnimations: PropTypes.arrayOf(PropTypes.object).isRequired,
    paused: PropTypes.bool.isRequired,
    play: PropTypes.func.isRequired,
    pause: PropTypes.func.isRequired,
  }).isRequired,
};
