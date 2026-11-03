// Footer of the Rethinking.Logistics site. Like Quartz's Footer, but each item can have plain text
// before its link (e.g. "developed by SPECT Community"). Copied into Quartz by scripts/build-site.mjs.
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
import { version } from "../../package.json"
import { i18n } from "../i18n"

export interface FooterItem {
  /** Plain text shown before the link. */
  before?: string
  text: string
  href: string
}

export default ((opts: { items: FooterItem[] }) => {
  const SiteFooter: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    return (
      <footer class={`${displayClass ?? ""}`}>
        <p>
          {i18n(cfg.locale).components.footer.createdWith}{" "}
          <a href="https://quartz.jzhao.xyz/">Quartz v{version}</a> © {year}
        </p>
        <ul>
          {opts.items.map(({ before, text, href }) => (
            <li>
              {before ? `${before} ` : ""}
              <a href={href}>{text}</a>
            </li>
          ))}
        </ul>
      </footer>
    )
  }

  SiteFooter.css = style
  return SiteFooter
}) satisfies QuartzComponentConstructor
