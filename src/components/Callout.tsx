import * as React from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { Text, View, Animated, Image } from 'react-native';
import { Button } from '@ui-kitten/components';
import ProximiioMapbox, { Feature, ProximiioMapboxEvents, Amenity } from 'react-native-proximiio-mapbox';

export interface Props {
  feature?: Feature
  visible: boolean
  onClose: () => void
}

export function Callout({ feature, onClose, visible }: Props) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;  // Initial value for opacity: 0
  const [ amenities, setAmenities ] = React.useState([] as Amenity[]);
  const [ amenity, setAmenity ] = React.useState({} as Amenity);

  React.useEffect(() => {
    const updateAmenities = async () => {
      const amenities = await ProximiioMapbox.getAmenities();
      setAmenities(amenities)
    }

    updateAmenities(); 
    ProximiioMapbox.subscribe(ProximiioMapboxEvents.AMENITIES_CHANGED, updateAmenities);
    return () => {
      ProximiioMapbox.unsubscribe(ProximiioMapboxEvents.AMENITIES_CHANGED, updateAmenities);
    }
  }, []);
  
  React.useEffect(() => {
    fadeAnim.stopAnimation();
    Animated.timing(
      fadeAnim,
      {
        toValue: visible ? 1 : 0,
        duration: 100,
        useNativeDriver: true
      }
    ).start();
  }, [visible]);

  React.useEffect(() => {
    if (feature) {
      const amenity = amenities.find(a => a.id === feature.properties.amenity)
      if (amenity) {
        setAmenity(amenity)
      }
    }
  }, [feature]);

  if (!feature) {
    return null
  }

  return (
    <MapboxGL.MarkerView
      coordinate={feature.geometry.coordinates}
      anchor={{ x: 0.5, y: 1.1 }}>
      <Animated.View style={{ opacity: fadeAnim, backgroundColor: 'white', borderRadius: 6, width: 240, elevation: 4 }}>
        <View style={{ padding: 12, flexDirection: 'row' }}>
          <View style={{ width: 40, justifyContent: 'center' }}>
            <Image
              style={{ width: 36, height: 36}}
              source={{ uri: amenity.icon }}
            />
          </View>
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{ feature.getTitle() }</Text>
            <Text>{ feature.getDescription() }</Text>
          </View>
        </View>
        <View style={{ width: '100%', backgroundColor: '#f3f3f3', padding: 12, display: 'flex', flexDirection: 'row', borderBottomLeftRadius: 6, borderBottomRightRadius: 6 }}>
          <Button 
            onPress={async () => {
              ProximiioMapbox.route.cancel()
              await ProximiioMapbox.route.find(feature.id, false);
              onClose()
            }} 
            size="small" 
            appearance="outline" 
            style={{ flex: 1, marginRight: 12  }}>
            Route Here
          </Button>
          <Button 
            onPress={() => onClose()} 
            size="small" 
            status="basic" 
            appearance="outline" 
            style={{ flex: 1 }}>
            Close
          </Button>
        </View>
      </Animated.View>
    </MapboxGL.MarkerView>
  );
}
