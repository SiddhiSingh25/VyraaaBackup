import {
  Outlet,
  NavLink,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Bolt,
  Bell,
  Moon,
  LogOut,
  ChevronDown,
  ChevronRight,
  Pin,
  PinOff,
  Menu,
  X,
  Plus,
  Search,
} from "lucide-react";
import {
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaLayerGroup,
} from "react-icons/fa";
import { FaProductHunt, FaTags, FaNetworkWired } from "react-icons/fa6";
import useGetQuery from "../../hooks/getQuery.hook.ts";
import { apiUrls } from "../../apis/index.ts";

type CategoryItem = {
  _id: string;
  category: string;
};

type NavSubItem = {
  id: string;
  label: string;
  path: string;
};

const createSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

const convertToNavLinks = (data: CategoryItem[]): NavSubItem[] => {
  return data.map((item) => {
    const slug = createSlug(item.category);

    return {
      id: item._id,
      label: item.category,
      path: `/admin/product/${slug}/${item._id}`,
    };
  });
};

export default function AdminLayout() {
  const { categorySlug } = useParams();
  const { getQuery } = useGetQuery();
  const navigate = useNavigate();
  const location = useLocation();

  const [productItems, setProductItems] = useState<CategoryItem[]>([]);
  const [headerName, setHeaderName] = useState("Dashboard");
  const [openMenu, setOpenMenu] = useState<string | null>("");
  const [isHovered, setIsHovered] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const isAsideExpanded = isLocked || isHovered;

  const productNavItems = useMemo(
    () => convertToNavLinks(productItems),
    [productItems],
  );

  const masterChannelNavItems: NavSubItem[] = [
    {
      id: "category",
      label: "Category",
      path: "/admin/master-channel/category",
    },
    {
      id: "subcategory",
      label: "Subcategory",
      path: "/admin/master-channel/subcategory",
    },
    {
      id: "subcategory-type",
      label: "Subcategory Type",
      path: "/admin/master-channel/subcategory-type",
    },
    {
      id: "brand",
      label: "Brand",
      path: "/admin/master-channel/brand",
    },
    {
      id: "color-family",
      label: "Color Family",
      path: "/admin/master-channel/color-family",
    },
    {
      id: "color",
      label: "Color",
      path: "/admin/master-channel/color",
    },
    {
      id: "property-type",
      label: "Property Type",
      path: "/admin/master-channel/property-type",
    },
    {
      id: "property-value",
      label: "Property Value",
      path: "/admin/master-channel/property-values",
    },
    {
      id: "size-type",
      label: "Size Type",
      path: "/admin/master-channel/size-type",
    },

    {
      id: "size-value",
      label: "Size Value",
      path: "/admin/master-channel/size-values",
    },
  ];

  const navItems = useMemo(
    () => [
      // {
      //   icon: LayoutDashboard,
      //   label: "Dashboard",
      //   path: "/admin/dashboard",
      // },
      {
        icon: FaNetworkWired,
        label: "Master Channel",
        path: "/admin/master-channel",
        items: masterChannelNavItems, // <-- static list, defined below
      },
      // {
      //   icon: FaProductHunt,
      //   label: "Product",
      //   path: "/admin/product",
      //   items: productNavItems,
      // },
      // {
      //   icon: FaTags,
      //   label: "Coupons",
      //   path: "/admin/coupons",
      // },
      {
        icon: FaBoxOpen,
        label: "All Products",
        path: "/admin/products",
      },
      {
        icon: FaShoppingCart,
        label: "All Orders",
        path: "/admin/orders",
      },
      {
        icon: FaUsers,
        label: "Add Videos",
        path: "/admin/Add-Home-Videos",
      },
    ],
    [productNavItems],
  );

  useEffect(() => {
    if (location.pathname.startsWith("/admin/product")) {
      setOpenMenu("Product");
    } else if (location.pathname.startsWith("/admin/master-channel")) {
      setOpenMenu("Master Channel");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (categorySlug) {
      const name = categorySlug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      setHeaderName(name);
      return;
    }

    const activeItem = navItems.find(
      (item) =>
        item.path === location.pathname ||
        location.pathname.startsWith(`${item.path}/`),
    );

    setHeaderName(activeItem?.label || "Dashboard");
  }, [categorySlug, location.pathname, navItems]);

  useEffect(() => {
    getQuery({
      url: apiUrls.Category.getAll,
      onSuccess: (res: any) => {
        if (res.success) {
          setProductItems(res.data || []);
        }
      },
      onFail: (err: any) => {
        console.log(err);
      },
    });
  }, []);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.startsWith("/admin/product")) {
      setOpenMenu("Product");
    }
  }, [location.pathname]);

  const toggleMenu = (label: string) => {
    setOpenMenu((prev) => (prev === label ? null : label));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; max-age=0; path=/";
    // Dynamically import store and logout to prevent circular dependency
    import("../../redux/store.ts").then(({ store }) => {
      import("../../redux/slices/authSlice.ts").then(({ logout }) => {
        store.dispatch(logout());
      });
    });

    // navigate("/");
  };

  const handleNavigation = (sub: NavSubItem) => {
    navigate(sub.path, {
      state: { categoryData: sub },
    });
  };

  return (
    <div className="relative flex min-h-screen bg-background  font-admin-text">
      {isMobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => !isLocked && setIsHovered(false)}
        className={`
          fixed inset-y-0 left-0 z-50 flex h-screen flex-col overflow-hidden
          border-r border-border/70 bg-surface/85 shadow-2xl shadow-black/10
          backdrop-blur-2xl transition-all duration-300 ease-in-out
          lg:sticky lg:top-0 lg:z-30 lg:translate-x-0
          ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isAsideExpanded ? "lg:w-67.5" : "lg:w-19"}
          w-72.5 max-w-[86vw]
        `}
      >
        <div className="border-b border-border/70 px-4 py-4">
          <div
            className={`flex items-center gap-3 ${isAsideExpanded ? "justify-between" : "justify-center"}`}
          >
            <button
              type="button"
              // onClick={() => navigate("/admin/dashboard")}
              className={`
                flex w-full min-w-0 items-center rounded-xl transition-all duration-200
                ${isAsideExpanded ? "justify-start gap-3" : "justify-center"}
              `}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
                <Bolt size={21} className="text-white" />
              </span>

              <span
                className={`
                  min-w-0 transition-all duration-200
                  ${isAsideExpanded ? "lg:block" : "lg:hidden"} block
                `}
              >
                <span className="block truncate text-lg font-bold tracking-wide ">
                  Admin
                </span>
                <span className="block truncate text-[11px] font-medium text-muted">
                  Control panel
                </span>
              </span>
            </button>

            <div
              className={`flex items-center gap-2 ${isAsideExpanded || isMobileSidebarOpen ? "flex" : "hidden"}`}
            >
              <button
                type="button"
                onClick={() => setIsLocked((prev) => !prev)}
                className={`
                  hidden h-9 w-9 items-center justify-center rounded-xl border
                  border-border/70 bg-background/70 text-muted transition-all
                  duration-200 hover:bg-card hover:text-primary lg:flex
                  ${isAsideExpanded ? "opacity-100" : "pointer-events-none opacity-0"}
                `}
                title={isLocked ? "Unlock sidebar" : "Lock sidebar"}
              >
                {isLocked ? <Pin size={16} /> : <PinOff size={16} />}
              </button>

              <button
                type="button"
                aria-label="Close sidebar"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-background/70 text-muted transition-all duration-200 hover:bg-card hover:text-primary lg:hidden"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="px-3 py-3">
          <button
            type="button"
            onClick={() => navigate("/admin/quick-add")}
            className={`
              group flex w-full items-center rounded-2xl bg-linear-to-r
              from-primary via-primary/90 to-primary/75 px-3 py-2.5 text-xs
              font-semibold uppercase tracking-[0.18em] text-white shadow-lg
              shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5
              hover:shadow-primary/30
              ${isAsideExpanded ? "lg:justify-start lg:gap-3" : "lg:justify-center"}
            `}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:rotate-90">
              <Plus size={16} />
            </span>

            <span className={`${isAsideExpanded ? "lg:block" : "lg:hidden"} block`}>
              Add Product
            </span>
          </button>
        </div>

        <nav className="flex-1 min-h-0 px-3 pb-3">
          <div className="h-full overflow-y-auto pr-1 scrollbar-none">
            <div className="space-y-1">
              {navItems.map((item: any) => {
                const Icon = item.icon;
                const hasDropdown = Boolean(item.items);
                const isOpen = openMenu === item.label;
                const isParentActive = location.pathname.startsWith(item.path);

                if (hasDropdown) {
                  return (
                    <div key={item.label} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => toggleMenu(item.label)}
                        title={item.label}
                        className={`
                          group flex w-full items-center rounded-2xl px-3 py-2.5
                          text-sm transition-all duration-200
                          ${isAsideExpanded ? "lg:justify-between" : "lg:justify-center"}
                          ${
                            isParentActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted hover:bg-card hover:"
                          }
                        `}
                      >
                        <span
                          className={`
                            flex min-w-0 items-center
                            ${isAsideExpanded ? "lg:gap-3" : "lg:justify-center"}
                          `}
                        >
                          <span
                            className={`
                              flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                              transition-all duration-200
                              ${
                                isParentActive
                                  ? "bg-primary text-white shadow-md shadow-primary/20"
                                  : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                              }
                            `}
                          >
                            <Icon size={17} />
                          </span>

                          <span
                            className={`
                              truncate font-medium
                              ${isAsideExpanded ? "lg:block" : "lg:hidden"} block
                            `}
                          >
                            {item.label}
                          </span>
                        </span>

                        <span
                          className={`
                            ${isAsideExpanded ? "lg:flex" : "lg:hidden"} flex
                            items-center text-muted transition-transform duration-200
                          `}
                        >
                          {isOpen ? (
                            <ChevronDown size={17} className="text-primary" />
                          ) : (
                            <ChevronRight size={17} />
                          )}
                        </span>
                      </button>

                      {isOpen && (
                        <div
                          className={`
                            overflow-hidden transition-all duration-300
                            ${isAsideExpanded ? "lg:block" : "lg:hidden"}
                          `}
                        >
                          <div className="ml-5 rounded-2xl border border-border/60 bg-background/45 p-2 backdrop-blur-xl">
                            <div className="relative space-y-1 border-l border-primary/20 pl-3">
                              {item.items.length === 0 ? (
                                <p className="px-3 py-2 text-xs text-muted">
                                  No categories found
                                </p>
                              ) : (
                                item.items.map((sub: NavSubItem) => {
                                  const isSubActive =
                                    location.pathname === sub.path;

                                  return (
                                    <button
                                      type="button"
                                      key={sub.path}
                                      onClick={() => handleNavigation(sub)}
                                      className={`
                                        group relative flex w-full items-center gap-2 rounded-xl
                                        px-3 py-2 text-left text-xs transition-all duration-200
                                        ${
                                          isSubActive
                                            ? "bg-primary text-white shadow-sm shadow-primary/20"
                                            : "text-muted hover:bg-card hover:"
                                        }
                                      `}
                                    >
                                      <span
                                        className={`
                                          absolute -left-4.25 h-2.5 w-2.5 rounded-full border-2
                                          ${
                                            isSubActive
                                              ? "border-primary bg-white"
                                              : "border-primary/40 bg-background"
                                          }
                                        `}
                                      />

                                      <span className="min-w-0 flex-1 truncate font-medium">
                                        {sub.label}
                                      </span>

                                      <ChevronRight
                                        size={13}
                                        className={`
                                          shrink-0 transition-transform duration-200
                                          group-hover:translate-x-0.5
                                          ${isSubActive ? "text-white" : "text-primary/70"}
                                        `}
                                      />
                                    </button>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    title={item.label}
                    className={({ isActive }) =>
                      `
                        group flex items-center rounded-2xl px-3 py-2.5 text-sm
                        transition-all duration-200
                        ${isAsideExpanded ? "lg:gap-3" : "lg:justify-center"}
                        ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted hover:bg-card hover:"
                        }
                      `
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`
                            flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                            transition-all duration-200
                            ${
                              isActive
                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                            }
                          `}
                        >
                          <Icon size={17} />
                        </span>

                        <span
                          className={`
                            truncate font-medium
                            ${isAsideExpanded ? "lg:block" : "lg:hidden"} block
                          `}
                        >
                          {item.label}
                        </span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="border-t border-border/70 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className={`
              flex w-full items-center rounded-2xl px-3 py-2.5 text-sm
              font-medium text-primary transition-all duration-200 hover:bg-primary/10
              ${isAsideExpanded ? "lg:gap-3" : "lg:justify-center"}
            `}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <LogOut size={17} />
            </span>

            <span className={`${isAsideExpanded ? "lg:block" : "lg:hidden"} block`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="
            sticky top-0 z-20 border-b border-border/60
            bg-background/55 px-4 py-3 backdrop-blur-2xl
            supports-[backdrop-filter]:bg-background/45
            sm:px-5 lg:hidden
          "
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                aria-label="Open sidebar"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-surface/70 text-muted shadow-sm backdrop-blur-xl transition-all duration-200 hover:bg-card hover:text-primary"
              >
                <Menu size={20} />
              </button>

              <div className="min-w-0">
                <p className="truncate text-base font-bold sm:text-lg">
                  {headerName}
                </p>
                <p className="hidden text-xs text-muted sm:block">
                  Manage your store data, products, and settings
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Logout"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-200 hover:bg-primary hover:text-white"
              >
                <LogOut size={17} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-background ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
