import React, { Component } from "react";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { View } from "react-native";
import settings from "../../settings";
import MapControls, { MapControlAction } from "./MapControls";
import Proximiio, {
  ProximiioContextProvider,
  ProximiioEvents,
  ProximiioLocation,
} from "react-native-proximiio";
import ProximiioMapbox, {
  AmenitySource,
  FeatureCollection,
  GeoJSONSource,
  RoutingSource,
  UserLocationSource,
  Feature,
} from "react-native-proximiio-mapbox";
import { Callout } from "./Callout";

MapboxGL.setAccessToken(settings.mapbox.token);

interface Props {
  collection: FeatureCollection;
  points: FeatureCollection;
  userLocation?: ProximiioLocation;
  animationDuration: number;
  centerCoordinate: number[];
  level: number;
  zoom: number;
  onLevelChange: (level: number) => void;
}

interface State {
  collection: FeatureCollection;
  points: FeatureCollection;
  images: any;
  mapLoaded: boolean;
  imagesReady: boolean;
  query: string;
  trackingEnabled: boolean;
  selected?: Feature;
  position?: ProximiioLocation;
  regionChanging: boolean;
}

export default class MapView extends Component<Props, State> {
  _map: MapboxGL.MapView | null = null;
  _camera: MapboxGL.Camera | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      collection: this.props.collection,
      points: this.props.points,
      images: {},
      mapLoaded: false,
      imagesReady: false,
      query: "",
      trackingEnabled: true,
      regionChanging: false,
    };
    this.onMapLoaded = this.onMapLoaded.bind(this);
    this.onAction = this.onAction.bind(this);
  }

  componentDidMount() {
    Proximiio.subscribe(ProximiioEvents.PositionUpdated, this.onPositionUpdate);
  }

  componentWillUnmount() {
    Proximiio.unsubscribe(
      ProximiioEvents.PositionUpdated,
      this.onPositionUpdate
    );
  }

  onPositionUpdate = async (location: ProximiioLocation) => {
    if (location && this.state.trackingEnabled) {
      this._camera?.flyTo([location.lng, location.lat], 300);
      this.setState({ position: location });
    }
  };

  async onAction(action: MapControlAction) {
    if (action === "level-up") {
      this.props.onLevelChange(this.props.level + 1);
      return;
    }

    if (action === "level-down") {
      this.props.onLevelChange(this.props.level - 1);
      return;
    }

    if (action === "center" && this.state.position) {
      this._camera?.flyTo(
        [this.state.position.lng, this.state.position.lat],
        300
      );
    }

    if (action === "tracking") {
      this.setState({ trackingEnabled: !this.state.trackingEnabled });
    }
  }

  private onPress = (features: Feature[]) => {
    const points = features.filter((f) => f.isPoint);
    if (points.length > 0) {
      const selected = points[0];
      this._camera?.flyTo(selected.geometry.coordinates, 250);
      setTimeout(() => {
        this.setState({ selected, trackingEnabled: false });
      }, 250);
    }
  };

  onMapLoaded() {
    this.setState({ mapLoaded: true });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapboxGL.MapView
          logoEnabled={false}
          ref={(map: MapboxGL.MapView) => (this._map = map)}
          style={{ flex: 1 }}
          styleURL={ProximiioMapbox.styleURL}
          compassEnabled={false}
          onRegionWillChange={() => this.setState({ regionChanging: true })}
          onRegionDidChange={() => this.setState({ regionChanging: false })}
          regionWillChangeDebounceTime={50}
          regionDidChangeDebounceTime={50}
          onDidFinishLoadingMap={this.onMapLoaded}
        >
          <MapboxGL.Camera
            ref={(camera: MapboxGL.Camera) => {
              this._camera = camera;
            }}
            zoomLevel={this.props.zoom}
            minZoomLevel={settings.map.minZoom}
            maxZoomLevel={settings.map.maxZoom}
            animationMode={settings.map.animation.mode}
            animationDuration={this.props.animationDuration}
            centerCoordinate={this.props.centerCoordinate}
            defaultSettings={{
              centerCoordinate: settings.map.coordinates,
              heading: settings.map.heading,
              pitch: settings.map.pitch,
              zoomLevel: settings.map.zoom,
            }}
          />
          {this.state.mapLoaded && (
            <ProximiioContextProvider>
              <Callout
                visible={!this.state.regionChanging}
                feature={this.state.selected}
                onClose={() => this.setState({ selected: undefined })}
              />
              <AmenitySource />
              <GeoJSONSource level={this.props.level} onPress={this.onPress} />
              <RoutingSource level={this.props.level} />
              <UserLocationSource level={this.props.level} />
            </ProximiioContextProvider>
          )}
        </MapboxGL.MapView>
        <MapControls
          level={this.props.level}
          onAction={this.onAction}
          trackingEnabled={this.state.trackingEnabled}
        />
      </View>
    );
  }
}
