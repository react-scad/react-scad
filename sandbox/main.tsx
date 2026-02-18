import { Translate, createRoot } from "@react-scad/core";
import { RocketBody } from "./components/rocket-body";
import { RocketHead } from "./components/rocket-head";
import { RocketWings } from "./components/rocket-wings";

const root = createRoot("model.scad");

const App = () => (
  <>
    <Translate v={[0, 0, "$t * 360"]}>
      <RocketHead />
      <RocketBody />
      <RocketWings />
    </Translate>
  </>
);

root.render(<App />);
