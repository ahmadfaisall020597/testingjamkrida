# React + Vite

![Node.js Version](https://img.shields.io/badge/Node.js-v20%2B-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Development Status](https://img.shields.io/badge/status-active-success)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

---

## Table of Contents

- [React + Vite](#react--vite)
- [How to Work in this Repository](#how-to-work-in-this-repository)
- [Instructions for Running the Application](#instructions-for-running-the-application)
- [Notes](#notes)
- [Template per Page Using This Framework](#template-per-page-using-this-framework)
- [State Management](#state-management)
- [Router](#router)
- [Styling](#styling)
- [Setting Roles per Page](#setting-roles-per-page)
- [Setting Privileges in Page Components Using `usePrivileges()`](#setting-privileges-in-page-components-using-useprivileges)
- [Setting Dummy Role for Easier Development](#setting-dummy-role-for-easier-development)
- [Watermark](#watermark)

---

# How to Work in this Repository

**Node Version**: v20+

## Instructions for Running the Application

To run the application execute the following commands in Git Bash:

- `npm install` (first run)
- `npm run prepare-env-dev && npm run clean-dev`

## Notes

- If you want to run debug from your private IP in Chrome (e.g., `http://192.168.1.10:5173/` or `http://172.27.224.93:5173/`), please follow these steps to avoid Firebase errors:
  1. In the address bar, type: `chrome://flags/#unsafely-treat-insecure-origin-as-secure`
  2. Add your private IP addresses, separated by commas, e.g., `http://192.168.1.10:5173/,http://172.27.224.93:5173/`
  3. Select **Enable**, then click **Relaunch**.
- **Important**: Make sure to read the entire README file to understand the project's structure and setup fully.

## Template per Page Using This Framework

- Must refer from the folder `src > pages > default`.
- Every page must have an `id` for easy usage of custom styles.
- **Note**: It is not mandatory to use the `default` folder. You can also refer to examples from other pages, such as `master page product promo`.

## State Management

- Using Redux.
- After creating a slice for each page, don't forget to register your slice in `src/utils/store/combineReducers.jsx`.

## Router

- Don't forget to add routes in `src/utils/router`.
- Each parent path should have its own `objectRouter`.
- After adding `"stringElement"` to every object in `objectRouter`, make sure to add the corresponding element in `src/utils/variableGlobal/RoutesElements.jsx`.

## Styling

- Global styles are located inside `src/assets/style/index.scss`.
- Please refer to the Bootstrap documentation for custom styling.

## Setting Roles per Page

To set roles per page, create an object `privileges` in each `objectRouter` found in the `src/utils/router` folder.  
For example, you can refer to the `objectRouter.masterPage.jsx` for implementation.

Each page can be assigned specific privileges based on roles defined in the `privileges` object to manage access control.

## Setting Privileges in Page Components Using `usePrivileges()`

  To set specific privileges for each page, you can use the custom hook `usePrivileges()` to retrieve the privileges associated with the current user for a particular page. This hook helps manage role-based access control inside each page component.

  ### Steps:
  1. **Create the `usePrivileges()` Hook**:  
     The `usePrivileges()` hook can be used to get the `privileges` object from the router for the current page. It will return a set of permissions or access rights that the current user is granted for that page.

  2. **Usage in Page Components**:  
     In every page component, you can call `usePrivileges()` to access the privileges and use them to conditionally render content or enable/disable specific actions based on the user's role.

     Example (using the `ProductPromo` page component):

     ```jsx
     import { Button, Stack } from "react-bootstrap";
     import { RiEditBoxFill } from "react-icons/ri";
     import { useNavigate } from "react-router";
     import usePrivileges from "src/utils/auth/getCurrentPrivilege";  // Importing the custom hook

     const ProductPromo = () => {
       const currentPrivileges = usePrivileges();  // Using the hook to fetch current user's privileges
       const navigate = useNavigate();

       // Example column configuration using privileges
       const columnsConfig = [
         {
           name: "Actions",
           cell: row => (
             <Stack direction="horizontal">
               {
                 currentPrivileges.includes('U') &&  // Checking if user has 'U' privilege (for Edit)
                 <Button variant="link" onClick={() => navigate(`/edit/${row.PROMO_ID}`)}>
                   <Stack direction="horizontal" gap={2}>
                     <RiEditBoxFill />
                     <div>Edit</div>
                   </Stack>
                 </Button>
               }
               {
                 currentPrivileges.includes('D') &&  // Checking if user has 'D' privilege (for Delete)
                 <Button variant="link" onClick={() => handleDelete(row.PROMO_ID)}>
                   Delete
                 </Button>
               }
             </Stack>
           ),
           width: "240px",
         },
       ];

       // Fetching data, handling edit, and delete actions
       const handleDelete = (id) => {
         // Handle delete action
       };

       return (
         <div>
           {/* Render table with columnsConfig */}
         </div>
       );
     };

     export default ProductPromo;
     ```

  3. **Referencing the Example in `index.jsx`**:  
     You can see the implementation of `usePrivileges()` in the `ProductPromo` component located in the `src/pages/masterPage/productPromo` folder. This component demonstrates how the privileges can be used to show or hide UI elements based on the user's permissions.

  By using `usePrivileges()`, you can easily manage the access and actions available to users depending on their roles within each page component. This approach centralizes the role management and enhances the maintainability of the codebase.

## Setting Dummy Role for Easier Development

  If you want to set a dummy role for easier development, you can configure it through the authHelpers.jsx file located in src/utils/auth.

  ### Steps to Enable Dummy Role:

  1. go to App.jsx
  2. add param **true** in **getprofile** in line **10**

  After making these changes, the application will use the dummy data (`menu.json`, `listPermission.json`, and `userData.json`) instead of calling the real API.  
  This is useful for local development without needing an active authentication server.

  **Important**:  
  Do not forget to **restore the original settings** once you have finished development, to ensure the app connects to the real authentication API.
  
---

**Watermark**:  
This README was created by **SYOFIAN - BERCA**, the first developer of this project.
