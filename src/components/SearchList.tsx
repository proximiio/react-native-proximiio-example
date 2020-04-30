import React, { ReactElement, useState } from 'react'
import { Image, ListRenderItemInfo, View, Platform, ViewStyle } from 'react-native'
import { Layout, List, ListItem, ListItemProps, Text } from '@ui-kitten/components'
import ProximiioMapbox, { Feature, FeatureCollection, ProximiioMapboxEvents, Amenity } from 'react-native-proximiio-mapbox'

interface Props {
  level: number
  query: string
  onSelect: (feature: Feature) => void
}

const layoutStyle = {
  position: 'absolute',
  top: Platform.OS === 'ios' ? 77 : 43,
  left: 0,
  width: 300,
  padding: 6,
  elevation: 4
} as ViewStyle

const accessoryStyle = {
  width: 40,
  alignContent: 'flex-end',
  margin: 0,
  alignItems: 'flex-end',
  backgroundColor: 'rgba(0, 0, 0, 0)'    
} as ViewStyle

const itemStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0)',
  padding: 0
} as ViewStyle

const titleStyle = {
  width: 184
}

export default function SearchList({query, onSelect}: Props): ReactElement {
  const [amenities, setAmenities] = useState([] as Amenity[])
  const [data, setData] = useState({ type: 'FeatureCollection', features: [] } as FeatureCollection)
  const [features, setFeatures] = useState([] as Feature[])

  const searchData = async (query: string) => {
    const filtered = features.filter(f => (f as any).contains(query))
    setData({
      type: 'FeatureCollection',
      features: (filtered.length > 9 ? filtered.slice(0, 9) : filtered)
    } as FeatureCollection)
  }

  React.useEffect(() => {
    const updateAmenities = async () => {
      const amenities = await ProximiioMapbox.getAmenities()
      setAmenities(amenities)
    }

    const updateFeatures = async () => {
      const features = await ProximiioMapbox.getFeatures()
      setFeatures(features.filter(f => f.isPoint && f.hasTitle()))
    }

    updateAmenities() 
    updateFeatures() 
    ProximiioMapbox.subscribe(ProximiioMapboxEvents.AMENITIES_CHANGED, updateAmenities)
    ProximiioMapbox.subscribe(ProximiioMapboxEvents.FEATURES_CHANGED, updateFeatures)
    return () => {
      ProximiioMapbox.unsubscribe(ProximiioMapboxEvents.AMENITIES_CHANGED, updateAmenities)
      ProximiioMapbox.unsubscribe(ProximiioMapboxEvents.FEATURES_CHANGED, updateFeatures)
    }
  }, [])

  React.useEffect(() => {
    searchData(query)
  }, [query, features])

  if (query.length < 3) {
    return <View />
  }

  const renderItem = ({ item }: ListRenderItemInfo<Feature>): React.ReactElement<ListItemProps> => {
    return (
      <ListItem
        title={item.properties.title}
        description={item.properties.description}
        accessory={(style) => <Layout style={accessoryStyle}>
          <Text style={{ fontSize: 14 }}>L{ item.properties.level }</Text>
        </Layout>}
        onPress={() => onSelect(item)}
        icon={(style) => <Image
          style={style}
          source={{ uri: amenities.find(amenity => amenity.id === item.properties.amenity )?.icon }}
        />}
        style={itemStyle}
        titleStyle={titleStyle}
      />
    );
  }

  return <Layout style={layoutStyle}>
    <List
      data={data.features}
      renderItem={renderItem}
    />
  </Layout>
}
