
import { Dict } from "@chakra-ui/utils";
import { ReactNode } from "react";

export type ButtonActionState = {
    logs: string;
    error?: Error | null;
};

export interface ButtonActionProps {
    theme?: Dict | undefined;
    children?: ReactNode;
    onStateChange?: (state: ButtonActionState) => void;
}
