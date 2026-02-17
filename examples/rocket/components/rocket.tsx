import React from "react";
import { RocketBody } from "./rocket-body";
import { RocketHead } from "./rocket-head";
import { RocketWings } from "./rocket-wings";

export const Rocket = () => (
	<>
		<RocketBody />
		<RocketHead />
		<RocketWings />
	</>
);
