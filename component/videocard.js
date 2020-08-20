import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import VideoPlayer from 'react-native-video-player';
import {Dimensions} from 'react-native';
const Container = styled.View`
  flex: 1;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: #e6b522;
  border-radius: 10px;
`;
const Title = styled.Text`
  font-size: 20px;
  font-weight: 500;
  color: #ffffff;
`;

let {width, height} = Dimensions.get('window');
const VideoCard = (props) => {
  console.log('check url of video' + '     ' + props.data.id);
  console.log(props.data.playbackUrl);
  const [videoUrl, setVideoUrl] = useState(props.data.playbackUrl);
  return (
    <Container>
      <Title>{props.data.playbackUrl + '       ' + props.data.id}</Title>

      <VideoPlayer
        style={{marginTop: 20}}
        video={{
          uri: videoUrl,
        }}
        videoWidth={width - 50}
        videoHeight={300}
      />
    </Container>
  );
};

export default VideoCard;
