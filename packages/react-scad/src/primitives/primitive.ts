import * as React from "react";
import type { PropsWithChildren } from "react";

export interface PrimitivePropsBase extends PropsWithChildren {
	type: string;
}

export function Primitive<Props extends PrimitivePropsBase>(props: Props) {
	const { type, children, ...rest } = props;
	return React.createElement(type, rest, children);
}
