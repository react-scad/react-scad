import { createRoot, LinearExtrude, Text } from "@react-scad/core";
import { useEffect, useState } from "react";

const App = () => {
	const [data, setData] = useState<Record<string, unknown> | null>(null);

	useEffect(() => {
		fetch("https://jsonplaceholder.typicode.com/posts/1")
			.then((r) => r.json())
			.then((d: Record<string, unknown>) => setData(d))
			.catch(() => setData({ error: "Fetch failed" }));
	}, []);

	return (
		<LinearExtrude height={2}>
			<Text text={data != null ? JSON.stringify(data, null, 2) : "Loading..."} size={3} />
		</LinearExtrude>
	);
};

const root = createRoot("async/model.scad");

root.render(<App />);
