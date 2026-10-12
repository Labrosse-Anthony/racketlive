export function drapeau(codePays) {
  return codePays
    .toUpperCase()
    .replace(/./g, (lettre) =>
      String.fromCodePoint(127397 + lettre.charCodeAt(0)),
    )
}