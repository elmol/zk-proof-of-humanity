import { Button, ChakraProvider } from "@chakra-ui/react";
import { Dict } from "@chakra-ui/utils";
import { ReactNode } from "react";

export interface ButtonProps {
  theme?: Dict | undefined
  children: ReactNode;
  isLoading?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined

}

const BaseButton = (props: ButtonProps) => {
  return (
    <ChakraProvider theme={props.theme}>
        <Button colorScheme='primary'  width="100%" isLoading={props.isLoading} onClick={props.onClick} loadingText="Check wallet">{props.children}</Button>
    </ChakraProvider>
  )
};

export default BaseButton;
