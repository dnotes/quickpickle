import { setWorldConstructor } from "quickpickle";
import { BrowserWorld } from "./BrowserWorld";


setWorldConstructor(VitestBrowserWorld);

export { VitestBrowserWorld };
