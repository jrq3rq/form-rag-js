// src/index.js
import FormRAG from "./components/FormRAG.jsx";
import { constructPrompt } from "./lib/promptEngine.js";

// Core Universal Template
import { UniversalSMBTemplate } from "./templates/universal-smb.js";

// Business-Specific Templates (PNW SMBs)
import { LandscaperTemplate } from "./templates/landscaper.js";
import { CleaningTemplate } from "./templates/cleaning.js";
import { HandymanTemplate } from "./templates/handyman.js";
import { AutomotiveTemplate } from "./templates/automotive.js";
import { AuthorTemplate } from "./templates/author.js";
import { ArtistTemplate } from "./templates/artist.js";
import { RealEstateTemplate } from "./templates/realestate.js";

// Export Everything
export {
  FormRAG,
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