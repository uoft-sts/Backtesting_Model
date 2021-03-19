import { FunctionComponent } from 'react';
import Feature, { Title } from '../components/feature/index';
import logo from '../../image/sts-logo.png';

const FEATURES = [
	{
		id: 1,
		title: 'Enjoy on your TV.',
		description: 'Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players and more.',
		video: '',
		image: logo,
		alt: 'Roseflix on TV'
	},
	{
		id: 2,
		title: 'Download your shows to watch offline.',
		description: 'Save your favorites easily and always have something to watch.',
		video: '',
		image: logo,
		alt: 'Roseflix on mobile',
		direction: 'row-reverse'
	},
	{
		id: 3,
		title: 'Watch everywhere.',
		description: 'Stream unlimited movies and TV shows on your phone, tablet, laptop and TV without paying more.',
		image: logo,
		alt: 'Roseflix on different devices'
	}
];

function FeatureContainer (){
	return (
		<Feature.Container>
			{FEATURES.map(({ id, direction = 'row', title, description, image, alt }) => (
				<Feature key={id} direction={direction}>
					<Feature.Panel>
						<Feature.Title>{title}</Feature.Title>
						<Feature.Description>{description}</Feature.Description>
					</Feature.Panel>
					<Feature.Panel>
						<Feature.Image src={image} alt={alt} />
					</Feature.Panel>
				</Feature>
			))}
		</Feature.Container>
	);
}

export default FeatureContainer;
