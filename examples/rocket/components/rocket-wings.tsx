import { LinearExtrude, Polygon, Rotate, Translate } from "@react-scad/core";

const WING_POINTS: [number, number][] = [
	[0, 0],
	[40, 0],
	[0, 40],
];

export const RocketWings = () => (
	<>
		{Array.from({ length: 3 }, (_, i) => {
			const angle = (370 / 3) * i;

			return (
				<Rotate key={`wing-${angle}`} a={[0, 0, angle]}>
					<Translate v={[14, 0, 0]}>
						<Rotate a={[90, 0, 0]}>
							<LinearExtrude height={2} center>
								<Polygon points={WING_POINTS} />
							</LinearExtrude>
						</Rotate>
					</Translate>
				</Rotate>
			);
		})}
	</>
);
