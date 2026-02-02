import { useAuth } from '../auth/AuthContext';
import { ROLES } from '../auth/roles';

const RoleGuard = ({ allowedRoles, children }) => {
    const { user } = useAuth();
    const role = user?.role || ROLES.GUEST;

    if (allowedRoles.includes(role)) {
        return children;
    }

    return null;
};

export default RoleGuard;
