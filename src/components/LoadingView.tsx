import React, {ReactElement} from 'react'
import { Layout, Text } from '@ui-kitten/components'
import { ViewStyle } from 'react-native'

interface Props {

}

const style = {
  flexDirection: 'column',
  alignSelf: 'stretch', 
  justifyContent: 'center', 
  alignItems: 'center' 
} as ViewStyle

export default function LoadingView({}: Props): ReactElement {
  return (
    <Layout style={style}>
      <Text>Loading</Text>
    </Layout>
  )
}
