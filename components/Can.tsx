import { ReactNode } from "react"
import { useCan } from "../hooks/useCan";

interface Props {
    children: ReactNode,
    permissions?: string[];
    roles?: string[];
}

export  function Can ({children, permissions, roles}: Props) {
    const userCanSeeComponent = useCan({permissions, roles})

    if(!userCanSeeComponent) {
        return null;
    }

    return (
        <>
            {children}
        </>
    )
}