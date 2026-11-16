// The page's calls to the server. Session data needs the token: as a header on
// every call, and as `?t=` on the stream alone, since EventSource sets no header.

// The printed URL carries the token once. localStorage is scoped to this port's
// origin, unlike a cookie, so a bookmark of the bare URL keeps working and no
// other service on 127.0.0.1 ever sees the token.
export const token = (() => {
  const url = new URL(location.href);
  const given = url.searchParams.get('t');
  if (given) {
    url.searchParams.delete('t');
    history.replaceState(null, '', url);
  }
  try {
    if (given) localStorage.setItem('board-token', given);
    return given || localStorage.getItem('board-token') || '';
  } catch {
    return given || '';
  }
})();

export const stream = () => new EventSource(`/api/stream?t=${encodeURIComponent(token)}`);

// Resolves to whether the server took the change; a push then shows it.
async function post(path, body) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Board-Token': token },
    body: JSON.stringify(body),
  });
  return res.ok;
}

export const archive = (sid, on) => post('/api/archive', { sid, on });
export const rename = (sid, title) => post('/api/rename', { sid, title });
