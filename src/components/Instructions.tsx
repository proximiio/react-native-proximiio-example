import * as React from 'react';
import { Text } from 'react-native';
import { Layout, Card, Button } from '@ui-kitten/components';
import ProximiioMapbox from 'react-native-proximiio-mapbox';
import { ProximiioRouteEvents } from '../../node_modules/react-native-proximiio-mapbox/src/route_manager';

export interface Props {
  previewMode: boolean;
  onCancel: () => void;
}

export interface State {
  instruction?: string;
  distance?: number;
  duration?: number;
}

export default class Instructions extends React.Component<Props, State> {
  state = {} as State;

  componentDidMount() {
    ProximiioMapbox.route.on(this.onRouteEvent);
  }

  componentWillUnmount() {
    ProximiioMapbox.route.off(this.onRouteEvent);
  }

  private onRouteEvent = (event?: string, data?: any) => {
    if (event === ProximiioRouteEvents.ROUTE_STARTED) {
      this.start();
      return;
    }

    if (event === ProximiioRouteEvents.ROUTE_UPDATED) {
      this.update();
      return;
    }

    if (event === ProximiioRouteEvents.ROUTE_CANCELED) {
      this.cancel();
    }
  };

  private start = () => {
    this.update();
  };

  private cancel = () => {
    this.setState({ instruction: undefined });
    this.props.onCancel();
  };

  private update = async () => {
    const { route } = ProximiioMapbox.route;
    if (route && route.descriptor.steps.length > 1) {
      this.setState({
        instruction: ProximiioMapbox.route.isPreview
          ? 'Route preview only mode'
          : route.descriptor.steps[1].instruction,
        distance: route.descriptor.distanceMeters,
        duration: route.descriptor.duration,
      });
    }
  };

  public render() {
    if (!this.state.instruction) {
      return null;
    }

    return (
      <Layout
        style={{
          position: 'absolute',
          alignSelf: 'center',
          bottom: 50,
          width: "100%",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        <Card status="control">
          <Layout
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ marginRight: 20, flex: 1 }}>
              {this.state.instruction}
            </Text>
            <Button
              size="small"
              appearance="outline"
              onPress={() => ProximiioMapbox.route.cancel()}
              style={{ alignSelf: 'flex-end', margin: 0 }}
            >
              {this.props.previewMode ? 'Cancel Preview' : 'Stop Navigation'}
            </Button>
          </Layout>
          {ProximiioMapbox.route.isStarted && (
            <Layout
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ marginRight: 20, flex: 1 }}>
                Distance: {this.state.distance?.toFixed(0)} meters (
                {this.state.duration?.toFixed(0)} seconds)
              </Text>
            </Layout>
          )}
        </Card>
      </Layout>
    );
  }
}
