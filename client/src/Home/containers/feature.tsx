import { FunctionComponent } from 'react';
import Feature, { Title } from '../components/feature/index';
import logo from '../../image/sts-logo.png';
import Install from './Install';

const FEATURES = [
	{
		id: 1,
		title: 'Presentation 1',
		description: 'Description 1',
		video: '',
		image: logo,
		alt: 'Roseflix on TV'
	},
	{
		id: 2,
		title: 'Presentation 2',
		description: 'Description 2',
		video: '',
		image: logo,
		alt: 'Roseflix on mobile',
		direction: 'row-reverse'
	},
	{
		id: 3,
		title: 'Presentation 3',
		description: 'Description 3',
		image: logo,
		alt: 'Roseflix on different devices'
	},
	{
		id: 4,
		title: 'Presentation 4',
		description: 'Description 4',
		image: logo,
		alt: 'Roseflix on different devices',
		direction: 'row-reverse'
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
			<Install/>
		</Feature.Container>
	);
}

export default FeatureContainer;
