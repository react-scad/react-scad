import React from "react";
import { Cylinder, Translate } from "react-scad";
import { FN, HEAD_H, HEAD_R, ROCKET_H } from "../constants";

export const RocketHead = () => (
	<Translate v={[0, 0, ROCKET_H]}>
		<Cylinder r1={HEAD_R} r2={0} h={HEAD_H} $fn={FN} />
	</Translate>
);
