function getGameId() {
  const gameId = window.location.pathname.match(/^\/(\w{8})/);
  return gameId ? gameId[1] : null;
}

function initializeMessageListener() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getGameUrl') {
      const gameId = getGameId();
      if (gameId) {
        sendResponse({ url: `https://lichess.org/${gameId}` });
      } else {
        sendResponse({ url: null });
      }
    }
    return true;
  });
}

initializeMessageListener();