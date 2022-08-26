import { Component } from 'react';
import { DeviceEventEmitter, Dimensions } from 'react-native';
import { SnackbarViewProps } from '../components/SnackbarContainer';

class SnackbarManager extends Component {
  constructor(props?: SnackbarViewProps) {
    super(props || {});
    this.state = {
      visibleHeight: Dimensions.get('window').height,
    };
  }

  props: SnackbarViewProps = {};

  private show(props: SnackbarViewProps) {
    this.props = props;
    this.emitChange();
    setTimeout(() => DeviceEventEmitter.emit('info', undefined), 2500);
  }

  public success = (message: string, timeout?: number) =>
    this.show({ message, severity: 'success' });

  public error = (
    place: string,
    message: string = 'Something went wrong. Try again later.',
    error?: any
  ) => {
    this.show({ message, severity: 'error' });
    console.log(place, error);
  };

  remove() {
    this.props = {};
    this.emitChange();
  }

  emitChange() {
    DeviceEventEmitter.emit('info', this.props);
  }

  addChangeListener(callback: (props: SnackbarViewProps | undefined) => void) {
    DeviceEventEmitter.addListener('info', callback);
  }
}

export default new SnackbarManager();
