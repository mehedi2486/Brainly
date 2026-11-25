import type { ReactNode } from "react";

type Variants = "primary" | "secondary"

interface ButtonProps {
    variant: Variants;
    size?:"sm" | "md" | "lg";
    text: string;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    // onClick?: () => void;

}

const variantStyles = {
    primary: "bg-purple-600 text-white",
    secondary: "bg-purple-300 text-purple-600"
}

const sizeStyle = {
    sm: "py-1 px-2",
    md: "py-2 px-4",
    lg: "py-4 px-6"
}

const defaultStyles = "rounded-md flex"


export const Button = (props: ButtonProps) =>{
    return (
    <button className={`${variantStyles[props.variant]} ${sizeStyle} ${defaultStyles}`}>
        {props.startIcon ? <div className="pr-2">{props.startIcon}</div>:null} {props.text} {props.endIcon}
    </button>

    );
}

<Button variant="primary" size="md" text={"adad"}/> 