import React from 'react';
import {View} from 'react-native';
import Header from './component/header';
import VideoRecycler from './component/videorecycler';

const App = () => {
  return (
    <View style={{flex: 1}}>
      <Header />
      <VideoRecycler />
    </View>
  );
};

export default App;
