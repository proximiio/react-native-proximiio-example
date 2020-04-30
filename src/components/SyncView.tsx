import React, { ReactElement } from 'react'
import { Layout, Spinner } from '@ui-kitten/components'
import { ViewStyle } from 'react-native'

const style = {
  width: 38,
  height: 38,
  position: 'absolute',
  right: 6,
  top: 101,
  backgroundColor: 'transparent'
} as ViewStyle

export default function SyncView(): ReactElement {
  return (
    <Layout style={style}>
      <Spinner size="giant" status="success"/>
    </Layout>
  )
}
