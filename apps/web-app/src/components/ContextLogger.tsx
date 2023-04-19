import LogsContext from "@/context/LogsContext";
import { ComponentType, useContext } from "react";
import theme from "../styles/index";

import { ButtonActionProps, ButtonActionState } from "../widget/ButtonAction";

 export function ContextLogger<T extends ButtonActionProps>(Component: ComponentType<T>) {
    return function ExtendedComponent(props: T) {
        const { setLogs } = useContext(LogsContext);
        function handleStateChange(state: ButtonActionState) {
            setLogs(state.logs);
        }
      return (
        <Component {...props} theme={theme} onStateChange={handleStateChange} />
      );
    };
  }
