import React, {memo, useRef, useState, useEffect} from 'react';
import {
  View,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview'; // Version can be specified in package.json
import styled from 'styled-components';
import VideoPlayer from 'react-native-video-player';

const AddType = {
  CONTINUE: 1,
  START: 0,
};

const Container = styled.View`
  flex: 1;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: #e6b522;
  border-radius: 10px;
`;

let {width, height} = Dimensions.get('window');
const VideoRecycler = memo(() => {
  const [pageSize, setPageSize] = useState(0);
  const [activeNumber, setActiveNumber] = useState(0);
  const [player, setPlayer] = useState([]);
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [dataProvider, setDataProvider] = useState(dataProviderMaker(data));

  const _layoutProvider = useRef(layoutMaker()).current;

  const listView = useRef();

  const rowRenderer = (type, singledata) => {
    return (
      <>
        <Container>
          <VideoPlayer
            style={{marginTop: 20}}
            video={{
              uri: singledata.playbackUrl,
            }}
            ref={(r) => {
              console.log('player inserting');
              console.log(r);
              console.log(' ' + player[0]);
              setPlayer([...player, r]);
            }}
            pauseOnPress={true}
            videoWidth={width - 50}
            videoHeight={height - 200}
          />
        </Container>
      </>
    );
  };

  const load = async (data, more = false) => {
    try {
      if (more) setIsLoadingMore(!!more);
      else setIsLoading(true);

      setData(data);
      setPageSize(pageSize + 1);
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

  const loadMore = async () => {
    console.log('end');
    fetchMyData(AddType.CONTINUE);
  };

  const refresh = async () => {
    fetchMyData(AddType.START);
  };

  useEffect(() => {
    fetchMyData(AddType.START);
  }, []);

  async function fetchMyData(type) {
    console.log('fetchmydata without check is called');
    let result = await fetch(
      'https://europe-west1-boom-dev-7ad08.cloudfunctions.net/videoFeed',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page: pageSize,
        }),
      },
    ).then((res) => {
      if (res) {
        return res.json();
      } else {
        console.log('error in fetching');
        return ['sdsdsd'];
      }
    });
    if (type == AddType.CONTINUE) {
      load([...data, ...result], true);
    } else {
      load(result);
    }
  }

  useEffect(() => {}, [activeNumber]);

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
      <RecyclerListView
        style={{flex: 1, marginTop: 50}}
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
        onVisibleIndicesChanged={(number) => {
          if (player.length > 1) {
            console.log('player identification');
            console.log(number[number.length - 2]);
            console.log(player.length);
            console.log(player[number[number.length - 2]]);
            player[number[number.length - 2]].resume();
            if (activeNumber != number[number.length - 2]) {
              player[activeNumber].pause();
              player[number[number.length - 2]].resume();
              setActiveNumber(number[number.length - 2]);
            }
          }
        }}
        layoutProvider={_layoutProvider}
        dataProvider={dataProvider}
        rowRenderer={rowRenderer}
      />
    </View>
  );
});
const layoutMaker = () =>
  new LayoutProvider(
    (index) => {
      return 1;
    },
    (type, dim) => {
      dim.width = width;
      dim.height = height - 70;
    },
  );

const RenderFooter = ({loading}) =>
  loading && (
    <ActivityIndicator
      style={{margin: 20, alignSelf: 'center', flex: 1}}
      size="large"
    />
  );

const dataProviderMaker = (data) =>
  new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(data);

export default VideoRecycler;
