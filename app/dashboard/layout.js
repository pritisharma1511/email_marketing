export default function DisabledDashboardLayout({ children }) {
    // This layout disables the nested sidebar from /dashboard 
    // since the new ClientLayout in root handles the global sidebar.
    return children;
}
