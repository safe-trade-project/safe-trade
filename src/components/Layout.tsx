import { Navbar } from './Navbar';

export const Layout = ({ children }: { children: React.ReactNode }) => (
	<>
		<Navbar />
		{children}
	</>
);
