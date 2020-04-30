import * as React from 'react';
import { Text } from 'react-native';
import { Layout, Card, Spinner, Button, Icon } from '@ui-kitten/components';
import ProximiioMapbox, { ProximiioMapboxEvents } from 'react-native-proximiio-mapbox';
import { ProximiioMapboxRouteUpdateEvent, ProximiioMapboxRouteUpdate } from 'react-native-proximiio-mapbox/lib/typescript/src/types';

export interface Props {
}

export interface State {
  instruction?: string
}

export default class Instructions extends React.Component<Props, State> {
  state = {} as State

  componentDidMount() {
    ProximiioMapbox.subscribe(ProximiioMapboxEvents.ROUTE_STARTED, this.start)
    ProximiioMapbox.subscribe(ProximiioMapboxEvents.ROUTE_UPDATED, this.update)
    ProximiioMapbox.subscribe(ProximiioMapboxEvents.ROUTE_CANCELED, this.cancel)
  }

  componentWillUnmount() {
    ProximiioMapbox.unsubscribe(ProximiioMapboxEvents.ROUTE_STARTED, this.start)
    ProximiioMapbox.unsubscribe(ProximiioMapboxEvents.ROUTE_UPDATED, this.update)
    ProximiioMapbox.unsubscribe(ProximiioMapboxEvents.ROUTE_CANCELED, this.cancel)
  }

  private start = () => this.setState({ instruction: 'Route starting' })

  private cancel = () => this.setState({ instruction: undefined})

  private update = async (evt: any) => {
    console.log('route update', evt)
    this.setState({ instruction: evt.text })
  }

  public render() {
    if (!this.state.instruction) {
      return null
    }

    return <Layout
      style={{
        position: 'absolute',
        alignSelf: 'center',
        bottom: 50,
        width: '100%'
      }}>
      <Card status='control'>
        <Layout style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ marginRight: 20, flex: 1 }}>{ this.state.instruction }</Text>
          <Button 
            size="small" 
            appearance="outline" 
            onPress={() => ProximiioMapbox.routeCancel()} 
            style={{ alignSelf: 'flex-end', margin: 0 }}>
            Stop Navigation
          </Button>
        </Layout>
      </Card>
    </Layout>
  }
}
