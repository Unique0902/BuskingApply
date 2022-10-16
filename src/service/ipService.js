class IpService {
  async getIp() {
    const ipData = await fetch('https://geolocation-db.com/json/');
    const locationIp = await ipData.json();
    return locationIp.IPv4;
  }
  async logIp() {
    const ipData = await fetch('https://geolocation-db.com/json/');
    const locationIp = await ipData.json();
    console.log(locationIp.IPv4);
  }
}

export default IpService;
