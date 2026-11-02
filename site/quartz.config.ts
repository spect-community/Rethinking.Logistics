import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

// Design Challenge Atlas — Quartz configuration.
// Values come from atlas.config.json via environment variables set by scripts/build-site.mjs.
const config: QuartzConfig = {
  configuration: {
    pageTitle: process.env.SITE_TITLE ?? "Rethinking.Logistics",
    pageTitleSuffix: " · Rethinking.Logistics",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "en-US",
    baseUrl: process.env.SITE_BASE_URL ?? "logistics.spect.cz",
    ignorePatterns: ["private", "Templates", ".obsidian", ".trash", "portfolios"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      // Rethinking.Logistics identity: Poppins (SemiBold 600 / ExtraBold 800)
      typography: {
        title: { name: "Poppins", weights: [800] },
        header: { name: "Poppins", weights: [600, 800] },
        body: { name: "Poppins", weights: [400, 600], includeItalic: true },
        code: "IBM Plex Mono",
      },
      // Project gradient: orange #C57E38 → purple #493A8B
      colors: {
        lightMode: {
          light: "#faf7f2", // page background (warm off-white)
          lightgray: "#e8e2d8", // borders, table lines
          gray: "#a9a1b3", // muted text, graph links
          darkgray: "#3f3a4a", // body text
          dark: "#231e33", // headings
          secondary: "#493a8b", // links, page title (purple)
          tertiary: "#c57e38", // hover, active graph node (orange)
          highlight: "rgba(73, 58, 139, 0.08)",
          textHighlight: "rgba(197, 126, 56, 0.35)",
        },
        darkMode: {
          light: "#1a1726", // deep purple-black background
          lightgray: "#353048",
          gray: "#6f6882",
          darkgray: "#d9d4e6",
          dark: "#f3eff9",
          secondary: "#a99be0", // lighter purple for contrast on dark
          tertiary: "#e0a060", // lighter orange
          highlight: "rgba(169, 155, 224, 0.12)",
          textHighlight: "rgba(224, 160, 96, 0.35)",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({ priority: ["frontmatter", "filesystem"] }),
      Plugin.SyntaxHighlighting({
        theme: { light: "github-light", dark: "github-dark" },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({ enableSiteMap: true, enableRSS: false }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
