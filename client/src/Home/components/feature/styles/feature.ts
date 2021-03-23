import styled from 'styled-components/macro';

interface InnerProps {
	readonly direction: string;
}

export const Inner = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: ${({ direction }: InnerProps) => direction};
	max-width: 68rem;
	margin: auto;
	padding: 5rem 2rem;
	text-align: center;

	@media (max-width: 1000px) {
		flex-direction: column;
		padding: 2rem;
	}
`;

export const Container = styled.div`
	position: absolute;
	left: 0;
	right: 0;
`;

export const Item = styled.div`
	display: flex;
	border-bottom: 0.5rem solid #222;
	color: #fff;
`;

export const Panel = styled.div`
	width: 50%;

	@media (max-width: 1000px) {
		width: 100%;
	}
`;

export const Title = styled.h1`
	color: red;
`;

export const Description = styled.h2`
	font-weight: 500;
	color: red;
	
	@media (max-width: 600px) {
		font-size: 1.3rem;
	}
`;

export const Image = styled.img`
	max-width: 100%;
	height: auto;
`;
