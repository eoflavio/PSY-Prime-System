import { Sidebar } from './Sidebar';
import type { ReactNode } from 'react';

export const PrivateLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <Sidebar />
      <div style={{ 
        flex: 1, 
        marginLeft: '80px', /* Matches collapsed sidebar width */
        display: 'flex',
        flexDirection: 'column'
      }}>
        <main style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
      </div>
    </div>
  );
};
