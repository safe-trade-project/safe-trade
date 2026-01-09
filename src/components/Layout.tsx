import { Navbar } from './Navbar';

export const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="h-full flex flex-col">
    <Navbar />
    <div className="flex-1">
      {children}
    </div>
  </div>
);
