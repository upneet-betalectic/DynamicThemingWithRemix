export type Theme = {
  background: string;
  links: string;
  ["links-hover"]: string;
  border: string;
};

export let darkTheme: Theme = {
  background: "gray",
  border: "#404040",
  links: "#75b3ff",
  "links-hover": "#99c7ff",
};

export let defaultTheme: Theme = {
  background: "white",
  border: "#d1d1d1",
  links: "#0a78ff",
  "links-hover": "#0063db",
};
