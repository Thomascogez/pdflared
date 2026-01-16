import "../tailwind.css";

import BuildedTemplate from "virtual:pdflared-builded-template";
import { createRoot } from "react-dom/client";

// biome-ignore lint/style/noNonNullAssertion: Will always be defined
const root = createRoot(document.getElementById("root")!);
root.render(<BuildedTemplate />);
