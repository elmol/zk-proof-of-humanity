import { HTMLChakraProps, ThemingProps } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
const Card = {
	baseStyle: (props: any) => ({
		p: '20px',
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		position: 'relative',
		borderRadius: '20px',
		minWidth: '0px',
		wordWrap: 'break-word',
		bg: mode('#ffffff', 'navy.900')(props),
		backgroundClip: 'border-box'
	})
};

export const CardComponent = {
	components: {
		Card
	}
};

export interface CustomCardProps extends HTMLChakraProps<'div'>, ThemingProps {}

export default Card


