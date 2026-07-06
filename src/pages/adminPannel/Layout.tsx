import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Bolt,
  Bell,
  Moon,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { FaProductHunt, FaTags, FaLayerGroup, FaNetworkWired } from "react-icons/fa6";
import useGetQuery from "../../hooks/getQuery.hook.ts";
import { apiUrls } from "../../apis/index.ts";
import { useParams } from 'react-router-dom';

const convertToNavLinks = (data: any) => {
  return data.map((item: any) => {
    // Create a slug-friendly path (e.g., "Electronics" -> "electronics")
    const slug = item.category.toLowerCase().replace(/\s+/g, '-');

    return {
      id: item._id,
      label: item.category,
      path: `/admin/product/${slug}` // Makes the route dynamic
    };
  });
};

export default function AdminLayout() {
  const { categorySlug } = useParams();
  const { getQuery } = useGetQuery()
  const navigate = useNavigate();
  const location = useLocation()
  const [productItems, setProductItems] = useState<[]>([])
  const [headerName, setHeaderName] = useState("")
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    if (!categorySlug) {
      setHeaderName("Dashboard");
    } else {
      const name = categorySlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setHeaderName(name)
    }

  }, [location])


  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/admin/quick-add",
    },
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      icon: FaNetworkWired,
      label: "Master Chanel",
      path: "/admin/master-channel",
      // items: convertToNavLinks(productItems)
    },
    {
      icon: FaProductHunt,
      label: "Product",
      path: "/admin/product",
      items: convertToNavLinks(productItems)
    },
    {
      icon: FaTags,
      label: "Copons",
      path: "/admin/coupons",
      // items: convertToNavLinks(productItems)
    },
    {
      icon: FaLayerGroup,
      label: "Global Attributes",
      path: "/admin/attributes",
      // items: convertToNavLinks(productItems)
    },
  ];

  useEffect(() => {
    getQuery({
      url: apiUrls.Category.getAll,
      onSuccess: (res: any) => {
        if (res.success) {
          setProductItems(res.data)
        }
      },
      onFail: (err: any) => {
        console.log(err);
      }
    })
  }, [])

  const toggleMenu = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleNavigation = (sub: any) => {
    // 1. Call your custom function logic here if needed
    console.log("Navigating to:", sub.path);

    // 2. Navigate and pass data via 'state'
    navigate(sub.path, {
      state: { categoryData: sub } // This passes your entire object
    });
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="flex w-[260px] flex-col border-r border-border bg-surface overflow-hidden">

        {/* Logo */}
        <div className="border-b border-border px-5 py-6">
          <div
            onClick={() => navigate("/admin/dashboard")}
            className="flex cursor-pointer items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm">
              <Bolt size={20} className="text-white" />
            </div>

            <h2 className="text-lg font-bold tracking-wide text-heading">
              Admin
            </h2>
          </div>
        </div>

        <div className="px-4 mt-3">
          <button className="group mb-2 flex w-full items-center justify-center gap-5 rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5  " onClick={()=>navigation.navigate("admin/quick-add")}>
            <span className="flex h-6 w-6 items-center justify-center item-center rounded-full bg-white/20 text-base transition-transform duration-300 ">
              <span className="material-symbols-outlined">+</span>
            </span>
            <span>Add Product</span>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 min-h-0 px-4 py-2">
          <div className="h-[calc(100vh-220px)] overflow-y-auto pr-1 scrollbar-none">
            {navItems.map((item: any) => {
              const Icon = item.icon;
              const hasDropdown = item.items;
              const isOpen = openMenu === item.label;

              if (hasDropdown) {
                return (
                  <div key={item.label}>
                    <div
                      onClick={() => toggleMenu(item.label)}
                      className="mb-1 flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-[13px] text-muted transition-all duration-200 hover:bg-card hover:text-heading"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <Icon size={16} />
                        </div>
                        <span>{item.label}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isOpen ? (
                          <ChevronDown size={16} className="text-primary" />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </div>
                    </div>

                    {isOpen && (
                      <div className="relative ml-7 mb-2 border-l border-primary/15 pl-4">
                        <span className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-primary/35 via-primary/20 to-transparent" />
                        {item.items.map((sub: any) => (
                          <button
                            key={sub.path}
                            onClick={() => handleNavigation(sub)}
                            className="group mb-1 flex w-full items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-left text-xs text-muted transition-all duration-200 hover:border-primary/10 hover:bg-card hover:text-heading"
                          >
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] text-primary">
                              •
                            </span>
                            <span className="flex-1">{sub.label}</span>
                            <span className="text-[10px] text-primary/60 transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                    `mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-all duration-200  text-muted hover:bg-card bg-card text-primary font-semibold shadow-smhover:text-heading${isActive
                      ? "bg-card text-primary font-semibold shadow-sm"
                      : "text-muted hover:bg-card hover:text-heading"
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>


        {/* Logout */}
        <div className="border-t border-border p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-primary transition-all duration-200 hover:bg-primary-light"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Topbar */}

        <header className="flex h-16 items-center justify-end gap-3 border-b border-border bg-surface px-7">
          <p className=" ">
            {headerName}
          </p>
          {/* Notification */}
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background transition-all duration-200 hover:bg-card">
            <Bell size={16} className="text-muted" />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {/* Theme */}
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background transition-all duration-200 hover:bg-card">
            <Moon size={16} className="text-muted" />
          </button>

          {/* Avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light font-semibold text-primary shadow-sm">
            AD
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}



