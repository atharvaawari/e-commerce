
export const CenterWrapper = ({ children }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh',
    backgroundColor: '#f0f2f5' // Optional light grey background
  }}>
    <div style={{ 
      width: '100%', 
      maxWidth: '400px', 
      padding: '24px', 
      background: '#fff', 
      borderRadius: '8px', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
    }}>
      {children}
    </div>
  </div>
);