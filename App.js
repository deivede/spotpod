import React, { useState, useEffect } from 'react';
import { TouchableHighlight, View, Linking, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Artists, Albums, Tracks, SignIn, Configurations } from './Screens.js'
import styles from './Styles.js'
import * as FileSystem from 'expo-file-system';

const Root = createStackNavigator()

export default function App() {

  const [lib, setLib] = useState({ artists: [{ name: "No Library. Go to Configurations or reopen app"}]})

  useEffect(() => {
    FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'libra.json').then(library =>
      {
        const parsedLibrary = JSON.parse(library)
        setLib(parsedLibrary)
      })
    }
    ,[])

      return (
        <NavigationContainer>
          <Root.Navigator>
            <Root.Screen name="SignIn" component={SignIn} />
            <Root.Screen name="Configurations" component={Configurations} />
  <Root.Screen name="Artists" initialParams={lib}  component={Artists}  />
<Root.Screen name="Albums" initialParams={lib} component={Albums} />
<Root.Screen name="Tracks" initialParams={lib} component={Tracks}  />
          </Root.Navigator>
      </NavigationContainer>
    )

}
