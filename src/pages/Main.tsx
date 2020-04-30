import React, { Component } from 'react'
import { View } from 'react-native'
import MapView from '../components/MapView'
import PositioningStatus from '../components/PositioningStatus'
import settings from '../../settings'
import Proximiio, { ProximiioLocation } from 'react-native-proximiio'
import { column } from '../styles'
import LoadingView from '../components/LoadingView'
import SyncView from '../components/SyncView'
import SearchBar from '../components/SearchBar'
import SearchList from '../components/SearchList'
import Instructions from '../components/Instructions'
import { ProximiioContextProvider } from 'react-native-proximiio'
import ProximiioMapbox, { Feature, FeatureCollection } from 'react-native-proximiio-mapbox'

interface Props {
}

interface State {
  collection: FeatureCollection
  points: FeatureCollection
  location?: ProximiioLocation
  initialized: boolean
  centerCoordinate: number[]
  animationDuration: number
  zoom: number
  menuVisible: boolean
  syncing: boolean
  query: string
  level: number
  title: string
}

class Main extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      collection: { type: 'FeatureCollection', features: [] },
      points: { type: 'FeatureCollection', features: [] },
      initialized: false,
      syncing: false,
      centerCoordinate: settings.map.coordinates,
      zoom: settings.map.zoom,
      animationDuration: settings.map.animation.duration,
      menuVisible: false,
      query: '',
      level: 0,
      title: 'Map / Navigation'
    }

    this.toggleMenu = this.toggleMenu.bind(this)
    this.onMenuItemSelect = this.onMenuItemSelect.bind(this)
    this.onSearchSelect = this.onSearchSelect.bind(this)
    this.onQueryChange = this.onQueryChange.bind(this)
    this.onLevelChange = this.onLevelChange.bind(this)
  }

  componentDidMount() {
    this.initialize()
  }

  async initialize() {
    await Proximiio.authorize(settings.proximiio.token)
    await ProximiioMapbox.authorize(settings.proximiio.token)

    Proximiio.requestPermissions()
    await this.setState({
      initialized: true
    })
  }

  toggleMenu () {
    this.setState({ menuVisible: !this.state.menuVisible })
  }

  onLevelChange(level: number) {
    this.setState({ level })
  }

  onQueryChange(query: string) {
    this.setState({ query })
  }

  onSearchSelect(feature: Feature) {
    ProximiioMapbox.routeFind(feature.id, false)
    this.setState({ query: '', })
  }

  onMenuItemSelect (index: number) {
    this.setState({ menuVisible: false })
  }

  renderFloating() {
    return <React.Fragment>
      < PositioningStatus />
      { this.state.syncing && <SyncView /> }
      
      <SearchList
        level={this.state.level}
        query={this.state.query}
        onSelect={this.onSearchSelect}
      />

      <SearchBar 
        query={this.state.query} 
        onChange={this.onQueryChange}
      />
      
      <Instructions />
    </React.Fragment>
  }

  render() {
    if (!this.state.initialized) {
      return <LoadingView />
    }

    return <View style={column}>
      <ProximiioContextProvider>
        <MapView
          collection={this.state.collection}
          points={this.state.points}
          centerCoordinate={this.state.centerCoordinate}
          level={this.state.level}
          zoom={this.state.zoom}
          userLocation={this.state.location}
          animationDuration={this.state.animationDuration}
          onLevelChange={this.onLevelChange}
        />
        { this.renderFloating() }
      </ProximiioContextProvider>
    </View>
  }
}

export default Main