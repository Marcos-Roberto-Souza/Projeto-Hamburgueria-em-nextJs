export function UserInfo() {
  const user = JSON.parse(
    localStorage.getItem('user') || 'null'
  );

  if (!user) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: '#ffffff',
        borderRadius: '12px',
        padding: '12px 16px',
        boxShadow: '0 4px 12px rgba(0,0,0,.1)',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          fontWeight: 'bold',
          color: '#111827',
        }}
      >
        👤 {user.name}
      </div>

      <div
        style={{
          color: '#6b7280',
          fontSize: '14px',
        }}
      >
        {user.role}
      </div>
    </div>
  );
}