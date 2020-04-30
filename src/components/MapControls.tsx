import React, { ReactElement } from 'react'
import { Layout, Button, Icon } from '@ui-kitten/components'
import { ViewStyle } from 'react-native'

export type MapControlAction = 'level-up' | 'level-down' | 'center' | 'tracking'

interface Props {
  level: number
  onAction: (action: MapControlAction) => void
  trackingEnabled: boolean
}

const style = {
  position: 'absolute',
  right: 4,
  top: 80,
  width: 50,
  height: 210,
  flex: 1,
  flexDirection: 'column',
  alignSelf: 'center',
  backgroundColor: 'white',
  borderRadius: 4,
  shadowColor: '#000',
  shadowRadius: 5,
  shadowOpacity: 0.15,
  shadowOffset: {width: 0, height: 5}
} as ViewStyle

const noMarginStyle = {
  marginTop: 0
} as ViewStyle

export default function MapControls({level, onAction, trackingEnabled}: Props): ReactElement {
  return (
    <Layout style={style}>
      <Button onPress={() => onAction('level-up')} status="basic" icon={(style: any) => <Icon {...style} name='arrow-up'/>}/>
      <Button status="basic">{ level.toFixed(0) }</Button>
      <Button onPress={() => onAction('level-down')} status="basic" icon={(style: any) => <Icon {...style} name='arrow-down'/>} style={noMarginStyle}/>
      <Button onPress={() => onAction('center')} status="basic" icon={(style: any) => <Icon {...style} name='pin-outline'/>} style={noMarginStyle}/>
      <Button onPress={() => onAction('tracking')} status={trackingEnabled ? 'primary' : 'basic'} icon={(style: any) => <Icon {...style} name='paper-plane-outline'/>} style={noMarginStyle}/>
    </Layout>
  )
}
