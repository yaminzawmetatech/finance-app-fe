import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";

export default function ModuleDashboard({
  highlights = [],
  shortcuts = [],
}) {
  return (
    <Box className="module-dashboard">
      {highlights.length > 0 && (
        <section className="dashboard-highlights" aria-label="Overview">
          {highlights.map(({ label, value, note, icon: Icon }) => (
            <article className="dashboard-highlight" key={label}>
              <div className="dashboard-highlight-top">
                <span className="dashboard-icon">
                  <Icon size={19} strokeWidth={1.8} />
                </span>
                <span className="dashboard-highlight-note">{note}</span>
              </div>
              <Typography className="dashboard-highlight-value">
                {value}
              </Typography>
              <Typography className="dashboard-highlight-label">
                {label}
              </Typography>
            </article>
          ))}
        </section>
      )}

      <section className="dashboard-shortcuts">
        {shortcuts.map(({ title: shortcutTitle, description: shortcutDescription, href, icon: Icon }) => {
          const content = (
            <>
              <span className="dashboard-shortcut-icon">
                <Icon size={21} strokeWidth={1.8} />
              </span>
              <span className="dashboard-shortcut-copy">
                <Typography component="h3">{shortcutTitle}</Typography>
                <Typography>{shortcutDescription}</Typography>
              </span>
              {href && (
                <ArrowUpRight className="dashboard-shortcut-arrow" size={19} />
              )}
            </>
          );

          return href ? (
            <Link className="dashboard-shortcut" key={shortcutTitle} to={href}>
              {content}
            </Link>
          ) : (
            <article className="dashboard-shortcut" key={shortcutTitle}>
              {content}
            </article>
          );
        })}
      </section>
    </Box>
  );
}
