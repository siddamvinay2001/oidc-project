function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function loginPage(uid, error) {
  return `
    <h2>Sign in</h2>
    ${error ? `<p style="color:red">${escapeHtml(error)}</p>` : ""}
    <form method="post" action="/interaction/${uid}/login">
      <p><input name="username" placeholder="username" autofocus></p>
      <p><input name="password" type="password" placeholder="password"></p>
      <button type="submit">Sign in</button>
    </form>
  `;
}

export function consentPage(uid, clientId, scope) {
  return `
    <h2>Allow access</h2>
    <p><b>${escapeHtml(clientId)}</b> wants access to: ${escapeHtml(scope)}</p>
    <form method="post" action="/interaction/${uid}/confirm">
      <button type="submit">Allow</button>
    </form>
  `;
}
