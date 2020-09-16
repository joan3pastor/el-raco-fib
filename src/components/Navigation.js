import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { createStackNavigator, createMaterialTopTabNavigator, createDrawerNavigator, createAppContainer } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

import LogOut from './navigation/LogOut';
import Horari from './navigation/Horari';
import Avisos from './navigation/Avisos';
import Noticies from './navigation/Noticies';
import Assignatures from './navigation/Assignatures';
import Labs from './navigation/Labs';
import Events from './navigation/Events';
import Notes from './navigation/Notes';
import Places from './navigation/Places';
import Mobilitat from './navigation/Mobilitat';
import Lectures from './navigation/Lectures';
import Aules from './navigation/Aules';
import SalesBibl from './navigation/SalesBibl';
import Feedback from './navigation/Feedback';
import Settings from './navigation/Settings';
import ExternalLinks from './navigation/ExternalLinks';
import DrawerComp from './navigation/Drawer';


const Tabs = createMaterialTopTabNavigator({
  HorariTab: { 
    screen: Horari,
    navigationOptions: {
      header: true,
      headerTitle: 'Horari',
      tabBarLabel: ` ${langBottomTabs.horari} `,
      tabBarIcon: ({ tintColor }) => (<Icon name='calendar' color={tintColor} size={22} />),  
    } 
  },
  AvisosTab: { 
    screen: Avisos,
    navigationOptions: {
      tabBarLabel: ` ${langBottomTabs.avisos} `,
      tabBarIcon: ({ tintColor }) => (<Icon name='envelope-o' color={tintColor} size={24} />), 
    } 
  },
  NoticiesTab: { 
    screen: Noticies,
    navigationOptions: {
      tabBarLabel: ` ${langBottomTabs.noticies} `,
      tabBarIcon: ({ tintColor }) => (<Icon name='newspaper-o' color={tintColor} size={24} />), 
    }
  },
  AssignaturesTab: { 
    screen: Assignatures,
    navigationOptions: {
      tabBarLabel: ` ${langBottomTabs.assig} `,
      tabBarIcon: ({ tintColor }) => (<Icon name='th-large' color={tintColor} size={24} />), 
    }
  }
  },{
    initialRouteName: 'HorariTab',
    tabBarPosition: 'bottom',
    tabBarOptions: {
      showIcon: true,
      activeTintColor: '#020617',
      inactiveTintColor: '#303030',
      labelStyle: {
        margin: 2
      },
      style: {
        backgroundColor: '#fff',
        borderTopColor: '#505050',
        borderTopWidth: 0.5
      },
      indicatorStyle: {
        backgroundColor: '#101D2A'
      }
    }
  });

const MainStack = createStackNavigator(
  {
    MainTabs: {
      screen: Tabs, 
      navigationOptions: ({ navigation }) => ({
        title: '  FIB  El Racó  ',
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.openDrawer()}><Icon style={{marginLeft:8}} name="navicon" backgroundColor="rgba(0,0,0,0)" color='#202020' size={24} /></TouchableOpacity>
        ),
      })
    }
  },{
    headerLayoutPreset: 'center'
  });

const EventsStack = createStackNavigator(
  {
    EventsStack_im: {
      screen: Events, 
      navigationOptions: ({ navigation }) => ({
        title: `  ${langTitleViews.events}  `,
        headerLeft: (
          <View style={{marginLeft:6}}>
            <TouchableOpacity onPress={() => navigation.navigate('MainDrawer')}><Icon name="arrow-left" backgroundColor="rgba(0,0,0,0)" color='#202020' size={24} /></TouchableOpacity>
          </View>
        ),
      })
    }
  },{
    headerLayoutPreset: 'center'
  });

const NotesStack = createStackNavigator(
  {
    NotesStack_im: {
      screen: Notes, 
      navigationOptions: ({ navigation }) => ({
        title: `  ${langTitleViews.notes}  `,
        headerLeft: (
          <View style={{marginLeft:6}}>
            <TouchableOpacity onPress={() => navigation.navigate('MainDrawer')}><Icon name="arrow-left" backgroundColor="rgba(0,0,0,0)" color='#202020' size={24} /></TouchableOpacity>
          </View>
        ),
      })
    }
  },{
    headerLayoutPreset: 'center'
  });

const PlacesStack = createStackNavigator(
  {
    PlacesStack_im: {
      screen: Places, 
      navigationOptions: ({ navigation }) => ({
        title: `  ${langTitleViews.places}  `,
        headerLeft: (
          <View style={{marginLeft:6}}>
            <TouchableOpacity onPress={() => navigation.navigate('MainDrawer')}><Icon name="arrow-left" backgroundColor="rgba(0,0,0,0)" color='#202020' size={24} /></TouchableOpacity>
          </View>
        ),
      })
    }
  },{
    headerLayoutPreset: 'center'
  });

const MobilitatStack = createStackNavigator(
  {
    MobilitatStack_im: {
      screen: Mobilitat, 
      navigationOptions: ({ navigation }) => ({
        title: `  ${langTitleViews.mobilitat}  `,
        headerLeft: (
          <View style={{marginLeft:6}}>
            <TouchableOpacity onPress={() => navigation.navigate('MainDrawer')}><Icon name="arrow-left" backgroundColor="rgba(0,0,0,0)" color='#202020' size={24} /></TouchableOpacity>
          </View>
        ),
      })
    }
  },{
    headerLayoutPreset: 'center'
  });

const LecturesStack = createStackNavigator(
  {
    LecturesStack_im: {
      screen: Lectures, 
      navigationOptions: ({ navigation }) => ({
        title: `  ${langTitleViews.lectures}  `,
        headerLeft: (
          <View style={{marginLeft:6}}>
            <TouchableOpacity onPress={() => navigation.navigate('MainDrawer')}><Icon name="arrow-left" backgroundColor="rgba(0,0,0,0)" color='#202020' size={24} /></TouchableOpacity>
          </View>
        ),
      })
    }
  },{
    headerLayoutPreset: 'center'
  });

const AulesStack = createStackNavigator(
  {
    AulesStack_im: {
      screen: Aules, 
      navigationOptions: ({ navigation }) => ({
        title: `  ${langTitleViews.aules}  `,
        headerLeft: (
          <View style={{marginLeft:6}}>
            <TouchableOpacity onPress={() => navigation.navigate('MainDrawer')}><Icon name="arrow-left" backgroundColor="rgba(0,0,0,0)" color='#202020' size={24} /></TouchableOpacity>
          </View>
        ),
      })
    }
  },{
    headerLayoutPreset: 'center'
  });

const LabsStack = createStackNavigator(
  {
    LabsStack_im: {
      screen: Labs, 
      navigationOptions: ({ navigation }) => ({
        title: `  ${langTitleViews.labs}  `,
        headerLeft: (
          <View style={{marginLeft:6}}>
            <TouchableOpacity onPress={() => navigation.navigate('MainDrawer')}><Icon name="arrow-left" backgroundColor="rgba(0,0,0,0)" color='#202020' size={24} /></TouchableOpacity>
          </View>
        ),
      })
    }
  },{
    headerLayoutPreset: 'center'
  });

const SalesBiblStack = createStackNavigator(
  {
    SalesBiblStack_im: {
      screen: SalesBibl, 
      navigationOptions: ({ navigation }) => ({
        title: `  ${langTitleViews.bibl}  `,
        headerLeft: (
          <View style={{marginLeft:6}}>
            <TouchableOpacity onPress={() => navigation.navigate('MainDrawer')}><Icon name="arrow-left" backgroundColor="rgba(0,0,0,0)" color='#202020' size={24} /></TouchableOpacity>
          </View>
        ),
      })
    }
  },{
    headerLayoutPreset: 'center'
  });

const FeedbackStack = createStackNavigator(
  {
    FeedbackStack_im: {
      screen: Feedback, 
      navigationOptions: ({ navigation }) => ({
        title: `  ${langTitleViews.feedback}  `,
        headerLeft: (
          <View style={{marginLeft:6}}>
            <TouchableOpacity onPress={() => navigation.navigate('MainDrawer')}><Icon name="arrow-left" backgroundColor="rgba(0,0,0,0)" color='#202020' size={24} /></TouchableOpacity>
          </View>
        ),
      })
    }
  },{
    headerLayoutPreset: 'center'
  });

  const SettingsStack = createStackNavigator(
    {
      SettingsStack_im: {
        screen: Settings, 
        navigationOptions: ({ navigation }) => ({
          title: `  ${langTitleViews.settings}  `,
          headerLeft: (
            <View style={{marginLeft:6}}>
              <TouchableOpacity onPress={() => navigation.navigate('MainDrawer')}><Icon name="arrow-left" backgroundColor="rgba(0,0,0,0)" color='#202020' size={24} /></TouchableOpacity>
            </View>
          ),
        })
      }
    },{
      headerLayoutPreset: 'center'
    });

    const ExternalLinksStack = createStackNavigator(
      {
        ExternalLinksStack_im: {
          screen: ExternalLinks, 
          navigationOptions: ({ navigation }) => ({
            title: `  ${langTitleViews.links}  `,
            headerLeft: (
              <View style={{marginLeft:6}}>
                <TouchableOpacity onPress={() => navigation.navigate('MainDrawer')}><Icon name="arrow-left" backgroundColor="rgba(0,0,0,0)" color='#202020' size={24} /></TouchableOpacity>
              </View>
            ),
          })
        }
      },{
        headerLayoutPreset: 'center'
      });

const Drawer = createDrawerNavigator({
  MainDrawer: {
    screen: MainStack
  },
  LabsDrawer: {
    screen: LabsStack
  },
  SalesBiblDrawer: {
    screen: SalesBiblStack
  },
  LogOut: {
    screen: LogOut
  },
  EventsDrawer: { 
    screen: EventsStack, 
  },
  NotesDrawer: { 
    screen: NotesStack, 
  },
  PlacesDrawer: { 
    screen: PlacesStack, 
  },
  MobilitatDrawer: { 
    screen: MobilitatStack, 
  },
  LecturesDrawer: { 
    screen: LecturesStack, 
  },
  AulesDrawer: { 
    screen: AulesStack, 
  },
  FeedbackDrawer: {
    screen: FeedbackStack,
  }, 
  SettingsDrawer: {
    screen: SettingsStack,
  },
  ExternalLinksDrawer: {
    screen: ExternalLinksStack,
  },
  },{
    initialRouteName: 'MainDrawer',
    contentComponent: DrawerComp
  });

  const App = createAppContainer(Drawer);
  export default App;


// TODO: Añadir settings drawer