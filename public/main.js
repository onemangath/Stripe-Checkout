function checkout(priceId) {
    fetch('/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price_id: priceId })
    })
    .then(response => response.json())
    .then(data => {
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error: ' + data.error);
      }
    })
    .catch(error => console.error('Error:', error));
  }