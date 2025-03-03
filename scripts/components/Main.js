import PropTypes from 'prop-types';
import React from 'react';
import Dialog from './Dialog/Dialog';
import InteractionContent from './Dialog/InteractionContent';
import './Main.scss';
import ModelViewer from './ModelViewer/ModelViewer';
import ToolBar from './Toolbar/Toolbar';

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    const modelViewerId = `model-viewer-${H5P.createUUID()}`;

    this.state = {
      modelPath: this.props.initialModelPath,
      modelViewerInstance: null,
      modelViewerId,
      animations: [],
      interactions: this.props.paramInteractions,
      showInteractionDialog: false,
    };
  }

  componentDidMount() {
    const modelViewer = document.getElementById(this.state.modelViewerId);
    if (!modelViewer) return;

    modelViewer.autoRotate = false;

    const handleLoad = () => {
      this.setState({
        interactions: this.state.interactions,
        modelViewerInstance: modelViewer,
        animations: modelViewer.availableAnimations,
      });
    };

    modelViewer.addEventListener('load', handleLoad, { once: true });

    this.setState({ modelViewerInstance: modelViewer });
  }

  componentWillUnmount() {
    // remove event listener
    this.state.modelViewerInstance.removeEventListener('load');
  }

  handleModelClick() {
    // retrieve clicked point on 3D Model from model-viewer instance
    if (this.state.editingLibrary) {
      this.setState({
        showHotspotDialog: true,
      });
    }
  }

  hideInteraction() {
    this.setState({
      showInteractionDialog: false,
      hotspot: null,
    });
  }

  showContentModal(hotspot) {
    this.setState({
      showInteractionDialog: true,
      hotspot,
      editingLibrary: hotspot.action.library,
    });
  }

  render() {
    let dialogClasses = [];
    if (this.state.showInteractionDialog) {
      const library = H5P.libraryFromString(this.state.hotspot.action.library);
      const interactionClass = library.machineName.replace('.', '-').toLowerCase();

      dialogClasses.push(interactionClass);
    }

    return (
      <div className='model-viewer-container'>
        {this.state.showInteractionDialog && (
          <Dialog onHideTextDialog={this.hideInteraction.bind(this)} dialogClasses={dialogClasses}>
            <InteractionContent hotspot={this.state.hotspot} />
          </Dialog>
        )}
        <div className='container'>
          <div className='mv-container'>
            <ModelViewer
              id={this.state.modelViewerId}
              handleClick={this.handleModelClick.bind(this)}
              hotspots={this.state.interactions}
              modelPath={this.state.modelPath}
              showContentModal={this.showContentModal.bind(this)}
            />
            <ToolBar
              animations={this.state.animations}
              modelViewerInstance={this.state.modelViewerInstance}
            />
          </div>
        </div>
      </div>
    );
  }
}

Main.propTypes = {
  modelPath: PropTypes.string,
};
