import React from "react";
import { Cylinder, Translate } from "@react-scad/core";
export const RocketHead = () => (
	<Translate v={[0, 0, 100]}>
		<Cylinder r1={20} r2={0} h={40} $fn={100} />
	</Translate>
);
