import { isAbsolute } from 'path';
import React, { FunctionComponent, useState } from 'react';
import Scrollbar from 'react-scrollbars-custom';
//import { BannerContainer, FaqsContainer, FeatureContainer, FooterContainer, HeaderContainer } from '../containers';
import BannerContainer from "../containers/banner";
import FeatureContainer from "../containers/feature";

const Home : FunctionComponent<any> = () => {
	const [ isHeaderShown, setHeaderShown ] = useState(false);

	const handleOnScroll = (scrollTop: number) => {
		if (scrollTop > 100 && !isHeaderShown) {
			setHeaderShown(true);
		} else if (scrollTop <= 100 && isHeaderShown) {
			setHeaderShown(false);
		}
	};
	return (
	<div>
		<BannerContainer />
		<FeatureContainer />
	</div>
	);
}

export default Home;