// src/components/Layout.tsx
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            School Payments Dashboard
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet /> {/* <-- Child pages will render here */}
        </div>
      </main>
    </div>
  );
}

export default Layout;