const DEFAULT_DASH_BUTTON_STYLE = `
  <div class='dash-button' style="background-color: blue; text-align:center;font-size:16px; color: white;padding:10px;">
    Buy Online
  </div>
`;

const getSiteConfig = () => {
  return fetch(
    `${process.env.DASH_PUBLIC_API}?url=${process.env.DEV_URL || document.location.origin}`,
  ).then(res => res.json());
};

const getCountOfDashVehicleElm = () =>
  document.querySelectorAll('div[data-dash-vehicle-vin]').length;

const injectDashWidget = dealerConfigs => {
  const vehicles = document.querySelectorAll('div[data-dash-vehicle-vin]');
  const button =
    dealerConfigs &&
    dealerConfigs.customer_data &&
    dealerConfigs.customer_data.widget &&
    dealerConfigs.customer_data.widget.button;

  for (let i = 0; i < vehicles.length; i += 1) {
    const vin = vehicles[i].getAttribute('data-dash-vehicle-vin');
    const node = document.createElement('div');
    node.innerHTML = button || DEFAULT_DASH_BUTTON_STYLE;
    node.onclick = () => {
      const iframe = document.createElement('iframe');
      iframe.src =
        dealerConfigs.domain && dealerConfigs.domain.indexOf('http') > -1
          ? `${dealerConfigs.domain}/vehicle/${vin}`
          : `https://${dealerConfigs.domain}/vehicle/${vin}?iframe=${window.location.pathname}`;
      iframe.style.position = 'fixed';
      iframe.style.top = '0px';
      iframe.style.bottom = '0px';
      iframe.style.left = '0px';
      iframe.style.right = '0px';
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.style.border = 'none';
      iframe.style.zIndex = '9999';
      const elmDiv = document.createElement('div');
      elmDiv.style.zIndex = '9999';
      elmDiv.id = 'dash--iframe-wrapper';
      elmDiv.style.position = 'fixed';
      elmDiv.style.top = '0px';
      elmDiv.style.bottom = '0px';
      elmDiv.style.left = '0px';
      elmDiv.style.right = '0px';
      elmDiv.style.backgroundColor = 'white';
      elmDiv.style.width = '100vw';
      elmDiv.style.height = '100vh';
      elmDiv.style.display = 'flex';
      const loadingImg = document.createElement('img');
      loadingImg.src = 'http://media.giphy.com/media/s4KqhlPU9Ypnq/giphy.gif';
      loadingImg.style.width = '100px';
      loadingImg.style.height = '100px';
      loadingImg.style.objectFit = 'contain';
      loadingImg.style.margin = 'auto';
      elmDiv.appendChild(loadingImg);

      elmDiv.appendChild(iframe);

      const closeButton = document.createElement('div');
      closeButton.style.position = 'fixed';
      closeButton.style.top = '20px';
      closeButton.style.right = '20px';
      closeButton.style.backgroundColor = '#000';
      closeButton.style.width = '50px';
      closeButton.style.height = '50px';
      closeButton.style.color = '#fff';
      closeButton.style.borderRadius = '25px';
      closeButton.textContent = 'X';
      closeButton.style.display = 'flex';
      closeButton.style.alignItems = 'center';
      closeButton.style.justifyContent = 'center';
      closeButton.style.padding = '15px';

      closeButton.onclick = () => {
        document.getElementById('dash--iframe-wrapper').remove();
      };

      elmDiv.appendChild(closeButton);
      document.body.appendChild(elmDiv);
    };
    // dealerConfigs.domain && dealerConfigs.domain.indexOf('http') > -1
    //   ? `${dealerConfigs.domain}/vehicle/${vin}`
    //   : `https://${dealerConfigs.domain}/vehicle/${vin}`;
    node.style.textDecoration = 'auto';
    vehicles[i].appendChild(node);
  }
  return vehicles.length;
};

document.addEventListener('DOMContentLoaded', () => {
  getSiteConfig().then(dealerConfigs => {
    let countElement = injectDashWidget(dealerConfigs);
    setInterval(() => {
      if (getCountOfDashVehicleElm() !== countElement) {
        countElement = injectDashWidget(dealerConfigs);
      }
    }, 5000);
  });
});
