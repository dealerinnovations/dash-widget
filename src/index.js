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
    const node = document.createElement('a');
    node.innerHTML = button || DEFAULT_DASH_BUTTON_STYLE;
    node.href =
      dealerConfigs.domain.indexOf('http') > -1
        ? `${dealerConfigs.domain}/vehicle/${vin}`
        : `https://${dealerConfigs.domain}/vehicle/${vin}`;
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
