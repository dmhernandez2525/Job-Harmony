import { useParams, useNavigate, useLocation } from 'react-router-dom';

// Compatibility hook to replace withRouter HOC
// Provides match, history, and location objects similar to react-router v5
export const useRouter = () => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  return {
    params,
    navigate,
    location,
    // Compatibility shim for history.push
    push: (path) => navigate(path),
    // Compatibility shim for history.replace
    replace: (path) => navigate(path, { replace: true }),
    // Compatibility shim for history.goBack
    goBack: () => navigate(-1),
  };
};

// HOC wrapper for class components that need router props
export const withRouter = (Component) => {
  return function WrappedComponent(props) {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    return (
      <Component
        {...props}
        params={params}
        navigate={navigate}
        location={location}
        match={{ params }}
        history={{
          push: (path) => navigate(path),
          replace: (path) => navigate(path, { replace: true }),
          goBack: () => navigate(-1),
        }}
      />
    );
  };
};
