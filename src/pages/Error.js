import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import ErrorAnimate from '../components/ErrorAnimation';


const Error = () => {
  return (
    <Wrapper>
      <ErrorAnimate/>
      <HomeBtn to="/" className="btn">Back Home</HomeBtn>
    </Wrapper>)
};


const Wrapper = styled.section`
	min-height: 100vh;
	display: flex;
	//place-items: center;
	flex-direction: column;
	background: var(--clr-primary-10);
	text-align: center;
	justify-content: center;
	align-items: center;

	h1 {
		font-size: 10rem;
	}
	h3 {
		color: var(--clr-grey-3);
		margin-bottom: 1.5rem;
		padding-top: 20px;
	}
`;

const HomeBtn = styled(Link)`
	margin-top: 20px;

`;
export default Error;
