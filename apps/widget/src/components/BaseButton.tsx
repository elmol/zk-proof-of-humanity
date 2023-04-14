import { Button, ChakraProvider } from "@chakra-ui/react";
import { Dict } from "@chakra-ui/utils";
import { ReactNode } from "react";

export interface ButtonProps {
  theme?: Dict | undefined
  children: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined

}

const BaseButton = (props: ButtonProps) => {
  return (
    <ChakraProvider theme={props.theme}>
        <Button colorScheme='primary' onClick={props.onClick}>{props.children}</Button>
    </ChakraProvider>

  )
};

export default BaseButton;
