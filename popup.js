document.addEventListener('DOMContentLoaded', () => {
  const qrContainer = document.getElementById('qr-container');
  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getGameUrl' }, (response) => {
      if (response && response.url) {
        generateQRCode(response.url);
        setupSharing(response.url);
      } else {
        qrContainer.innerHTML = '<p>No active game found.</p>';
      }
    });
  });

  function generateQRCode(url) {
    try {
      // In the generateQRCode function, update the QR code size:
      new QRCode(qrContainer, {
        text: url,
        width: 180,
        height: 180,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
      });
      
      // Add share overlay
      const shareOverlay = document.createElement('img');
      shareOverlay.src = 'images/share.png';
      shareOverlay.className = 'share-overlay';
      shareOverlay.alt = 'Share';
      qrContainer.appendChild(shareOverlay);

      // Add click event to share overlay
      shareOverlay.addEventListener('click', () => {
        shareQRCode(url);
      });
      
    } catch (error) {
      console.error('QR Code generation error:', error);
      qrContainer.innerHTML = '<p>Error generating QR code.</p>';
    }
  }

  function setupSharing(url) {
    qrContainer.addEventListener('contextmenu', async (e) => {
      e.preventDefault();
      shareQRCode(url);
    });

    qrContainer.addEventListener('dblclick', (e) => {
      e.preventDefault();
      shareQRCode(url);
    });
  }

  function shareQRCode(url) {
    const qrImage = qrContainer.querySelector('img:not(.share-overlay)');
    if (qrImage) {
      fetch(qrImage.src)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'lichess_qr.png', { type: 'image/png' });
          const data = {
            files: [file],
            title: 'Lichess Game QR Code',
            text: `Scan this QR code to join the game: ${url}`
          };
          
          if (navigator.canShare && navigator.canShare(data)) {
            navigator.share(data);
          } else {
            alert('Sharing not supported in this browser');
          }
        });
    }
  }
});