import { IdentityGenerator, NewIdentityProps } from "@/widget/IdentityGenerator";
import { ContextLogger } from "./ContextLogger";


export const IdentityGeneration = ContextLogger<NewIdentityProps>(IdentityGenerator);
