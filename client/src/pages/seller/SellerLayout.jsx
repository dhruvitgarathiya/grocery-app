import { assets } from "../../assets/assets";
import { useAppcontext } from "../../context/AppContext";
import { Link, NavLink, Outlet } from "react-router-dom";

const SellerLayout = () => {
  const { sellerLogout } = useAppcontext();

  const sidebarLinks = [
    { name: "Add Product", path: "/seller", icon: assets.add_icon },
    {
      name: "Product List",
      path: "/seller/product-list",
      icon: assets.product_list_icon,
    },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
  ];

  const handleLogout = async () => {
    try {
      await sellerLogout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-700 py-3 bg-gray-900 shadow-sm">
        <Link to="/">
          <img
            src={assets.logo}
            alt="logo"
            className="cursor-pointer w-34 md:w-38"
          />
        </Link>
        <div className="flex items-center gap-5 text-gray-300">
          <p>Hi! Admin</p>
          <button
            onClick={handleLogout}
            className="border border-gray-600 rounded-full text-sm px-4 py-1 hover:bg-gray-800 transition-colors text-white"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 border-r border-gray-700 shadow-sm">
          <nav className="p-4 space-y-1">
            {sidebarLinks.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/seller"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#00FF41]/10 text-[#00FF41] font-medium"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                <img src={item.icon} alt="" className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-black">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SellerLayout;
