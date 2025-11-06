// src/index.js
import FormRAG from "./components/FormRAG.jsx";
import { constructPrompt } from "./lib/promptEngine.js";
import { UniversalSMBTemplate } from "../templates/universal-smb.js";

export { FormRAG, constructPrompt, UniversalSMBTemplate };