import React, { Context } from 'react'
import { Card, Text, Spinner, Layout } from '@ui-kitten/components'
import { ProximiioContext, ProximiioContextType } from 'react-native-proximiio'
import { ViewStyle } from 'react-native'

export interface Props {
}

const style = {
  position: 'absolute',
  alignSelf: 'center',
  bottom: 0,
  width: '100%',
  borderRadius: 6,
  elevation: 4,
  shadowColor: '#000',
  shadowRadius: 5,
  shadowOpacity: 0.15,
  shadowOffset: {width: 0, height: 5}
} as ViewStyle

const sourceStyle = {
  flex: 1, 
  marginLeft: 12, 
  textAlign: 'right'
} as ViewStyle

export default class PositioningStatus extends React.Component<Props> {
  static contextType: Context<ProximiioContextType> = ProximiioContext

  public render() {
    return <Layout
      style={style}>
      <Card status='control'>
        { !this.context.location && <Layout style={{ flexDirection: 'row' }}>
          <Spinner />
          <Text style={{ marginHorizontal: 20 }}>Acquiring position...</Text>
        </Layout> }
        { this.context.location && <Layout style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ flex: 2 }}>
            { this.context.location.lat.toFixed(9) }  { this.context.location.lng.toFixed(9) }
          </Text>
          <Text style={sourceStyle}>
            { this.context.location.sourceType || '' }
          </Text>
        </Layout> }
      </Card>
    </Layout>
  }
}

