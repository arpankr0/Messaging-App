import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";
import 'dotenv/config';

const mode = process.env.ARCJET_ENV === "development" ? "DRY_RUN" : "LIVE";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode }),
    detectBot({
      mode,
      allow: [
        "CATEGORY:SEARCH_ENGINE",
      ],
    }),
    slidingWindow({
      mode,
      max: 100,
      interval: 60,
    }),
  ],
});

export default aj