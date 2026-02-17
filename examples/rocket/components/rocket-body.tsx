import React from "react";
import { Cylinder } from "react-scad";
import { FN, ROCKET_H, ROCKET_R } from "../constants";

export const RocketBody = () => <Cylinder r={ROCKET_R} h={ROCKET_H} $fn={FN} />;
