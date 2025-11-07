// src/index.js
import FormRAG from "./components/FormRAG.jsx";  // ← CRITICAL
import { constructPrompt } from "./lib/promptEngine.js";

// Templates
import { UniversalSMBTemplate } from "./templates/universal-smb.js";
import { LandscaperTemplate } from "./templates/landscaper.js";
import { CleaningTemplate } from "./templates/cleaning.js";
import { HandymanTemplate } from "./templates/handyman.js";
import { AutomotiveTemplate } from "./templates/automotive.js";
import { AuthorTemplate } from "./templates/author.js";
import { ArtistTemplate } from "./templates/artist.js";
import { RealEstateTemplate } from "./templates/realestate.js";

// EXPORT EVERYTHING
export {
  FormRAG,                    // ← NOW EXPORTED
  constructPrompt,
  UniversalSMBTemplate,
  LandscaperTemplate,
  CleaningTemplate,
  HandymanTemplate,
  AutomotiveTemplate,
  AuthorTemplate,
  ArtistTemplate,
  RealEstateTemplate,
};