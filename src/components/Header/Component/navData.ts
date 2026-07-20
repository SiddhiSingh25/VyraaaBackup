export interface NavChild {
  state?: any;
  label: string;
  to: string;
}

export interface NavColumn {
  title: string;
  links: NavChild[];
}

export interface NavLink {
  id?: string;
  state?: any;
  label: string;
  to: string;
  columns?: NavColumn[];
}

