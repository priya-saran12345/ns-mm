import React from "react";
import { Result, Button } from "antd";
import { Link, useLocation } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <div style={{ padding: 24 }}>
      <Result
        status="404"
        title="404 – Page not found"
        subTitle={
          <>
            The path <code>{pathname}</code> doesn’t exist or may have moved.
          </>
        }
        extra={
          <Button type="primary">
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        }
      />
    </div>
  );
};

export default NotFoundPage;
