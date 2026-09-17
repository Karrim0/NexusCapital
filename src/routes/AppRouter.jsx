import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import LocaleLayout from "../layouts/LocaleLayout";
import AdminLayout from "../layouts/AdminLayout";
import { SUPPORTED_LANGUAGES } from "../i18n";
import HomeView from "../views/HomeView";
import AboutView from "../views/AboutView";
import BuyView from "../views/BuyView";
import RentView from "../views/RentView";
import LandsView from "../views/LandsView";
import ContactView from "../views/ContactView";
import LoginView from "../views/LoginView";
import RegisterView from "../views/RegisterView";
import AllPropertiesView from "../views/AllPropertiesView";
import PropertyDetailsView from "../views/PropertyDetailsView";
import DashboardView from "../views/DashboardView";
import ProjectsView from "../views/ProjectsView";
import ServicesView from "../views/ServicesView";
import LegalServicesView from "../views/LegalServicesView";
import RentalServicesView from "../views/RentalServicesView";
import FurnitureView from "../views/FurnitureView";
import TeamView from "../views/TeamView";
import FaqView from "../views/FaqView";
import ProjectDetailsView from "../views/ProjectDetailsView";
import BlogListView from "../views/BlogListView";
import BlogPostDetailView from "../views/BlogPostDetailView";
import AddPropertyView from "../views/dashboard/properties/AddPropertyView";
import PropertiesListView from "../views/dashboard/properties/PropertiesListView";
import FavoritesView from "../views/dashboard/properties/FavoritesView";
import DeletedPropertiesView from "../views/dashboard/properties/DeletedPropertiesView";
import ContactRequestsView from "../views/dashboard/properties/ContactRequestsView";
import EditPropertyView from "../views/dashboard/properties/EditPropertyView";
import ProfileView from "../views/dashboard/users/ProfileView";
import AddUserView from "../views/dashboard/users/AddUserView";
import AllUsersView from "../views/dashboard/users/AllUsersView";
import SalesManagementView from "../views/dashboard/users/SalesManagementView";
import AgentProfileView from "../views/dashboard/agents/AgentProfileView";
import AddAgentView from "../views/dashboard/agents/AddAgentView";
import AllAgentsView from "../views/dashboard/agents/AllAgentsView";
import AdminRequestsView from "../views/dashboard/AdminRequestsView";
import GeneralMessagesView from "../views/dashboard/GeneralMessagesView";
import AddProjectView from "../views/dashboard/projects/AddProjectView";
import ProjectsListView from "../views/dashboard/projects/ProjectsListView";
import EditProjectView from "../views/dashboard/projects/EditProjectView";
import AddBlogPostView from "../views/dashboard/blog/AddBlogPostView";
import BlogPostsListView from "../views/dashboard/blog/BlogPostsListView";
import EditBlogPostView from "../views/dashboard/blog/EditBlogPostView";
import HomeContentSettingsView from "../views/dashboard/HomeContentSettingsView";
import BuyContentSettingsView from "../views/dashboard/BuyContentSettingsView";
import ProjectsContentSettingsView from "../views/dashboard/ProjectsContentSettingsView";
import ServicesContentSettingsView from "../views/dashboard/ServicesContentSettingsView";
import LegalServicesContentSettingsView from "../views/dashboard/LegalServicesContentSettingsView";
import RentalServicesContentSettingsView from "../views/dashboard/RentalServicesContentSettingsView";
import FurnitureContentSettingsView from "../views/dashboard/FurnitureContentSettingsView";
import TeamMembersSettingsView from "../views/dashboard/TeamMembersSettingsView";
import ChatbotLeadsView from "../views/dashboard/ChatbotLeadsView";
import FaqContentSettingsView from "../views/dashboard/FaqContentSettingsView";
import AboutContentSettingsView from "../views/dashboard/AboutContentSettingsView";
import ContactContentSettingsView from "../views/dashboard/ContactContentSettingsView";
import RentContentSettingsView from "../views/dashboard/RentContentSettingsView";
import LandsContentSettingsView from "../views/dashboard/LandsContentSettingsView";
import NotFoundView from "../views/NotFoundView";

const publicChildren = [
  {
    index: true,
    element: <HomeView />,
  },
  {
    path: "about",
    element: <AboutView />,
  },
  {
    path: "buy",
    element: <BuyView />,
  },
  {
    path: "rent",
    element: <RentView />,
  },
  {
    path: "lands-buildings",
    element: <LandsView />,
  },
  {
    path: "contact",
    element: <ContactView />,
  },
  {
    path: "login",
    element: <LoginView />,
  },
  {
    path: "register",
    element: <RegisterView />,
  },
  {
    path: "properties",
    element: <AllPropertiesView />,
  },
  {
    path: "properties/:id",
    element: <PropertyDetailsView />,
  },
  {
    path: "projects",
    element: <ProjectsView />,
  },
  {
    path: "projects/:id",
    element: <ProjectDetailsView />,
  },
  {
    path: "blog",
    element: <BlogListView />,
  },
  {
    path: "blog/:slug",
    element: <BlogPostDetailView />,
  },
  {
    path: "services",
    element: <ServicesView />,
  },
  {
    path: "legal-services",
    element: <LegalServicesView />,
  },
  {
    path: "rental-services",
    element: <RentalServicesView />,
  },
  {
    path: "furniture-furnishing",
    element: <FurnitureView />,
  },
  {
    path: "about/team",
    element: <TeamView />,
  },
  {
    path: "faq",
    element: <FaqView />,
  },
];

const router = createBrowserRouter(
  [
    {
      // English (default, unprefixed): /, /about, /projects/:id ...
      path: "/",
      element: <LocaleLayout />,
      children: [
        {
          element: <RootLayout />,
          children: publicChildren,
        },
      ],
    },
    // Every other language gets its own explicit, literal top-level path
    // (/de, /fr, /ar ...) rather than a generic /:lang wildcard, so that a
    // genuinely unknown single-segment URL (e.g. /whatever) still falls
    // through correctly to the 404 route below instead of being mistaken
    // for a language code.
    ...SUPPORTED_LANGUAGES.map((code) => ({
      path: `/${code}`,
      element: <LocaleLayout lang={code} />,
      children: [
        {
          element: <RootLayout />,
          children: publicChildren,
        },
      ],
    })),
    {
      path: "/dashboard",
      element: <AdminLayout />,
      children: [
        {
          index: true,
          element: <DashboardView />,
        },
        {
          path: "properties/add",
          element: <AddPropertyView />,
        },
        {
          path: "properties/list",
          element: <PropertiesListView />,
        },
        {
          path: "properties/:id/edit",
          element: <EditPropertyView />,
        },
        {
          path: "properties/favorites",
          element: <FavoritesView />,
        },
        {
          path: "properties/deleted",
          element: <DeletedPropertiesView />,
        },
        {
          path: "properties/requests",
          element: <ContactRequestsView />,
        },
        {
          path: "users/profile",
          element: <ProfileView />,
        },
        {
          path: "users/add",
          element: <AddUserView />,
        },
        {
          path: "users/all",
          element: <AllUsersView />,
        },
        {
          path: "users/sales",
          element: <SalesManagementView />,
        },
        {
          path: "agents/profile",
          element: <AgentProfileView />,
        },
        {
          path: "agents/add",
          element: <AddAgentView />,
        },
        {
          path: "agents/all",
          element: <AllAgentsView />,
        },
        {
          path: "requests/agents",
          element: <AdminRequestsView />,
        },
        {
          path: "requests/messages",
          element: <GeneralMessagesView />,
        },
        {
          path: "projects/add",
          element: <AddProjectView />,
        },
        {
          path: "projects/list",
          element: <ProjectsListView />,
        },
        {
          path: "projects/:id/edit",
          element: <EditProjectView />,
        },
        {
          path: "blog/add",
          element: <AddBlogPostView />,
        },
        {
          path: "blog/list",
          element: <BlogPostsListView />,
        },
        {
          path: "blog/:id/edit",
          element: <EditBlogPostView />,
        },
        {
          path: "home-content",
          element: <HomeContentSettingsView />,
        },
        {
          path: "buy-content",
          element: <BuyContentSettingsView />,
        },
        {
          path: "projects-content",
          element: <ProjectsContentSettingsView />,
        },
        {
          path: "services-content",
          element: <ServicesContentSettingsView />,
        },
        {
          path: "legal-services-content",
          element: <LegalServicesContentSettingsView />,
        },
        {
          path: "rental-services-content",
          element: <RentalServicesContentSettingsView />,
        },
        {
          path: "furniture-content",
          element: <FurnitureContentSettingsView />,
        },
        {
          path: "team-members",
          element: <TeamMembersSettingsView />,
        },
        {
          path: "chatbot-leads",
          element: <ChatbotLeadsView />,
        },
        {
          path: "faq-content",
          element: <FaqContentSettingsView />,
        },
        {
          path: "about-content",
          element: <AboutContentSettingsView />,
        },
        {
          path: "contact-content",
          element: <ContactContentSettingsView />,
        },
        {
          path: "rent-content",
          element: <RentContentSettingsView />,
        },
        {
          path: "lands-content",
          element: <LandsContentSettingsView />,
        },
        {
          path: "*",
          element: <NotFoundView />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFoundView />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
