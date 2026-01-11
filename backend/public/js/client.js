async function searchMusic() {
  const apiKey = localStorage.getItem('apiKey');
  if (!apiKey) {
    alert('Silakan register terlebih dahulu');
    return;
  }

  const term = document.getElementById('term').value;

  const res = await fetch(`/client/music/search?term=${term}`, {
    headers: {
      'x-api-key': apiKey
    }
  });

  const data = await res.json();
  const list = document.getElementById('result');
  list.innerHTML = '';

  data.results.forEach(song => {
    const li = document.createElement('li');
    li.textContent = `${song.artistName} - ${song.trackName}`;
    list.appendChild(li);
  });
}
