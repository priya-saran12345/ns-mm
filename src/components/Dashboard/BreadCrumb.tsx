import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="mb-6 ml-2 text-md font-medium flex flex-wrap items-center">
      <Link to="/" className="text-textheading hover:underline">
        Dashboard
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        return (
          <span key={to} className="flex items-center">
            <span className="mx-2 text-textheading">-</span>
            {isLast ? (
              <span className="text-lighttext capitalize">{value.replace(/-/g, " ")}</span>
            ) : (
              <Link
                to={to}
                className="text-lighttext hover:underline capitalize"
              >
                {value.replace(/-/g, " ")}
              </Link>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
