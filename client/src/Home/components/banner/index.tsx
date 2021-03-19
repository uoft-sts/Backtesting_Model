import React from 'react';
import { Container, Inner, Title, SubTitle } from './styles/banner';

type ComponentProp = {
	children?: any;
	[x: string]: any;
};

function Banner({ children, ...restProps }: ComponentProp) {
	return (
		<Container {...restProps}>
			<Inner>{children}</Inner>
		</Container>
	);
}

Banner.Title = function BannerTitle({ children, ...restProps }: ComponentProp) {
	return <Title {...restProps}>{children}</Title>;
};

Banner.SubTitle = function BannerSubTitle({ children, ...restProps }: ComponentProp) {
	return <SubTitle {...restProps}>{children}</SubTitle>;
};

export default Banner;
