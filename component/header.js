import React from 'react';
import styled from 'styled-components';

const Container = styled.View`
  flex: 1;
  height: 50px;
  width: 100%;
  position: absolute;
  top: 0;
  background-color: #0288d1;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: 500;
  color: #ffffff;
`;

const Header = () => {
  return (
    <Container>
      <Title>Binge Watch</Title>
    </Container>
  );
};

export default Header;
