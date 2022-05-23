import React from 'react';
import { DeviceEventEmitter, Dimensions } from 'react-native';
import { SnackbarViewProps } from '../components/SnackbarContainer';

class SnackbarManager extends React.Component {
  constructor(props: SnackbarViewProps | undefined) {
    super(props || {});
    this.state = {
      visibleHeight: Dimensions.get('window').height,
    };
  }

  private props: SnackbarViewProps | undefined;

  private show(props: SnackbarViewProps) {
    this.props = props;
    this.emitChange();
    setTimeout(() => DeviceEventEmitter.emit('info', undefined), 2000);
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
    this.props = undefined;
    this.emitChange();
  }

  emitChange() {
    DeviceEventEmitter.emit('info', this.props);
  }

  addChangeListener(callback: (props: SnackbarViewProps | undefined) => void) {
    DeviceEventEmitter.addListener('info', callback);
  }
}

export default new SnackbarManager(undefined);
