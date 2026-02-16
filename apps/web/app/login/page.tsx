export default function LoginPage() {
  return (
    <div>
      <section className="page-header">
        <h2>Login</h2>
        <p>Sign in with Firebase Auth (email + phone).</p>
      </section>
      <div className="card">
        <p className="muted">Authentication UI is connected to Firebase configuration in your project.</p>
        <button className="primary">Continue</button>
      </div>
    </div>
  );
}
