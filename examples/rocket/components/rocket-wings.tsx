import React from "react";
import { Raw } from "react-scad";
import { ROCKET_R, WING_H, WING_L, WING_MANY, WING_W } from "../constants";

const WINGS_RAW = `
rocket_r = ${ROCKET_R};
wing_w = ${WING_W};
many = ${WING_MANY};
wing_l = ${WING_L};
wing_h = ${WING_H};
wing_points = [[0,0],[wing_l,0],[0,wing_h]];
in_by = 1;

for (i = [0: many - 1])
  rotate([0, 0, 370 / many * i])
  translate([rocket_r - in_by, 0, 0])
  rotate([90, 0, 0])
  linear_extrude(height = wing_w, center = true)
    polygon(wing_points);
`;

export const RocketWings = () => <Raw code={WINGS_RAW} />;
