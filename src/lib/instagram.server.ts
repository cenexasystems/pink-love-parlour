import { createServerFn } from "@tanstack/react-start";
import type { IgPost } from "./instagram.types";

// Instagram Graph API — server-side only, token never reaches the browser.
//
// Required env var (set in .env or your deployment dashboard):
//   VITE_IG_ACCESS_TOKEN=<long-lived user access token>
//
// Scopes needed: instagram_basic, pages_show_list
//
// Get a long-lived token via:
//   https://developers.facebook.com/tools/explorer/
// Exchange for a long-lived one (60-day) with:
//   GET https://graph.facebook.com/v20.0/oauth/access_token
//     ?grant_type=fb_exchange_token
//     &client_id=APP_ID
//     &client_secret=APP_SECRET
//     &fb_exchange_token=SHORT_LIVED_TOKEN

const IG_FIELDS =
  "id,media_type,media_url,thumbnail_url,permalink,caption,timestamp";
const IG_LIMIT = 6;

export const fetchInstagramPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ data: IgPost[]; error?: string }> => {
    const token = process.env.VITE_IG_ACCESS_TOKEN;

    if (!token) {
      return { data: [], error: "VITE_IG_ACCESS_TOKEN is not configured." };
    }

    try {
      // Step 1 — resolve IG Business Account ID tied to the token.
      const meRes = await fetch(
        `https://graph.facebook.com/v20.0/me/accounts?fields=instagram_business_account&access_token=${token}`,
      );
      const meJson = (await meRes.json()) as {
        data?: { instagram_business_account?: { id: string } }[];
        error?: { message: string };
      };

      if (!meRes.ok || meJson.error) {
        return {
          data: [],
          error: meJson.error?.message ?? "Failed to fetch IG account.",
        };
      }

      const igId = meJson.data?.[0]?.instagram_business_account?.id;

      // Step 2a — fallback: direct Creator token flow (no Business Account).
      if (!igId) {
        const directRes = await fetch(
          `https://graph.instagram.com/me/media?fields=${IG_FIELDS}&limit=${IG_LIMIT}&access_token=${token}`,
        );
        const directJson = (await directRes.json()) as {
          data?: IgPost[];
          error?: { message: string };
        };

        if (!directRes.ok || directJson.error) {
          return {
            data: [],
            error:
              directJson.error?.message ?? "Failed to fetch IG media directly.",
          };
        }

        return { data: directJson.data ?? [] };
      }

      // Step 2b — fetch media via Business Account ID.
      const mediaRes = await fetch(
        `https://graph.facebook.com/v20.0/${igId}/media?fields=${IG_FIELDS}&limit=${IG_LIMIT}&access_token=${token}`,
      );
      const mediaJson = (await mediaRes.json()) as {
        data?: IgPost[];
        error?: { message: string };
      };

      if (!mediaRes.ok || mediaJson.error) {
        return {
          data: [],
          error: mediaJson.error?.message ?? "Failed to fetch IG media.",
        };
      }

      return { data: mediaJson.data ?? [] };
    } catch (err) {
      console.error("[fetchInstagramPosts]", err);
      return { data: [], error: "Unexpected server error." };
    }
  },
);
