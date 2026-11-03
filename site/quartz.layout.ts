import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

const contact = process.env.SITE_CONTACT_URL ?? "mailto:info@spect.cz"
const project = process.env.SITE_PROJECT_URL ?? "https://spect.cz/projects/rethinking-logistics/"

// Order of top-level folders in the left-hand explorer (follows the ontology chain).
const explorer = Component.Explorer({
  title: "Browse",
  folderDefaultState: "collapsed",
  sortFn: (a, b) => {
    const order = ["about", "overviews", "strategies", "ambitions", "challenges", "metrics", "tools", "case studies", "reference projects", "insights", "sources"]
    const ia = order.indexOf(a.displayName.toLowerCase())
    const ib = order.indexOf(b.displayName.toLowerCase())
    if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
    if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1
    return a.displayName.localeCompare(b.displayName, undefined, { numeric: true, sensitivity: "base" })
  },
})

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      "SPECT Community": project,
      "Contact": contact,
      "Funded by Rambøll Fonden (Ramboll Foundation)": "https://www.rambollfonden.com/",
    },
  }),
}

export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta({ showReadingTime: false }),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [{ Component: Component.Search(), grow: true }, { Component: Component.Darkmode() }],
    }),
    explorer,
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta({ showReadingTime: false })],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [{ Component: Component.Search(), grow: true }, { Component: Component.Darkmode() }],
    }),
    explorer,
  ],
  right: [],
}
