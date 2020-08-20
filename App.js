/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
/////////////////

import React, {memo, useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  Button,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import VideoCard from './component/videocard';
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
  BaseScrollView,
} from 'recyclerlistview'; // Version can be specified in package.json

const ViewTypes = {
  LOADING: 0,
  NORMAL: 1,
};

let containerCount = 0;

const pageSize = 4;

let {width, height} = Dimensions.get('window');

const ListView = memo(() => {
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [dataProvider, setDataProvider] = useState(dataProviderMaker(data));

  const _layoutProvider = useRef(layoutMaker()).current;

  const listView = useRef();

  const load = async (data, more = false) => {
    try {
      if (more) setIsLoadingMore(!!more);
      else setIsLoading(true);

      const resData = await fake(data);
      setData(resData);
    } catch (e) {
      console.log(e);
    } finally {
      if (more) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
        setIsLoadingMore(false);
        !loaded && setLoaded(true);
      }
    }
  };

  const loadMore = () => {
    console.log('end');
    load([...data, ...generateArray(pageSize)], true);
  };

  const refresh = async () => {
    load(generateArray(pageSize));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      // listView?.scrollTo({y: 300, animated: true});
    }, 5000);

    load(generateArray(pageSize));

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    setDataProvider(dataProviderMaker(data));
  }, [data]);

  if (!loaded && isLoading)
    return (
      <ActivityIndicator
        style={{marginTop: '50%', alignSelf: 'center'}}
        size="large"
      />
    );

  if (!data.length) return null;

  return (
    <View style={{flex: 1}}>
      <Button title="Refresh" onPress={() => refresh()} />
      <RecyclerListView
        style={{flex: 1}}
        ref={listView}
        scrollViewProps={{
          refreshControl: (
            <RefreshControl
              refreshing={loaded && isLoading}
              onRefresh={() => refresh()}
            />
          ),
        }}
        renderFooter={() => <RenderFooter loading={isLoadingMore} />}
        onEndReached={() => loadMore()}
        onEndReachedThreshold={1}
        externalScrollView={ExternalScrollView}
        layoutProvider={_layoutProvider}
        dataProvider={dataProvider}
        rowRenderer={rowRenderer}
      />

      <Button title="Load More" onPress={() => loadMore()} />
    </View>
  );
});

const layoutMaker = () =>
  new LayoutProvider(
    (index) => {
      return ViewTypes.NORMAL;
      4;
    },
    (type, dim) => {
      switch (type) {
        case ViewTypes.NORMAL:
          dim.width = width;
          dim.height = height - 70;
          break;
        default:
          console.warn('djjef');
          dim.width = 0;
          dim.height = 0;
      }
    },
  );

const rowRenderer = (type, data) => {
  switch (type) {
    case ViewTypes.NORMAL:
      return <VideoCard />;
    default:
      return null;
  }
};

const RenderFooter = ({loading}) =>
  loading && (
    <ActivityIndicator
      style={{margin: 20, alignSelf: 'center', flex: 1}}
      size="large"
    />
  );

const dataProviderMaker = (data) =>
  new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(data);

const generateArray = (n) => {
  let arr = new Array(n);
  for (let i = 0; i < n; i++) {
    arr[i] = i;
  }
  return arr;
};

class ExternalScrollView extends BaseScrollView {
  scrollTo(...args) {
    if (this._scrollViewRef) {
      this._scrollViewRef.scrollTo(...args);
    }
  }

  render() {
    return (
      <ScrollView
        {...this.props}
        ref={(scrollView) => {
          this._scrollViewRef = scrollView;
        }}
      />
    );
  }
}

// class CellContainer extends React.Component {
//   constructor(args) {
//     super(args);
//     this._containerId = containerCount++;
//   }
//   render() {
//     return (
//       <View {...this.props}>
//         {this.props.children}
//         <Text>Cell Id: {this._containerId}</Text>
//       </View>
//     );
//   }
// }

const fake = (data) => {
  return new Promise(function (resolve, reject) {
    try {
      setTimeout(() => {
        resolve(data);
      }, 3000);
    } catch (e) {
      reject(e);
    }
  });
};

export default ListView;

const styles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'orange',
  },
};

////////////////

// import React, {memo, useRef, useState, useEffect} from 'react';
// import styled from 'styled-components';
// import Video from 'react-native-video';
// import VideoPlayer from 'react-native-video-player';
// import {
//   SafeAreaView,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Button,
//   View,
//   Text,
//   StatusBar,
// } from 'react-native';

// import {
//   LearnMoreLinks,
//   Colors,
//   DebugInstructions,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';
// import Header from './component/header';
// import VideoCard from './component/videocard';
// import {RecyclerListView, LayoutProvider, DataProvider} from 'recyclerlistview';
// import {Dimensions} from 'react-native';

// const SCREEN_WIDTH = Dimensions.get('window').width;
// const SCREEN_HEIGHT = Dimensions.get('window').height;

// const ViewTypes = {
//   NORMAL: 1,
//   LOADING: 0,
// };

// const Container = styled.View`
//   flex: 1;
//   background-color: #ffffff;
//   justify-content: center;
//   align-items: center;
// `;

// const Title = styled.Text`
//   font-size: 20px;
//   font-weight: 500;
//   color: #3543ff;
// `;
// const App = memo(() => {
//   const [count, setCount] = useState(0);
//   const [videoUrl, setVideoUrl] = useState([
//     {
//       type: 1,
//       item: {
//         id: 0,
//         url: '',
//       },
//     },
//     {
//       type: 1,
//       item: {
//         id: 12,
//         url: 'dt',
//       },
//     },
//   ]);
//   const [dataProvider, setDataProvider] = useState(dataProviderMaker(videoUrl));
//   const _layoutProvider = useRef(layoutMaker()).current;

//   // const [dataProvider, setdataProvider] = useState(
//   //   new DataProvider((r1, r2) => r1 != r2).cloneWithRows(videoUrl),
//   // );

//   // const [layoutProvider, setlayoutProvider] = useState(
//   //   new LayoutProvider(
//   //     (i) => {
//   //       return dataProvider.getDataForIndex(i).type;
//   //     },
//   //     (type, dim) => {
//   //       switch (type) {
//   //         case 'LOADING':
//   //           dim.width = SCREEN_WIDTH - 10;
//   //           dim.height = 40;
//   //           break;
//   //         case 'NORMAL':
//   //           dim.width = SCREEN_WIDTH;
//   //           dim.height = SCREEN_HEIGHT - 100;
//   //           break;
//   //         default:
//   //           dim.width = 20;
//   //           dim.height = 0;
//   //       }
//   //     },
//   //   ),
//   // );

//   ///////

//   ////
//   useEffect(() => {
//     console.log('running');
//     setDataProvider(dataProviderMaker(videoUrl));
//   }, [videoUrl]);

//   return (
//     <Container>
//       <Header />

//       <RecyclerListView
//         style={{flex: 1, backgroundColor: 'red'}}
//         layoutProvider={_layoutProvider}
//         dataProvider={dataProvider}
//         rowRenderer={rowRenderer}
//       />
//       <VideoCard />

//       <Title>Count: {count}</Title>
//       <Button
//         title="update me"
//         onPress={() => {
//           videoUrl.push({
//             type: 1,
//             item: {
//               id: count + 1,
//               url: '',
//             },
//           });
//           setDataProvider(dataProviderMaker(videoUrl));
//           setCount(count + 1);
//         }}
//       />
//       {/* <VideoPlayer
//         video={{
//           uri:
//             'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
//         }}
//         videoWidth={1600}
//         videoHeight={900}
//         thumbnail={{uri: 'https://i.picsum.photos/id/866/1600/900.jpg'}}
//       /> */}
//     </Container>
//   );
// });

// const rowRenderer = (type, data) => {
//   const {url} = data.item;
//   return <VideoCard />;
// };

// const layoutMaker = () =>
//   new LayoutProvider(
//     (index) => {
//       return dataProvider.getDataForIndex(index).type;
//     },
//     (type, dim) => {
//       switch (type) {
//         case ViewTypes.LOADING:
//           console.log("nden")
//           dim.width = SCREEN_WIDTH - 10;
//           dim.height = 40;
//           break;
//         case ViewTypes.NORMAL:
//           dim.width = SCREEN_WIDTH;
//           console.log("full wi");
//           dim.height = SCREEN_HEIGHT - 100;
//           break;
//         default:
//           dim.width = 20;
//           dim.height = 20;
//       }
//     },
//   );

// const dataProviderMaker = (videoUrl) =>
//   new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(videoUrl);

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 10,
//   },
//   button: {
//     alignItems: 'center',
//     backgroundColor: '#DDDDDD',
//     padding: 10,
//   },
//   backgroundVideo: {
//     position: 'absolute',
//     width: 200,
//     height: 200,
//     backgroundColor: '#000000',
//     top: 0,
//     left: 0,
//     bottom: 0,
//     right: 0,
//   },
//   scrollView: {
//     backgroundColor: Colors.lighter,
//   },
//   engine: {
//     position: 'absolute',
//     right: 0,
//   },
//   body: {
//     backgroundColor: Colors.white,
//   },
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: Colors.black,
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//     color: Colors.dark,
//   },
//   highlight: {
//     fontWeight: '700',
//   },
//   footer: {
//     color: Colors.dark,
//     fontSize: 12,
//     fontWeight: '600',
//     padding: 4,
//     paddingRight: 12,
//     textAlign: 'right',
//   },
// });

// export default App;
