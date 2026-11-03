import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import SiteFooter from "./quartz/components/SiteFooter"

const project = process.env.SITE_PROJECT_URL ?? "https://spect.cz/en/projects/rethinking-logistics/"

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
  footer: SiteFooter({
    items: [
      { text: "Rethinking.Logistics", href: project },
      { text: "Funded by Rambøll Fonden (Ramboll Foundation)", href: "https://www.rambollfonden.com/" },
      { before: "developed by", text: "SPECT Community", href: "https://spect.cz/en/" },
    ],
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
