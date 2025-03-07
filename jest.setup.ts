import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Polyfill para TextEncoder y TextDecoder
Object.assign(global, { TextEncoder, TextDecoder });

// global.Response = global.Response || require("node-fetch").Response;
