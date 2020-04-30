import React, { ReactElement } from 'react'
import { Icon, Input } from '@ui-kitten/components'
import { View, Platform, ViewStyle } from 'react-native'

interface Props {
  query: string
  onChange: (query: string) => void
}

const viewStyle = {
  position: 'absolute', 
  width: '100%', 
  paddingTop: Platform.OS === 'ios' ? 34 : 0, 
  backgroundColor: '#f7f9fc' 
} as ViewStyle

const inputStyle = {
  alignSelf: "center",
  width: '100%',
  elevation: 4,
  borderColor: 'transparent'
} as ViewStyle

export default function SearchBar({query, onChange}: Props): ReactElement {
  const queryOpacity = query.length < 2 ? 0.4 : 0

  return <View style={viewStyle}>
    <Input
      value={query}
      onChangeText={onChange}
      captionStyle={{ color: 'black', opacity: queryOpacity, marginLeft: 10 }}
      placeholder='Search...'
      icon={style => <Icon {...style} name="search"/>}
      style={inputStyle}
    />
  </View>
}
