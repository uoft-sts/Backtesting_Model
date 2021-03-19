import React, { FunctionComponent } from 'react';
import Banner from '../components/banner/index';
//import SubscribeContainer from './subscribe';

function BannerContainer () {
	return (
		<Banner>
			<Banner.Title>STS</Banner.Title>
			<Banner.SubTitle>Description Here</Banner.SubTitle>
		</Banner>
	);
}

export default BannerContainer;