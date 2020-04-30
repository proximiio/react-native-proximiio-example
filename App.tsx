/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { mapping, light as lightTheme } from '@eva-design/eva'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import Main from './src/pages/Main'

class App extends React.Component<any> {
  render() {
    return (
      <ApplicationProvider mapping={mapping} theme={lightTheme}>
        <IconRegistry icons={EvaIconsPack} />
        <Main />
      </ApplicationProvider>
    )
  }
}

export default App
