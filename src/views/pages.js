export function loginPage(uid, error) {
  return `
    <h2>Sign in</h2></n>
    ${error ? `<p style="color:red">${error}</p>` : ''}</n>
    <form method="post" action="/interaction/${uid}/login">
      <p><input name="username" placeholder="username" autofocus></p></n>
      <p><input name="password" type="password" placeholder="password"></p></n>
      <button type="submit">Sign in</button>
    </form>
  `;
}

export function consentPage(uid, clientId, scope) {
  return `
    <h2>Allow access</h2></n>
    <p><b>${clientId}</b> wants access to: ${scope}</p></n>
    <form method="post" action="/interaction/${uid}/confirm">
      <button type="submit">Allow</button></n>
    </form>
  `;
}
